import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { OpenBalanceService } from 'shared/services/open-balance/open-balance.service';
import { PropertiesService } from 'shared/services/properties.service';
import { openBalanceresponse, MockOpenBalanceService } from 'shared/specs/mocks/mock-open-balance.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { OpenBalanceGuard } from './open-balance-guard';

describe('OpenBalanceGuard', () => {
  let guard: OpenBalanceGuard;
  let propertiesService: PropertiesService;
  let openBalanceService: OpenBalanceService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [OpenBalanceGuard,
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: OpenBalanceService, useClass: MockOpenBalanceService }
      ]
    });

    guard = TestBed.inject(OpenBalanceGuard);
    propertiesService = TestBed.inject(PropertiesService);
    openBalanceService = TestBed.inject(OpenBalanceService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();
  });

  describe('#canActivate', () => {

    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    it('should check feature flag and open balance', () => {
      spyOn(propertiesService, 'getOpenInvoicesf91').and.returnValue(of(true));
      spyOn(openBalanceService, 'getOpenBalances').and.returnValue(of(openBalanceresponse));
      guard.canActivate().subscribe(value => {
        expect(value).toEqual(true);
      });
      expect(propertiesService.getOpenInvoicesf91).toHaveBeenCalled();
    });

    it('should check feature flag and open balance and navigate to open balance page', () => {
      spyOn(propertiesService, 'getOpenInvoicesf91').and.returnValue(of(true));
      spyOn(openBalanceService, 'getOpenBalances').and.returnValue(of(openBalanceresponse));
      guard.canActivate().subscribe();
      expect(router.navigate).toHaveBeenCalled();
    });
    it('should redirect to home page when flag is turned off', () => {
      spyOn(propertiesService, 'getOpenInvoicesf91').and.returnValue(of(false));
      spyOn(openBalanceService, 'getOpenBalances').and.returnValue(of(openBalanceresponse));
      guard.canActivate().subscribe();
      expect(router.navigate).not.toHaveBeenCalled();
    });
    it('should redirect to home page when flag is turned off with route as-home', () => {
      spyOn(propertiesService, 'getOpenInvoicesf91').and.returnValue(of(false));
      spyOn(openBalanceService, 'getOpenBalances').and.returnValue(of(openBalanceresponse));
      guard.canActivate().subscribe();
      expect(router.navigate).not.toHaveBeenCalledWith(['/eorder/as-open-balance/confirmation']);
    });
  });
});
