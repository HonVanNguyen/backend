import { Expose, Transform } from 'class-transformer';
import { IPolicies } from 'src/common/interfaces/casl.interface';
import { User } from 'src/users/entities/user.entity';

// Transform from array group policies, each group has array policies to just array policies
export class UserWithPoliciesDto extends User {
  @Expose()
  @Transform(({ obj }: { obj: User }) => {
    const value = obj.userToGroupPolicies.reduce(
      (result: IPolicies[], userToGroupPoliciesItem) => {
        userToGroupPoliciesItem?.groupPolicy?.groupToPolicies?.forEach(
          (groupToPoliciesItem) => {
            const policy: IPolicies = {
              action: groupToPoliciesItem.policy.action,
              resource: groupToPoliciesItem.policy.resource,
              actionAbility: groupToPoliciesItem.policy.actionAbility,
            };
            const isConflict = result.some(
              (item) =>
                item.action === policy.action &&
                item.resource === policy.resource &&
                item.actionAbility === policy.actionAbility,
            );
            if (!isConflict) {
              result.push(policy);
            }
          },
        );
        return result;
      },
      [],
    );
    return value;
  })
  policies: IPolicies[];
}
