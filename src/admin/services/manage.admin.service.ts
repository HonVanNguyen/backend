import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { UserToGroupPolicy } from 'src/casl/entities/user-to-group-policy.entity';
import { GroupPolicyType } from 'src/casl/enums/group-policy.enum';
import { GroupPolicyRepository } from 'src/casl/repositories/group-policy.repository';
import { PolicyRepository } from 'src/casl/repositories/policy.repository';
import { UserToGroupPolicyRepository } from 'src/casl/repositories/user-to-group-policy.repository';
import { AdminCaslService } from 'src/casl/services/admin.casl.service';
import { DeleteMultipleByIdNumberReqDto } from 'src/common/dto/delete-multiple.dto';
import { Action, ActionAbility, Resource } from 'src/common/enums/casl.enum';
import {
  ConflictExc,
  ExpectationFailedExc,
  NotFoundExc,
} from 'src/common/exceptions/custom.exception';
import { User } from 'src/users/entities/user.entity';
import { UserType } from 'src/users/enums/users.enum';
import { UserRepository } from 'src/users/repositoties/user.repository';
import { EncryptService } from 'src/utils/services/encrypt.service';
import { In, IsNull, Not } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { AdminResDto } from '../dto/admin-response.dto';
import { CreateAdminReqDto } from '../dto/manage/create-admin.dto';
import { GetListAdminReqDto } from '../dto/manage/get-admin.dto';
import { UpdateAdminReqDto } from '../dto/manage/update-admin.dto';
import { AdminStatus } from '../enums/admin.enum';
import { AdminRepository } from '../repositoires/admin.repository';

@Injectable()
export class ManageAdminService {
  constructor(
    private adminRepo: AdminRepository,
    private userRepo: UserRepository,
    private policyRepo: PolicyRepository,
    private groupPolicyRepo: GroupPolicyRepository,
    private userToGroupPolicyRepo: UserToGroupPolicyRepository,
    private encryptService: EncryptService,
    private configService: ConfigService,
    private adminCaslService: AdminCaslService,
  ) {}

  @Transactional()
  async createDefaultAdmin() {
    try {
      const admin = await this.adminRepo.findOne({
        where: { username: this.configService.get('defaultAdmin.username') },
        relations: ['user'],
      });
      if (admin) {
        return AdminResDto.forAdmin({ data: admin });
      }

      const user = await this.userRepo.save({ type: UserType.ADMIN });
      // Create group policy
      const policyRoot = await this.policyRepo.findOne({
        where: {
          action: Action.MANAGE,
          resource: Resource.ALL,
          actionAbility: ActionAbility.CAN,
        },
      });
      const groupPoliciyRoot = await this.adminCaslService.createGroupPolicy(
        {
          name: 'Default Admin Group Policy',
          description: 'Default admin group policy',
          policyIds: [policyRoot.id],
          type: GroupPolicyType.ADMIN,
        },
        user,
      );
      // Create default admin with encrypted password
      return await this.create(
        {
          name: this.configService.get('defaultAdmin.username'),
          username: this.configService.get('defaultAdmin.username'),
          password: this.configService.get('defaultAdmin.password'),
          groupPolicyIds: [groupPoliciyRoot.id],
        },
        user,
      );
    } catch (error) {
      console.log('error', error);
    }
  }

  async getDefaultAdmin() {
    return await this.adminRepo.findOne({
      where: { username: this.configService.get('defaultAdmin.username') },
    });
  }

  async getList(dto: GetListAdminReqDto, user: User) {
    const { limit, page, status } = dto;
    let { searchText } = dto;

    const queryBuilder = this.adminRepo
      .createQueryBuilder('admin')
      .orderBy('admin.id')
      .where('admin.userId != :userId', { userId: user.id });

    if (searchText) {
      searchText = `%${searchText}%`;
      queryBuilder.where('admin.username ILIKE :searchText', { searchText });
    }

    if (status) queryBuilder.where('admin.status = :status', { status });

    const { items, meta } = await paginate(queryBuilder, { page, limit });

    const admins = items.map((item) => AdminResDto.forAdmin({ data: item }));
    return new Pagination(admins, meta);
  }

  async getDetail(id: number, user: User) {
    const admin = await this.adminRepo.findOne({
      where: { id, userId: Not(user.id) },
      relations: { user: { userToGroupPolicies: { groupPolicy: true } } },
    });

    if (!admin) throw new NotFoundExc({ message: 'common.notFound' });
    return AdminResDto.forAdmin({ data: admin });
  }

  @Transactional()
  async create(dto: CreateAdminReqDto, currentUser: User) {
    const { name, username, password, groupPolicyIds } = dto;

    // Check username existed
    const existedAdmin = await this.adminRepo.findOne({
      where: { username },
    });
    if (existedAdmin)
      throw new ConflictExc({
        message: ['repository.admin', 'common.alreadyExists'],
      });

    const user = await this.userRepo.save({ type: UserType.ADMIN });

    await Promise.all(
      groupPolicyIds.map(async (item) => {
        const groupPolicy =
          await this.groupPolicyRepo.findOneByOrThrowNotFoundExc({
            id: item,
          });

        await this.userToGroupPolicyRepo.save({
          groupPolicy,
          user,
        });
      }),
    );

    const encryptedPassword = this.encryptService.encryptText(password);
    const admin = this.adminRepo.create({
      name,
      username,
      password: encryptedPassword,
      user,
      status: AdminStatus.ACTIVE,
    });
    await this.adminRepo.save(admin);

    return this.getDetail(admin.id, currentUser);
  }

  @Transactional()
  async update(dto: UpdateAdminReqDto, user: User) {
    const { id: adminId, status, groupPolicyIds } = dto;

    let admin = await this.adminRepo.findOne({
      where: { id: adminId, userId: Not(user.id) },
      relations: { user: { userToGroupPolicies: true } },
    });
    if (!admin) throw new NotFoundExc({ message: 'common.notFound' });

    admin = { ...admin, status };

    await Promise.all([
      this.updateAdminToGroupPolicies(admin.user, groupPolicyIds),
      this.adminRepo.save(admin),
    ]);

    return this.getDetail(admin.id, user);
  }

  @Transactional()
  async deleteList(dto: DeleteMultipleByIdNumberReqDto, user: User) {
    const { ids } = dto;
    const { affected } = await this.adminRepo.softDelete({
      id: In(ids),
      userId: Not(user.id),
      deletedAt: IsNull(),
    });

    if (affected !== ids.length)
      throw new ExpectationFailedExc({
        message: 'auth.common.deleteMultipleError',
      });
  }

  @Transactional()
  async deleteSingle(id: number, user: User) {
    const { affected } = await this.adminRepo.softDelete({
      id,
      userId: Not(user.id),
    });
    if (!affected) throw new NotFoundExc({ message: 'common.notFound' });
  }

  private async updateAdminToGroupPolicies(
    user: User,
    groupPolicyIds: number[],
  ) {
    const removeUserGroupPolicies: UserToGroupPolicy[] = [];
    const addUserGroupPolicies: UserToGroupPolicy[] = [];

    user.userToGroupPolicies.filter((item) => {
      const isExisted = groupPolicyIds.includes(item.groupPolicyId);
      if (isExisted) return true;

      removeUserGroupPolicies.push(item);
      return false;
    });

    groupPolicyIds.forEach((groupPolicyId) => {
      const isExisted = user.userToGroupPolicies.some(
        (item) => item.groupPolicyId === groupPolicyId,
      );
      if (isExisted) return;

      const userGroupPolicy = this.userToGroupPolicyRepo.create({
        groupPolicyId,
        userId: user.id,
      });
      addUserGroupPolicies.push(userGroupPolicy);
      user.userToGroupPolicies.push(userGroupPolicy);
    });

    await Promise.all([
      this.userToGroupPolicyRepo.softRemove(removeUserGroupPolicies),
      this.userToGroupPolicyRepo.save(addUserGroupPolicies),
    ]);
  }
}
