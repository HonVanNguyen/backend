import { Injectable } from '@nestjs/common';
import {
  ExpectationFailedExc,
  NotFoundExc,
} from 'src/common/exceptions/custom.exception';
import { FileRepository } from 'src/file/repositories/file.repository';
import { User } from 'src/users/entities/user.entity';
import { EncryptService } from 'src/utils/services/encrypt.service';
import { Transactional } from 'typeorm-transactional';
import { CustomerResDto } from '../dto/customer-response.dto';
import { ChangePasswordCustomerReqDto } from '../dto/profile/change-passowrd-customer.dto';
import {
  UpdateAvatarCustomerReqDto,
  UpdateProfileCustomerReqDto,
} from '../dto/profile/update-profile-customer.dto';
import { CustomerRepository } from '../repositories/customer.repository';

@Injectable()
export class ProfileCustomerService {
  constructor(
    private customerRepo: CustomerRepository,
    private fileRepo: FileRepository,
    private encryptService: EncryptService,
  ) {}

  async getProfile(user: User) {
    const customer = await this.customerRepo.findOneOrThrowNotFoundExc({
      where: { userId: user.id },
      relations: {
        avatar: true,
      },
    });

    return CustomerResDto.forCustomer({
      data: customer,
    });
  }

  @Transactional()
  async updateProfile(user: User, dto: UpdateProfileCustomerReqDto) {
    const { avatarId } = dto;

    const customer = await this.customerRepo.findOneByOrThrowNotFoundExc({
      userId: user.id,
    });

    if (avatarId) {
      await this.fileRepo.findOneByOrThrowNotFoundExc({
        id: avatarId,
        uploaderId: user.id,
      });
      customer.avatarId = avatarId;
    }

    await this.customerRepo.save({
      ...customer,
      ...dto,
    });

    return this.getProfile(user);
  }

  @Transactional()
  async updateAvatar(dto: UpdateAvatarCustomerReqDto, user: User) {
    const { imageId } = dto;

    let customer = user.customer;
    if (!customer) {
      customer = await this.customerRepo.findOneByOrThrowNotFoundExc({
        userId: user.id,
      });
    }

    await this.fileRepo.findOneByOrThrowNotFoundExc({
      id: imageId,
      uploaderId: customer.userId,
    });

    const { affected } = await this.customerRepo.update(customer.id, {
      avatarId: imageId,
    });

    if (!affected)
      throw new ExpectationFailedExc({
        message: 'common.exc.expectationFailed',
      });

    return this.getProfile(user);
  }

  async changePassword(user: User, body: ChangePasswordCustomerReqDto) {
    const { password, newPassword } = body;

    const customer = await this.customerRepo.findOne({
      where: { userId: user.id },
    });

    if (!customer)
      throw new NotFoundExc({
        message: 'common.exc.notFound',
        params: { name: 'customer' },
      });
    if (!this.encryptService.compareHash(password, customer.password))
      throw new ExpectationFailedExc({
        message: 'auth.customer.wrongOldPassword',
      });

    await this.customerRepo.save({
      ...customer,
      password: this.encryptService.encryptText(newPassword),
    });
  }
}
