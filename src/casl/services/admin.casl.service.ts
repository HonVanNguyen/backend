import { Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { TypeORMQueryResult } from 'src/common/dto/sql-query-result.dto';
import {
  ConflictExc,
  NotFoundExc,
} from 'src/common/exceptions/custom.exception';
import { User } from 'src/users/entities/user.entity';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import {
  CreateGroupPolicyAdminReqDto,
  DeleteManyGroupPoliciesAdminReqDto,
  GetListGroupPoliciesAdminReqDto,
  GetListPoliciesAdminReqDto,
  UpdateGroupPoliciesAdminReqDto,
  UpdatePolicyNameAdminReqDto,
} from '../dto/admin-casl-request.dto';
import { GroupToPolicy } from '../entities/group-to-policy.entity';
import { GroupPolicyStatus } from '../enums/group-policy.enum';
import { GroupPolicyRepository } from '../repositories/group-policy.repository';
import { GroupToPolicyRepository } from '../repositories/group-to-policy.repository';
import { PolicyRepository } from '../repositories/policy.repository';
import { CommonCaslService } from './common.casl.service';
import { PolicyResDto } from '../dto/policy-response.dto';
import { GroupPolicyResDto } from '../dto/group-policies-response.dto';

@Injectable()
export class AdminCaslService {
  constructor(
    private groupPolicyRepo: GroupPolicyRepository,
    private policyRepo: PolicyRepository,
    private groupToPolicyRepo: GroupToPolicyRepository,
    private commonCaslService: CommonCaslService,
  ) {}

  async getListPolicies(dto: GetListPoliciesAdminReqDto) {
    const { limit, page, type, actionAbility } = dto;
    let { searchText } = dto;

    const qb = this.policyRepo.createQueryBuilder('p').orderBy('p.id');

    if (searchText) {
      searchText = `%${searchText}%`;
      qb.andWhere('p.name ILIKE :searchText', { searchText });
    }
    if (type) {
      qb.andWhere('p.type = :type', { type });
    }
    if (actionAbility) {
      qb.andWhere('p.actionAbility = :actionAbility', { actionAbility });
    }

    const { items, meta } = await paginate(qb, { limit, page });
    const policies = items.map((item) => PolicyResDto.forAdmin({ data: item }));

    return new Pagination(policies, meta);
  }

  async getPolicy(id: number) {
    const policy = await this.policyRepo.findOneByOrThrowNotFoundExc({ id });
    return PolicyResDto.forAdmin({ data: policy });
  }

  async getListGroupPolicies(dto: GetListGroupPoliciesAdminReqDto) {
    const { status, limit, page, type } = dto;
    let { searchText } = dto;

    const queryBuilder = this.groupPolicyRepo
      .createQueryBuilder('groupPolicy')
      // .leftJoinAndSelect('groupPolicy.groupToPolicies', 'groupToPolicy')
      // .leftJoinAndSelect('groupToPolicy.policy', 'policy')
      .orderBy('groupPolicy.id');

    if (searchText) {
      searchText = `%${searchText}%`;
      queryBuilder.where('groupPolicy.name ILIKE :searchText', { searchText });
    }
    if (status)
      queryBuilder.andWhere('groupPolicy.status = :status', { status });

    if (type) queryBuilder.andWhere('groupPolicy.type = :type', { type });

    const { items, meta } = await paginate(queryBuilder, {
      limit,
      page,
      cacheQueries: true,
    });

    const groupPolicy = items.map((item) =>
      GroupPolicyResDto.forAdmin({ data: item }),
    );

    return new Pagination(groupPolicy, meta);
  }

  async getGroupPolicyById(id: number) {
    const groupPolicy = await this.groupPolicyRepo
      .createQueryBuilder('groupPolicy')
      .leftJoinAndSelect('groupPolicy.groupToPolicies', 'groupToPolicy')
      .leftJoinAndSelect('groupToPolicy.policy', 'policy')
      .loadRelationCountAndMap(
        'groupPolicy.totalMem',
        'groupPolicy.userToGroupPolicies',
      )
      .where('groupPolicy.id = :id', { id })
      .getOne();
    if (!groupPolicy) throw new NotFoundExc({ message: 'common' });

    return GroupPolicyResDto.forAdmin({ data: groupPolicy });
  }

  @Transactional()
  async createGroupPolicy(dto: CreateGroupPolicyAdminReqDto, user: User) {
    const { description, name, policyIds, type } = dto;
    const groupPolicyKey = this.commonCaslService.transformNameToKey(name);

    await this.checkPolicies(policyIds);

    await this.commonCaslService.checkGroupPolicyKey(
      type,
      groupPolicyKey,
      user.id,
    );

    const groupPolicy = this.groupPolicyRepo.create({
      key: groupPolicyKey,
      name,
      description,
      status: GroupPolicyStatus.ACTIVE,
      type: type,
      ownerId: user.id,
    });

    await this.groupPolicyRepo.save(groupPolicy);
    await this.saveGroupToPolicies([], policyIds, groupPolicy.id);

    return this.getGroupPolicyById(groupPolicy.id);
  }

  @Transactional()
  async updateGroupPolicy(dto: UpdateGroupPoliciesAdminReqDto, user: User) {
    const { id, description, name, policyIds, status, type } = dto;

    const groupPolicy = await this.groupPolicyRepo.findOneOrThrowNotFoundExc({
      where: { id },
      relations: { groupToPolicies: true },
    });

    await this.checkPolicies(policyIds);
    const updatedKey = this.commonCaslService.transformNameToKey(name);
    if (groupPolicy.key !== updatedKey) {
      await this.commonCaslService.checkGroupPolicyKey(
        type,
        updatedKey,
        user.id,
      );
    }
    await this.saveGroupToPolicies(
      groupPolicy.groupToPolicies,
      policyIds,
      groupPolicy.id,
    );

    await this.groupPolicyRepo.update(id, {
      key: updatedKey,
      name,
      description,
      status,
      type,
    });

    return this.getGroupPolicyById(id);
  }

  private async checkPolicies(policyIds: number[]) {
    await Promise.all([
      policyIds.map((item) =>
        this.policyRepo.findOneByOrThrowNotFoundExc({ id: item }),
      ),
    ]);
  }

  private async saveGroupToPolicies(
    groupToPolicies: GroupToPolicy[],
    policyIds: number[],
    groupPolicyId: number,
  ) {
    const groupToPolicyIdsToRemove: number[] = [];
    const groupToPolicyToInsert: GroupToPolicy[] = [];

    for (const groupToPolicy of groupToPolicies) {
      if (!policyIds.includes(groupToPolicy.policyId)) {
        groupToPolicyIdsToRemove.push(groupToPolicy.id);
      }
    }

    for (const policyId of policyIds) {
      if (!groupToPolicies.some((item) => item.policyId === policyId)) {
        const groupToPolicy = this.groupToPolicyRepo.create({
          groupPolicyId,
          policyId,
        });
        groupToPolicyToInsert.push(groupToPolicy);
      }
    }

    await Promise.all([
      groupToPolicyIdsToRemove?.length &&
        this.groupToPolicyRepo.softDelete(groupToPolicyIdsToRemove),
      groupToPolicyToInsert?.length &&
        this.groupToPolicyRepo.insert(groupToPolicyToInsert),
    ]);
  }

  async deleteListGroupPolicies(
    dto: DeleteManyGroupPoliciesAdminReqDto,
  ): Promise<TypeORMQueryResult> {
    const { groupPoliciesIds } = dto;

    const groupPolicy = await this.groupPolicyRepo.findBy({
      id: In(groupPoliciesIds),
    });

    return this.groupPolicyRepo.softDelete(groupPoliciesIds);
  }

  async deleteGroupPolicyById(id: number) {
    const groupPolicy = await this.groupPolicyRepo.findOneBy({ id: id });
    if (!groupPolicy) throw new NotFoundExc({ message: 'common' });

    return this.groupPolicyRepo.softDelete(id);
  }

  @Transactional()
  async updatePolicyName(id: number, dto: UpdatePolicyNameAdminReqDto) {
    const { name } = dto;
    const policy = await this.policyRepo.findOneByOrThrowNotFoundExc({ id });

    if (policy.name === name) throw new ConflictExc({ message: 'common' });

    await this.policyRepo.update(id, { name: name });
  }
}
