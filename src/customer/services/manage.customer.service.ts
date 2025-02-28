import { Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { DeleteMultipleByIdNumberReqDto } from 'src/common/dto/delete-multiple.dto';
import {
  ExpectationFailedExc,
  NotFoundExc,
} from 'src/common/exceptions/custom.exception';
import { Transactional } from 'typeorm-transactional';
import { CustomerResDto } from '../dto/customer-response.dto';
import {
  ExportCustomerReqDto,
  GetListCustomerReqDto,
} from '../dto/manage/get-customer.dto';
import {
  CustomerRecentActivity,
  CustomerSearchBy,
} from '../enums/customers.enum';
import { CustomerRepository } from '../repositories/customer.repository';
import { ExcelService } from 'src/utils/services/excel.service';
import { Response } from 'express';

@Injectable()
export class ManageCustomerService {
  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly excelService: ExcelService,
  ) {}

  @Transactional()
  async getList(dto: GetListCustomerReqDto) {
    const { searchBy, recentActivity, limit, page } = dto;
    let { searchText } = dto;
    const queryBuilder = this.customerRepo
      .createQueryBuilder('customer')
      .orderBy('customer.id');

    if (searchBy && searchText) {
      searchText = `%${dto.searchText}%`;

      switch (searchBy) {
        case CustomerSearchBy.NAME:
          queryBuilder.where('customer.name ILIKE :searchText', {
            searchText,
          });
          break;
        case CustomerSearchBy.PHONE:
          queryBuilder.where('customer.phoneNumber ILIKE :searchText', {
            searchText,
          });
          break;
      }
    }

    if (recentActivity) {
      const date = new Date();
      switch (recentActivity) {
        case CustomerRecentActivity.AGO_1_HOUR:
          date.setHours(date.getHours() - 1);
          break;
        case CustomerRecentActivity.AGO_1_DAY:
          date.setDate(date.getDate() - 1);
          break;
        case CustomerRecentActivity.AGO_7_DAY:
          date.setDate(date.getDate() - 7);
          break;
        case CustomerRecentActivity.AGO_30_DAY:
          date.setDate(date.getDate() - 30);
          break;
        case CustomerRecentActivity.AGO_90_DAY:
          date.setDate(date.getDate() - 90);
          break;
      }

      queryBuilder.andWhere('customer.recentActivity >= :date', { date });
    }

    const { items, meta } = await paginate(queryBuilder, { limit, page });

    const customers = items.map((item) =>
      CustomerResDto.forAdmin({ data: item }),
    );
    return new Pagination(customers, meta);
  }

  async getDetail(id: number) {
    const customer = await this.customerRepo.findOneOrThrowNotFoundExc({
      where: { id },
      relations: {
        avatar: true,
        user: true,
      },
    });

    return CustomerResDto.forAdmin({ data: customer });
  }

  async deleteMultiple(dto: DeleteMultipleByIdNumberReqDto) {
    const { ids } = dto;
    const { affected } = await this.customerRepo.softDelete(ids);

    if (affected !== ids.length)
      throw new ExpectationFailedExc({
        message: 'auth.common.deleteMultipleError',
      });
  }

  async deleteSingle(id: number) {
    const { affected } = await this.customerRepo.softDelete(id);

    if (!affected) throw new NotFoundExc({ message: 'common.notFound' });
  }

}
