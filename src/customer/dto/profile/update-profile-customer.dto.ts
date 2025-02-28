import {
  IsValidEmail,
  IsValidJSON,
  IsValidNumber,
  IsValidText,
} from 'src/common/decorators/custom-validator.decorator';

export class UpdateProfileCustomerReqDto {
  @IsValidText({ maxLength: 30 })
  name: string;

  @IsValidEmail({ required: false })
  email?: string;

  @IsValidText({ required: false })
  avatarUrl?: string;

  @IsValidNumber({ min: 0, required: false })
  avatarId?: number;

  @IsValidJSON({ required: false })
  dynamicData?: Record<string, any>;
}

export class UpdateAvatarCustomerReqDto {
  @IsValidNumber({ min: 1 })
  imageId: number;
}
