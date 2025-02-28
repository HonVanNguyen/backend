import {
  RedisModuleAsyncOptions,
  RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { AppEnvironment } from '../enums/app.enum';
import globalConfig, { GlobalConfig } from './global.config';

dotenv.config();

export enum RedisNamespace {
  MASTER_NS = 'MASTER_NS',
  SLAVE_NS = 'SLAVE_NS',
}

export const redisConfig: RedisModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory(configService: ConfigService<GlobalConfig>) {
    const sentinelsConfig =
      configService.get<typeof globalConfig.redis.sentinels>('redis.sentinels');
    const sentinels = sentinelsConfig.map((item) => ({
      host: item.host,
      port: Number(item.port),
    }));
    const sentinelPassword = configService.get('redis.sentinelPassword');
    const password = configService.get('redis.password');
    const groupName = configService.get('redis.redisGroupName');
    const redisHost = configService.get('redis.standAlone.host');
    const redisPort = configService.get('redis.standAlone.port');

    let redisConfig: RedisModuleOptions = {
      readyLog: true,
      errorLog: true,
    };

    switch (configService.get('environment')) {
      case AppEnvironment.LOCAL:
        redisConfig = {
          ...redisConfig,
          commonOptions: { host: redisHost, port: Number(redisPort), password },
          config: [
            { role: 'master', namespace: RedisNamespace.MASTER_NS },
            { role: 'slave', namespace: RedisNamespace.SLAVE_NS },
          ],
        };
        break;
      case AppEnvironment.TEST:
        redisConfig = {
          ...redisConfig,
          commonOptions: { host: '127.0.0.1', port: 6379, password },
          config: [
            { role: 'master', namespace: RedisNamespace.MASTER_NS },
            { role: 'slave', namespace: RedisNamespace.SLAVE_NS },
          ],
        };
        break;
      default:
        redisConfig = {
          commonOptions: {
            sentinels,
            password,
            sentinelPassword,
            name: groupName,
          },
          config: [
            { role: 'master', namespace: RedisNamespace.MASTER_NS },
            { role: 'slave', namespace: RedisNamespace.SLAVE_NS },
          ],
        };
    }

    return redisConfig;
  },
};
