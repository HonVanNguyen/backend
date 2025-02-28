import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PartialIndexWithSoftDelete } from '../../common/decorators/typeorm.decorator';
import { BaseEntityWithoutUpdateAndVersion } from '../../common/entities/base.entity';
import { GroupPolicy } from './group-policy.entity';

@Entity({ name: 'user_to_group_policy' })
@PartialIndexWithSoftDelete(['userId', 'groupPolicyId'], {
  unique: true,
})
export class UserToGroupPolicy extends BaseEntityWithoutUpdateAndVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'group_policy_id' })
  groupPolicyId: number;

  @ManyToOne(() => User, (user) => user.userToGroupPolicies, {
    onDelete: 'CASCADE',
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(
    () => GroupPolicy,
    (groupPolicy) => groupPolicy.userToGroupPolicies,
    { onDelete: 'CASCADE', cascade: ['insert'] },
  )
  @JoinColumn({ name: 'group_policy_id' })
  groupPolicy: GroupPolicy;
}
