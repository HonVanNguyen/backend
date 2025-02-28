import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { MOBILE_ROUTE_DATA } from './common/data/mobile-route.data';
import { I18nTranslations } from './i18n/i18n.generated';
import { REGEX_TEMPLATE_DATA } from './common/data/regex.data';

@Injectable()
export class AppService {
  constructor() {}

  async getHello(i18nContext: I18nContext<I18nTranslations>) {
    return i18nContext.t('common.hello');
  }

  async getMobileRoutes() {
    return MOBILE_ROUTE_DATA;
  }

  async getRegexTemplate() {
    return REGEX_TEMPLATE_DATA;
  }
}
