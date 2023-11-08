import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReasonCategory } from 'shared/models/reason-category';
import { DataService } from 'shared/services/data.service';
import { DeeplinkService } from 'shared/services/deeplink.service';
import { PscService } from 'shared/services/psc.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { MockPscDetailsService } from 'shared/specs/mocks';
import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockDeeplinkService } from 'shared/specs/mocks/mock-deeplink.service';
import { MockPscService } from 'shared/specs/mocks/mock-psc.service';
import { AsFindLocationComponent } from './as-find-location.component';


class MockRouteComponent { }
const routes = [
  { path: 'find-location/as-location-finder-details', component: MockRouteComponent },
  { path: 'find-location/as-location-finder', component: MockRouteComponent }
];

describe('AsFindLocationComponent', () => {
  let component: AsFindLocationComponent;
  let fixture: ComponentFixture<AsFindLocationComponent>;
  let pscService: PscService;
  let pscDetailsService: PscDetailsService;
  let dataService: DataService;
  let route: any;
  let router: Router;
  let deeplinkService: DeeplinkService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsFindLocationComponent],
      imports: [RouterTestingModule.withRoutes(routes), FormsModule, HttpClientTestingModule],
      providers: [
        { provide: PscService, useClass: MockPscService },
        { provide: DataService, useClass: MockDataService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: PscDetailsService, useClass: MockPscDetailsService },
        { provide: DeeplinkService, useClass: MockDeeplinkService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AsFindLocationComponent);
    pscService = TestBed.inject(PscService);
    dataService = TestBed.inject(DataService);
    pscDetailsService = TestBed.inject(PscDetailsService);
    route = TestBed.inject(ActivatedRoute);
    deeplinkService = TestBed.inject(DeeplinkService);
    spyOn(router, 'navigate').and.stub();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('#disableFindLoationBackArrow', () => {
    beforeEach(waitForAsync(() => {
      spyOn(component, 'disableFindLoationBackArrow').and.callThrough();
      spyOn(component, 'ngOnInit').and.callThrough();
      component.ngOnInit();
    }));
    it(' it should call disableFindLoationBackArrow', () => {
      route.setQueryParamMap('reasonForVisit', 'PHLEBOTOMY');
      expect(component.disableFindLoationBackArrow).toHaveBeenCalled();
    });
  });
  describe('#disableFindLoationDetailBackArrow', () => {
    beforeEach(waitForAsync(() => {
      spyOn(component, 'disableFindLoationDetailBackArrow').and.callThrough();
      spyOn(component, 'ngOnInit').and.callThrough();
      component.ngOnInit();
    }));
    it(' it should call disableFindLoationDetailBackArrow', () => {
      route.setQueryParamMap('reasonForVisit', 'PHLEBOTOMY');
      expect(component.disableFindLoationDetailBackArrow).toHaveBeenCalled();
    });
  });
  describe('#navigateToNext', () => {
    it('should navigate to location finder details', () => {
      const params = {
        reasonForVisit: 'PHLEBOTOMY'
      };
      component.navigateToNext(true, params);
      expect(router.navigate).toHaveBeenCalledWith(['/find-location/as-location-finder-details'],
        {
          queryParams: { reasonForVisit: 'PHLEBOTOMY' }
        });
    });
    it('should navigate to location finder', () => {
      const params = {
        reasonForVisit: 'PHLEBOTOMY'
      };
      component.navigateToNext(false, params);
      expect(router.navigate).toHaveBeenCalledWith(['/find-location/as-location-finder'],
        {
          queryParams: { reasonForVisit: 'PHLEBOTOMY' }
        });
    });
  });

  describe('#navigateToNextFromKitcollection', () => {
    it('should navigate to location finder details', () => {
      const params: ReasonCategory = {
        'facilityServiceId': 6,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Purchased a Test From Quest',
        'testDesc': 'Select this option if you have purchased a test from Quest.',
        'precedence': 6,
        'serviceRequestor': 'PURCHASETEST',
        'activeInd': true,
        'skipInsurance': true,
        'visitCategory': null,
        'deeplinkReason': 'PQD'
      };
      component.navigateToNextFromKitcollection(true, params);
      expect(router.navigate).toHaveBeenCalledWith(['/find-location/as-location-finder-details'],
        {
          queryParams: { reason: 'PQD' }
        });
    });
    it('should navigate to location finder', () => {
      const params: ReasonCategory = {
        'facilityServiceId': 6,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Purchased a Test From Quest',
        'testDesc': 'Select this option if you have purchased a test from Quest.',
        'precedence': 6,
        'serviceRequestor': 'PURCHASETEST',
        'activeInd': true,
        'skipInsurance': true,
        'visitCategory': null,
        'deeplinkReason': 'PQD'
      };
      component.navigateToNextFromKitcollection(false, params);
      expect(router.navigate).toHaveBeenCalledWith(['/find-location/as-location-finder'],
        {
          queryParams: { reason: 'PQD' }
        });
    });
  });
});
