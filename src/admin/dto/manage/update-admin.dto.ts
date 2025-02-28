import {
  IsValidArrayNumber,
  IsValidEnum,
  IsValidNumber,
} from 'src/common/decorators/custom-validator.decorator';
import { AdminStatus } from '../../enums/admin.enum';

export class UpdateAdminReqDto {
  @IsValidNumber({ required: true, min: 1 })
  id: number;

  @IsValidEnum({ enum: AdminStatus, required: true })
  status: AdminStatus;

  @IsValidArrayNumber({ required: true, minSize: 1, unique: true })
  groupPolicyIds: number[];
}
