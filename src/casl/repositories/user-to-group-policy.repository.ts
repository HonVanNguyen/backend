import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { DataSource } from 'typeorm';
import { I18nPath } from 'src/i18n/i18n.generated';
import { UserToGroupPolicy } from '../entities/user-to-group-policy.entity';

@Injectable()
export class UserToGroupPolicyRepository extends BaseRepository<UserToGroupPolicy> {
  entityNameI18nKey: I18nPath | string;
  constructor(dataSource: DataSource) {
    super(UserToGroupPolicy, dataSource);
    this.entityNameI18nKey = 'repository.userToGroupPolicy';
  }
}
