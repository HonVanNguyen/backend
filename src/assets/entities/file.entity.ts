import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UniqueWithSoftDelete } from '../../common/decorators/typeorm.decorator';
import { BaseEntityWithoutUpdate } from '../../common/entities/base.entity';
import { ConstraintName } from '../../common/enums/constraint-name.enum';
import { SupportFileType } from '../../common/enums/file.enum';
import { User } from 'src/users/entities/user.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Entity('file')
export class File extends BaseEntityWithoutUpdate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @UniqueWithSoftDelete()
  key: string;

  @Column({ nullable: true })
  url: string;

  @Column({ enum: SupportFileType })
  type: SupportFileType;

  @Column({ default: 0 })
  size: number;

  // Join user
  @Column({ name: 'uploader_id' })
  uploaderId: number;

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({ name: 'uploader_id' })
  uploader: User;
  // End join user

  @OneToOne(() => Customer, (customer) => customer.avatar)
  customer: Customer;
}
