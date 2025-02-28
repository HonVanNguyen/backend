import { InternalServerErrorException } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { IHostStrategy } from 'src/common/interfaces/host-strategy.interface';

export class CloudinaryStrategy implements IHostStrategy {
  constructor(
    private params: { cloudName: string; apiKey: string; apiSecret: string },
  ) {}

  deleteFile(fileUrl: string): Promise<void> {
    throw new InternalServerErrorException('Method not implemented.');
  }

  uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.config({
        cloud_name: this.params.cloudName,
        api_key: this.params.apiKey,
        api_secret: this.params.apiSecret,
      });

      cloudinary.v2.uploader
        .upload_stream({ resource_type: 'auto' }, (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve(result.secure_url);
        })
        .end(file.buffer);
    });
  }

  getHostName(): string {
    return 'cloudinary';
  }
}
