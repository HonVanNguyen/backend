import {
  IsValidArrayNumber,
  IsValidEnum,
  IsValidText,
} from 'src/common/decorators/custom-validator.decorator';
import { UserType } from '../enums/users.enum';

export class CreateUserReqDto {
  @IsValidEnum({ enum: UserType, required: true })
  type: UserType;
}
