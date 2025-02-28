import { UniqueWithSoftDelete } from 'src/common/decorators/typeorm.decorator';
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
import { AdminStatus } from '../enums/admin.enum';

@Entity('admin')
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @UniqueWithSoftDelete()
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ enum: AdminStatus, type: 'enum', default: AdminStatus.ACTIVE })
  status: AdminStatus;

  @Column({ length: 255, nullable: true })
  name: string;

  // Join file
  @Column({ nullable: true })
  avatarId: number;

  @ManyToOne(() => File)
  @JoinColumn({ name: 'avatar_id' })
  avatar: File;
  // End join file

  // Join user
  @Column({ name: 'user_id' })
  userId: number;

  @OneToOne(() => User, (user) => user.admin)
  @JoinColumn({ name: 'user_id' })
  user: User;
  // End join user
}
