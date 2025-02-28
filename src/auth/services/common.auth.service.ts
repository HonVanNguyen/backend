import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GlobalConfig } from 'src/common/config/global.config';
import { JwtAuthPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class CommonAuthService {
  constructor(
    private configService: ConfigService<GlobalConfig>,
    private jwtService: JwtService,
  ) {}

  generateAccessToken(payload: JwtAuthPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('auth.accessToken.expiresTime'),
      secret: this.configService.get('auth.accessToken.secret'),
    });
  }

  generateRefreshToken(payload: JwtAuthPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('auth.refreshToken.expiresTime'),
      secret: this.configService.get('auth.refreshToken.secret'),
    });
  }

  generateTokens(payload: JwtAuthPayload) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
