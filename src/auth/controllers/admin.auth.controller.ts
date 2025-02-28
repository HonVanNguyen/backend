import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from 'src/common/constants/global.constant';
import {
  AuthenticateAdmin,
  CurrentAuthData,
} from 'src/common/decorators/auth.decorator';
import { User } from 'src/users/entities/user.entity';
import { AdminLoginReqDto, AdminRegisterReqDto } from '../dto/admin.auth.dto';
import { RefreshTokenReqDto } from '../dto/common.auth.dto';
import { AdminAuthService } from '../services/admin.auth.service';

@Controller(`${PrefixType.ADMIN}/auth`)
@ApiTags('Admin Auth Controller')
export class AdminAuthController {
  constructor(private AdminAuthService: AdminAuthService) {}

  @Post('register')
  register(@Body() body: AdminRegisterReqDto) {
    return this.AdminAuthService.register(body);
  }

  @Post('login')
  login(@Body() body: AdminLoginReqDto) {
    return this.AdminAuthService.login(body);
  }

  @Post('refresh-token')
  refreshToken(@Body() body: RefreshTokenReqDto) {
    return this.AdminAuthService.refreshToken(body);
  }

  @Get('current')
  @AuthenticateAdmin()
  getCurrent(@CurrentAuthData() user: User) {
    return this.AdminAuthService.getCurrent(user);
  }
}
