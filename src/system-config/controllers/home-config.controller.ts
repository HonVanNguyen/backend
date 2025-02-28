import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HomeConfigService } from '../services/home-config.service';

@Controller(`/home-config`)
@ApiTags('Home Config Controller')
export class HomeConfigController {
  constructor(private homeConfigService: HomeConfigService) {}

  @Get()
  get() {
    return this.homeConfigService.get();
  }
}
