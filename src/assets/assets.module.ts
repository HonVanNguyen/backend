import { DynamicModule, Module } from '@nestjs/common';
import {
  HOST_STRATEGY,
  IHostStrategy,
} from 'src/common/interfaces/host-strategy.interface';
import { TypeOrmCustomModule } from 'src/common/modules/typeorm-custom.module';
import { FileRepository } from 'src/file/repositories/file.repository';
import { UtilsModule } from 'src/utils/utils.module';
import { AssetsAdminController } from './controllers/admin/assets.admin.controller';
import { AssetsAdminService } from './services/admin/assets.admin.service';

@Module({})
export class AssetsModule {
  static forRoot(hostStrategy: IHostStrategy): DynamicModule {
    return {
      imports: [TypeOrmCustomModule.forFeature([FileRepository]), UtilsModule],
      controllers: [AssetsAdminController],
      module: AssetsModule,
      providers: [
        AssetsAdminService,
        {
          provide: HOST_STRATEGY,
          useValue: hostStrategy,
        },
      ],
    };
  }
}
