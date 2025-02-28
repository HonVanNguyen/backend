import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { I18nPath } from 'src/i18n/i18n.generated';
import { DataSource } from 'typeorm';
import { File } from '../entities/file.entity';

@Injectable()
export class FileRepository extends BaseRepository<File> {
  entityNameI18nKey: I18nPath | string;
  constructor(dataSource: DataSource) {
    super(File, dataSource);
    this.entityNameI18nKey = 'repository.file';
  }
}
