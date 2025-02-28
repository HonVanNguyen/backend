import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from 'src/common/constants/global.constant';
import { AuthorizeAdmin } from 'src/common/decorators/auth.decorator';
import { PaginationResponse } from 'src/common/decorators/swagger.decorator';
import { Action, Resource } from 'src/common/enums/casl.enum';
import { CustomerResDto } from '../dto/customer-response.dto';
import { GetListCustomerReqDto } from '../dto/manage/get-customer.dto';
import { ManageCustomerService } from '../services/manage.customer.service';

@Controller(`${PrefixType.ADMIN}/customer`)
@ApiTags('Admin Manage Customer Controller')
@AuthorizeAdmin({ action: Action.MANAGE, resource: Resource.CUSTOMER })
export class ManageCustomerController {
  constructor(private manageCustomerService: ManageCustomerService) {}

  @Get()
  @PaginationResponse(CustomerResDto)
  getList(@Query() dto: GetListCustomerReqDto) {
    return this.manageCustomerService.getList(dto);
  }
}
