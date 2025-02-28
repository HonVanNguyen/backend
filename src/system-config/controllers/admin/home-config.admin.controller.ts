import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateHomeConfigAdminReqDto } from 'src/system-config/dto/admin/home-config.admin.req.dto';
import { HomeConfigAdminService } from 'src/system-config/services/admin/home-config.admin.service';
import { User } from 'src/users/entities/user.entity';
import { PrefixType } from '../../../common/constants/global.constant';
import {
  AuthorizeAdmin,
  CurrentAuthData,
} from '../../../common/decorators/auth.decorator';
import { Action, Resource } from '../../../common/enums/casl.enum';

@Controller(`${PrefixType.ADMIN}/home-config`)
@ApiTags('Admin Manage Home Config Controller')
@AuthorizeAdmin({ action: Action.READ, resource: Resource.SYSTEM_CONFIG })
export class HomeConfigAdminController {
  constructor(private homeConfigAdminService: HomeConfigAdminService) {}

  @Get()
  get(@CurrentAuthData() user: User) {
    return this.homeConfigAdminService.get(user);
  }

  @Put()
  @AuthorizeAdmin({
    action: Action.UPDATE,
    resource: Resource.SYSTEM_CONFIG,
  })
  update(
    @CurrentAuthData() user: User,
    @Body() body: UpdateHomeConfigAdminReqDto,
  ) {
    return this.homeConfigAdminService.update(user, body);
  }
}
