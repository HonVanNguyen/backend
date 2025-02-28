import { Injectable } from '@nestjs/common';
import { NotFoundExc } from 'src/common/exceptions/custom.exception';
import {
  SeedHomeConfigAdminReqDto,
  UpdateHomeConfigAdminReqDto,
} from 'src/system-config/dto/admin/home-config.admin.req.dto';
import { HomeConfigResDto } from 'src/system-config/dto/common/res/home-config.res.dto';
import { HomeSectionType } from 'src/system-config/enums/home-config.enum';
import { SystemConfigKey } from 'src/system-config/enums/system-config.enum';
import { SystemConfigRepository } from 'src/system-config/repositories/system-config.repository';
import { User } from 'src/users/entities/user.entity';
import { UtilsService } from 'src/utils/services/utils.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class HomeConfigAdminService {
  constructor(
    private systemConfigRepo: SystemConfigRepository,
    private utilsService: UtilsService,
  ) {}

  @Transactional()
  async get(user: User) {
    const homeConfig = await this.systemConfigRepo.findOneByOrThrowNotFoundExc({
      key: SystemConfigKey.HOME_CONFIG,
    });
    return HomeConfigResDto.forAdmin({
      sections: homeConfig.value,
    });
  }

  @Transactional()
  async update(user: User, dto: UpdateHomeConfigAdminReqDto) {
    const { sections } = dto;

    let homeConfig = await this.systemConfigRepo.findOneBy({
      key: SystemConfigKey.HOME_CONFIG,
    });
    if (!homeConfig) {
      homeConfig = this.systemConfigRepo.create({
        key: SystemConfigKey.HOME_CONFIG,
        ownerId: user.id,
      });
    }

    homeConfig.value = sections;

    await this.systemConfigRepo.save(homeConfig);

    return this.get(user);
  }

  @Transactional()
  async seed(dto: SeedHomeConfigAdminReqDto, userId: number) {
    const { sections } = dto;

    const homeConfig = this.systemConfigRepo.create({
      key: SystemConfigKey.HOME_CONFIG,
      ownerId: userId,
    });

    homeConfig.value = sections;

    await this.systemConfigRepo.save(homeConfig);
  }
}
