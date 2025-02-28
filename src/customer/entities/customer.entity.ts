import { PartialIndexWithSoftDelete } from 'src/common/decorators/typeorm.decorator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { File } from 'src/file/entities/file.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerStatus } from '../enums/customers.enum';

@Entity('customer')
@PartialIndexWithSoftDelete(['phoneNumber'], { unique: true })
@PartialIndexWithSoftDelete(['email'], { unique: true })
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'phone_number', length: 50 })
  phoneNumber: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  password: string;

  @Column({ name: 'name', length: 50, nullable: true })
  name: string;

  @Column({ name: 'avatar_url', length: 255, nullable: true })
  avatarUrl: string;

  @Column({ name: 'dynamic_data', type: 'jsonb', nullable: true })
  dynamicData: any;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.ACTIVE,
  })
  status: CustomerStatus;

  @Column({ name: 'recent_activity', type: 'timestamptz', nullable: true })
  recentActivity: Date;

  // Join user
  @Column({ name: 'user_id' })
  userId: number;

  @OneToOne(() => User, (user) => user.customer)
  @JoinColumn({ name: 'user_id' })
  user: User;
  // End join user

  // Join avatar
  @Column({ name: 'avatar_id', nullable: true })
  avatarId: number;

  @ManyToOne(() => File, (file) => file.customer)
  @JoinColumn({ name: 'avatar_id' })
  avatar: File;
  // End join avatar
}
