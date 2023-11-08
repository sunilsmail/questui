import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { editSummaryDetails } from 'shared/models/eOrder-state-navigation';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { mockEorderDemographicsInfo, MockEorderService } from 'shared/specs/mocks/mock-eorder.service';
import { MockFindAppointmentService } from 'shared/specs/mocks/mock-find-appointment';
import { MockGenderFieldsService } from 'shared/specs/mocks/mock-gender-fields-service';
import { MockPscService } from 'shared/specs/mocks/mock-psc.service';
import { ApiService } from '../api.service';
import { FindAppointmentService } from '../find-appointment.service';
import { PscService } from '../psc.service';
import { GenderFieldsService } from '../psc/gender-fields.service';
import { EorderDataService } from './eorder-data.service';
import { EorderService } from './eorder.service';
import { EorderStateNavigationService } from './eorder.state.navigation.service';

describe('EorderStateNavigationService', () => {

  let service: EorderStateNavigationService;
  let router: Router;
  let eorderDataService: EorderDataService;
  let eorderService: EorderService;
  let apiService: ApiService;
  let findAppointmentService: FindAppointmentService;
  let pscService: PscService;
  let genderFieldsService: GenderFieldsService;
  const apiPesponse = [{
    token: '5gmXGOs3BwN2KaWhI1VoOfa_pXUOzyodfxRTSqlfqIforOnAeEQI1O7TvxhNIilgE1K7coR6Tq65aVZNgmL7fQ',
    active: 'T',
    testOrders: 'BASIC HEALTH PROFILE',
    doctorFirstName: 'STAGING',
    doctorLastName: 'PHYSICIAN NY PR VA'
  },
  {
    token: '6gmXGOs3BwN2KaWhI1VoOfa_pXUOzyodfxRTSqlfqIforOnAeEQI1O7TvxhNIilgE1K7coR6Tq65aVZNgmL7fQ',
    active: 'T',
    testOrders: 'BASIC HEALTH PROFILE1',
    doctorFirstName: 'STAGING1',
    doctorLastName: 'PHYSICIAN'
  }];
  class MockRouteComponent { }
  const routes = [
    { path: 'eorder/as-eorder-personal-information', component: MockRouteComponent },
    { path: 'eorder/as-eorder-reason-for-visit', component: MockRouteComponent },
    { path: 'schedule-appointment/as-reason-for-visit', component: MockRouteComponent },
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [
        EorderStateNavigationService,
        EorderDataService,
        { provide: EorderService, useClass: MockEorderService },
        { provide: PscService, useClass: MockPscService },
        { provide: ApiService, useClass: MockApiService },
        { provide: FindAppointmentService, useClass: MockFindAppointmentService },
        { provide: GenderFieldsService, useClass: MockGenderFieldsService },
      ]
    });
    router = TestBed.inject(Router);
    service = TestBed.inject(EorderStateNavigationService);
    eorderDataService = TestBed.inject(EorderDataService);
    eorderService = TestBed.inject(EorderService);
    apiService = TestBed.inject(ApiService);
    findAppointmentService = TestBed.inject(FindAppointmentService);
    pscService = TestBed.inject(PscService);
    genderFieldsService = TestBed.inject(GenderFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('getRoutePathByFlow', () => {
    beforeEach(() => {
      spyOn(service, 'getRoutePathByFlow').and.callThrough();
      spyOn(router, 'navigate').and.callThrough();
      spyOn(service, 'setdemographics').and.callThrough();
    });
    it('should call getRoutePathByFlow', () => {
      service.getRoutePathByFlow('');
      expect(service.getRoutePathByFlow).toHaveBeenCalled();
    });
    it('If user is in whoIsVisiting', () => {
      service.getRoutePathByFlow(editSummaryDetails.whoIsVisiting);
      expect(router.navigate).toHaveBeenCalledWith(['/eorder/as-eorder-personal-information']);
    });
    it('If user is in reasonForVisit', () => {
      service.getRoutePathByFlow(editSummaryDetails.reasonForVisit);
      service.setdemographics(['/eorder/as-eorder-reason-for-visit']);
      expect(service.setdemographics).toHaveBeenCalled();
      expect(service.setdemographics).toHaveBeenCalledWith(['/eorder/as-eorder-reason-for-visit']);
    });
    it('If maxAuthAttempts failed, switch to regular appointment flow', () => {
      service.getRoutePathByFlow(editSummaryDetails.maxAttemptsFailed);
      expect(router.navigate).toHaveBeenCalledWith(['/schedule-appointment/as-reason-for-visit']);
    });
  });

  describe('#set Demographics', () => {
    beforeEach(() => {
      spyOn(eorderService, 'getBasicEncounterInfo').and.returnValue(of(mockEorderDemographicsInfo));
      service.setdemographics(['/eorder/as-eorder-reason-for-visit']);
    });
    it('get Demographics', () => {
      expect(eorderService.getBasicEncounterInfo).toHaveBeenCalledWith('demographics');
    });
  });

  describe('#getOpenEorders', () => {
    beforeEach(() => {
      spyOn(apiService, 'post').and.returnValue(of(apiPesponse));
    });
    it('should call the `/api/getOpenEorders` api', () => {
      service.getOpenEorders().subscribe();
      expect(apiService.post).toHaveBeenCalledWith(`/api/getOpenEorders`);
    });
  });

  describe('#createEorderUserSession', () => {

    beforeEach(() => {
      spyOn(apiService, 'post').and.returnValue(of({ stateNavigation: null }));
    });
    it('should call the `/api/createPatienteOrder` api', () => {
      service.createEorderUserSession('5gmXGOs3BwN2KaWhI1VoOfa_pXUOzyodfxRTSqlfqIforOnAeEQI1O7TvxhNIilgE1K7coR6Tq65aVZNgmL7fQ').subscribe();
      expect(apiService.post).toHaveBeenCalledWith(`/api/createPatienteOrder`,
        { token: '5gmXGOs3BwN2KaWhI1VoOfa_pXUOzyodfxRTSqlfqIforOnAeEQI1O7TvxhNIilgE1K7coR6Tq65aVZNgmL7fQ' });
    });
  });
});
