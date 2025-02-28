import { Injectable } from '@nestjs/common';
import { ExpectationFailedExc } from 'src/common/exceptions/custom.exception';
import { User } from 'src/users/entities/user.entity';
import { EncryptService } from 'src/utils/services/encrypt.service';
import { IsNull, Not } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { AdminResDto } from '../dto/admin-response.dto';
import { ChangePasswordAdminReqDto } from '../dto/profile/change-password-admin.dto';
import { UpdateProfileAdminReqDto } from '../dto/profile/update-profile-admin.dto';
import { AdminStatus } from '../enums/admin.enum';
import { AdminRepository } from '../repositoires/admin.repository';

@Injectable()
export class ProfileAdminService {
  constructor(
    private adminRepo: AdminRepository,
    private encryptService: EncryptService,
  ) {}

  async getProlie(user: User) {
    const [admin] = await this.adminRepo.find({
      where: { userId: user.id, status: Not(AdminStatus.BANNED) },
      relations: {
        avatar: true,
        user: {
          userToGroupPolicies: {
            groupPolicy: { groupToPolicies: { policy: true } },
          },
        },
      },
      relationLoadStrategy: 'query',
    });

    return AdminResDto.forAdmin({ data: admin });
  }

  async update(dto: UpdateProfileAdminReqDto, user: User) {
    const { avatarId, name } = dto;

    const [admin] = await this.adminRepo.find({
      where: { userId: user.id, status: Not(AdminStatus.BANNED) },
    });

    const { affected } = await this.adminRepo.update(
      { id: admin.id, deletedAt: IsNull() },
      { avatarId, name },
    );

    if (!affected)
      throw new ExpectationFailedExc({
        message: 'common.exc.expectationFailed',
      });

    return this.getProlie(user);
  }

  @Transactional()
  async changePassword(dto: ChangePasswordAdminReqDto, user: User) {
    const { newPassword, password } = dto;

    let admin = user.admin;
    if (!admin || !admin.password) {
      admin = await this.adminRepo.findOneOrThrowNotFoundExc({
        where: { userId: user.id, status: AdminStatus.ACTIVE },
        select: { id: true, password: true },
      });
    }
    if (!this.encryptService.compareHash(password, admin.password)) {
      throw new ExpectationFailedExc({
        message: 'auth.wrongOldPassword',
      });
    }

    await this.adminRepo.update(admin.id, {
      password: this.encryptService.encryptText(newPassword),
    });
  }
}
