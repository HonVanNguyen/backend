import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GlobalConfig } from 'src/common/config/global.config';
import { ExceptionSubCode } from 'src/common/constants/exception.constant';
import {
  ConflictExc,
  UnauthorizedExc,
} from 'src/common/exceptions/custom.exception';
import { CustomerRepository } from 'src/customer/repositories/customer.repository';
import { User } from 'src/users/entities/user.entity';
import { UserType } from 'src/users/enums/users.enum';
import { UsersService } from 'src/users/users.service';
import { EncryptService } from 'src/utils/services/encrypt.service';
import { AuthTokenResDto, RefreshTokenReqDto } from '../dto/common.auth.dto';
import {
  CustomerLoginReqDto,
  CustomerRegisterReqDto,
} from '../dto/customer.auth.dto';
import { JwtAuthPayload } from '../interfaces/jwt-payload.interface';
import { CommonAuthService } from './common.auth.service';

@Injectable()
export class CustomerAuthService {
  constructor(
    private customerRepo: CustomerRepository,
    private usersService: UsersService,
    private encryptService: EncryptService,
    private jwtService: JwtService,
    private configService: ConfigService<GlobalConfig>,
    private commonAuthService: CommonAuthService,
  ) {}

  async register(dto: CustomerRegisterReqDto) {
    const { phoneNumber, email } = dto;

    // Check if phone number or email is existed
    const existedCustomer = await this.customerRepo.findOne({
      where: [{ phoneNumber }, { email }],
    });
    if (existedCustomer)
      throw new ConflictExc({
        message: ['repository.customer', 'common.alreadyExists'],
      });

    // Create user
    const user = await this.usersService.createUser({
      type: UserType.CUSTOMER,
    });

    // Create customer
    const customer = this.customerRepo.create({
      ...dto,
      phoneNumber,
      // password: this.encryptService.encryptText(password),
      user,
    });
    await this.customerRepo.save(customer);

    // Generate tokens
    const payload: JwtAuthPayload = { userId: customer.userId };
    const { accessToken, refreshToken } =
      this.commonAuthService.generateTokens(payload);

    return AuthTokenResDto.forCustomer({ data: { accessToken, refreshToken } });
  }

  async login(dto: CustomerLoginReqDto) {
    const { phoneNumber } = dto;

    // Check if phone number is existed
    const customer = await this.customerRepo.findOneBy({ phoneNumber });
    if (!customer)
      throw new UnauthorizedExc({
        message: ['repository.customer', 'common.notFound'],
      });

    // // Check if password is correct
    // if (!this.encryptService.compareHash(password, customer.password))
    //   throw new UnauthorizedExc({ message: 'auth.wrongPassword' });

    const payload: JwtAuthPayload = { userId: customer.userId };
    const accessToken = this.commonAuthService.generateAccessToken(payload);
    const refreshToken = this.commonAuthService.generateRefreshToken(payload);

    return AuthTokenResDto.forAdmin({ data: { accessToken, refreshToken } });
  }

  async getCurrent(user: User) {
    const currentUser = await this.usersService.getDetailUser(user.id);
    // update recent activity
    await this.customerRepo.update(currentUser.customer.id, {
      recentActivity: new Date(),
    });
    return currentUser;
  }

  async refreshToken(dto: RefreshTokenReqDto) {
    const { refreshToken } = dto;

    try {
      const payload = this.jwtService.verify<JwtAuthPayload>(refreshToken, {
        secret: this.configService.get('auth.refreshToken.secret'),
      });
      const accessToken = this.commonAuthService.generateAccessToken({
        userId: payload.userId,
      });

      return AuthTokenResDto.forCustomer({ data: { accessToken } });
    } catch (error) {
      throw new UnauthorizedExc({
        message: 'auth.invalidToken',
        subCode: ExceptionSubCode.INVALID_REFRESH_TOKEN,
      });
    }
  }
}
