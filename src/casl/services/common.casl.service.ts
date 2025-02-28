import { Injectable } from '@nestjs/common';
import { ConflictExc } from 'src/common/exceptions/custom.exception';
import { UserRepository } from 'src/users/repositoties/user.repository';
import { In } from 'typeorm';
import { GroupPolicyStatus, GroupPolicyType } from '../enums/group-policy.enum';
import { GroupPolicyRepository } from '../repositories/group-policy.repository';

@Injectable()
export class CommonCaslService {
  constructor(
    private groupPolicyRepo: GroupPolicyRepository,
    private userRepo: UserRepository,
  ) {}

  transformNameToKey(name: string): string {
    return name.toLowerCase().replace(/ /g, '_');
  }

  async checkGroupPolicyKey(
    type: GroupPolicyType,
    key: string,
    ownerId: number,
  ) {
    let isExisted: any;

    switch (type) {
      case GroupPolicyType.COMMON:
        isExisted = await this.groupPolicyRepo.findOneBy({
          key,
        });

        if (isExisted) {
          throw new ConflictExc({ message: 'common' });
        }
        break;

      case GroupPolicyType.ADMIN:
        isExisted = await this.groupPolicyRepo.findOneBy({
          key,
          type: In([type, GroupPolicyType.COMMON]),
        });

        if (isExisted) {
          throw new ConflictExc({ message: 'common' });
        }
        break;

      default:
        throw new Error(`Invalid group policy type: ${type}`);
    }
  }

  // This function is used by jwt-casl.strategy.ts
  async getAdminUserWithPolicies(userId: number) {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
        userToGroupPolicies: {
          groupPolicy: { status: GroupPolicyStatus.ACTIVE },
        },
      },
      relations: {
        userToGroupPolicies: {
          groupPolicy: { groupToPolicies: { policy: true } },
        },
        admin: true,
      },
    });

    return user;
  }
}
