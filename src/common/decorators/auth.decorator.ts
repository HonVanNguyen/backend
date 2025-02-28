import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthenAdminGuard } from 'src/auth/guards/jwt-authen.admin.guard';
import { JwtAuthenCustomerGuard } from 'src/auth/guards/jwt-authen.customer.guard';
import { JwtAbilityAdminGuard } from 'src/casl/guards/ability.admin.guard';
import { ABILITY_METADATA_KEY } from '../constants/global.constant';
import { RequiredRule } from '../interfaces/casl.interface';

export const IS_PUBLIC_KEY = Symbol();

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const AuthenticateCustomer = () =>
  applyDecorators(UseGuards(JwtAuthenCustomerGuard), ApiBearerAuth());

export const AuthenticateAdmin = () =>
  applyDecorators(UseGuards(JwtAuthenAdminGuard), ApiBearerAuth());

export const AuthorizeAdmin = (...requirements: RequiredRule[]) => {
  return applyDecorators(
    UseGuards(JwtAbilityAdminGuard),
    SetMetadata(ABILITY_METADATA_KEY, requirements),
    ApiBearerAuth(),
  );
};

export const CurrentAuthData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
