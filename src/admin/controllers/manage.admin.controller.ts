import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from 'src/common/constants/global.constant';
import {
  AuthorizeAdmin,
  CurrentAuthData,
} from 'src/common/decorators/auth.decorator';
import { PaginationResponse } from 'src/common/decorators/swagger.decorator';
import { DeleteMultipleByIdNumberReqDto } from 'src/common/dto/delete-multiple.dto';
import { Action, Resource } from 'src/common/enums/casl.enum';
import { User } from 'src/users/entities/user.entity';

import { ManageAdminService } from '../services/manage.admin.service';
import { AdminResDto } from '../dto/admin-response.dto';
import { GetListAdminReqDto } from '../dto/manage/get-admin.dto';
import { CreateAdminReqDto } from '../dto/manage/create-admin.dto';
import { UpdateAdminReqDto } from '../dto/manage/update-admin.dto';

@Controller(`${PrefixType.ADMIN}/admin`)
@ApiTags('Admin Manage Admin Controller')
@AuthorizeAdmin({ action: Action.MANAGE, resource: Resource.ADMIN })
export class ManageAdminController {
  constructor(private manageAdminService: ManageAdminService) {}

  @Get()
  @PaginationResponse(AdminResDto)
  getListAdmin(
    @Query() body: GetListAdminReqDto,
    @CurrentAuthData() user: User,
  ) {
    return this.manageAdminService.getList(body, user);
  }
}
