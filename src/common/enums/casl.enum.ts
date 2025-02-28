export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum ActionAbility {
  CAN = 'can',
  CANNOT = 'cannot',
}

export enum Resource {
  ALL = 'all',
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  USER = 'user',
  GROUP_POLICY = 'group_policy',

  SYSTEM_CONFIG = 'system_config',
  CUSTOM_FIELD = 'custom_field',
  SUBJECT = 'subject',
  NEWS = 'news',
}
