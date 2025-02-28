import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { IsValidHomeConfig } from 'src/system-config/validators/home-config.validator';
import {
  HomeSection,
  HomeSectionBanner,
  HomeSectionNormalService,
} from '../common/home-config.common.dto';

@ApiExtraModels(HomeSectionBanner, HomeSectionNormalService)
export class UpdateHomeConfigAdminReqDto {
  @IsArray()
  @IsValidHomeConfig()
  @ApiProperty({
    type: 'array',
    items: {
      anyOf: [
        { $ref: getSchemaPath(HomeSectionBanner) },
        { $ref: getSchemaPath(HomeSectionNormalService) },
      ],
    },
  })
  sections: HomeSection[];
}

export class SeedHomeConfigAdminReqDto {
  @IsArray()
  @IsValidHomeConfig()
  sections: HomeSection[];
}
