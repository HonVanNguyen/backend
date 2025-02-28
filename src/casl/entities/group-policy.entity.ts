import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { GroupPolicyStatus, GroupPolicyType } from '../enums/group-policy.enum';
import { GroupToPolicy } from './group-to-policy.entity';
import { UserToGroupPolicy } from './user-to-group-policy.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'group_policy' })
export class GroupPolicy extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ enum: GroupPolicyStatus, type: 'enum' })
  status: GroupPolicyStatus;

  @Column({ enum: GroupPolicyType, type: 'enum' })
  type: GroupPolicyType;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @ManyToOne(() => User, (user) => user.groupPolicies)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(
    () => GroupToPolicy,
    (groupToPolicies) => groupToPolicies.groupPolicy,
    { cascade: ['insert'] },
  )
  groupToPolicies: GroupToPolicy[];

  @OneToMany(
    () => UserToGroupPolicy,
    (userToGroupPolicy) => userToGroupPolicy.groupPolicy,
    { cascade: ['insert'] },
  )
  userToGroupPolicies: UserToGroupPolicy[];
}
