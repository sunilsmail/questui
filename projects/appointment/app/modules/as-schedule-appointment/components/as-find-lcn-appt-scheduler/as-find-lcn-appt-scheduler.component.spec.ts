import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { fakeAsync, tick, waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AnalyticsService } from 'shared/services/analytics.service';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { RouteService } from 'shared/services/route.service';
import { MockAnalyticsService } from 'shared/specs/mocks/mock-analytics.service';
import { mockAppointment, mockReason } from 'shared/specs/mocks/mock-appointment.service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import {
  mockPscDetailsWithSlots, MockPscService
} from 'shared/specs/mocks/mock-psc.service';
import { MockRouteService } from './../../../../../../shared/specs/mocks/mock-router.service';
import { AsFindLcnApptSchedulerComponent } from './as-find-lcn-appt-scheduler.component';

class MockRouteComponent { }

const routes = [
  { path: 'schedule-appointment/as-appt-scheduler', component: MockRouteComponent },
  { path: 'schedule-appointment/as-personal-information', component: MockRouteComponent }
];

describe('AsFindLcnApptSchedulerComponent', () => {
  let component: AsFindLcnApptSchedulerComponent;
  let fixture: ComponentFixture<AsFindLcnApptSchedulerComponent>;
  let service: PscService;
  let spy: jasmine.Spy;
  let dataService: DataService;
  let dateService: DateService;
  const data = mockAppointment;
  let propertiesService: PropertiesService;
  let routeService: RouteService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsFindLcnApptSchedulerComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        MatSnackBarModule,],
      providers: [
        { provide: PscService, useClass: MockPscService },
        { provide: DataService, useClass: MockDataService },
        { provide: dateService, useClass: DateService },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: RouteService, useClass: MockRouteService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(AsFindLcnApptSchedulerComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PscService);
    dataService = TestBed.inject(DataService);
    dateService = TestBed.inject(DateService);
    propertiesService = TestBed.inject(PropertiesService);
    routeService = TestBed.inject(RouteService);
    fixture.detectChanges();
    spy = spyOn(service, 'getPscDetailsWithSlots').and.returnValue(of([mockPscDetailsWithSlots] as any));

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    describe('getReasonData', () => {
      it('should be called', () => {
          spyOn(dataService, 'getReasonData').and.returnValue(of({
            facilityServiceId: 3,
            facilityTestTypeValue: 'Employer Drug and Alcohol',
            testDesc: 'Select this option if your employer ordered a drug and alcohol test for you.',
            precedence: 3,
            serviceRequestor: 'EMPLOYER'
          }) as any);
        });
      it('should set data', () => {
          expect(component.reasonForVisit).not.toBeNull();
        });
      it('should set reqParams', () => {
          expect(component.reqParams).not.toBeNull();
        });
      it('should set existing appointment as null', () => {
          spy = spyOn(dataService, 'getappointmentData').and.returnValue(of(null));
          component.ngOnInit();
          expect(component.selectedIndex).toEqual(-1);
        });
    });
  });
  describe('#onDateChanged', () => {
    beforeEach(() => {
    });
    it('should call getPscsWithAvailability',
      fakeAsync(() => {
        component.selectedTests = null;
        component.reasonForVisit = mockReason;
        component.onDateChanged(new Date().toString());
        component.pscs$.subscribe();
      })
    );
  });

  // describe('#hideInsuranceInformation', () => {
  //   it('hide the hideInsuranceInfo if facilityServiceId is 1 or 25 or 26 or 6', () => {
  //     dataService.getHideInsuranceInfo().subscribe(response => {
  //         expect(component.hideInsuranceInfo).toEqual(response);
  //     });
  //   });
  // });

  describe('#onDateChanged', () => {
    beforeEach(() => {
    });
    it('should call getPscsWithAvailability',
      fakeAsync(() => {
        component.selectedTests = null;
        component.reasonForVisit = mockReason;
        component.onDateChanged(new Date().toString());
        component.pscs$.subscribe();
      })
    );
  });

  describe('#newAppt', () => {
    it('should enable continue', () => {
      component.newAppt(data, 1);
      expect(component.enableContinue).toBeTruthy();
    });
    it('should disable continue', () => {
        component.newAppt(null, 1);
        expect(component.enableContinue).toBeFalsy();
      });
  });

  describe('#enableContinueButton', () => {
    it('should enable continue',
      fakeAsync(() => {
        component.enableContinueButton(true);
        tick();
        expect(component.enableContinue).toBeTruthy();
      })
    );
    it('should disable continue',
      fakeAsync(() => {
        component.enableContinueButton(false);
        tick();
        expect(component.enableContinue).toBeFalsy();
      })
    );
  });
  describe('#go to previous button ', () => {
    it('should set reqParams', () => {
        expect(component.reqParams).not.toBeNull();
      });
    it('should set previousUrl', () => {
        const url = '/find-location/as-location-finder-reason';
        expect(component.previousUrl).toBe(url);
      });
    it('#goToPrevious()', () => {
        component.goToPrevious();
        expect(component.goToPrevious).toBeDefined();
      });
  });
  describe('#navigateToLocations', () => {
    beforeEach(() => {
      spyOn(component, 'navigateToLocations').and.callThrough();
    });
    it('should call navigateToLocations', () => {
      component.navigateToLocations();
      expect(service.fromFindMyLocationFlow).toBeTruthy();
      expect(component.navigateToLocations).toHaveBeenCalled();
    });
  });

  describe('#getSchedulerMaintenancef964', () => {
    it('should call getSchedulerMaintenancef964 method', () => {
      spyOn(propertiesService, 'getSchedulerMaintenancef964').and.callThrough();
      component.ngOnInit();
      expect(propertiesService.getSchedulerMaintenancef964).toHaveBeenCalled();
    });
  });
});
