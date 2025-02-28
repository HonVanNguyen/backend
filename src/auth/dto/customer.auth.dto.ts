import { Transform } from 'class-transformer';
import { REGEX } from 'src/common/constants/regex.constant';
import {
  IsValidEmail,
  IsValidJSON,
  IsValidText,
} from 'src/common/decorators/custom-validator.decorator';
import { getPhoneE164 } from 'src/common/utils';

export class CustomerRegisterReqDto {
  @IsValidText({
    message: 'auth.wrongPhoneNumber',
    minLength: 12,
    maxLength: 12,
  })
  @Transform(({ value }) => getPhoneE164(value))
  phoneNumber: string;

  // @IsValidText({
  //   minLength: 8,
  //   maxLength: 50,
  //   matches: REGEX.AT_LEAST_ONE_NUMBER_AND_CHARACTER,
  // })
  // password: string;

  @IsValidText({ maxLength: 30 })
  name: string;

  @IsValidEmail({ required: false })
  email: string;

  @IsValidText({ required: false })
  avatarUrl: string;

  @IsValidJSON({ required: false })
  dynamicData: Record<string, any>;
}

export class CustomerLoginReqDto {
  @IsValidText({ message: 'auth.wrongPhoneNumber' })
  @Transform(({ value }) => getPhoneE164(value))
  phoneNumber: string;

  // @IsValidText({ maxLength: 255, message: 'auth.wrongPassword' })
  // password: string;
}

export class CustomerResetPasswordReqDto {
  @IsValidText({ message: 'auth.wrongPhoneNumber' })
  @Transform(({ value }) => getPhoneE164(value))
  phoneNumber: string;

  @IsValidText()
  otp: string;

  @IsValidText({
    minLength: 8,
    maxLength: 50,
    matches: REGEX.AT_LEAST_ONE_NUMBER_AND_CHARACTER,
  })
  newPassword: string;
}

export class CustomerCheckPhoneNumberReqDto {
  @IsValidText({ message: 'auth.wrongPhoneNumber' })
  @Transform(({ value }) => getPhoneE164(value))
  phoneNumber: string;
}
