import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectRequest,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { map } from 'rxjs';
import { GlobalConfig } from '../../common/config/global.config';
import { UuidService } from './uuid.service';

@Injectable()
export class UploadService {
  constructor(
    private configService: ConfigService<GlobalConfig>,
    private httpService: HttpService,
    private uuidService: UuidService,
  ) {}

  async createPresignUrl(bucket: string, key: string, contentType: string) {
    const s3Client = this.getS3();
    const s3Config = this.getS3Config();
    // const fieldsPresign = {
    //   acl: 'public-read',
    // };
    const fieldsPresign = {
      'Content-Type': contentType,
    };
    const data = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: key,
      Conditions: [
        ['content-length-range', 0, s3Config.maxSize * 1000000], // content length restrictions: 0-30MB
        // ['starts-with', '$Content-Type', 'image/'], // content type restriction
        // ['eq', '$x-amz-meta-userid', userid], // tag with userid <= the user can see this!
      ],
      Expires: s3Config.timeOutMinute * 60, //Seconds before the presigned post expires. 3600 by default.
      Fields: fieldsPresign,
    });

    return data;
  }

  async getObject(name: string) {
    const s3Config = this.getS3Config();
    const s3Client = this.getS3();
    const cmd = new GetObjectCommand({
      Bucket: s3Config.bucket,
      Key: name,
      // Key: 'JOB-7b2055a9-4610-44e7-935c-8c8f7be589ec.json',
    });
    const data = await s3Client.send(cmd);

    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      });

    const json = await streamToString(data.Body);
    return json;
  }

  /**
   * User this function to upload image from url direct from server
   * and not using presign URL (not recommended) but URL upload had CORS issue
   * so we can only use this function.
   */
  async uploadFromUrl(url: string) {
    const s3Client = this.getS3();
    const s3Config = this.getS3Config();
    const extFile = this.getExtension(url);
    const nameFile = this.uuidService.genRandomStr() + extFile; // audio or image before.

    return this.httpService
      .get(encodeURI(url), { responseType: 'stream' })
      .pipe(
        map(async (res) => {
          const target: PutObjectCommandInput = {
            ACL: 'public-read',
            Bucket: s3Config.bucket,
            Key: nameFile,
            Body: res.data,
          };

          try {
            const parallelUploads3 = new Upload({
              client: s3Client,
              params: target,
            });

            parallelUploads3.on('httpUploadProgress', (progress) => {
              // console.log('progress', progress);
              // return 'success';
            });

            const data = await parallelUploads3.done();

            // Need to create response include URL file here.
            // https://clevertube-s3-dev1-bucket.s3.ap-northeast-1.amazonaws.com/1f67f169-f3ab-44e3-a6cb-7af90156a4fd.jpg
            // https://clevertube-s3-dev1-bucket.s3.ap-northeast-1.amazonaws.com/246061fa-628e-40af-b708-39704eed451b.mp3
            return `${s3Config.bucket}/${nameFile}`;
          } catch (e) {
            console.log(e);
          }
        }),
      );
  }

  async uploadFile(request: PutObjectRequest) {
    const s3Client = this.getS3();

    const command = new PutObjectCommand(request);

    await s3Client.send(command);
  }

  private getS3() {
    const s3Config = this.getS3Config();
    return new S3Client({
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
      region: s3Config.region || 'ap-southeast-1',
    });
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

  private getExtension(filePath: string) {
    let mimetype = path.extname(filePath);
    mimetype = mimetype.split('/').pop();
    mimetype = mimetype.includes('+') ? mimetype.split('+').shift() : mimetype;
    mimetype = mimetype.includes('?') ? mimetype.split('?').shift() : mimetype;
    return mimetype;
  }
}
