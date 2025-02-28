import * as AWS from 'aws-sdk';
import * as dayjs from 'dayjs';
import { IHostStrategy } from 'src/common/interfaces/host-strategy.interface';

export class S3Strategy implements IHostStrategy {
  constructor(
    private params: {
      bucketName: string;
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
    },
  ) {}
  deleteFile(fileUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const s3 = new AWS.S3({
        accessKeyId: this.params.accessKeyId,
        secretAccessKey: this.params.secretAccessKey,
        region: this.params.region,
      });
      const params = {
        Bucket: this.params.bucketName,
        Key: fileUrl.split('/').pop(),
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve();
      });
    });
  }

  uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const newFileName = `${dayjs().unix()}_${file.originalname}`;
      const s3 = new AWS.S3({
        accessKeyId: this.params.accessKeyId,
        secretAccessKey: this.params.secretAccessKey,
        region: this.params.region,
      });
      const params = {
        Bucket: this.params.bucketName,
        Key: newFileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      s3.upload(params, (err, data) => {
        console.log(data);
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(data.Location);
      });
    });
  }

  getHostName(): string {
    return 's3';
  }
}
