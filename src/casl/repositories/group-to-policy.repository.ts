import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { I18nPath } from 'src/i18n/i18n.generated';
import { DataSource } from 'typeorm';
import { GroupToPolicy } from '../entities/group-to-policy.entity';

@Injectable()
export class GroupToPolicyRepository extends BaseRepository<GroupToPolicy> {
  entityNameI18nKey: I18nPath | string;
  constructor(dataSource: DataSource) {
    super(GroupToPolicy, dataSource);
    this.entityNameI18nKey = 'repository.groupToPolicy';
  }
}
