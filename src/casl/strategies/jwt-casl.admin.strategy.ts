import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import * as dayjs from 'dayjs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GlobalConfig } from 'src/common/config/global.config';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthPayload } from '../../auth/interfaces/jwt-payload.interface';
import { ExceptionSubCode } from '../../common/constants/exception.constant';
import { UnauthorizedExc } from '../../common/exceptions/custom.exception';
import { UserWithPoliciesDto } from '../dto/user-with-policies.dto';
import { CaslStrategyName } from '../enums/casl-strategy.enum';
import { CommonCaslService } from '../services/common.casl.service';

@Injectable()
export class JwtCaslAdminStrategy extends PassportStrategy(
  Strategy,
  CaslStrategyName.ADMIN,
) {
  constructor(
    private commonCaslService: CommonCaslService,
    configService: ConfigService<GlobalConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('auth.accessToken.secret'),
      algorithms: [configService.get('auth.accessToken.algorithm')],
    });
  }

  async validate(
    payload: JwtAuthPayload,
  ): Promise<UserWithPoliciesDto | false> {
    const { userId, exp } = payload;

    if (dayjs.unix(exp).isBefore(dayjs())) {
      throw new UnauthorizedExc({
        message: 'auth.common.expiredToken',
        subCode: ExceptionSubCode.EXPIRES_ACCESS_TOKEN,
      });
    }

    const user: User =
      await this.commonCaslService.getAdminUserWithPolicies(userId);

    if (!user.admin) return false;

    const userWithPolicies = plainToInstance(UserWithPoliciesDto, user);

    if (!userWithPolicies) return false;

    return userWithPolicies;
  }
}
