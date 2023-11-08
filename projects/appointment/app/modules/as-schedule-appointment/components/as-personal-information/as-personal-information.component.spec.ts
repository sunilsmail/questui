// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
// import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatSelectModule } from '@angular/material/select';
// import { By } from '@angular/platform-browser';
// import { Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { of, ReplaySubject } from 'rxjs';
// import { CustomPipesModule } from 'shared/custom-pipes.module';
// import { GoogleAutocompletePrediction, UserDemographic } from 'shared/models';
// import { ClinicalTrailsService } from 'shared/services/clinical-trails/clinical-trails.service';
// import { DataService } from 'shared/services/data.service';
// import { GoogleMapsService } from 'shared/services/google-maps.service';
// import { I18nConstantsService } from 'shared/services/i18n-constants.service';
// import { PropertiesService } from 'shared/services/properties.service';
// import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
// import { RouteService } from 'shared/services/route.service';
// import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
// import { UserService } from 'shared/services/user.service';
// import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
// import { MockClinicalTrailsService } from 'shared/specs/mocks/mock-clinical-trails-service';
// import { mockVerifyIdentityData } from 'shared/specs/mocks/mock-data.service';
// import { MockGenderFieldsService } from 'shared/specs/mocks/mock-gender-fields-service';
// import { MockGoogleMapsService } from 'shared/specs/mocks/mock-google-maps.service';
// import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
// import { MockRouteService } from 'shared/specs/mocks/mock-router.service';
// import { mockUserDemographic, MockUserService } from 'shared/specs/mocks/mock-user.service';
// import { AsPersonalInformationComponent } from './as-personal-information.component';

// const debounceTime = 200;
// const mockPredictions = new Array(5).fill(new GoogleAutocompletePrediction());

// describe('AsPersonalInformationComponent', () => {
//   let component: AsPersonalInformationComponent;
//   let fixture: ComponentFixture<AsPersonalInformationComponent>;
//   let i18nConstants: I18nConstantsService;
//   let userService: UserService;
//   let googleMapsService: GoogleMapsService;
//   let router: Router;
//   let propertiesService: PropertiesService;
//   let debugElement: DebugElement;
//   let dataService: DataService;
//   let userDemographics$: ReplaySubject<UserDemographic>;
//   let skipInsuranceService: SkipInsuranceService;
//   let routeService: RouteService;
//   let genderFieldsService: GenderFieldsService;
//   let clinicalTrailsService: ClinicalTrailsService;

//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [AsPersonalInformationComponent],
//       imports: [ReactiveFormsModule,
//         FormsModule,
//         CustomPipesModule,
//         MatAutocompleteModule,
//         RouterTestingModule,
//         HttpClientTestingModule,
//         MockI18nModule,
//         MatDatepickerModule,
//         MatNativeDateModule,
//         MatSelectModule

//       ],
//       providers: [
//         I18nConstantsService,
//         { provide: userService, useClass: MockUserService },
//         { provide: GoogleMapsService, useClass: MockGoogleMapsService },
//         { provide: PropertiesService, useClass: MockPropertiesService },
//         { provide: SkipInsuranceService, useClass: SkipInsuranceService },
//         { provide: RouteService, useClass: MockRouteService },
//         { provide: ClinicalTrailsService, useClass: MockClinicalTrailsService },
//         { provide: GenderFieldsService, useClass: MockGenderFieldsService },
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     userService = TestBed.inject(UserService);
//     userDemographics$ = new ReplaySubject<UserDemographic>(1);
//     userService.userDemographics$ = userDemographics$;
//     router = TestBed.inject(Router);
//     googleMapsService = TestBed.inject(GoogleMapsService);
//     propertiesService = TestBed.inject(PropertiesService);
//     dataService = TestBed.inject(DataService);
//     skipInsuranceService = TestBed.inject(SkipInsuranceService);
//     fixture = TestBed.createComponent(AsPersonalInformationComponent);
//     component = fixture.componentInstance;
//     debugElement = fixture.debugElement;
//     i18nConstants = TestBed.inject(I18nConstantsService);
//     routeService = TestBed.inject(RouteService);
//     genderFieldsService = TestBed.inject(GenderFieldsService);
//     clinicalTrailsService = TestBed.inject(ClinicalTrailsService);
//     spyOn(router, 'navigate').and.stub();
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('buildform()', () => {
//     it('should build the form', () => {
//       expect(component.personalInfoForm.get('firstName')).toBeTruthy();
//     });
//     it('set form to be invalid if emailaddress is invalid', () => {
//       component.personalInfoForm.get('email').setValue('test@test');
//       expect(component.personalInfoForm.get('email').invalid).toBeTruthy();
//     });
//     it('set form to be valid if emailaddress is valid', () => {
//       component.personalInfoForm.get('email').setValue('test@test.com');
//       expect(component.personalInfoForm.get('email').invalid).toBeFalsy();
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
//       spyOn(component, 'isMobileCheckInit').and.callThrough();
//       component.ngOnInit();
//     });
//     it('should call buildForm,isMobileCheckInit', () => {
//       expect(component.buildForm).toHaveBeenCalled();
//       expect(component.isMobileCheckInit).toHaveBeenCalled();
//     });
//   });

//   describe('onInit -> personalInfoForm', () => {
//     beforeEach(() => {
//       spyOn(component, 'buildForm').and.callThrough();
//       spyOn(component, 'isMobileCheckInit').and.callThrough();
//       spyOn(component, 'skipInsuranceInfo').and.callThrough();
//     });
//     // tslint:disable-next-line: max-line-length
//     it('should call buildForm,isMobileCheckInit,getpersonalInfo,getVerifyIdentityData', () => {
//       spyOn(dataService, 'getPersonalData').and.callThrough();
//       spyOn(dataService, 'getVerifyIdentityData').and.callThrough();
//       component.ngOnInit();

//       expect(component.buildForm).toHaveBeenCalled();
//       expect(component.isMobileCheckInit).toHaveBeenCalled();
//       expect(dataService.getPersonalData).toHaveBeenCalled();
//       expect(dataService.getVerifyIdentityData).toHaveBeenCalled();
//       expect(component.skipInsuranceInfo).toHaveBeenCalled();
//     });

//     it('should set form with verifyIdentityData, when personalData not available and verifyData is available', () => {
//       spyOn(dataService, 'getVerifyIdentityData').and.returnValue(of(mockVerifyIdentityData));
//       component.ngOnInit();

//       expect(dataService.getVerifyIdentityData).toHaveBeenCalled();
//       expect(component.personalInfoForm.get('lastName').value).toEqual('verifyUser');
//       expect(component.personalInfoForm.get('dateOfBirth').value).toEqual('11/11/1970');
//     });
//   });

//   describe('onInit -> Auth Users - personalInfoForm ', () => {
//     beforeEach(() => {
//       spyOn(component, 'buildForm').and.callThrough();
//       spyOn(component, 'isMobileCheckInit').and.callThrough();
//       spyOn(dataService, 'getVerifyIdentityData').and.callThrough();
//     });

//     it('should set form with info from userDemographics, if personalData/form is not submitted', () => {
//       userDemographics$.next(mockUserDemographic);
//       spyOn(dataService, 'getPersonalData').and.callThrough();
//       component.ngOnInit();

//       expect(component.buildForm).toHaveBeenCalled();
//       expect(component.isMobileCheckInit).toHaveBeenCalled();
//       expect(dataService.getPersonalData).toHaveBeenCalled();
//       expect(dataService.getVerifyIdentityData).toHaveBeenCalled();

//       expect(component.personalInfoForm.get('firstName').value).toEqual('Sunils');
//       expect(component.personalInfoForm.get('lastName').value).toEqual('Amujuri');
//       expect(component.personalInfoForm.get('dateOfBirth').value).toEqual('07/01/1990');
//       expect(component.personalInfoForm.get('isMobile').value).toEqual('Mobile');
//       expect(component.personalInfoForm.get('phone').value).toEqual('201-201-9999');
//     });
//   });

//   describe('get phoneDetails based on UserDemographics Info', () => {
//     it('should return phoneDetails with Primary PhoneNumber and phoneType as Mobile, if User has Primary phoneNumber', () => {
//       const userDetails = new UserDemographic;
//       userDetails.primaryPhone = '5556667777';
//       const result = component.getPhoneNumberByType(userDetails);
//       expect(result.get('phoneNumber')).toBe('5556667777');
//       expect(result.get('phoneType')).toBe('Mobile');
//     });

//     it('should return phoneDetails with Secondary PhoneNumber and phoneType as LandLine, if User only has Secondary phoneNumber', () => {
//       const userDetails = new UserDemographic;
//       userDetails.primaryPhone = null;
//       userDetails.secondaryPhone = '2223334444';
//       const result = component.getPhoneNumberByType(userDetails);
//       expect(result.get('phoneNumber')).toBe('2223334444');
//       expect(result.get('phoneType')).toBe('Landline');
//     });

//     it('should return phoneDetails as Null, if User has neither of Primary/Secondary phoneNumbers', () => {
//       const userDetails = new UserDemographic;
//       userDetails.primaryPhone = null;
//       userDetails.secondaryPhone = null;
//       const result = component.getPhoneNumberByType(userDetails);
//       expect(result).toBeNull();
//     });
//   });

//   describe(('continueClicked'), () => {
//     it('should navigate to insurance page if user decide to provide insurance', () => {
//       spyOn(clinicalTrailsService, 'logClinicalTrailsMetrics').and.returnValue(
//         of(true)
//       );
//       component.personalInfoForm.get('insuranceInfo').setValue('insurance-provide');
//       component.continueClicked();
//       expect(router.navigate).toHaveBeenCalledWith(['/schedule-appointment/as-insurance-information']);
//     });
//   });
//   describe('isMobileCheckInit()', () => {
//     beforeEach(() => {
//       component.isMobileCheckInit();
//       fixture.detectChanges();
//     });
//     it('should disable mobile text preference when its not a cell/mobile', () => {
//       component.personalInfoForm.get('isMobile').patchValue('Landline');
//       fixture.detectChanges();
//       expect(component.personalInfoForm.get('preferences').get('preference_mobile').value).toEqual(false);
//       expect(component.personalInfoForm.get('preferences').get('preference_mobile').status).toEqual('DISABLED');
//       expect(component.disableMobilePreference).toBeTruthy();
//     });

//     it('should enable mobile text preference when its a cell/mobile', () => {
//       component.personalInfoForm.get('isMobile').patchValue('Mobile');
//       fixture.detectChanges();
//       expect(component.personalInfoForm.get('preferences').get('preference_mobile').value).toEqual(false);
//       expect(component.personalInfoForm.get('preferences').get('preference_mobile').status).toEqual('VALID');
//       expect(component.disableMobilePreference).toBeFalsy();
//     });
//   });

//   describe('onkeypressdate', () => {
//     beforeEach(() => {
//       spyOn(component, 'onkeypressdate');
//       fixture.detectChanges();
//     });

//     it('should get called', () => {
//       const eventItem = new KeyboardEvent('keypress', { code: 'Digit2' });
//       const dateElement = fixture.debugElement.query(By.css('input[id="phone"]')).nativeElement;
//       dateElement.value = '11221986';
//       component.onkeypressdate(eventItem, dateElement);
//       expect(component.onkeypressdate).toHaveBeenCalled();
//     });

//   });

//   describe('onkeypressdate()', () => {
//     it('should enter / after two digit is entered', () => {
//       const event = new KeyboardEvent('keypress', { code: 'Digit2' });
//       const dateElement = fixture.debugElement.query(By.css('input[id="phone"]')).nativeElement;
//       dateElement.value = '09';
//       component.onkeypressdate(event, dateElement);
//       expect(dateElement.value).toEqual('09/');
//     });
//     it('should not enter / if already entered', () => {
//       const event = new KeyboardEvent('keypress', { code: 'Digit2' });
//       const dateElement = fixture.debugElement.query(By.css('input[id="phone"]')).nativeElement;
//       dateElement.value = '09/';
//       component.onkeypressdate(event, dateElement);
//       expect(dateElement.value).toEqual('09/');
//     });

//     it('should remove one / if entered twice', () => {
//       const event = new KeyboardEvent('keypress', { code: 'Digit2' });
//       const dateElement = fixture.debugElement.query(By.css('input[id="phone"]')).nativeElement;
//       dateElement.value = '09//';
//       component.onkeypressdate(event, dateElement);
//       expect(dateElement.value).toEqual('09/');
//     });
//     it('should add / if 5 characters are entered', () => {
//       const event = new KeyboardEvent('keypress', { code: 'Digit2' });
//       const dateElement = fixture.debugElement.query(By.css('input[id="phone"]')).nativeElement;
//       dateElement.value = '09/09';
//       component.onkeypressdate(event, dateElement);
//       expect(dateElement.value).toEqual('09/09/');
//     });

//   });

//   describe('onkeypressphone()', () => {
//     it('should add - after three digit is entered', () => {
//       const event = new KeyboardEvent('keypress', { code: 'Digit2' });
//       const phoneElement = fixture.debugElement.query(By.css('input[id="phone"]')).nativeElement;
//       phoneElement.value = '908';
//       component.onkeypressphone(event, phoneElement);
//       expect(phoneElement.value).toEqual('908-');
//     });
//     it('should not enter - if already entered', () => {
//       const event = new KeyboardEvent('keypress', { code: 'Digit2' });
//       const phoneElement = fixture.debugElement.query(By.css('input[id="phone"]')).nativeElement;
//       phoneElement.value = '908-';
//       component.onkeypressphone(event, phoneElement);
//       expect(phoneElement.value).toEqual('908-');
//     });

//     it('should add - if 7 characters are entered', () => {
//       const event = new KeyboardEvent('keypress', { code: 'Digit2' });
//       const phoneElement = fixture.debugElement.query(By.css('input[id="phone"]')).nativeElement;
//       phoneElement.value = '908-332';
//       component.onkeypressphone(event, phoneElement);
//       expect(phoneElement.value).toEqual('908-332-');
//     });

//     it('should add set error if 11 characters are entered', () => {
//       component.ngOnInit();
//       fixture.detectChanges();
//       const event = new KeyboardEvent('keypress', { code: 'Digit2' });
//       const phoneElement = fixture.debugElement.query(By.css('input[id="phone"]')).nativeElement;
//       phoneElement.value = '856-854-85555';
//       const expectedErrors = { invalidPhoneno: true };

//       component.onkeypressphone(event, phoneElement);
//       expect(component.personalInfoForm.get('phone').errors).toEqual(expectedErrors);
//     });

//   });


//   describe('#go to previous button in  personal information module of find location module', () => {
//     it('should set previousUrl for find location module', () => {
//       component.isFindLocationFlow = true;
//       expect(component.isFindLocationFlow).toEqual(true);
//       component.previousUrl = '/schedule-appointment/as-find-lcn-appt-scheduler';
//     });
//     it(
//       'should set previousUrl for appintment scheduler', () => {
//         component.isFindLocationFlow = false;
//         expect(component.isFindLocationFlow).toEqual(false);
//         component.previousUrl = '/schedule-appointment/as-appt-scheduler';
//       });
//     it(
//       '#goToPrevious()', () => {
//         component.goToPrevious();
//         expect(component.goToPrevious).toBeDefined();
//       });
//   });

//   describe('#getSchedulerMaintenancef1385', () => {
//     it('should call getSchedulerMaintenancef1385 method', () => {
//       spyOn(propertiesService, 'getSchedulerMaintenancef1385').and.callThrough();
//       component.ngOnInit();
//       expect(propertiesService.getSchedulerMaintenancef1385).toHaveBeenCalled();
//     });
//   });

//   describe('#setPreviousUrlForEdit', () => {
//     beforeEach(() => {
//       component.previousUrl = '/schedule-appointment/as-appt-scheduler';
//     });
//     it('should call setPreviousUrlForEdit', () => {
//       component.fromAuthUserEdit = true;
//       component.setPreviousUrlForEdit();
//       expect(component.previousUrl).toBe('/find-appointment/as-find-appointment-summary');
//     });
//     it('should call setPreviousUrlForEdit when not editing', () => {
//       component.fromAuthUserEdit = false;
//       component.setPreviousUrlForEdit();
//       expect(component.previousUrl).toBe('/schedule-appointment/as-appt-scheduler');
//     });
//   });

//   describe('#checking getters', () => {
//     beforeEach(() => {
//       component.genderRaceOptions = [
//         {
//           'field_name': 'gender_preference',
//           'options': [
//             {
//               'key': 'M',
//               'value': 'Male'
//             },
//             {
//               'key': 'F',
//               'value': 'Female'
//             },
//             {
//               'key': 'MTF',
//               'value': 'Transgenger male-to-female'
//             },
//             {
//               'key': 'FTM',
//               'value': 'Transgender female-to-male'
//             },
//             {
//               'key': 'TNOS',
//               'value': 'Transgender, not specified'
//             },
//             {
//               'key': 'X',
//               'value': 'Gender nonconforming'
//             },
//             {
//               'key': 'D',
//               'value': 'Decline to answer'
//             },
//             {
//               'key': 'NG',
//               'value': 'Not given'
//             }
//           ],
//           'enabled': true,
//           'state': [

//           ]
//         },
//         {
//           'field_name': 'race',
//           'options': [
//             {
//               'key': 'I',
//               'value': 'American Indian or Alaska Native'
//             },
//             {
//               'key': 'A',
//               'value': 'Asian'
//             },
//             {
//               'key': 'B',
//               'value': 'Black or African American'
//             },
//             {
//               'key': 'P',
//               'value': 'Native Hawaiian or Other Pacific Islander'
//             },
//             {
//               'key': 'O',
//               'value': 'Other Race'
//             },
//             {
//               'key': 'W',
//               'value': 'White'
//             },
//             {
//               'key': 'NG',
//               'value': 'Not given'
//             },
//             {
//               'key': 'M',
//               'value': 'Multiracial(new)'
//             },
//             {
//               'key': 'D',
//               'value': 'Decline to answer'
//             }
//           ],
//           'enabled': true,
//           'state': [
//             'NJ'
//           ]
//         },
//         {
//           'field_name': 'ethnicity',
//           'options': [
//             {
//               'key': 'H',
//               'value': 'Hispanic or Latino'
//             },
//             {
//               'key': 'N',
//               'value': 'Not Hispanic or Latino'
//             },
//             {
//               'key': 'NG',
//               'value': 'Not given'
//             },
//             {
//               'key': 'D',
//               'value': 'Decline to answer'
//             }
//           ],
//           'enabled': true,
//           'state': [
//             'NJ'
//           ]
//         },
//         {
//           'field_name': 'Sexual_orientation',
//           'options': [
//             {
//               'key': 'BI',
//               'value': 'Bisexual'
//             },
//             {
//               'key': 'HET',
//               'value': 'Straight'
//             },
//             {
//               'key': 'HOM',
//               'value': 'Gay or lesbian'
//             },
//             {
//               'key': 'SE',
//               'value': 'Something else'
//             },
//             {
//               'key': 'D',
//               'value': 'Decline to answer'
//             },
//             {
//               'key': 'NG',
//               'value': 'Not given'
//             }
//           ],
//           'enabled': true,
//           'state': [

//           ]
//         }
//       ];
//     });
//     it('getRace', () => {
//       expect(component.getRace.length).toBeGreaterThan(0);
//     });
//     it('getRace disable', () => {
//       component.genderRaceOptions = null;
//       expect(component.getRace).toBe(null);
//     });
//     it('getEthnicity', () => {
//       expect(component.getEthnicity.length).toBeGreaterThan(0);
//     });
//     it('getEthnicity disable', () => {
//       component.genderRaceOptions = null;
//       expect(component.getEthnicity).toBe(null);
//     });
//     it('getGenderPreference', () => {
//       expect(component.getGenderPreference.length).toBeGreaterThan(0);
//     });
//     it('getGenderPreference disable', () => {
//       component.genderRaceOptions = null;
//       expect(component.getGenderPreference).toBe(null);
//     });
//     it('getSexualOrientation', () => {
//       expect(component.getSexualOrientation.length).toBeGreaterThan(0);
//     });
//     it('getSexualOrientation disable', () => {
//       component.genderRaceOptions = null;
//       expect(component.getSexualOrientation).toBe(null);
//     });
//   });

// });
