import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminResDto } from 'src/admin/dto/admin-response.dto';
import { AdminRepository } from 'src/admin/repositoires/admin.repository';
import { GlobalConfig } from 'src/common/config/global.config';
import { ExceptionSubCode } from 'src/common/constants/exception.constant';
import {
  ConflictExc,
  UnauthorizedExc,
} from 'src/common/exceptions/custom.exception';
import { User } from 'src/users/entities/user.entity';
import { UserType } from 'src/users/enums/users.enum';
import { UsersService } from 'src/users/users.service';
import { EncryptService } from 'src/utils/services/encrypt.service';
import { AdminLoginReqDto, AdminRegisterReqDto } from '../dto/admin.auth.dto';
import { AuthTokenResDto, RefreshTokenReqDto } from '../dto/common.auth.dto';
import { JwtAuthPayload } from '../interfaces/jwt-payload.interface';
import { CommonAuthService } from './common.auth.service';

@Injectable()
export class AdminAuthService {
  constructor(
    private adminRepo: AdminRepository,
    private usersService: UsersService,
    private encryptService: EncryptService,
    private jwtService: JwtService,
    private configService: ConfigService<GlobalConfig>,
    private commonAuthService: CommonAuthService,
  ) {}

  async register(dto: AdminRegisterReqDto) {
    const { username, password } = dto;

    // Check if username is existed
    const existedAdmin = await this.getAdminByUsername(username);
    if (existedAdmin) throw new ConflictExc({ message: 'auth.alreadyExists' });

    // Create user
    const user = await this.usersService.createUser({ type: UserType.ADMIN });

    // Create admin
    const admin = this.adminRepo.create({
      ...dto,
      username,
      password: this.encryptService.encryptText(password),
      user,
    });
    await this.adminRepo.save(admin);

    return AdminResDto.forAdmin({ data: admin });
  }

  async login(dto: AdminLoginReqDto) {
    const { username, password } = dto;

    // Check if username is existed
    const admin = await this.getAdminByUsername(username);
    if (!admin) throw new UnauthorizedExc({ message: 'auth.notFound' });

    // Check if password is correct
    if (!this.encryptService.compareHash(password, admin.password))
      throw new UnauthorizedExc({ message: 'auth.wrongPassword' });

    const payload: JwtAuthPayload = { userId: admin.userId };
    const accessToken = this.commonAuthService.generateAccessToken(payload);
    const refreshToken = this.commonAuthService.generateRefreshToken(payload);

    return AuthTokenResDto.forAdmin({ data: { accessToken, refreshToken } });
  }

  async getCurrent(user: User) {
    return await this.usersService.getDetailUser(user.id);
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

      return AuthTokenResDto.forAdmin({ data: { accessToken } });
    } catch (error) {
      throw new UnauthorizedExc({
        subCode: ExceptionSubCode.INVALID_REFRESH_TOKEN,
        message: 'common',
      });
    }
  }

  private async getAdminByUsername(username: string) {
    const admin = await this.adminRepo
      .createQueryBuilder('admin')
      .addSelect('admin.password')
      .innerJoinAndSelect('admin.user', 'user')
      .where('admin.username = :username', { username })
      .getOne();

    return admin;
  }
}
