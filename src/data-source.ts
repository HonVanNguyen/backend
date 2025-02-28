import * as dotenv from 'dotenv';
import { NamingStrategy } from './common/config/typeorm.config';
import { AppEnvironment } from './common/enums/app.enum';
import { DataSource, DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

let config: DataSourceOptions & PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
  logger: 'simple-console',
  extra: {
    options: '-c lock_timeout=60000ms',
  },
  logging: Boolean(process.env.DB_ENABLE_LOGGING),
  migrationsTransactionMode: 'each',
  namingStrategy: new NamingStrategy(),
};

switch (process.env.NODE_ENV) {
  case AppEnvironment.TEST:
    config = {
      ...config,
      logging: false,
      migrationsRun: true,
      entities: ['src/**/*.entity.ts'],
      migrations: ['dist/migrations/*.js'],
      host: process.env.TEST_DB_HOST,
      port: +process.env.TEST_DB_PORT,
      username: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_DATABASE,
    };
    break;

  case AppEnvironment.DEVELOPMENT:
    config = {
      ...config,
      synchronize: false,
      migrationsRun: true,
      logging: false,
    };
    break;

  case AppEnvironment.STAGE:
    config = {
      ...config,
      synchronize: false,
      migrationsRun: true,
      logging: false,
    };
    break;

  case AppEnvironment.PRODUCTION:
    config = {
      ...config,
      synchronize: false,
      migrationsRun: true,
      logging: false,
    };
    break;

  // default is local
  default:
    config = {
      ...config,
      synchronize: false,
      migrationsRun: false,
      logging: Boolean(process.env.DB_ENABLE_LOGGING),
    };
    break;
}

export const dataSource = new DataSource(config);
