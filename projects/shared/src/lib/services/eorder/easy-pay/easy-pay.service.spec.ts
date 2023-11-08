import { TestBed } from '@angular/core/testing';
import { EasyPayStatus } from 'shared/models/eorder';
import { ApiService } from 'shared/services/api.service';
import { PropertiesService } from 'shared/services/properties.service';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { EorderEasyPayService } from './easy-pay.service';

describe('EorderEasyPayService', () => {
  let service: EorderEasyPayService;
  let apiService: any;
  let propertiesService: PropertiesService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EorderEasyPayService,
        { provide: ApiService, useClass: MockApiService },
        { provide: PropertiesService, useClass: MockPropertiesService }
      ]
    });
    service = TestBed.inject(EorderEasyPayService);
    apiService = TestBed.inject(ApiService);
    propertiesService = TestBed.inject(PropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('purchase status success', () => {
    service.isSkipPaymentSelected = false;
    const mockPaymentStatus = {
      'status': 'COMPLETED'
    };
    spyOn(apiService, 'post').and.callThrough();
    service.purchaseSuccess();
    expect(apiService.post).toHaveBeenCalledWith('/guest/easypay/updateTransaction', mockPaymentStatus);
  });

  it('purchase status failed', () => {
    const mockPaymentStatus = {
      'status': 'FAILED'
    };
    spyOn(apiService, 'post').and.callThrough();
    service.purchaseError();
    expect(apiService.post).toHaveBeenCalledWith('/guest/easypay/updateTransaction', mockPaymentStatus);
  });
  describe('#callComponentMethod', () => {
    it('when success', () => {
      const response: EasyPayStatus = new EasyPayStatus();
      response.isSkippayment = false;
      response.status = true;
      spyOn(service.componentMethodCallSource, 'next').and.callThrough();
      service.callComponentMethod(false);
      expect(service.componentMethodCallSource.next).toHaveBeenCalledWith(response);
    });
    it('when error', () => {
      const response: EasyPayStatus = new EasyPayStatus();
      response.isSkippayment = true;
      response.status = false;
      service.isSkipPaymentSelected = true;
      spyOn(service.componentMethodCallSource, 'next').and.callThrough();
      service.callComponentMethod(true);
      expect(service.componentMethodCallSource.next).toHaveBeenCalledWith(response);
    });
    it('when error and subscribing', () => {
      const response: EasyPayStatus = new EasyPayStatus();
      response.isSkippayment = false;
      response.status = false;
      service.callComponentMethod(true);
      service.componentMethodCalled$.subscribe((data: EasyPayStatus) => {
        expect(data).toEqual(response);
      });
    });

  });
});
