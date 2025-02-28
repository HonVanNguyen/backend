import { PresignedPost } from '@aws-sdk/s3-presigned-post';
import { FileResDto } from './file.res.dto';

export class PresignedUrlResDto {
  file: FileResDto;
  presigned: PresignedPost;
}
