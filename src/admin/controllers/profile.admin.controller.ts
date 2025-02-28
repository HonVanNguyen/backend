import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from 'src/common/constants/global.constant';
import {
  AuthenticateAdmin,
  CurrentAuthData,
} from 'src/common/decorators/auth.decorator';
import { User } from 'src/users/entities/user.entity';
import { ChangePasswordAdminReqDto } from '../dto/profile/change-password-admin.dto';
import { UpdateProfileAdminReqDto } from '../dto/profile/update-profile-admin.dto';
import { ProfileAdminService } from '../services/profile.admin.service';

@Controller(`${PrefixType.ADMIN}/profile`)
@AuthenticateAdmin()
@ApiTags('Admin Profile Controller')
export class ProfileAdminController {
  constructor(private profileAdminService: ProfileAdminService) {}

  @Get()
  getProlie(@CurrentAuthData() user: User) {
    return this.profileAdminService.getProlie(user);
  }
}
