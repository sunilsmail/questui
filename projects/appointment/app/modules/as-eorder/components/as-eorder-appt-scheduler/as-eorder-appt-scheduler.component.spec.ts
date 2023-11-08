// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatSnackBarModule } from '@angular/material';
// import { RouterTestingModule } from '@angular/router/testing';
// import { of } from 'rxjs';
// import { mockAppointment, mockReason, mockReasonWithServiceRequestor, mockTestsList } from 'shared/specs/mocks/mock-appointment.service';

// import { UserLocation } from 'shared/models';
// import { DataService } from 'shared/services/data.service';
// import { EorderService } from 'shared/services/eorder/eorder.service';
// import { GoogleMapsService } from 'shared/services/google-maps.service';
// import { I18nConstantsService } from 'shared/services/i18n-constants.service';
// import { PscService } from 'shared/services/psc.service';
// import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
// import { MockDataService } from 'shared/specs/mocks/mock-data.service';
// import { MockGoogleMapsService } from 'shared/specs/mocks/mock-google-maps.service';
// import {
//     mockLocation,
//     mockLocationAvailabilityQuery,
//     mockPscLocationAvailability,
//     MockPscService,
// } from 'shared/specs/mocks/mock-psc.service';
// import { AsEorderApptSchedulerComponent } from './as-eorder-appt-scheduler.component';

// describe('AsEorderApptSchedulerComponent', () => {
//     let component: AsEorderApptSchedulerComponent;
//     let fixture: ComponentFixture<AsEorderApptSchedulerComponent>;
//     let service: PscService;
//     let eorderService: EorderService;
//     let spy: jasmine.Spy;
//     let dataService: DataService;
//     let googleMapsService: GoogleMapsService;
//     let i18nConstants: I18nConstantsService;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [AsEorderApptSchedulerComponent],
//             imports: [HttpClientTestingModule,
//                 ReactiveFormsModule,
//                 FormsModule,
//                 RouterTestingModule,
//                 MatSnackBarModule,
//                 MockI18nModule,
//             ],
//             providers: [
//                 I18nConstantsService,
//                 { provide: PscService, useClass: MockPscService },
//                 { provide: DataService, useClass: MockDataService },
//                 { provide: GoogleMapsService, useClass: MockGoogleMapsService },
//                 { provide: EorderService, useClass: EorderService}

//             ],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(AsEorderApptSchedulerComponent);
//         component = fixture.componentInstance;
//         service = TestBed.get(PscService);
//         dataService = TestBed.get(DataService);
//         googleMapsService = TestBed.get(GoogleMapsService);
//         i18nConstants = TestBed.get(I18nConstantsService);
//         eorderService = TestBed.get(EorderService);
//         spy = spyOn(service, 'getPscsWithAvailability').and.returnValue(of([mockPscLocationAvailability]));
//         fixture.detectChanges();

//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     describe('#onLocationChange', () => {
//         it('sets hasChangedLocation', () => {
//             // tslint:disable-next-line:max-line-length
//             component.existingAppt ? expect(component.hasChangedLocation).toEqual(true)
//               : expect(component.hasChangedLocation).toEqual(false);
//             component.onLocationChange(mockLocation);
//             expect(component.hasChangedLocation).toEqual(true);
//         });
//         it('emits locationChanged', done => {
//             component.locationChanged.subscribe(value => {
//                 expect(value).toEqual(true);
//                 done();
//             });
//             component.onLocationChange(mockLocation);
//         });
//     });

//     it(
//         'should update when userLocation$ emits',
//         fakeAsync(() => {
//             component.selectedTests = null;
//             component.reasonForVisit = mockReason;
//             component.onLocationChange(mockLocation);
//             component.pscs$.subscribe();
//             tick();
//            // expect(spy).toHaveBeenCalledWith(mockLocationAvailabilityQuery);
//         })
//     );
//     it(
//         'should call getPscsWithAvailability',
//         fakeAsync(() => {
//             component.selectedTests = null;
//             component.reasonForVisit = mockReason;
//             component.onLocationChange(new UserLocation());
//             component.pscs$.subscribe();
//             tick();
//             expect(spy).toHaveBeenCalled();
//         })
//     );

//     describe('#ngOnInit', () => {
//         beforeEach(() => {
//            // spy = spyOn(dataService, 'getReasonData').and.returnValue(of(mockReasonWithServiceRequestor));
//             spyOn(googleMapsService, 'getLatLngByZipcode').and.returnValue(of());
//            // spyOn(component, 'getAppointmentDataForEdit').and.callThrough();
//             component.ngOnInit();
//         });
//     });

//     describe('#onDateChanged', () => {
//         beforeEach(() => {
//         });
//         it(
//             'should call getPscsWithAvailability',
//             fakeAsync(() => {
//                 component.selectedTests = null;
//                 component.reasonForVisit = mockReason;
//                 component.onDateChanged((new Date()).toDateString());
//                 component.pscs$.subscribe();
//                 tick();
//                // expect(spy).toHaveBeenCalled();
//             })
//         );
//     });

//     describe('#newAppt', () => {
//         beforeEach(() => {
//             spy = spyOn(dataService, 'setappointmentData');
//         });
//         // it(
//         //   'should call dataService', () => {
//         //     component.onContinue();
//         //     expect(spy).toHaveBeenCalledWith({ data: mockAppointment, selectedIndex: 1 });
//         //   });
//         it(
//             'should enable continue', () => {
//                 component.newAppt(mockAppointment, 1);
//                 expect(component.enableContinue).toBeTruthy();
//             });
//         it(
//             'should disable continue', () => {
//                 component.newAppt(null, 1);
//                 expect(component.enableContinue).toBeFalsy();
//             });
//     });

//     describe('#enableContinueButton', () => {
//         it(
//             'should enable continue',
//             fakeAsync(() => {
//                 component.enableContinueButton(true);
//                 tick();
//                 expect(component.enableContinue).toBeTruthy();
//             })
//         );
//         it(
//             'should disable continue',
//             fakeAsync(() => {
//                 component.enableContinueButton(false);
//                 tick();
//                 expect(component.enableContinue).toBeFalsy();
//             })
//         );
//     });

//     describe('showMore', () => {
//         it('should increase the count when called', () => {
//             component.showLocations = 5;
//             component.showmore();
//             expect(component.showLocations).toEqual(10);
//         });
//     });
//     describe('#go to previous button in  personal information module of find location module', () => {
//         it(
//           'should set previousUrl for find location module', () => {
//             component.isFindLocationFlow = true;
//             expect(component.isFindLocationFlow).toEqual(true);
//             component.previousUrl = '/find-location/as-location-finder-reason';
//         });
//         it(
//           'should set previousUrl for appintment scheduler', () => {
//             component.isFindLocationFlow = false;
//             expect(component.isFindLocationFlow).toEqual(false);
//             component.previousUrl = '/schedule-appointment/as-reason-for-visit';
//         });
//         it(
//           '#goToPrevious()', () => {
//             component.goToPrevious();
//             expect(component.goToPrevious).toBeDefined();
//         });
//       });
//     //   describe('#getAppointmentDataForEdit',() =>{
//     //       it('get appointment object without cache', () =>{
//     //         eorderService.getEncounterInfoWithoutCahce('appointment').subscribe(encounter =>{
//     //             expect(encounter.appointment).toBeTruthy();
//     //         });
//     //       });
//     //   });
//     describe('#getLabcardFromSiteCode',() =>{
//         it('should return labcard value based on sitecode',() =>{
//             component.getLabcardFromSiteCode(mockPscLocationAvailability.siteCode);
//             expect([mockPscLocationAvailability].length).toBeGreaterThan(0);
//             expect([mockPscLocationAvailability].filter(x => x.siteCode === mockPscLocationAvailability.siteCode)[0].labCard);
//         });
//         it('should return null if no pscs',() =>{
//             expect(component.labCardPscs).toBeFalsy();
//         });
//     });
// });
