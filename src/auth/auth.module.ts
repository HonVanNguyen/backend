import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminRepository } from 'src/admin/repositoires/admin.repository';
import { GlobalConfig } from 'src/common/config/global.config';
import { TypeOrmCustomModule } from 'src/common/modules/typeorm-custom.module';
import { CustomerRepository } from 'src/customer/repositories/customer.repository';
import { UserRepository } from 'src/users/repositoties/user.repository';
import { UtilsModule } from 'src/utils/utils.module';
import { AdminAuthController } from './controllers/admin.auth.controller';
import { CustomerAuthController } from './controllers/customer.auth.controller';
import { AdminAuthService } from './services/admin.auth.service';
import { CommonAuthService } from './services/common.auth.service';
import { CustomerAuthService } from './services/customer.auth.service';
import { JwtAuthenAdminStrategy } from './strategies/jwt-authen.admin.strategy';
import { JwtAuthenCustomerStrategy } from './strategies/jwt-authen.customer.strategy';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<GlobalConfig>) => ({
        secret: configService.get('auth.accessToken.secret'),
        signOptions: {
          algorithm: configService.get('auth.accessToken.algorithm'),
        },
      }),
    }),
    TypeOrmCustomModule.forFeature([
      AdminRepository,
      CustomerRepository,
      UserRepository,
    ]),
    UtilsModule,
  ],
  controllers: [AdminAuthController, CustomerAuthController],
  providers: [
    JwtAuthenAdminStrategy,
    JwtAuthenCustomerStrategy,
    AdminAuthService,
    CommonAuthService,
    CustomerAuthService,
    UsersService,
  ],
})
export class AuthModule {}
