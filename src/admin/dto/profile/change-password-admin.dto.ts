import { IsValidText } from 'src/common/decorators/custom-validator.decorator';

export class ChangePasswordAdminReqDto {
  @IsValidText()
  password: string;

  @IsValidText()
  newPassword: string;
}
