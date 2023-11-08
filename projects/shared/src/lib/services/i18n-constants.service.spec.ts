import { inject, TestBed } from '@angular/core/testing';

import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { I18nConstantsService } from './i18n-constants.service';

describe('I18nConstantsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockI18nModule],
      providers: [I18nConstantsService]
    });
  });

  it(
    'should be created',
    inject([I18nConstantsService], (service: I18nConstantsService) => {
      expect(service).toBeTruthy();
    })
  );
});
