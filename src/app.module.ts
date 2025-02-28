import { Module, OnModuleInit, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE, ModuleRef } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { AdminModule } from './admin/admin.module';
import { ManageAdminService } from './admin/services/manage.admin.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetsModule } from './assets/assets.module';
import { S3Strategy } from './assets/strategies/s3.strategy';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { TaskCaslService } from './casl/services/task.casl.service';
import globalConfig from './common/config/global.config';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { CustomerModule } from './customer/customer.module';
import { dataSource } from './data-source';
import { SystemConfigAdminService } from './system-config/services/admin/system-config.admin.service';
import { SystemConfigModule } from './system-config/system-config.module';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => globalConfig],
      cache: true,
    }),
    // RedisModule.forRootAsync(redisConfig),
    EventEmitterModule.forRoot({
      maxListeners: 20,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      typesOutputPath: path.join(process.cwd(), '/src/i18n/i18n.generated.ts'),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        initializeTransactionalContext();
        return addTransactionalDataSource(dataSource);
      },
    }),
    AssetsModule.forRoot(
      new S3Strategy({
        bucketName: process.env.AWS_S3_BUCKET_NAME,
        region: process.env.AWS_S3_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }),
    ),
    UtilsModule,
    AuthModule,
    AdminModule,
    UsersModule,
    CustomerModule,
    CaslModule,
    SystemConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { exposeDefaultValues: true },
      }),
    },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.moduleRef.get(TaskCaslService, { strict: false }).syncPolicies();
    this.moduleRef
      .get(ManageAdminService, { strict: false })
      .createDefaultAdmin();
    this.moduleRef.get(SystemConfigAdminService, { strict: false }).init();
  }
}
