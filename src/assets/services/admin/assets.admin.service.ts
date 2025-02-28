import { Inject, Injectable } from '@nestjs/common';
import { UploadResponseDto } from 'src/assets/dto/upload-response.dto';
import { SupportFileType } from 'src/common/enums/file.enum';
import {
  HOST_STRATEGY,
  IHostStrategy,
} from 'src/common/interfaces/host-strategy.interface';
import { FileRepository } from 'src/file/repositories/file.repository';
import { User } from 'src/users/entities/user.entity';
import { UuidService } from 'src/utils/services/uuid.service';

@Injectable()
export class AssetsAdminService {
  constructor(
    @Inject(HOST_STRATEGY)
    private readonly hostStrategy: IHostStrategy,
    private readonly fileRepo: FileRepository,
    private readonly uuidService: UuidService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    user: User,
  ): Promise<UploadResponseDto> {
    const uploadFileUrl = await this.hostStrategy.uploadFile(file);

    const fileType = file.mimetype.split('/')[1] as SupportFileType;
    const key = this.genFileKey(file.filename, user.id, fileType);

    const fileUploaded = await this.fileRepo.save({
      key: key,
      size: 0,
      type: fileType,
      uploaderId: user.id,
      url: uploadFileUrl,
    });

    return {
      id: fileUploaded.id,
      url: uploadFileUrl,
      host: this.hostStrategy.getHostName(),
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
    };
  }

  private genFileKey(
    fileType: string,
    userId: number,
    type: string,
    fileName?: string,
  ) {
    const randomStr = this.uuidService.genRandomStr();
    if (fileName) {
      return `${fileType}/${userId}/${randomStr}/${fileName}.${type}`;
    }
    return `${fileType}/${userId}/${randomStr}.${type}`;
  }
}
