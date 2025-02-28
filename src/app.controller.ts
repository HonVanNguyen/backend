import { Controller, Get } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AppService } from './app.service';
import { I18nTranslations } from './i18n/i18n.generated';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@I18n() i18nContext: I18nContext<I18nTranslations>) {
    return this.appService.getHello(i18nContext);
  }

  @Get('mobile-routes')
  getRoutes() {
    return this.appService.getMobileRoutes();
  }

  @Get('regex-template')
  getRegexTemplate() {
    return this.appService.getRegexTemplate();
  }
}
