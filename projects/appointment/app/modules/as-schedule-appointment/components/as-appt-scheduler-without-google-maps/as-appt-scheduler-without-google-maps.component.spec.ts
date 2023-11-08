// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { fakeAsync, tick, waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ActivatedRoute } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { of } from 'rxjs';
// import { UserLocation } from 'shared/models';
// import { AnalyticsService } from 'shared/services/analytics.service';
// import { DataService } from 'shared/services/data.service';
// import { FindAppointmentService } from 'shared/services/find-appointment.service';
// import { GoogleMapsService } from 'shared/services/google-maps.service';
// import { I18nConstantsService } from 'shared/services/i18n-constants.service';
// import { PropertiesService } from 'shared/services/properties.service';
// import { PscService } from 'shared/services/psc.service';
// import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
// import { PscDetailsService } from 'shared/services/psc/psc-details.service';
// import { RouteService } from 'shared/services/route.service';
// import { MockPscDetailsService } from 'shared/specs/mocks';
// import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
// import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
// import { MockAnalyticsService } from 'shared/specs/mocks/mock-analytics.service';
// import { mockAppointment, mockReason, mockReasonWithServiceRequestor, mockTestsList } from 'shared/specs/mocks/mock-appointment.service';
// import { MockDataService } from 'shared/specs/mocks/mock-data.service';
// import { MockFindAppointmentService } from 'shared/specs/mocks/mock-find-appointment';
// import { MockGenderFieldsService } from 'shared/specs/mocks/mock-gender-fields-service';
// import { MockGoogleMapsService } from 'shared/specs/mocks/mock-google-maps.service';
// import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
// import {
//   mockLocation,
//   mockLocationAvailabilityQuery,
//   mockPscLocationAvailability,
//   MockPscService
// } from 'shared/specs/mocks/mock-psc.service';
// import { MockRouteService } from 'shared/specs/mocks/mock-router.service';
// import { AsGetlabsDialogComponent } from '../as-getlabs-dialog/as-getlabs-dialog.component';
// import { AsPeaceOfMindTestDialogComponent } from '../as-peace-of-mind-test-dialog/as-peace-of-mind-test-dialog.component';
// import { AsPurchaseMyOwnTestDialogComponent } from '../as-purchase-my-own-test-dialog/as-purchase-my-own-test-dialog.component';
// import { AsApptSchedulerComponent } from './as-appt-scheduler-without-google-maps.component';
// const mockMatDialogRef = {
//   updateSize: (size: string) => {},
//   close: () => {},
//   afterClosed: () => {}
// };

// describe('AsApptSchedulerComponent', () => {
//   let component: AsApptSchedulerComponent;
//   let fixture: ComponentFixture<AsApptSchedulerComponent>;
//   let service: PscService;
//   let spy: jasmine.Spy;
//   let dataService: DataService;
//   let googleMapsService: GoogleMapsService;
//   let i18nConstants: I18nConstantsService;
//   let propertiesService: PropertiesService;
//   let findAppointmentService: FindAppointmentService;
//   let routeService: RouteService;
//   let genderFieldsService: GenderFieldsService;
//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         AsApptSchedulerComponent,
//         AsPeaceOfMindTestDialogComponent,
//         AsPurchaseMyOwnTestDialogComponent,
//         AsGetlabsDialogComponent
//       ],
//       imports: [HttpClientTestingModule,
//         ReactiveFormsModule,
//         FormsModule,
//         RouterTestingModule,
//         MatSnackBarModule,
//         MockI18nModule,
//         MatDialogModule,
//         BrowserAnimationsModule,
//       ],
//       providers: [
//         I18nConstantsService,
//         { provide: PscService, useClass: MockPscService },
//         { provide: DataService, useClass: MockDataService },
//         { provide: GoogleMapsService, useClass: MockGoogleMapsService },
//         { provide: MAT_DIALOG_DATA, useValue: {} },
//         { provide: MatDialogRef, useValue: mockMatDialogRef },
//         { provide: AnalyticsService, useClass: MockAnalyticsService },
//         { provide: PropertiesService, useClass: MockPropertiesService },
//         { provide: FindAppointmentService, useClass: MockFindAppointmentService },
//         { provide: PscDetailsService, useClass: MockPscDetailsService },
//         { provide: RouteService, useClass: MockRouteService},
//         { provide: ActivatedRoute, useClass: MockActivatedRoute },
//         { provide: GenderFieldsService, useClass: MockGenderFieldsService },

//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     }).overrideModule(BrowserDynamicTestingModule, {
//       set: {
//         entryComponents: [
//           AsPeaceOfMindTestDialogComponent,
//           AsPurchaseMyOwnTestDialogComponent,
//           AsGetlabsDialogComponent
//         ]
//       }
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     propertiesService = TestBed.inject(PropertiesService);
//     fixture = TestBed.createComponent(AsApptSchedulerComponent);
//     component = fixture.componentInstance;
//     service = TestBed.inject(PscService);
//     dataService = TestBed.inject(DataService);
//     googleMapsService = TestBed.inject(GoogleMapsService);
//     i18nConstants = TestBed.inject(I18nConstantsService);
//     findAppointmentService = TestBed.inject(FindAppointmentService);
//     routeService = TestBed.inject(RouteService);
//     genderFieldsService = TestBed.inject(GenderFieldsService);
//     spy = spyOn(service, 'getPscsWithAvailability').and.returnValue(of([mockPscLocationAvailability]));
//     spyOn(service, 'getPscDetails').and.callThrough();
//     fixture.detectChanges();

//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('#onLocationChange', () => {
//     it('sets hasChangedLocation', () => {
//       // tslint:disable-next-line:max-line-length
//       component.existingAppt ?
//         expect(component.hasChangedLocation).toEqual(true) : expect(component.hasChangedLocation).toEqual(false);
//       component.onLocationChange(mockLocation);
//       expect(component.hasChangedLocation).toEqual(true);
//     });
//     it('emits locationChanged', done => {
//       component.locationChanged.subscribe(value => {
//         expect(value).toEqual(true);
//         done();
//       });
//       component.onLocationChange(mockLocation);
//     });
//   });

//   it('should update when userLocation$ emits',
//     fakeAsync(() => {
//       component.selectedTests = null;
//       component.reasonForVisit = mockReason;
//       component.onLocationChange(mockLocation);
//       component.pscs$.subscribe();
//       tick(1000);
//       expect(spy).toHaveBeenCalledWith(mockLocationAvailabilityQuery);
//     })
//   );
//   it(
//     'should call getPscsWithAvailability',
//     fakeAsync(() => {
//       component.selectedTests = null;
//       component.reasonForVisit = mockReason;
//       component.onLocationChange(new UserLocation());
//       component.pscs$.subscribe();
//       tick(1000);
//       expect(spy).toHaveBeenCalled();
//     })
//   );

//   // describe('#hideInsuranceInformation', () => {
//   //     it('hide the insuranceinfo if facilitySetviceId is 1, 6, 25, 26',() => {
//   //         dataService.getHideInsuranceInfo().subscribe(data => {
//   //             expect(component.hideInsuranceInfo).toEqual(data);
//   //         });
//   //     });
//   // });

//   describe('#ngOnInit', () => {
//     beforeEach(() => {
//       spy = spyOn(dataService, 'getReasonData').and.returnValue(of(mockReasonWithServiceRequestor));
//       spyOn(googleMapsService, 'getLatLngByZipcode').and.returnValue(of());
//       component.ngOnInit();
//     });
//     describe('getReasonData', () => {
//       it(
//         'should be called', () => {
//           expect(spy).toHaveBeenCalled();
//         });
//       it(
//         'should set data', () => {
//           expect(component.reasonForVisit).not.toBeNull();
//         });
//       it(
//         'should set reqParams', () => {
//           expect(component.reqParams).not.toBeNull();
//         });
//       it(
//         'should set existing appointment as null', () => {
//           spy = spyOn(dataService, 'getappointmentData').and.returnValue(of(null));
//           component.ngOnInit();
//           expect(component.existingAppt).toBeNull();
//           expect(component.selectedIndex).toBeNull();

//         });
//     });
//   });

//   describe('#getFacilityService', () => {
//     it(
//       'should return facilityServiceId of tests', () => {
//         component.selectedTests = mockTestsList;
//         const result = component.getFacilityService();
//         expect(result.length).toEqual(2);
//       });
//     it(
//       'should return facilityServiceId of reason', () => {
//         component.selectedTests = null;
//         component.reasonForVisit = mockReason;
//         const result = component.getFacilityService();
//         expect(result.length).toEqual(1);
//       });
//   });

//   describe('#onDateChanged', () => {
//     beforeEach(() => {
//     });
//     it(
//       'should call getPscsWithAvailability',
//       fakeAsync(() => {
//         component.selectedTests = null;
//         component.reasonForVisit = mockReason;
//         component.onDateChanged((new Date()).toDateString());
//         component.pscs$.subscribe();
//         tick(1000);
//         expect(spy).toHaveBeenCalled();
//       })
//     );
//   });

//   describe('#newAppt', () => {
//     beforeEach(() => {
//       spy = spyOn(dataService, 'setappointmentData');
//     });
//     // it(
//     //   'should call dataService', () => {
//     //     component.onContinue();
//     //     expect(spy).toHaveBeenCalledWith({ data: mockAppointment, selectedIndex: 1 });
//     //   });
//     it(
//       'should enable continue', () => {
//         component.newAppt(mockAppointment, 1);
//         expect(component.enableContinue).toBeTruthy();
//       });
//     it(
//       'should disable continue', () => {
//         component.newAppt(null, 1);
//         expect(component.enableContinue).toBeFalsy();
//       });
//   });

//   describe('#enableContinueButton', () => {
//     it(
//       'should enable continue',
//       fakeAsync(() => {
//         component.enableContinueButton(true);
//         tick();
//         expect(component.enableContinue).toBeTruthy();
//       })
//     );
//     it(
//       'should disable continue',
//       fakeAsync(() => {
//         component.enableContinueButton(false);
//         tick();
//         expect(component.enableContinue).toBeFalsy();
//       })
//     );
//   });

//   describe('showMore', () => {
//     it('should increase the count when called', () => {
//       component.initOffset = 0;
//       component.showmore();
//       expect(component.initOffset).toBeGreaterThan(0);
//     });
//   });
//   describe('#go to previous button in  personal information module of find location module', () => {
//     it(
//       'should set previousUrl for find location module', () => {
//         component.isFindLocationFlow = true;
//         expect(component.isFindLocationFlow).toEqual(true);
//         component.previousUrl = '/find-location/as-location-finder-reason';
//       });
//     it(
//       'should set previousUrl for appintment scheduler', () => {
//         component.isFindLocationFlow = false;
//         expect(component.isFindLocationFlow).toEqual(false);
//         component.previousUrl = '/schedule-appointment/as-reason-for-visit';
//       });
//     it(
//       '#goToPrevious()', () => {
//         component.goToPrevious();
//         expect(component.goToPrevious).toBeDefined();
//       });
//   });
//   describe('#onContinue', () => {
//     beforeEach(() => {
//       spyOn(component, 'onContinue').and.callThrough();
//     });
//     it('should call onContinue', () => {
//       component.onContinue();
//       expect(component.onContinue).toHaveBeenCalled();
//     });
//   });

//   describe('#setPreviousUrlForEdit', () => {
//     beforeEach(() => {
//       component.previousUrl = '/schedule-appointment/as-reason-for-visit';
//     });
//     it('should call setPreviousUrlForEdit', () => {
//       component.setPreviousUrlForEdit();
//       expect(component.previousUrl).toBe('/find-appointment/as-find-appointment-summary');
//     });
//     it('should call setPreviousUrlForEdit when not editing', () => {
//       component.isEditFromSummaryPage = false;
//       component.setPreviousUrlForEdit();
//       expect(component.previousUrl).toBe('/schedule-appointment/as-reason-for-visit');
//     });
//   });
// });

