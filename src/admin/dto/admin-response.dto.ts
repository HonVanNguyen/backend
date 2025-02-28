import { BaseResponseDtoParams } from 'src/common/dto/base-response.dto';
import { FileResDto } from 'src/file/dtos/res/file.res.dto';
import { UserResDto } from 'src/users/dto/user-response.dto';
import { Admin } from '../entities/admin.entity';
import { AdminStatus } from '../enums/admin.enum';

export interface AdminResDtoParams extends BaseResponseDtoParams {
  data: Admin;
}

export class AdminResDto {
  id: number;
  username: string;
  status: AdminStatus;
  name: string;
  avatar: FileResDto;
  user: UserResDto;

  private static mapProperty(dto: AdminResDto, { data }: AdminResDtoParams) {
    dto.id = data.id;
    dto.name = data.name;
    dto.username = data.username;
  }

  private static mapPolicies(
    dto: AdminResDto,
    { data, resOpts }: AdminResDtoParams,
  ) {}

  static forAdmin(params: AdminResDtoParams) {
    const { data, resOpts } = params;

    if (!data) return null;
    const result = new AdminResDto();

    this.mapProperty(result, params);
    this.mapPolicies(result, params);

    result.status = data.status;
    result.avatar = FileResDto.forAdmin({ data: data.avatar, resOpts });
    result.user = UserResDto.forAdmin({ data: data.user });

    return result;
  }
}
