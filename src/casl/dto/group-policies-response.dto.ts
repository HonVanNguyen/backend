import { BaseResponseDtoParams } from 'src/common/dto/base-response.dto';
import { GroupPolicy } from '../entities/group-policy.entity';
import { GroupPolicyStatus, GroupPolicyType } from '../enums/group-policy.enum';
import { PolicyResDto } from './policy-response.dto';

export interface GroupPolicyResDtoParams extends BaseResponseDtoParams {
  data: GroupPolicy;
}

export class GroupPolicyResDto {
  id: number;
  key: string;
  name: string;
  description: string;
  createdAt: Date;
  status: GroupPolicyStatus;
  type: GroupPolicyType;
  ownerId: number;
  policies: PolicyResDto[];

  static mapProperty(
    dto: GroupPolicyResDto,
    { data }: GroupPolicyResDtoParams,
  ) {
    dto.id = data.id;
    dto.name = data.name;
    dto.key = data.key;
    dto.description = data.description;
    dto.ownerId = data.ownerId;
    dto.createdAt = data.createdAt;
  }

  static forAdmin(params: GroupPolicyResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new GroupPolicyResDto();

    this.mapProperty(result, params);

    result.status = data.status;
    result.type = data.type;
    result.policies = data.groupToPolicies?.map((item) =>
      PolicyResDto.forAdmin({ data: item.policy }),
    );
    return result;
  }
}
