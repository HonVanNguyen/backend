import { PartialNonFunctionProperties } from '../../../../common/types/utils.type';
import { HomeSection } from '../home-config.common.dto';

export class HomeConfigResDto {
  sections: HomeSection[];

  static mapProperty(
    dto: HomeConfigResDto,
    data: PartialNonFunctionProperties<HomeConfigResDto>,
  ) {
    dto.sections = data.sections;
  }

  static forCustomer(data: PartialNonFunctionProperties<HomeConfigResDto>) {
    const result = new HomeConfigResDto();
    if (!data) return null;

    this.mapProperty(result, data);

    return result;
  }

  static forAdmin(data: PartialNonFunctionProperties<HomeConfigResDto>) {
    const result = new HomeConfigResDto();
    if (!data) return null;

    this.mapProperty(result, data);

    return result;
  }
}
