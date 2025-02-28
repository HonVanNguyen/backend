import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as dayjs from 'dayjs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GlobalConfig } from 'src/common/config/global.config';
import { UserType } from 'src/users/enums/users.enum';
import { UserRepository } from 'src/users/repositoties/user.repository';
import { ExceptionSubCode } from '../../common/constants/exception.constant';
import { UnauthorizedExc } from '../../common/exceptions/custom.exception';
import { JwtStrategyName } from '../enums/jwt-strategy.enum';
import { JwtAuthPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthenAdminStrategy extends PassportStrategy(
  Strategy,
  JwtStrategyName.ADMIN,
) {
  constructor(
    private readonly userRepo: UserRepository,
    configService: ConfigService<GlobalConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('auth.accessToken.secret'),
      algorithms: [configService.get('auth.accessToken.algorithm')],
    });
  }

  async validate(payload: JwtAuthPayload) {
    const { userId, exp } = payload;

    if (dayjs.unix(exp).isBefore(dayjs())) {
      throw new UnauthorizedExc({
        message: 'auth.expiredToken',
        subCode: ExceptionSubCode.EXPIRES_ACCESS_TOKEN,
      });
    }

    const user = await this.userRepo.findOneBy({
      id: userId,
      type: UserType.ADMIN,
    });

    if (!user) {
      throw new UnauthorizedExc({
        message: 'auth.invalidToken',
        subCode: ExceptionSubCode.INVALID_ACCESS_TOKEN,
      });
    }

    return user;
  }
}
