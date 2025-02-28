import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthenticateAdmin,
  CurrentAuthData,
} from 'src/common/decorators/auth.decorator';
import { SupportFileType } from 'src/common/enums/file.enum';
import { User } from 'src/users/entities/user.entity';
import { FileService } from './file.service';
import { PresignedUrlReqDto } from './dtos/req/presigned-url.req.dto';

@Controller('file')
@AuthenticateAdmin()
@ApiTags('File Controller')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('presigned-url')
  async createPresignUrl(
    @CurrentAuthData() user: User,
    @Body() dto: PresignedUrlReqDto,
  ) {
    const preSignService = await this.fileService.createPresignUpload(
      dto,
      user,
    );
    return preSignService;
  }

  @Post('upload-image')
  uploadFromUrl(@Body('url') url: string) {
    return this.fileService.uploadFromUrl(url);
  }
}
