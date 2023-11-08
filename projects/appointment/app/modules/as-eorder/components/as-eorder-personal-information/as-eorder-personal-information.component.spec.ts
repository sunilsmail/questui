// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
// import { fakeAsync, tick, waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { By } from '@angular/platform-browser';
// import { Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { of } from 'rxjs';
// import { CustomPipesModule } from 'shared/custom-pipes.module';
// import { GoogleAutocompletePrediction } from 'shared/models';
// import { AppointmentService } from 'shared/services/appointment.service';
// import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
// import { EorderService } from 'shared/services/eorder/eorder.service';
// import { GoogleMapsService } from 'shared/services/google-maps.service';
// import { PropertiesService } from 'shared/services/properties.service';
// import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
// import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
// import { createAppointmentResponse, mockAppointment } from 'shared/specs/mocks/mock-appointment.service';
// import { mockEorderDemographicsInfo } from 'shared/specs/mocks/mock-eorder.service';
// import { MockGenderFieldsService } from 'shared/specs/mocks/mock-gender-fields-service';
// import { mockAutocompletePrediction, MockGoogleMapsService } from 'shared/specs/mocks/mock-google-maps.service';
// import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
// import { AsEorderPersonalInformationComponent } from './as-eorder-personal-information.component';

// const debounceTime = 200;
// const mockPredictions = new Array(5).fill(new GoogleAutocompletePrediction());

// class MockRouteComponent { }
// const routes = [
//   { path: 'eorder/as-eorder-appt-scheduler', component: MockRouteComponent },
//   { path: 'eorder/as-eorder-price-estimate', component: MockRouteComponent }
// ];

// describe('AsEorderPersonalInformationComponent', () => {
//   let component: AsEorderPersonalInformationComponent;
//   let fixture: ComponentFixture<AsEorderPersonalInformationComponent>;
//   let googleMapsService: GoogleMapsService;
//   let debugElement: DebugElement;
//   let router: Router;
//   let eorderService: EorderService;
//   let eorderDataService: EorderDataService;
//   let appointmentService: AppointmentService;
//   let propertiesService: PropertiesService;
//   let genderFieldsService: GenderFieldsService;

//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [AsEorderPersonalInformationComponent],
//       imports: [ReactiveFormsModule,
//         FormsModule,
//         CustomPipesModule,
//         MatAutocompleteModule,
//         RouterTestingModule.withRoutes(routes),
//         HttpClientTestingModule,
//         MockI18nModule,
//         MatDatepickerModule,
//         MatNativeDateModule
//       ],
//       providers: [
//         { provide: GoogleMapsService, useClass: MockGoogleMapsService }, EorderDataService, AppointmentService,
//         { provide: PropertiesService, useClass: MockPropertiesService },
//         { provide: GenderFieldsService, useClass: MockGenderFieldsService },
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AsEorderPersonalInformationComponent);
//     eorderDataService = TestBed.inject(EorderDataService);
//     googleMapsService = TestBed.inject(GoogleMapsService);
//     eorderService = TestBed.inject(EorderService);
//     appointmentService = TestBed.inject(AppointmentService);
//     router = TestBed.inject(Router);
//     propertiesService = TestBed.inject(PropertiesService);
//     genderFieldsService = TestBed.inject(GenderFieldsService);
//     debugElement = fixture.debugElement;
//     component = fixture.componentInstance;
//     spyOn(router, 'navigate').and.stub();
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//   describe('buildform()', () => {
//     it('should build the form', () => {
//       expect(component.personalInfoForm.get('firstName')).toBeTruthy();
//       expect(component.personalInfoForm.get('address')).toBeTruthy();
//     });
//     it('set form to be invalid if emailaddress is invalid', () => {
//       component.personalInfoForm.get('emailAddress').setValue('test@test');
//       expect(component.personalInfoForm.get('emailAddress').invalid).toBeTruthy();
//     });
//     it('set form to be valid if emailaddress is valid', () => {
//       component.personalInfoForm.get('emailAddress').setValue('test@test.com');
//       expect(component.personalInfoForm.get('emailAddress').invalid).toBeFalsy();
//     });
//     it('set form to be valid if phone is valid', () => {
//       component.personalInfoForm.get('phone').setValue('9089089090');
//       expect(component.personalInfoForm.get('phone').invalid).toBeFalsy();
//     });
//     it('set form to be invalid if phone is invalid', () => {
//       component.personalInfoForm.get('phone').setValue('908');
//       expect(component.personalInfoForm.get('phone').invalid).toBeTruthy();
//     });
//   });

//   describe('onInit', () => {
//     beforeEach(() => {
//       spyOn(component, 'buildForm').and.callThrough();
//       spyOn(component, 'addressAutocompleteInit').and.callThrough();
//       spyOn(component, 'stateSearchInit').and.callThrough();
//       spyOn(component, 'zipCodeValidationInit').and.callThrough();
//       spyOn(component, 'getDemographicsInfo').and.callThrough();
//       spyOn(component, 'getblnEditReasonData').and.callThrough();
//       spyOn(eorderDataService, 'getappointmentDataForEdit').and.callThrough();
//       component.ngOnInit();
//     });
//     it('should call buildForm,addressAutocompleteInit,stateSearchInit,zipCodeValidationInit,getEncounterInfoFunction', () => {
//       expect(component.buildForm).toHaveBeenCalled();
//       expect(component.addressAutocompleteInit).toHaveBeenCalled();
//       expect(component.stateSearchInit).toHaveBeenCalled();
//       expect(component.zipCodeValidationInit).toHaveBeenCalled();
//       expect(component.getDemographicsInfo).toHaveBeenCalled();
//       expect(component.getblnEditReasonData).toHaveBeenCalled();
//       expect(eorderDataService.getappointmentDataForEdit).not.toHaveBeenCalled();
//     });
//   });

//   describe('onInit - with  isEditFromEoderSummary', () => {
//     beforeEach(() => {
//       spyOn(component, 'buildForm').and.callThrough();
//       spyOn(component, 'addressAutocompleteInit').and.callThrough();
//       spyOn(component, 'stateSearchInit').and.callThrough();
//       spyOn(component, 'zipCodeValidationInit').and.callThrough();
//       spyOn(component, 'getDemographicsInfo').and.callThrough();
//       spyOn(component, 'getblnEditReasonData').and.callThrough();
//       eorderDataService.isEditFromEorderSummary = true;
//       spyOn(eorderDataService, 'getappointmentDataForEdit').and.returnValue(
//         of({
//           demographics: mockEorderDemographicsInfo
//         } as any)
//       );
//       component.ngOnInit();
//     });
//     // tslint:disable-next-line: max-line-length
//     it('should call buildForm,addressAutocompleteInit,stateSearchInit,
//        zipCodeValidationInit,getEncounterInfoFunction,getappointmentDataForEdit ', () => {
//       expect(component.buildForm).toHaveBeenCalled();
//       expect(component.addressAutocompleteInit).toHaveBeenCalled();
//       expect(component.stateSearchInit).toHaveBeenCalled();
//       expect(component.zipCodeValidationInit).toHaveBeenCalled();
//       expect(component.getDemographicsInfo).toHaveBeenCalled();
//       expect(component.getblnEditReasonData).toHaveBeenCalled();
//       expect(eorderDataService.getappointmentDataForEdit).toHaveBeenCalled();
//     });
//   });

//   describe('getblnEditReasonData', () => {
//     it('should get the destination and isReview', () => {
//       eorderDataService.getblnEditReasonData().subscribe(response => {
//         expect(component.isReview).toEqual(response.blnedit);
//         expect(component.destination).toEqual(response.route);
//       });
//     });
//   });
//   describe('#getDemographicsInfo', () => {
//     it('should get demographics Info', () => {
//       expect(eorderDataService.ispreviousUrlForDemographics).toBeFalsy();
//       eorderService.getBasicEncounterInfo('demographics').subscribe(res => {
//         expect(component.personalInfoForm.patchValue(res.demographics));
//         expect(component.personalInfoForm.get('zipCode1').patchValue(component.personalInfoForm.get('zip').value));
//       }, error => { });
//     });
//   });

//   describe('addressAutocompleteInit()', () => {
//     beforeEach(() => {
//       component.ngOnInit();
//       fixture.detectChanges();
//     });
//     describe('google autocomplete searchControl when loading is true', () => {
//       beforeEach(() => {
//         fixture.detectChanges();
//         spyOn(googleMapsService, 'getGoogleAutocomplete').and.callThrough();
//         component.addressLoading = true;
//         component.personalInfoForm.get('address').patchValue('something');
//       });

//       it('does not call getGoogleAutocomplete', () => {
//         expect(googleMapsService.getGoogleAutocomplete).not.toHaveBeenCalled();
//       });
//     });

//     describe('when loading is false', () => {
//       beforeEach(
//         fakeAsync(() => {

//           component.personalInfoForm.get('city').patchValue('Huntsville');
//           component.personalInfoForm.get('state').patchValue('AL');
//           component.personalInfoForm.get('zip').patchValue('45040');
//           tick(500);
//         })
//       );
//       it(
//         'sets options back to an empty array before the request is made',
//         fakeAsync(() => {
//           fixture.detectChanges();
//           spyOn(googleMapsService, 'getGoogleAutocomplete').and.returnValue(of());
//           component.options = mockPredictions;
//           component.personalInfoForm.get('address').patchValue('something');
//           tick(500);
//           expect(component.options).toEqual([]);
//         })
//       );

//       it(
//         'debounces the input of street address',
//         fakeAsync(() => {
//           fixture.detectChanges();
//           spyOn(googleMapsService, 'getGoogleAutocomplete').and.returnValue(of());
//           const sampleAddress = 'newyork';
//           component.personalInfoForm.get('address').patchValue(sampleAddress);
//           fixture.detectChanges();
//           tick(500);
//           expect(googleMapsService.getGoogleAutocomplete).toHaveBeenCalledTimes(1);
//           expect(googleMapsService.getGoogleAutocomplete).toHaveBeenCalledWith(sampleAddress);
//         })
//       );

//       it(
//         'sets loading to true',
//         fakeAsync(() => {
//           fixture.detectChanges();
//           spyOn(googleMapsService, 'getGoogleAutocomplete').and.returnValue(of());
//           component.options = mockPredictions;
//           component.personalInfoForm.get('address').patchValue('something');
//           tick(500);
//           expect(component.addressLoading).toEqual(true);
//         })
//       );

//       describe('successful autocomplete', () => {
//         beforeEach(
//           fakeAsync(() => {
//             spyOn(googleMapsService, 'getGoogleAutocomplete').and.callThrough();
//             component.personalInfoForm.get('address').patchValue('something');
//             tick(500);
//           })
//         );

//         it('calls getGoogleAutocomplete', () => {
//           expect(googleMapsService.getGoogleAutocomplete).toHaveBeenCalledWith('something');
//         });

//         it('sets the options to the results', () => {
//           expect(component.options).toEqual(mockPredictions);
//         });

//         it('sets loading to false', () => {
//           expect(component.addressLoading).toEqual(false);
//         });
//       });
//     });
//   });

//   describe('stateSearchInit()', () => {
//     beforeEach(() => {
//       component.stateSearchInit();
//       fixture.detectChanges();
//     });
//     it('should get no state if input value doesn\'t match the character of statename', () => {
//       const searchField: DebugElement = fixture.debugElement.query(By.css('#eOrder_as_personal_state_txt'));
//       searchField.nativeElement.value = 'as';
//       searchField.nativeElement.dispatchEvent(new Event('input'));
//       expect(component.stateResult.length).toEqual(0);
//     });

//     it('should empty the state option if no input', () => {
//       const searchField: DebugElement = fixture.debugElement.query(By.css('#eOrder_as_personal_state_txt'));
//       searchField.nativeElement.value = '';
//       searchField.nativeElement.dispatchEvent(new Event('input'));
//       expect(component.stateResult.length).toEqual(52);
//     });
//   });
//   describe('autocomplete zip code', () => {
//     beforeEach(
//       fakeAsync(() => {
//         component.personalInfoForm.get('city').patchValue('Huntsville');
//         component.personalInfoForm.get('state').patchValue('AL');

//         tick(debounceTime);
//       }),
//     );

//     it(
//       'debounces the input',
//       fakeAsync(() => {
//         spyOn(googleMapsService, 'getGoogleCityState').and.returnValue(of());
//         const sampleZip = '45040';
//         component.personalInfoForm.get('zip').patchValue(sampleZip);
//         fixture.detectChanges();
//         tick(debounceTime);
//         expect(googleMapsService.getGoogleCityState).toHaveBeenCalledTimes(1);
//         expect(googleMapsService.getGoogleCityState).toHaveBeenCalledWith(sampleZip);
//       })
//     );

//     it(
//       'does autofill city and state',
//       fakeAsync(() => {
//         component.personalInfoForm.get('zip').patchValue('45040');
//         fixture.detectChanges();
//         tick(debounceTime);
//         expect(component.personalInfoForm.get('city').value).toEqual('Huntsville');
//         expect(component.personalInfoForm.get('state').value).toEqual('AL');
//       })
//     );

//     it(
//       'does not clear city and state if zip code not found',
//       fakeAsync(() => {
//         spyOn(googleMapsService, 'getGoogleCityState').and.returnValue(of());
//         const invalidZipCode = '25816';
//         component.personalInfoForm.get('zip').patchValue(invalidZipCode);
//         tick(debounceTime);
//         expect(component.personalInfoForm.get('city').value).toEqual('Huntsville');
//         expect(component.personalInfoForm.get('state').value).toEqual('AL');
//       })
//     );

//     it(
//       'does not allow zipcodes outside the USA',
//       fakeAsync(() => {
//         const invalidZipCode = '45000';
//         const responseOutsideUSA = { city: 'Toronto', state: 'ON' };
//         const expectedErrors = { outsideUsa: true };
//         spyOn(googleMapsService, 'getGoogleCityState').and.returnValue(of(responseOutsideUSA));

//         component.personalInfoForm.get('zip').patchValue(invalidZipCode);
//         fixture.detectChanges();
//         tick(debounceTime);
//         expect(component.personalInfoForm.get('zip').errors).toEqual(expectedErrors);
//       })
//     );

//     it(
//       'does not allow invalid zipcode',
//       fakeAsync(() => {
//         const invalidZipCode = '00000';
//         const responseInvalidZip = { city: null, state: null };
//         const expectedErrors = { invalidzipCode: true };
//         spyOn(googleMapsService, 'getGoogleCityState').and.returnValue(of(responseInvalidZip));

//         component.personalInfoForm.get('zip').patchValue(invalidZipCode);
//         fixture.detectChanges();
//         tick(debounceTime);
//         expect(component.personalInfoForm.get('zip').errors).toEqual(expectedErrors);
//       })
//     );
//   });

//   describe('onOptionSelect', () => {
//     beforeEach(() => {
//       spyOn(googleMapsService, 'getGoogleCityStateZipCode').and.callThrough(); // returnValue(of());
//       component.options = [mockAutocompletePrediction];
//       component.personalInfoForm.get('address').patchValue('2 peak st, AL, 45040');
//       component.onOptionSelect(mockAutocompletePrediction);
//       fixture.detectChanges();
//     });

//     it('calls getGoogleCityStateZipCode', () => {
//       expect(googleMapsService.getGoogleCityStateZipCode).toHaveBeenCalledWith('some-id');
//     });
//     it('sets address values', () => {
//       expect(component.personalInfoForm.get('address').value).toEqual('2 peak st');
//       expect(component.personalInfoForm.get('state').value).toEqual('AL');
//       expect(component.personalInfoForm.get('zip').value).toEqual('45040');

//     });
//     it('sets state to null if state not in USA', () => {
//       const noStateMockAutocompletePrediction = new GoogleAutocompletePrediction();
//       noStateMockAutocompletePrediction.description = null;
//       component.onOptionSelect(noStateMockAutocompletePrediction);
//       expect(component.personalInfoForm.get('state').value).toBeNull();

//     });
//   });
//   describe(('continueClicked'), () => {
//     const mockUrl = '/eorder/as-eorder-appt-scheduler';
//     it('should navigate to appt-scheduler page if user decide to provide location, date and time', () => {
//       component.continueClicked();
//       expect(router.navigate).toHaveBeenCalledWith(['/eorder/as-eorder-appt-scheduler']);
//     });
//     it('router navigates to as-personal-information page if destination is review-details page', () => {
//       component.continueClicked();
//       expect(router.navigate).toHaveBeenCalledWith([mockUrl]);
//     });
//   });

//   describe(('modifyAppointment() - invoked'), () => {
//     it('modifyAppointmentResponse -> confimationcode present, router navigates to as-eorder-price-estimate', () => {
//       const apptData = {
//         appointmentDetails: mockAppointment,
//         demographics: mockEorderDemographicsInfo
//       };
//       fixture.detectChanges();

//       spyOn(appointmentService, 'modifyAppointment').and.returnValue(of(createAppointmentResponse));
//       component.modifyAppointment(apptData);
//       expect(router.navigate).toHaveBeenCalledWith(['/eorder/as-eorder-price-estimate']);
//     });

//     it('modifyAppointmentResponse -> No confirmation code, router should not navigate to as-eorder-price-estimate', () => {
//       const apptData = {
//         appointmentDetails: mockAppointment,
//         demographics: mockEorderDemographicsInfo
//       };
//       fixture.detectChanges();
//       spyOn(appointmentService, 'modifyAppointment').and.returnValue(of({}));
//       component.modifyAppointment(apptData);
//       expect(router.navigate).not.toHaveBeenCalledWith(['/eorder/as-eorder-price-estimate']);
//     });
//   });

//   describe('onkeypressphone()', () => {
//     it('should add - after three digit is entered', () => {
//       const event = new KeyboardEvent('keypress', { code: 'Digit2' });
//       const phoneElement = fixture.debugElement.query(By.css('input[id="eOrderPI_phone"]')).nativeElement;
//       phoneElement.value = '908';
//       component.onkeypressphone(event, phoneElement);
//       expect(phoneElement.value).toEqual('908-');
//     });
//     it('should not enter - if already entered', () => {
//       const event = new KeyboardEvent('keypress', { code: 'Digit2' });
//       const phoneElement = fixture.debugElement.query(By.css('input[id="eOrderPI_phone"]')).nativeElement;
//       phoneElement.value = '908-';
//       component.onkeypressphone(event, phoneElement);
//       expect(phoneElement.value).toEqual('908-');
//     });

//     it('should add - if 7 characters are entered', () => {
//       const event = new KeyboardEvent('keypress', { code: 'Digit2' });
//       const phoneElement = fixture.debugElement.query(By.css('input[id="eOrderPI_phone"]')).nativeElement;
//       phoneElement.value = '908-332';
//       component.onkeypressphone(event, phoneElement);
//       expect(phoneElement.value).toEqual('908-332-');
//     });

//     it('should add set error if 11 characters are entered', () => {
//       component.ngOnInit();
//       fixture.detectChanges();
//       const event = new KeyboardEvent('keypress', { code: 'Digit2' });
//       const phoneElement = fixture.debugElement.query(By.css('input[id="eOrderPI_phone"]')).nativeElement;
//       phoneElement.value = '856-854-85555';
//       const expectedErrors = { invalidPhoneno: true };

//       component.onkeypressphone(event, phoneElement);
//       expect(component.personalInfoForm.get('phone').errors).toEqual(expectedErrors);
//     });
//   });
// });
