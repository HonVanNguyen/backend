import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { I18nPath } from 'src/i18n/i18n.generated';
import { DataSource } from 'typeorm';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class AdminRepository extends BaseRepository<Admin> {
  entityNameI18nKey: I18nPath | string;
  constructor(dataSource: DataSource) {
    super(Admin, dataSource);
    this.entityNameI18nKey = 'repository.admin';
  }
}
