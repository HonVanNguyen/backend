import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { I18nPath } from 'src/i18n/i18n.generated';
import { DataSource } from 'typeorm';
import { SystemConfig } from '../entities/system-config.entity';

@Injectable()
export class SystemConfigRepository extends BaseRepository<SystemConfig> {
  entityNameI18nKey: I18nPath | string;
  constructor(dataSource: DataSource) {
    super(SystemConfig, dataSource);
    this.entityNameI18nKey = 'repositoty.systemConfig';
  }
}
