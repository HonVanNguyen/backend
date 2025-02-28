import { IsOptional } from 'class-validator';
import {
  IsValidEnum,
  IsValidText,
} from '../../../common/decorators/custom-validator.decorator';
import { SupportFileType } from '../../../common/enums/file.enum';

export class PresignedUrlReqDto {
  @IsValidEnum({ enum: SupportFileType, required: true })
  type: SupportFileType;

  @IsValidText()
  @IsOptional()
  contentType: string;
}
