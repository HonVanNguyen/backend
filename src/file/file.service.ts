import { PutObjectRequest } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from 'src/users/entities/user.entity';
import { Transactional } from 'typeorm-transactional';
import { GlobalConfig } from '../common/config/global.config';
import { MapFilePathSupport } from '../common/constants/global.constant';
import { EventName } from '../common/enums/event.enum';
import { SupportFileType } from '../common/enums/file.enum';
import { InternalServerErrorExc } from '../common/exceptions/custom.exception';
import { UploadService } from '../utils/services/upload-file.service';
import { UuidService } from '../utils/services/uuid.service';
import { PresignedUrlReqDto } from './dtos/req/presigned-url.req.dto';
import { PresignedUrlResDto } from './dtos/res/presigned-url.res.dto';
import { FileRepository } from './repositories/file.repository';

@Injectable()
export class FileService {
  constructor(
    private fileRepo: FileRepository,
    private configService: ConfigService<GlobalConfig>,
    private uploadService: UploadService,
    private uuidService: UuidService,
  ) {}

  @OnEvent(EventName.CUSTOMER_DELETED)
  @Transactional()
  async deleteFileWhenCustomerDeleted(user: User) {
    await Promise.all([this.fileRepo.softDelete({ uploaderId: user.id })]);
  }

  async createPresignUpload(
    dto: PresignedUrlReqDto,
    user: User,
  ): Promise<PresignedUrlResDto> {
    const { type, contentType } = dto;
    const s3Config = this.getS3Config();

    // Check if type is in name folder, We need to check type, to detect file from image/video/pdf
    const fileType = MapFilePathSupport.find((obj) => obj.types.includes(type));
    if (!fileType) throw new InternalServerErrorExc({ message: 'common' });

    const key = this.genFileKey(fileType.key, user.id, type);
    const baseUrl = `https://s3.${s3Config.region}.amazonaws.com/${s3Config.bucket}`;

    const file = this.fileRepo.create({
      key: key,
      size: 0,
      type,
      uploaderId: user.id,
      url: `${baseUrl}/${key}`,
    });
    await this.fileRepo.save(file);

    const presigned = await this.uploadService.createPresignUrl(
      s3Config.bucket,
      key,
      contentType,
    );
    return { file, presigned };
  }

  async uploadFromUrl(url: string) {
    return this.uploadService.uploadFromUrl(url);
  }

  async uploadFile(
    file: PutObjectRequest['Body'],
    type: SupportFileType,
    userId: number,
    fileName?: string,
  ) {
    const s3Config = this.getS3Config();
    const fileType = MapFilePathSupport.find((obj) => obj.types.includes(type));
    const key = this.genFileKey(fileType.key, userId, type, fileName);

    await this.uploadService.uploadFile({
      Bucket: s3Config.bucket,
      Key: key,
      Body: file,
    });

    return key;
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

  private getS3Config() {
    const maxSize = this.configService.get('aws.s3.limitSizeMb');
    const timeOutMinute = this.configService.get('aws.s3.presignTimeOut');
    const accessKeyId = this.configService.get('aws.accessKeyId');
    const secretAccessKey = this.configService.get('aws.accessKeySecret');
    const region = this.configService.get('aws.s3.region');
    const bucket = this.configService.get('aws.s3.bucketName');
    return {
      maxSize,
      timeOutMinute,
      accessKeyId,
      secretAccessKey,
      region,
      bucket,
    };
  }
}
