import { Action, Resource, ActionAbility } from '../enums/casl.enum';

export interface IPolicies {
  action: Action;
  resource: Resource;
  actionAbility: ActionAbility;
}

export interface RequiredRule {
  action: Action;
  resource: Resource;
}
