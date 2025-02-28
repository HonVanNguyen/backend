import { Equals, IsObject, IsOptional, IsUrl } from 'class-validator';
import {
  IsValidArrayObject,
  IsValidEnum,
  IsValidNumber,
  IsValidObject,
  IsValidText,
} from 'src/common/decorators/custom-validator.decorator';
import {
  HomeSectionDirection,
  HomeSectionType,
} from 'src/system-config/enums/home-config.enum';

export class HomeSectionBannerDataItem {
  @IsUrl()
  image: string;

  @IsValidNumber()
  imageId: number;

  @IsValidText({
    required: false,
  })
  link: string;

  @IsObject()
  @IsOptional()
  params?: any;
}

export class HomeSectionBanner {
  @Equals(HomeSectionType.BANNER)
  type: HomeSectionType.BANNER;

  @IsValidArrayObject(
    {
      required: true,
      minSize: 1,
    },
    HomeSectionBannerDataItem,
  )
  data: HomeSectionBannerDataItem[];
}

class HomeSectionNormalServiceDataItem {
  @IsUrl()
  image: string;

  @IsValidText({
    required: false,
  })
  link: string;

  @IsValidNumber()
  imageId: number;

  @IsValidText()
  name: string;

  @IsObject()
  @IsOptional()
  params?: any;
}

export class HomeSectionNormalService {
  @Equals(HomeSectionType.NORMAL_SERVICE)
  type: HomeSectionType.NORMAL_SERVICE;

  @IsValidText()
  title: string;

  @IsValidArrayObject(
    {
      required: true,
      minSize: 1,
    },
    HomeSectionNormalServiceDataItem,
  )
  data: HomeSectionNormalServiceDataItem[];
}

export type HomeSection = HomeSectionBanner | HomeSectionNormalService;
