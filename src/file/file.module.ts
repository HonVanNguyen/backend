import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmCustomModule } from 'src/common/modules/typeorm-custom.module';
import { UtilsModule } from 'src/utils/utils.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileRepository } from './repositories/file.repository';
import { FileSubscriber } from './subscribers/file.subscriber';

@Module({
  imports: [
    TypeOrmCustomModule.forFeature([FileRepository]),
    forwardRef(() => AuthModule),
    UtilsModule,
  ],
  controllers: [FileController],
  providers: [FileService, FileSubscriber],
  exports: [FileService],
})
export class FileModule {}
