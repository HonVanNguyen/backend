import { Injectable } from '@nestjs/common';
import { ManageAdminService } from 'src/admin/services/manage.admin.service';
import { DEFAULT_HOME_CONFIG_DATA } from 'src/system-config/data/home-config.data';
import { SystemConfigKey } from 'src/system-config/enums/system-config.enum';
import { SystemConfigRepository } from 'src/system-config/repositories/system-config.repository';
import { HomeConfigAdminService } from './home-config.admin.service';

@Injectable()
export class SystemConfigAdminService {
  constructor(
    private systemConfigRepo: SystemConfigRepository,
    private homeConfigAdminService: HomeConfigAdminService,
    private manageAdminService: ManageAdminService,
  ) {}

  async init() {
    const defaultAdmin = await this.manageAdminService.createDefaultAdmin();
    if (!defaultAdmin) return;
    // Seed default home config data if not existed to default admin's user
    const homeConfig = await this.systemConfigRepo.findOneBy({
      key: SystemConfigKey.HOME_CONFIG,
    });
    if (!homeConfig) {
      await this.homeConfigAdminService.seed(
        DEFAULT_HOME_CONFIG_DATA,
        defaultAdmin?.user?.id,
      );
    }
  }
}
