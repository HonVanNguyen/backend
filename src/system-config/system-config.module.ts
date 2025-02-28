import { Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { TypeOrmCustomModule } from 'src/common/modules/typeorm-custom.module';
import { UtilsModule } from 'src/utils/utils.module';
import { HomeConfigAdminController } from './controllers/admin/home-config.admin.controller';
import { HomeConfigController } from './controllers/home-config.controller';
import { SystemConfigRepository } from './repositories/system-config.repository';
import { HomeConfigAdminService } from './services/admin/home-config.admin.service';
import { SystemConfigAdminService } from './services/admin/system-config.admin.service';
import { HomeConfigService } from './services/home-config.service';

@Module({
  imports: [
    TypeOrmCustomModule.forFeature([SystemConfigRepository]),
    UtilsModule,
    AdminModule,
  ],
  controllers: [HomeConfigAdminController, HomeConfigController],
  providers: [
    SystemConfigAdminService,
    HomeConfigAdminService,
    HomeConfigService,
  ],
})
export class SystemConfigModule {}
