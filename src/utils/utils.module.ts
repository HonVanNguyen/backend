import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EncryptService } from './services/encrypt.service';
import { ExcelService } from './services/excel.service';
import { UploadService } from './services/upload-file.service';
import { UtilsService } from './services/utils.service';
import { UuidService } from './services/uuid.service';

@Module({
  imports: [HttpModule],
  providers: [
    EncryptService,
    UploadService,
    UuidService,
    UtilsService,
    ExcelService,
  ],
  exports: [
    EncryptService,
    UploadService,
    UuidService,
    UtilsService,
    ExcelService,
  ],
})
export class UtilsModule {}
