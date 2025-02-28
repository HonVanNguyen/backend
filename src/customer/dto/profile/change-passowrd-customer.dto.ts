import { IsValidText } from 'src/common/decorators/custom-validator.decorator';

export class ChangePasswordCustomerReqDto {
  @IsValidText({ minLength: 6, maxLength: 50 })
  password: string;

  @IsValidText({ minLength: 6, maxLength: 50 })
  newPassword: string;
}
