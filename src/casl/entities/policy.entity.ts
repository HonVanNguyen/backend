import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {
  PartialIndexWithSoftDelete,
  UniqueWithSoftDelete,
} from '../../common/decorators/typeorm.decorator';
import { BaseEntity } from '../../common/entities/base.entity';
import { Action, ActionAbility, Resource } from '../../common/enums/casl.enum';
import { PolicyType } from '../enums/policy.enum';
import { GroupToPolicy } from './group-to-policy.entity';

@Entity({ name: 'policy' })
@PartialIndexWithSoftDelete(['action', 'resource', 'actionAbility'], {
  unique: true,
})
export class Policy extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Action })
  action: Action;

  @Column({ type: 'enum', enum: Resource })
  resource: Resource;

  @Column({ type: 'enum', enum: ActionAbility, name: 'action_ability' })
  actionAbility: ActionAbility;

  @Column()
  @UniqueWithSoftDelete()
  name: string;

  @Column({ type: 'enum', enum: PolicyType })
  type: PolicyType;

  @OneToMany(() => GroupToPolicy, (groupToPolicies) => groupToPolicies.policy, {
    cascade: ['insert'],
  })
  groupToPolicies: GroupToPolicy[];
}
