import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { DataSource } from 'typeorm';
import { I18nPath } from 'src/i18n/i18n.generated';
import { GroupPolicy } from '../entities/group-policy.entity';

@Injectable()
export class GroupPolicyRepository extends BaseRepository<GroupPolicy> {
  entityNameI18nKey: I18nPath | string;
  constructor(dataSource: DataSource) {
    super(GroupPolicy, dataSource);
    this.entityNameI18nKey = 'repository.groupPolicy';
  }
}
