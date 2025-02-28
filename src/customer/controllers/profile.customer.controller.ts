import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ChangePasswordAdminReqDto } from 'src/admin/dto/profile/change-password-admin.dto';
import { PrefixType } from 'src/common/constants/global.constant';
import {
  AuthenticateCustomer,
  CurrentAuthData,
} from 'src/common/decorators/auth.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  UpdateAvatarCustomerReqDto,
  UpdateProfileCustomerReqDto,
} from '../dto/profile/update-profile-customer.dto';
import { ProfileCustomerService } from '../services/profile.customer.service';

@Controller(`${PrefixType.CUSTOMER}/profile`)
@AuthenticateCustomer()
@ApiTags('Customer Profile Controller')
export class ProfileCustomerController {
  constructor(
    private readonly profileCustomerService: ProfileCustomerService,
  ) {}

  @Get()
  getInfo(@CurrentAuthData() user: User) {
    return this.profileCustomerService.getProfile(user);
  }

  @Put()
  updateProfile(
    @CurrentAuthData() user: User,
    @Body() body: UpdateProfileCustomerReqDto,
  ) {
    return this.profileCustomerService.updateProfile(user, body);
  }

  @Patch('avatar')
  updateAvatar(
    @Body() body: UpdateAvatarCustomerReqDto,
    @CurrentAuthData() user: User,
  ) {
    return this.profileCustomerService.updateAvatar(body, user);
  }

  @Patch('/change-password')
  @UseGuards(ThrottlerGuard)
  updatepassword(
    @CurrentAuthData() user: User,
    @Body() body: ChangePasswordAdminReqDto,
  ) {
    return this.profileCustomerService.changePassword(user, body);
  }
}
