import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { serviceRequestorEnum } from 'shared/models/reason-category';
import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockDeeplinkService } from 'shared/specs/mocks/mock-deeplink.service';
import { MockSkipInsuranceService } from 'shared/specs/mocks/mock-skip-insurance.service';
import { default as reasonsList } from '../../../../specs/mocks/response/reasons-response.json';
import { DataService } from '../data.service';
import { DeeplinkService } from '../deeplink.service';
import { SkipInsuranceService } from '../skip-insurance.service';
import { DeeplinkReasonService } from './deeplink-reason.service';

describe('DeeplinkReasonService', () => {
  let dataService: DataService;
  let service: DeeplinkReasonService;
  let deeplinkService: DeeplinkService;
  let route: any;
  let skipInsuranceService: SkipInsuranceService;
  const [Main, Glucose, Employer] = JSON.parse(JSON.stringify(reasonsList));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeeplinkReasonService,
        { provide: DataService, useClass: MockDataService },
        { provide: DeeplinkService, useClass: MockDeeplinkService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: SkipInsuranceService, useClass: MockSkipInsuranceService },
      ]
    });
    dataService = TestBed.inject(DataService);
    service = TestBed.inject(DeeplinkReasonService);
    skipInsuranceService = TestBed.inject(SkipInsuranceService);
    deeplinkService = TestBed.inject(DeeplinkService);
    route = TestBed.inject(ActivatedRoute);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('#setParentChildValues', () => {
    it('setting parent if reason is employer', () => {
      const filterData = Main.filter(x => x.serviceRequestor === 'EMPLOYER');
      spyOn(dataService, 'setReasonData').and.callThrough();
      spyOn(dataService, 'setReasonType').and.callThrough();
      service.setParentChildValues('EMPLOYER', Main, Employer[0]);
      expect(dataService.setReasonData).toHaveBeenCalledWith(filterData[0]);
      expect(dataService.setReasonType).toHaveBeenCalledWith(true);
    });
    it('passing invalid service requestor as parent', () => {
      spyOn(dataService, 'setReasonData').and.callThrough();
      spyOn(dataService, 'setReasonType').and.callThrough();
      service.setParentChildValues('serviceType', Main, Employer[0]);
      expect(dataService.setReasonData).not.toHaveBeenCalled();
      expect(dataService.setReasonType).not.toHaveBeenCalled();
    });
    it('setting parent if reason is GLUCOSE', () => {
      const filterData = Main.filter(x => x.serviceRequestor === 'GLUCOSE');
      spyOn(dataService, 'setReasonData').and.callThrough();
      spyOn(dataService, 'setReasonType').and.callThrough();
      service.setParentChildValues('GLUCOSE', Main, Employer[0]);
      expect(dataService.setReasonData).toHaveBeenCalledWith(filterData[0]);
      expect(dataService.setReasonType).toHaveBeenCalledWith(false);
    });
  });

  describe('#setValueDeepLinkHasSingleTest', () => {
    it('setting glucose as parent child as Glucose common', () => {
      const value = 'OF';
      spyOn(service, 'setParentChildValues').and.callThrough();
      const glucoseFilter = Glucose.filter(x => x.deeplinkReason.toUpperCase() === value.toUpperCase());
      service.setValueDeepLinkHasSingleTest(null, Glucose, value, Main, Employer);
      expect(service.setParentChildValues).toHaveBeenCalled();
    });
    it('setting employer as parent and child as ORAL FLUID', () => {
      const value = 'GMC';
      spyOn(service, 'setParentChildValues').and.callThrough();
      const employerFilter = Employer.filter(x => x.deeplinkReason.toUpperCase() === value.toUpperCase());
      service.setValueDeepLinkHasSingleTest(null, Glucose, value, Main, Employer);
      expect(service.setParentChildValues).toHaveBeenCalled();
    });
    it('setting reason from main category ', () => {
      const value = 'GMC';
      spyOn(dataService, 'setfindLocationReason').and.callThrough();
      spyOn(dataService, 'setReasonData').and.callThrough();
      spyOn(skipInsuranceService, 'setSkipInsurance').and.callThrough();
      spyOn(deeplinkService, 'setFlagFordisableReason').and.callThrough();

      const employerFilter = Employer.filter(x => x.deeplinkReason.toUpperCase() === value.toUpperCase());
      service.setValueDeepLinkHasSingleTest(Main, Glucose, value, Main, Employer);
      expect(dataService.setfindLocationReason).toHaveBeenCalled();
      expect(dataService.setReasonData).toHaveBeenCalled();
      expect(skipInsuranceService.setSkipInsurance).toHaveBeenCalled();
      expect(deeplinkService.setFlagFordisableReason).toHaveBeenCalled();
    });
  });

  describe('#newReasonDeeplink', () => {
    it('it should call newReasonDeeplink', () => {
      spyOn(service, 'deeplinkHasMultiTest').and.callThrough();
      spyOn(dataService, 'setDeepLinkReasonFlag').and.callThrough();
      route.setQueryParamMap('reason', 'AOT');
      service.newReasonDeeplink();
      expect(dataService.setDeepLinkReasonFlag).toHaveBeenCalledWith(true);
      expect(service.deeplinkHasMultiTest).not.toHaveBeenCalled();
    });
    it('it should call newReasonDeeplink with empty', () => {
      spyOn(service, 'resetDeepLinkValues').and.callThrough();
      spyOn(dataService, 'setDeepLinkReasonFlag').and.callThrough();
      route.setQueryParamMap('reason', '');
      service.newReasonDeeplink();
      expect(dataService.setDeepLinkReasonFlag).toHaveBeenCalledWith(false);
      expect(service.resetDeepLinkValues).toHaveBeenCalled();
    });
    it('it should call newReasonDeeplink with multiple reasons', () => {
      spyOn(dataService, 'setDeepLinkReasonFlag').and.callThrough();
      spyOn(service, 'deeplinkHasMultiTest').and.callThrough();
      route.setQueryParamMap('reason', 'OF,Hair');
      service.newReasonDeeplink();
      expect(service.deeplinkHasMultiTest).toHaveBeenCalled();
      expect(dataService.setDeepLinkReasonFlag).toHaveBeenCalledWith(true);
    });
  });

  describe('#deeplinkReasonHasSingleTest', () => {
    it('it should call deeplinkReasonHasSingleTest', () => {
      service.reasonsListArray = reasonsList;
      spyOn(service, 'resetDeepLinkValues').and.callThrough();
      spyOn(service, 'setValueDeepLinkHasSingleTest').and.callThrough();
      service.deeplinkReasonHasSingleTest('AOT');
      expect(service.resetDeepLinkValues).toHaveBeenCalled();
      expect(service.setValueDeepLinkHasSingleTest).toHaveBeenCalled();
    });
    it('it should call deeplinkReasonHasSingleTest', () => {
      service.reasonsListArray = [];
      spyOn(service, 'resetDeepLinkValues').and.callThrough();
      spyOn(service, 'setValueDeepLinkHasSingleTest').and.callThrough();
      service.deeplinkReasonHasSingleTest('AOT');
      expect(service.resetDeepLinkValues).toHaveBeenCalled();
      expect(service.setValueDeepLinkHasSingleTest).not.toHaveBeenCalled();
    });
  });

  describe('#deeplinkHasMultiTest', () => {
    it('it should call deeplinkHasMultiTest', () => {
      service.reasonsListArray = reasonsList;
      spyOn(service, 'resetDeepLinkValues').and.callThrough();
      spyOn(service, 'setValueDeepLinkHasMultiTest').and.callThrough();
      service.deeplinkHasMultiTest('OF,Hair');
      expect(service.resetDeepLinkValues).toHaveBeenCalled();
      expect(service.setValueDeepLinkHasMultiTest).toHaveBeenCalled();
    });
    it('it should call deeplinkHasMultiTest and reasons list is empty', () => {
      service.reasonsListArray = [];
      spyOn(service, 'resetDeepLinkValues').and.callThrough();
      spyOn(service, 'setValueDeepLinkHasMultiTest').and.callThrough();
      service.deeplinkHasMultiTest('OF,Hair');
      expect(service.resetDeepLinkValues).toHaveBeenCalled();
      expect(service.setValueDeepLinkHasMultiTest).not.toHaveBeenCalled();
    });
  });
  describe('#prepareTestListFromStringArray', () => {
    it('setting value as glucose', () => {
      service.hasChildDeepLink = [];
      const tests = ['GMC'];
      service.prepareTestListFromStringArray(tests, Glucose, Employer);
      expect(service.hasChildDeepLink[0]).toEqual(serviceRequestorEnum.glucose);
    });
    it('setting value as employer and multiple tests', () => {
      service.hasChildDeepLink = [];
      const tests = ['OF', 'Hair'];
      service.prepareTestListFromStringArray(tests, Glucose, Employer);
      expect(service.hasChildDeepLink[0]).toEqual(serviceRequestorEnum.employer);
    });
  });
});
