import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PartialIndexWithSoftDelete } from '../../common/decorators/typeorm.decorator';
import { BaseEntity } from '../../common/entities/base.entity';
import { SystemConfigKey } from '../enums/system-config.enum';

@Entity()
@PartialIndexWithSoftDelete(['ownerId', 'key'], { unique: true })
export class SystemConfig extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  key: SystemConfigKey;

  @Column({ type: 'jsonb' })
  value: any;

  // Join user
  @Column({ name: 'owner_id' })
  ownerId: number;

  @ManyToOne(() => User, (user) => user.systemConfigs)
  @JoinColumn({ name: 'owner_id' })
  owner: User;
  // End join user
}
