import {
  Controller,
  Inject,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SharpPipe } from 'src/assets/pipes/sharp.pipe';
import { AssetsAdminService } from 'src/assets/services/admin/assets.admin.service';
import { PrefixType } from 'src/common/constants/global.constant';
import { ApiFile } from 'src/common/decorators/api-file.decorator';
import {
  AuthenticateAdmin,
  CurrentAuthData,
} from 'src/common/decorators/auth.decorator';
import {
  HOST_STRATEGY,
  IHostStrategy,
} from 'src/common/interfaces/host-strategy.interface';
import { User } from 'src/users/entities/user.entity';

@Controller(`${PrefixType.ADMIN}/file`)
@AuthenticateAdmin()
@ApiTags('Admin Upload File Controller')
export class AssetsAdminController {
  constructor(
    @Inject(HOST_STRATEGY)
    private readonly hostStrategy: IHostStrategy,
    private readonly assetsAdminService: AssetsAdminService,
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
        errorHttpStatusCode: 400,
        fileIsRequired: true,
      }),
      SharpPipe,
    )
    file: Express.Multer.File,
    @CurrentAuthData() user: User,
  ) {
    return this.assetsAdminService.uploadFile(file, user);
  }
}
