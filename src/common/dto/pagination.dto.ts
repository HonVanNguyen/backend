import { IsValidNumber } from '../decorators/custom-validator.decorator';

export abstract class PaginationReqDto {
  @IsValidNumber({ required: false, min: 1 })
  page?: number = 1;

  @IsValidNumber({ required: false, min: 1 })
  limit?: number = 20;
}

// https://aalonso.dev/blog/how-to-generate-generics-dtos-with-nestjsswagger-422g
export class PaginationResDto {
  items: any[];

  meta: {
    itemCount: number;
    totalItems?: number;
    itemsPerPage: number;
    totalPages?: number;
    currentPage: number;
  };

  links?: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  };
}
