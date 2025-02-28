import {
  IsValidDate,
  IsValidEnum,
  IsValidText,
} from 'src/common/decorators/custom-validator.decorator';
import { PaginationReqDto } from 'src/common/dto/pagination.dto';
import {
  CustomerRecentActivity,
  CustomerSearchBy,
} from 'src/customer/enums/customers.enum';

export class GetListCustomerReqDto extends PaginationReqDto {
  @IsValidEnum({ enum: CustomerSearchBy, required: false })
  searchBy?: CustomerSearchBy;

  @IsValidText({ required: false, trim: true })
  searchText?: string;

  @IsValidEnum({ enum: CustomerRecentActivity, required: false })
  recentActivity?: CustomerRecentActivity;
}

export class ExportCustomerReqDto extends GetListCustomerReqDto {
  @IsValidText({ required: false, trim: true })
  fileName?: string;

  @IsValidDate({ required: false })
  startDate?: Date;

  @IsValidDate({ required: false })
  endDate?: Date;
}
