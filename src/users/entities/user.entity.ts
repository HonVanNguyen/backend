import { Admin } from 'src/admin/entities/admin.entity';
import { GroupPolicy } from 'src/casl/entities/group-policy.entity';
import { UserToGroupPolicy } from 'src/casl/entities/user-to-group-policy.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { File } from 'src/file/entities/file.entity';
import { SystemConfig } from 'src/system-config/entities/system-config.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserType } from '../enums/users.enum';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserType, default: UserType.CUSTOMER })
  type: UserType;

  @OneToOne(() => Admin, (admin) => admin.user)
  admin: Admin;

  @OneToOne(() => Customer, (customer) => customer.user)
  customer: Customer;

  @OneToMany(
    () => UserToGroupPolicy,
    (userToGroupPolicies) => userToGroupPolicies.user,
  )
  userToGroupPolicies: UserToGroupPolicy[];

  @OneToMany(() => GroupPolicy, (groupPolicy) => groupPolicy.owner)
  groupPolicies: GroupPolicy[];

  @OneToMany(() => File, (file) => file.uploader)
  files: File[];

  @OneToMany(() => SystemConfig, (sc) => sc.owner)
  systemConfigs: SystemConfig[];
}
