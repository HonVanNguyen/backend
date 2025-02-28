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
import { User } from 'src/users/entities/user.entity';
import { PrefixType } from '../../common/constants/global.constant';
import {
  AuthorizeAdmin,
  CurrentAuthData,
} from '../../common/decorators/auth.decorator';
import { PaginationResponse } from '../../common/decorators/swagger.decorator';
import { Action, Resource } from '../../common/enums/casl.enum';
import {
  CreateGroupPolicyAdminReqDto,
  DeleteManyGroupPoliciesAdminReqDto,
  GetListGroupPoliciesAdminReqDto,
  GetListPoliciesAdminReqDto,
  UpdateGroupPoliciesAdminReqDto,
  UpdatePolicyNameAdminReqDto,
} from '../dto/admin-casl-request.dto';
import { GroupPolicyResDto } from '../dto/group-policies-response.dto';
import { PolicyResDto } from '../dto/policy-response.dto';
import { AdminCaslService } from '../services/admin.casl.service';

@Controller(`${PrefixType.ADMIN}/casl`)
@ApiTags('Admin Manage Casl Controller')
@AuthorizeAdmin({ action: Action.READ, resource: Resource.GROUP_POLICY })
export class AdminCaslController {
  constructor(private adminCaslService: AdminCaslService) {}

  @Get('policy')
  @PaginationResponse(PolicyResDto)
  getListPolicies(@Query() query: GetListPoliciesAdminReqDto) {
    return this.adminCaslService.getListPolicies(query);
  }

  @Get('policy/:id')
  getPolicy(@Param('id') id: number) {
    return this.adminCaslService.getPolicy(id);
  }

  @Patch('policy/:id')
  @AuthorizeAdmin({ action: Action.UPDATE, resource: Resource.GROUP_POLICY })
  updatePolicyName(
    @Param('id') id: number,
    @Body() body: UpdatePolicyNameAdminReqDto,
  ) {
    return this.adminCaslService.updatePolicyName(id, body);
  }

  @Post('group-policy')
  @AuthorizeAdmin({ action: Action.UPDATE, resource: Resource.GROUP_POLICY })
  createGroupPolicies(
    @Body() body: CreateGroupPolicyAdminReqDto,
    @CurrentAuthData() user: User,
  ) {
    return this.adminCaslService.createGroupPolicy(body, user);
  }

  @Get('group-policy')
  @PaginationResponse(GroupPolicyResDto)
  getAllGroupPolicies(@Query() query: GetListGroupPoliciesAdminReqDto) {
    return this.adminCaslService.getListGroupPolicies(query);
  }

  @Get('group-policy/:id')
  getGroupPolicyById(@Param('id') id: number) {
    return this.adminCaslService.getGroupPolicyById(id);
  }

  @Patch('group-policy')
  @AuthorizeAdmin({ action: Action.UPDATE, resource: Resource.GROUP_POLICY })
  updateGroupPolicies(
    @Body() body: UpdateGroupPoliciesAdminReqDto,
    @CurrentAuthData() user: User,
  ) {
    return this.adminCaslService.updateGroupPolicy(body, user);
  }

  @Delete('group-policy')
  @AuthorizeAdmin({ action: Action.UPDATE, resource: Resource.GROUP_POLICY })
  deleteManyGroupPolicies(@Body() body: DeleteManyGroupPoliciesAdminReqDto) {
    return this.adminCaslService.deleteListGroupPolicies(body);
  }

  @Delete('group-policy/:id')
  @AuthorizeAdmin({ action: Action.UPDATE, resource: Resource.GROUP_POLICY })
  deleteGroupPolicies(@Param('id') id: number) {
    return this.adminCaslService.deleteGroupPolicyById(id);
  }
}
