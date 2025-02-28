import {
  IsValidArrayNumber,
  IsValidText,
} from 'src/common/decorators/custom-validator.decorator';

export class CreateAdminReqDto {
  @IsValidText()
  name: string;

  @IsValidText()
  username: string;

  @IsValidText()
  password: string;

  @IsValidArrayNumber({ required: true, minSize: 1, unique: true })
  groupPolicyIds: number[];
}
