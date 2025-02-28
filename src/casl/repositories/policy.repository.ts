import { Injectable } from '@nestjs/common';
import { Action, ActionAbility, Resource } from 'src/common/enums/casl.enum';
import { NotFoundExc } from 'src/common/exceptions/custom.exception';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { DataSource } from 'typeorm';
import { I18nPath } from 'src/i18n/i18n.generated';
import { Policy } from '../entities/policy.entity';

@Injectable()
export class PolicyRepository extends BaseRepository<Policy> {
  entityNameI18nKey: I18nPath | string;
  constructor(dataSource: DataSource) {
    super(Policy, dataSource);
    this.entityNameI18nKey = 'repository.policy';
  }

  async getPolicyByIdsAndCheckErr(policyIds: number[]) {
    const policies = await Promise.all(
      policyIds.map(async (policyId) => this.findOneBy({ id: policyId })),
    );

    //  Check policies exist
    policies.forEach((policiesEntity) => {
      if (!policiesEntity) throw new NotFoundExc({ message: 'common' });
    });
    return policies;
  }

  genName(action: Action, resource: Resource, actionAbility: ActionAbility) {
    return `${actionAbility} ${action} ${resource}`;
  }
}
