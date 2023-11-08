import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CostEstimateStatus } from 'shared/models/eorder';
import { ApiService } from 'shared/services/api.service';
import { PropertiesService } from 'shared/services/properties.service';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { CostEstimateService } from './cost-estimate.service';

describe('CostEstimateService', () => {
  let service: CostEstimateService;
  let apiService: any;
  let propertiesService: PropertiesService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CostEstimateService,
        { provide: ApiService, useClass: MockApiService },
        { provide: PropertiesService, useClass: MockPropertiesService }
      ]
    });
    service = TestBed.inject(CostEstimateService);
    apiService = TestBed.inject(ApiService);
    propertiesService = TestBed.inject(PropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('call getEasypayStatus when f89 is enabled', () => {
    const res = new CostEstimateStatus();
    res.skipCostEstimate = true;
    res.quotedCost = 10;
    res.type = 'COMPLETED';
    spyOn(propertiesService, 'getEaypayEnhancementF89').and.returnValue(of(true));
    spyOn(apiService, 'get').and.returnValue(of(res));
    service.getEstimateCostStatus().subscribe();
    expect(apiService.get).toHaveBeenCalledWith('/guest/easypay/easyPayTransactionStatus');
  });
  it('do not call getEasypayStatus when f89 is disabled', () => {
    spyOn(propertiesService, 'getEaypayEnhancementF89').and.returnValue(of(false));
    spyOn(apiService, 'get').and.callThrough();
    service.getEstimateCostStatus().subscribe();
    expect(apiService.get).not.toHaveBeenCalled();
  });
});
