import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CostEstimateService } from 'shared/services/eorder/easy-pay/cost-estimate.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { MockCostEstimateService } from 'shared/specs/mocks/mock-cost-estimate.service';
import { MockEorderService } from 'shared/specs/mocks/mock-eorder.service';
import { GuestCostEstimateGuard } from './guest-costestimate-guard';

describe('GuestCostEstimateGuard', () => {
  let guard: GuestCostEstimateGuard;
  let costEstimateService: CostEstimateService;
  let eOrderService: EorderService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [GuestCostEstimateGuard,
        { provide: CostEstimateService, useClass: MockCostEstimateService },
        { provide: EorderService, useClass: MockEorderService }
      ]
    });

    guard = TestBed.inject(GuestCostEstimateGuard);
    costEstimateService = TestBed.inject(CostEstimateService);
    eOrderService = TestBed.inject(EorderService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();
  });

  describe('#canActivate', () => {

    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    it('should return the getEstimateCostStatus', () => {
      spyOn(costEstimateService, 'getEstimateCostStatus').and.returnValue(of(false));
      guard.canActivate().subscribe(value => {
        expect(value).toEqual(true);
      });
      expect(costEstimateService.getEstimateCostStatus).toHaveBeenCalled();
    });

    it('should not redirect to confirmation page', () => {
      spyOn(costEstimateService, 'getEstimateCostStatus').and.returnValue(of(false));
      guard.canActivate().subscribe();
      expect(router.navigate).not.toHaveBeenCalled();
    });
    it('should redirect to confirmation page', () => {
      spyOn(costEstimateService, 'getEstimateCostStatus').and.returnValue(of(true));
      guard.canActivate().subscribe();
      expect(router.navigate).toHaveBeenCalled();
    });
    it('should redirect to confirmation page with path', () => {
      spyOn(costEstimateService, 'getEstimateCostStatus').and.returnValue(of(true));
      guard.canActivate().subscribe();
      expect(router.navigate).toHaveBeenCalledWith(['/eorder/as-eorder-confirmation']);
    });
    it('should redirect to confirmation page and save encounter', () => {
      spyOn(costEstimateService, 'getEstimateCostStatus').and.returnValue(of(true));
      spyOn(eOrderService, 'saveEncounter').and.callThrough();
      guard.canActivate().subscribe();
      expect(router.navigate).toHaveBeenCalledWith(['/eorder/as-eorder-confirmation']);
      expect(eOrderService.saveEncounter).toHaveBeenCalled();
    });
  });
});
