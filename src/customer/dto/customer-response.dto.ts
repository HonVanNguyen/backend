import { BaseResponseDtoParams } from 'src/common/dto/base-response.dto';
import { FileResDto } from 'src/file/dtos/res/file.res.dto';
import { UserResDto } from 'src/users/dto/user-response.dto';
import { Customer } from '../entities/customer.entity';
import { CustomerStatus } from '../enums/customers.enum';

export interface CustomerResDtoParams extends BaseResponseDtoParams {
  data?: Customer;
}

export class CustomerResDto {
  id: number;
  phoneNumber: string;
  email: string;
  name: string;
  status: CustomerStatus;
  avatar: FileResDto;
  recentActivity: Date;
  dynamicData: any;
  createdAt: Date;
  user: UserResDto;
  userId: number;

  static mapProperty(dto: CustomerResDto, { data }: CustomerResDtoParams) {
    dto.id = data.id;
    dto.phoneNumber = data.phoneNumber;
    dto.email = data.email;
    dto.name = data.name;
    dto.createdAt = data.createdAt;
    dto.status = data.status;
    dto.recentActivity = data.recentActivity;
    dto.dynamicData = data.dynamicData;
  }

  static forCustomer(params: CustomerResDtoParams) {
    const { data } = params;
    if (!data) return null;

    const result = new CustomerResDto();

    this.mapProperty(result, { data });

    return result;
  }

  static forAdmin(params: CustomerResDtoParams) {
    const { data } = params;
    if (!data) return null;

    const result = new CustomerResDto();

    this.mapProperty(result, { data });

    return result;
  }
}
