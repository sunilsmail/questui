import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { MockGenderFieldsService } from 'shared/specs/mocks/mock-gender-fields-service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import {
  FormattedPrimaryInsurance,
  FormattedSecondaryInsurance, PrimaryAndSecondaryInsurance
} from 'shared/specs/mocks/mock-psc-insurance';
import { MockSecondaryInsuranceService } from 'shared/specs/mocks/mock-secondary-insurance.service';
import { MockUserService } from 'shared/specs/mocks/mock-user.service';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { PropertiesService } from '../properties.service';
import { GenderFieldsService } from '../psc/gender-fields.service';
import { SecondaryInsuranceService } from '../secondary-insurance.service';
import { UserService } from '../user.service';
import { AuthInsuranceService } from './auth-insurance.service';

describe('AuthInsuranceService', () => {
  let service: AuthInsuranceService;
  let apiMock: any;
  let userService: UserService;
  let propertiesService: PropertiesService;
  let dataService: DataService;
  let secondaryInsuranceService: SecondaryInsuranceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInsuranceService,
        { provide: ApiService, useClass: MockApiService },
        { provide: UserService, useClass: MockUserService },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: GenderFieldsService, useClass: MockGenderFieldsService },
        { provide: SecondaryInsuranceService, useClass: MockSecondaryInsuranceService },
      ]
    });
    service = TestBed.inject(AuthInsuranceService);
    userService = TestBed.inject(UserService);
    apiMock = TestBed.inject(ApiService);
    propertiesService = TestBed.inject(PropertiesService);
    dataService = TestBed.inject(DataService);
    secondaryInsuranceService = TestBed.inject(SecondaryInsuranceService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('#getInsuranceProfile', () => {

    it('makes get insurance api calls', () => {
      service.isDataFetch = false;
      spyOn(apiMock, 'get').and.returnValue(of(true));
      userService.isAuthenticated$ = of(true);
      spyOn(service, 'skipAutopopulateInsForEdit').and.returnValue(of([true, true]));
      service.getInsuranceProfile().subscribe();
      expect(apiMock.get).toHaveBeenCalledWith('/api/getInsuranceProfile');
      expect(service.isModifyFlow).toBe(true);
    });

    // it('not makes get insurance api calls', () => {
    //   service.isDataFetch = true;
    //   spyOn(apiMock, 'get').and.returnValue(of(true));
    //   userService.isAuthenticated$ = of(true);
    //   spyOn(service, 'skipAutopopulateInsForEdit').and.returnValue(of([true, true]));
    //   service.getInsuranceProfile().subscribe();
    //   expect(apiMock.get).not.toHaveBeenCalledWith('/api/getInsuranceProfile');
    //   expect(service.isModifyFlow).toBe(true);
    // });

    // it('skip calling insurance when feature flag is off', () => {
    //   service.isDataFetch = true;
    //   spyOn(apiMock, 'get').and.returnValue(of(true));
    //   userService.isAuthenticated$ = of(true);
    //   spyOn(service, 'skipAutopopulateInsForEdit').and.returnValue(of([false, true]));
    //   service.getInsuranceProfile().subscribe();
    //   expect(apiMock.get).not.toHaveBeenCalledWith('/api/getInsuranceProfile');
    //   expect(service.isModifyFlow).toBe(true);
    // });

    // it('skip calling insurance when feature flag is off and checking is Modify Flow', () => {
    //   service.isDataFetch = true;
    //   spyOn(apiMock, 'get').and.returnValue(of(true));
    //   userService.isAuthenticated$ = of(true);
    //   spyOn(service, 'skipAutopopulateInsForEdit').and.returnValue(of([false, false]));
    //   service.getInsuranceProfile().subscribe();
    //   expect(apiMock.get).not.toHaveBeenCalledWith('/api/getInsuranceProfile');
    //   expect(service.isModifyFlow).toBe(false);
    // });

  });
  describe('#set Insurance Data', () => {
    it('set primary insurance', () => {
      spyOn(dataService, 'setInsuranceData').and.callThrough();
      service.setPrimaryInsuranceData(PrimaryAndSecondaryInsurance);
      expect(dataService.setInsuranceData).toHaveBeenCalledWith(FormattedPrimaryInsurance);
    });
    it('set secondary insurance', () => {
      spyOn(secondaryInsuranceService, 'setInsuranceData').and.callThrough();
      service.setPrimaryInsuranceData(PrimaryAndSecondaryInsurance);
      expect(secondaryInsuranceService.setInsuranceData).toHaveBeenCalledWith(FormattedSecondaryInsurance);
    });
    it('do not set primary insurance', () => {
      service.isModifyFlow = true;
      spyOn(dataService, 'setInsuranceData').and.callThrough();
      service.setPrimaryInsuranceData(PrimaryAndSecondaryInsurance);
      expect(dataService.setInsuranceData).not.toHaveBeenCalledWith(FormattedPrimaryInsurance);
    });
    it('do not set secondary insurance', () => {
      service.isModifyFlow = true;
      spyOn(secondaryInsuranceService, 'setInsuranceData').and.callThrough();
      service.setPrimaryInsuranceData(PrimaryAndSecondaryInsurance);
      expect(secondaryInsuranceService.setInsuranceData).not.toHaveBeenCalledWith(FormattedSecondaryInsurance);
    });
  });

});
