import {
  IsValidEnum,
  IsValidText,
} from 'src/common/decorators/custom-validator.decorator';
import { PaginationReqDto } from 'src/common/dto/pagination.dto';
import { AdminStatus } from '../../enums/admin.enum';

export class GetListAdminReqDto extends PaginationReqDto {
  @IsValidText({ trim: true, required: false })
  searchText?: string;

  @IsValidEnum({ enum: AdminStatus, required: false })
  status?: AdminStatus;
}
