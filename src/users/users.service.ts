import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositoties/user.repository';
import { UserResDto } from './dto/user-response.dto';
import { UserType } from './enums/users.enum';
import { User } from './entities/user.entity';
import { CreateUserReqDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepo: UserRepository) {}

  async getDetailUser(userId: number) {
    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId });

    let user = await queryBuilder.getOne();

    switch (user.type) {
      case UserType.ADMIN:
        user = await queryBuilder
          .leftJoinAndSelect('user.admin', 'admin')
          .leftJoinAndSelect('admin.avatar', 'avatar')
          .leftJoinAndSelect('user.userToGroupPolicies', 'userToGroupPolicies')
          .leftJoinAndSelect('userToGroupPolicies.groupPolicy', 'groupPolicy')
          .leftJoinAndSelect('groupPolicy.groupToPolicies', 'groupToPolicy')
          .leftJoinAndSelect('groupToPolicy.policy', 'policy')
          .getOne();
        return UserResDto.forAdmin({ data: user });
      case UserType.CUSTOMER:
        user = await queryBuilder
          .leftJoinAndSelect('user.customer', 'customer')
          .getOne();
        return UserResDto.forCustomer({ data: user });
    }
  }

  async createUser(dto: CreateUserReqDto): Promise<User> {
    const user = this.userRepo.create(dto);
    return await this.userRepo.save(user);
  }
}
