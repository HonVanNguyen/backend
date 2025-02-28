import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { I18nPath } from '../../i18n/i18n.generated';
import { User } from '../entities/user.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  entityNameI18nKey: I18nPath | string;
  constructor(dataSource: DataSource) {
    super(User, dataSource);
    this.entityNameI18nKey = 'repository.user';
  }
}
