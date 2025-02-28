import { IsValidText } from 'src/common/decorators/custom-validator.decorator';
import { BaseResponseDtoParams } from 'src/common/dto/base-response.dto';
import { PartialNonFunctionProperties } from 'src/common/types/utils.type';

export class RefreshTokenReqDto {
  @IsValidText()
  refreshToken: string;
}

export interface AuthTokenResDtoParams extends BaseResponseDtoParams {
  data: PartialNonFunctionProperties<AuthTokenResDto>;
}

export class AuthTokenResDto {
  accessToken: string;
  refreshToken: string;

  static mapProperty(dto: AuthTokenResDto, { data }: AuthTokenResDtoParams) {
    dto.accessToken = data.accessToken;
    dto.refreshToken = data.refreshToken;
  }

  static forCustomer(params: AuthTokenResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new AuthTokenResDto();

    this.mapProperty(result, params);

    return result;
  }

  static forAdmin(params: AuthTokenResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new AuthTokenResDto();

    this.mapProperty(result, params);

    return result;
  }
}
