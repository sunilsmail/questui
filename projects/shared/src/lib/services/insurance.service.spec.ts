import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { ApiService } from './api.service';
import { InsuranceService } from './insurance.service';


describe('InsuranceService', () => {
  let service: InsuranceService;
  let apiMock: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InsuranceService, { provide: ApiService, useClass: MockApiService }]
    });
    service = TestBed.inject(InsuranceService);
    apiMock = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#verifyInsurance', () => {
    const mockBody = {
      siteCode: 'ATL',
      insuranceMnemonic: 'insuran',
      insuranceMemberId: 'abc12345',
      insuranceGroupId: 'abc123',
      patientDOB: '01/01/1990',
      patientFirstName: 'quest',
      patientLastName: 'peter',
      serviceDate: '01/01/2010'
    };
    beforeEach(() => {
      spyOn(apiMock, 'post').and.returnValue(of(null));
      spyOn(apiMock, 'get').and.returnValue(of(null));
    });

    it('should call the `/guest/getPayorList` api', () => {
      service.getInsuranceProvider(mockBody.siteCode).subscribe();
      expect(apiMock.get).toHaveBeenCalledWith(`/guest/getPayorList/${mockBody.siteCode}`);
    });
    it('should call the `/guest/verifyInsurance` api', () => {
      service.verifyInsurance(mockBody).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith(`/guest/verifyInsurance`, mockBody);
    });

  });
});
