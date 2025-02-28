import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { DataSource } from 'typeorm';
import { I18nPath } from 'src/i18n/i18n.generated';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerRepository extends BaseRepository<Customer> {
  entityNameI18nKey: I18nPath | string;
  constructor(dataSource: DataSource) {
    super(Customer, dataSource);
    this.entityNameI18nKey = 'repository.customer';
  }
}
