import { BaseResponseDtoParams } from 'src/common/dto/base-response.dto';
import { Action, ActionAbility, Resource } from 'src/common/enums/casl.enum';
import { Policy } from '../entities/policy.entity';
import { PolicyType } from '../enums/policy.enum';

export interface PolicyResDtoParams extends BaseResponseDtoParams {
  data: Policy;
}

export class PolicyResDto {
  id: number;
  name: string;
  action: Action;
  resource: Resource;
  actionAbility: ActionAbility;
  type: PolicyType;

  static mapProperty(dto: PolicyResDto, { data }: PolicyResDtoParams) {
    dto.id = data.id;
    dto.name = data.name;
    dto.action = data.action;
    dto.resource = data.resource;
    dto.actionAbility = data.actionAbility;
    dto.type = data.type;
  }

  static forAdmin(params: PolicyResDtoParams) {
    const { data } = params;

    if (!data) return null;
    const result = new PolicyResDto();

    PolicyResDto.mapProperty(result, params);

    return result;
  }
}
