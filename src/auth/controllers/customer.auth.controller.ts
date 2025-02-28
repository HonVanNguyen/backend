import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from 'src/common/constants/global.constant';
import {
  AuthenticateCustomer,
  CurrentAuthData,
} from 'src/common/decorators/auth.decorator';
import { User } from 'src/users/entities/user.entity';
import { RefreshTokenReqDto } from '../dto/common.auth.dto';
import {
  CustomerLoginReqDto,
  CustomerRegisterReqDto,
} from '../dto/customer.auth.dto';
import { CustomerAuthService } from '../services/customer.auth.service';

@Controller(`${PrefixType.CUSTOMER}/auth`)
@ApiTags('Customer Auth Controller')
export class CustomerAuthController {
  constructor(private CustomerAuthService: CustomerAuthService) {}
  @Post('register')
  register(@Body() body: CustomerRegisterReqDto) {
    return this.CustomerAuthService.register(body);
  }

  @Post('login')
  login(@Body() body: CustomerLoginReqDto) {
    return this.CustomerAuthService.login(body);
  }

  @Post('refresh-token')
  refreshToken(@Body() body: RefreshTokenReqDto) {
    return this.CustomerAuthService.refreshToken(body);
  }

  @Get('current')
  @AuthenticateCustomer()
  getCurrent(@CurrentAuthData() user: User) {
    return this.CustomerAuthService.getCurrent(user);
  }
}
