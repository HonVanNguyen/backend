import { AdminResDto } from 'src/admin/dto/admin-response.dto';
import { GroupPolicyResDto } from 'src/casl/dto/group-policies-response.dto';
import { CustomerResDto } from 'src/customer/dto/customer-response.dto';
import { User } from '../entities/user.entity';
import { UserType } from '../enums/users.enum';

export type UserResDtoParams = {
  data?: User;
};

export class UserResDto {
  id: number;
  type: UserType;
  customer: CustomerResDto;
  admin: AdminResDto;
  groupPolicies: GroupPolicyResDto[];

  static mapProperty(dto: UserResDto, params: UserResDtoParams) {
    const { data } = params;

    dto.id = data.id;
  }

  static forAdmin(params: UserResDtoParams) {
    const { data } = params;

    const result = new UserResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    result.type = data.type;
    result.groupPolicies = data.userToGroupPolicies
      ?.map((item) => GroupPolicyResDto.forAdmin({ data: item.groupPolicy }))
      .filter(Boolean);

    result.admin = AdminResDto.forAdmin({ data: data.admin });

    return result;
  }

  static forCustomer(params: UserResDtoParams) {
    const { data } = params;

    const result = new UserResDto();
    if (!data) return null;

    this.mapProperty(result, params);

    result.type = data.type;

    result.customer = CustomerResDto.forCustomer({ data: data.customer });

    return result;
  }
}
