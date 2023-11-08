import { MissingTranslationStrategy } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

export const MockI18nService = new I18n('xlf', '', 'en', MissingTranslationStrategy.Ignore);
