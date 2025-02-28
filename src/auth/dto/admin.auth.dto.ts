import { IsEnum } from 'class-validator';
import { AdminStatus } from 'src/admin/enums/admin.enum';
import { IsValidText } from 'src/common/decorators/custom-validator.decorator';

export class AdminRegisterReqDto {
  @IsValidText()
  username: string;

  @IsValidText()
  password: string;

  @IsValidText()
  name: string;

  @IsEnum(AdminStatus)
  status: AdminStatus;
}

export class AdminLoginReqDto {
  @IsValidText()
  username: string;

  @IsValidText()
  password: string;
}
