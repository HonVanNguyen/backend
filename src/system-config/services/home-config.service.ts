import { Injectable } from '@nestjs/common';
import { ExpectationFailedExc } from 'src/common/exceptions/custom.exception';
import { HomeConfigResDto } from '../dto/common/res/home-config.res.dto';
import { SystemConfigKey } from '../enums/system-config.enum';
import { SystemConfigRepository } from '../repositories/system-config.repository';

@Injectable()
export class HomeConfigService {
  constructor(private systemConfigRepo: SystemConfigRepository) {}

  async get() {
    const homeConfig = await this.systemConfigRepo.findOneByOrThrowNotFoundExc({
      key: SystemConfigKey.HOME_CONFIG,
    });

    if (!Array.isArray(homeConfig.value)) {
      throw new ExpectationFailedExc({ message: 'common' });
    }

    return HomeConfigResDto.forCustomer({
      sections: homeConfig.value,
    });
  }
}
