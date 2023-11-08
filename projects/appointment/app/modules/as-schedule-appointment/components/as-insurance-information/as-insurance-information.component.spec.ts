import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { fakeAsync, tick, waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { GoogleAutocompletePrediction } from 'shared/models';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { InsuranceAddressService } from 'shared/services/insurance-address.service';
import { InsuranceService } from 'shared/services/insurance.service';
import { PropertiesService } from 'shared/services/properties.service';
import { RouteService } from 'shared/services/route.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { createAppointmentResponse } from 'shared/specs/mocks/mock-appointment.service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { mockAutocompletePrediction, MockGoogleMapsService } from 'shared/specs/mocks/mock-google-maps.service';
import { MockInsuranceAddressService } from 'shared/specs/mocks/mock-insurance-address.service';
import { MockInsuranceService } from 'shared/specs/mocks/mock-insurance.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockRouteService } from 'shared/specs/mocks/mock-router.service';
import { AsInsuranceInformationComponent } from './as-insurance-information.component';

@Component({
  template: '<div></div>'
})
class MockRouteComponent { }

const routes = [
  { path: 'schedule-appointment/as-review-details', component: MockRouteComponent },
  { path: 'schedule-appointment/as-reason-for-visit', component: MockRouteComponent },
  { path: 'schedule-appointment/as-secondary-insurance', component: MockRouteComponent }
];
const debounceTime = 200;
const mockPredictions = new Array(5).fill(new GoogleAutocompletePrediction());

describe('AsInsuranceInformationComponent', () => {
  let component: AsInsuranceInformationComponent;
  let fixture: ComponentFixture<AsInsuranceInformationComponent>;
  let insuranceService: InsuranceService;
  let googleService: GoogleMapsService;
  let dataService: DataService;
  let debugElement: DebugElement;
  let appointmentService: AppointmentService;
  let router: Router;
  let insuranceAddressService: InsuranceAddressService;
  let propertiesService: PropertiesService;
  let secondaryInsuranceService: SecondaryInsuranceService;
  let routeService: RouteService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsInsuranceInformationComponent, MockRouteComponent],
      imports: [RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        MatAutocompleteModule,
        FormsModule,
        ReactiveFormsModule,
        CustomPipesModule,
        MockI18nModule,
        MatDatepickerModule,
        MatNativeDateModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [I18nConstantsService,
        { provide: InsuranceService, useClass: MockInsuranceService },
        { provide: GoogleMapsService, useClass: MockGoogleMapsService },
        { provide: DataService, useClass: MockDataService },
        { provide: insuranceAddressService, useClass: MockInsuranceAddressService },
        { provide: PropertiesService, useClass: MockPropertiesService },
        AppointmentService,
        SecondaryInsuranceService,
        { provide: RouteService, useClass: MockRouteService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    googleService = TestBed.inject(GoogleMapsService);
    insuranceService = TestBed.inject(InsuranceService);
    dataService = TestBed.inject(DataService);
    appointmentService = TestBed.inject(AppointmentService);
    insuranceAddressService = TestBed.inject(InsuranceAddressService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AsInsuranceInformationComponent);
    propertiesService = TestBed.inject(PropertiesService);
    secondaryInsuranceService = TestBed.inject(SecondaryInsuranceService);
    routeService = TestBed.inject(RouteService);
    spyOn(dataService, 'getlabCardLocationSearch').and.returnValue(of({
      provider: {
        insuranceCompanyName: 'LAB CARD',
        insuranceMnemonic: 'LBCRD'
      },
      labCard: 'false'
    }) as any);
    component = fixture.componentInstance;
    spyOn(router, 'navigate').and.stub();
    component.insuranceProviders = [{
      insuranceCompanyName: 'LAB CARD',
      insuranceMnemonic: 'LBCRD'
    }, {
      insuranceCompanyName: 'MEDICARE',
      insuranceMnemonic: '3500'
    }, {
      insuranceCompanyName: 'NJ MEDICARE',
      insuranceMnemonic: '3500'
    }, {
      insuranceCompanyName: 'RAILROAD RETIREES MEDICARE',
      insuranceMnemonic: '3700'
    }, {
      insuranceCompanyName: 'TRAVELERS RAILROAD MEDICARE',
      insuranceMnemonic: '3700'
    }, {
      insuranceCompanyName: 'BC/BS OF NEW JERSEY/HORIZON',
      insuranceMnemonic: '4000'
    }, {
      insuranceCompanyName: 'BLUE CROSS & BLUE SHIELD OF NEW JERSEY',
      insuranceMnemonic: '4000'
    }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('isFormValid', () => {
  //     it('should get called', () => {
  //         spyOn(component, 'isFormValid').and.callFake(() => {
  //             return of(true);
  //         });
  //         expect(component.isFormValid).toBeTruthy();
  //     });
  // });

  describe('checkError', () => {
    it('should set noMatchesError to be true if not blurred', () => {
      component.checkError();
      component.form.get('provider').patchValue('asdf');
      expect(component.noMatchesError).toBeTruthy();
    });

    it('should get called also call showError', () => {
      debugElement = fixture.debugElement;
      spyOn(component, 'checkError');
      spyOn(component, 'showError');
      component.form.get('provider').patchValue('asdf');
      fixture.detectChanges();

      const input = debugElement.query(By.css('#as_insurance_insuranceProvider_txt'));
      const inputElement = input.nativeElement;

      inputElement.dispatchEvent(new Event('blur'));
      expect(component.checkError).toHaveBeenCalled();
      expect(component.showError).toHaveBeenCalled();
    });
  });

  describe('clearError', () => {

    it('should get called also call showError', () => {
      debugElement = fixture.debugElement;
      spyOn(component, 'clearError');
      component.form.get('provider').patchValue('asdf');
      fixture.detectChanges();

      const input = debugElement.query(By.css('#as_insurance_insuranceProvider_txt'));
      const inputElement = input.nativeElement;

      inputElement.dispatchEvent(new Event('focus'));
      // expect(component.noMatchesError).toBeFalsy()
      expect(component.clearError).toHaveBeenCalled();
    });
    it('should clear all error', () => {
      component.form.get('provider').patchValue('asdf');

      fixture.detectChanges();
      component.clearError();
      expect(component.error).toBeFalsy();
      expect(component.noMatchesError).toBeFalsy();
      expect(component.bringCardError).toBeFalsy();
    });
  });

  describe('showError', () => {

    it('should get called also call showError', () => {
      component.showError('none');
      expect(component.error).toBeFalsy();
    });
    it('should get called also call showError', () => {
      component.showError('noMatchError');
      expect(component.noMatchesError).toBeTruthy();
    });
    it('should get called also call showError', () => {
      component.showError('bringCardError');
      expect(component.bringCardError).toBeTruthy();
    });
  });

  describe('buildform()', () => {
    it('should build the form', () => {
      expect(component.form.get('address1')).toBeTruthy();
      expect(component.form.get('address2')).toBeTruthy();
      expect(component.form.get('provider')).toBeTruthy();
      expect(component.form.get('memberId')).toBeTruthy();
      expect(component.form.get('groupId')).toBeTruthy();
      expect(component.form.get('city')).toBeTruthy();
      expect(component.form.get('state')).toBeTruthy();
      expect(component.form.get('zipCode')).toBeTruthy();
    });
    it('set form to be invalid if address1 is invalid', () => {
      component.form.get('address1').setValue('ny');
      expect(component.form.get('address1').invalid).toBeTruthy();
    });
    it('set form to be valid if address1 is valid', () => {
      component.form.get('address1').setValue('nyc');
      expect(component.form.get('address1').invalid).toBeFalsy();
    });
    it('set form to be valid if zipcode is valid', () => {
      component.form.get('address1').setValue('08091');
      expect(component.form.get('address1').invalid).toBeFalsy();
    });
    it('set form to be invalid if zipcode is invalid', () => {
      component.form.get('address1').setValue('abcdf');
      expect(component.form.get('address1').invalid).toBeFalsy();
    });
    it('set form to be invalid if zipcode is invalid', () => {
      component.form.get('zipCode').patchValue('abcdf');
      expect(component.form.get('zipCode').invalid).toBeTruthy();
    });
    it('set form to be valid if zipcode is valid', () => {
      component.form.get('zipCode').patchValue('08091');
      expect(component.form.get('zipCode').invalid).toBeFalsy();
    });
    it('set form to be valid if memberId is invalid', () => {
      component.form.get('memberId').setValue(null);
      expect(component.form.get('memberId').invalid).toBeTruthy();
    });
    it('set form to be valid if memberId is valid', () => {
      component.form.get('memberId').patchValue('1234');
      expect(component.form.get('memberId').invalid).toBeFalsy();
    });
  });

  describe('onInit', () => {
    beforeEach(() => {
      spyOn(component, 'buildForm').and.callThrough();
      spyOn(component, 'stateSearchInit').and.callThrough();
      spyOn(component, 'providerSearchInit').and.callThrough();
      spyOn(component, 'addressAutocompleteInit').and.callThrough();
      spyOn(component, 'zipCodeValidationInit').and.callThrough();
      spyOn(insuranceService, 'getInsuranceProvider').and.callThrough();
      dataService.isModifyCancel = false;
      component.ngOnInit();
    });
    it('should call buildForm,stateSearchInit,providerSearchInit,addressAutocompleteInit,zipCodeValidationInit', () => {
      expect(component.buildForm).toHaveBeenCalled();
      expect(component.stateSearchInit).toHaveBeenCalled();
      expect(component.providerSearchInit).toHaveBeenCalled();
      expect(component.addressAutocompleteInit).toHaveBeenCalled();
      expect(component.zipCodeValidationInit).toHaveBeenCalled();
    });
    it('should get list of insurance provider for a site code provided', () => {
      insuranceService.getInsuranceProvider('JAE').subscribe((res: any) => {
        expect(res.length).toBeGreaterThan(0);
      });
    });
    it('should get list of insurance provider for a site code provided', () => {
      insuranceService.getInsuranceProvider('JAE').subscribe((res: any) => {
        res.forEach(element => {
          expect(Object.keys(element)[0]).toBe('insuranceCompanyName');
        });
      });
    });
    it('should remove validations for the address controls if user has quest account', () => {
      spyOn(dataService, 'getIsQuestAccountCreated').and.callFake(() => {
        return of(
          {
            firstName: 'ajay',
            middleInitial: 'r',
            lastName: 'anireddy',
            dateOfBirth: '11/22/1986',
            sex: 'male',
            primaryPhone: '908-332-1767',
            phoneType: 'mobile',
            email: 'ajayreddy_2211@yahoo.com',
            address1: '2 peak lane',
            address2: '',
            city: '',
            state: '',
            zipCode: '',
            isQuestUser: true,
            secondaryInsurance: false,
          }
        );
      });
      const spy = spyOn(component, 'clearValidations');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
    it('should set insurance value for the form if insurance information is already entered', () => {
      spyOn(dataService, 'getInsuranceData').and.returnValue(of(
        {
          data: {
            sameas: true,
            provider: 'test',
            memberId: 'test',
            groupId: '',
            relationship: '',
            isPrimaryInsuranceHolder: true,
            firstName: 'ajay',
            lastName: 'anireddy',
            dateOfBirth: '11/22/1986',
            gender: 'male',
            phone: '908-332-1767',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zipCode: '',
            labCard: 'false',
            secondaryInsurance: false,
            differentPersonalAddress: {
              address1: '',
              address2: '',
              city: '',
              state: '',
              zipCode: ''
            }
          }
        }
      ) as any);
      component.ngOnInit();
      expect(component.form.get('firstName').value).toEqual('ajay');
    });
    it('should set appointment data if appointment data is already present', () => {
      spyOn(dataService, 'getappointmentData').and.returnValue(of({
        data: {
          address1: '160 W 26Th St',
          address2: null,
          appointmentDate: '2019-10-24',
          appointmentTime: '12:45',
          city: 'New York',
          name: 'Quest Diagnostics - NYC-26th St PSC - Employer Drug Testing Not Offered',
          phone: '6466468031',
          siteCode: 'T2O',
          state: 'NY',
          zip: '10001-6975',
          labCard: 'true'
        }
      }) as any);
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.appointmentData.siteCode).toEqual('BWT');
    });

    // This test is obsolete with the new changes
    /* it('should set appointment data to null if appointment data is not present', () => {

        spyOn(dataService, 'getappointmentData').and.callFake(() => {
            return of(null);
        });
        component.ngOnInit();

        expect(component.appointmentData).toEqual(null);
    }); */
    it('should set personal data if personal data is present', () => {

      spyOn(dataService, 'getPersonalData').and.callFake(() => {
        return of({
          address1: '',
          address2: '',
          city: '',
          createAccount: '',
          dateOfBirth: '12/12/2018',
          email: 'sayedsohel@gmail.com',
          firstName: 'sayed',
          gender: 'male',
          insuranceInfo: 'insurance-no',
          isMobile: 'yes',
          lastName: 'sohel',
          password: '',
          phone: '2222222222',
          preferences: {
            preference_email: true,
            preference_mobile: false
          },
          state: '',
          termsOfService: false,
          zipCode: ''
        });
      });
      component.ngOnInit();
      expect(component.personalData).toEqual({
        firstName: 'STINCHCOMB',
        lastName: 'GREGORY',
        dateOfBirth: '1964-11-26T18:30:00.000+0000'
      });
    });
  });

  describe('providerSearchInit()', () => {
    it('should get the provider if input value matches the character of insuranceCompanyName', () => {
      component.providerSearchInit();
      const searchField: DebugElement = fixture.debugElement.query(By.css('#as_insurance_insuranceProvider_txt'));
      searchField.nativeElement.value = 'bl';
      searchField.nativeElement.dispatchEvent(new Event('input'));
      expect(component.providerOptions[0]['insuranceCompanyName']).toEqual('BLUE CROSS & BLUE SHIELD OF NEW JERSEY');
    });

    it('should empty the provider option if no input', () => {
      component.providerSearchInit();
      const searchField: DebugElement = fixture.debugElement.query(By.css('#as_insurance_insuranceProvider_txt'));
      searchField.nativeElement.value = '';
      searchField.nativeElement.dispatchEvent(new Event('input'));
      expect(component.providerOptions).toBeLessThanOrEqual(0);
    });

  });
  describe('stateSearchInit()', () => {
    it('should get the state if input value matches the character of statename', () => {
      component.providerSearchInit();
      const searchField: DebugElement = fixture.debugElement.query(By.css('#as_insurance_insuranceProvider_txt'));
      searchField.nativeElement.value = 'al';
      searchField.nativeElement.dispatchEvent(new Event('input'));
      expect(component.stateResult[0]['label']).toEqual('Alabama');
    });

    it('should get no state if input value doesn\'t match the character of statename', () => {
      component.stateSearchInit();
      const searchField: DebugElement = fixture.debugElement.query(By.css('#as_insurance_state_txt'));
      searchField.nativeElement.value = 'as';
      searchField.nativeElement.dispatchEvent(new Event('input'));
      expect(component.stateResult.length).toEqual(0);
    });

    it('should empty the state option if no input', () => {
      component.stateSearchInit();
      const searchField: DebugElement = fixture.debugElement.query(By.css('#as_insurance_state_txt'));
      searchField.nativeElement.value = '';
      searchField.nativeElement.dispatchEvent(new Event('input'));
      expect(component.stateResult.length).toEqual(52);
    });
  });
  describe('build form when someonse else', () => {
    beforeEach(() => {
      component.handleChange('false');
      component.enableDisableValidation();
    });

    it('set form to be invalid if firstName is invalid', () => {
      component.form.get('firstName').patchValue(null);
      expect(component.form.get('firstName').errors['required']).toBeTruthy();
    });
    it('set form to be invalid if firstName is invalid chars', () => {
      component.form.get('firstName').patchValue('Admin@1#$%');
      expect(component.form.get('firstName').errors['pattern']).toBeTruthy();
    });
    it('set form to be valid if firstName is valid', () => {
      component.form.get('firstName').setValue('sanju');
      expect(component.form.get('firstName').invalid).toBeFalsy();
    });

    it('set form to be invalid if lastName is invalid', () => {
      component.form.get('lastName').patchValue(null);
      expect(component.form.get('lastName').errors['required']).toBeTruthy();
    });
    it('set form to be invalid if lastName is invalid chars', () => {
      component.form.get('lastName').patchValue('Admin@1#$%');
      expect(component.form.get('lastName').errors['pattern']).toBeTruthy();
    });
    it('set form to be valid if lastName is valid', () => {
      component.form.get('lastName').setValue('sanju');
      expect(component.form.get('lastName').invalid).toBeFalsy();
    });

    it('set form to be invalid if dateOfBirth is invalid', () => {
      component.form.get('dateOfBirth').patchValue(null);
      expect(component.form.get('dateOfBirth').errors['required']).toBeTruthy();
    });
    it('set form to be invalid if dateOfBirth is invalid age', () => {
      component.form.get('dateOfBirth').patchValue('01/10/1990');
      expect(component.form.get('dateOfBirth').errors).toBeFalsy();
    });

    it('set form to be invalid if dateOfBirth is invalid minimum', () => {
      component.form.get('dateOfBirth').patchValue('01/10/2019');
      expect(component.form.get('dateOfBirth').errors['coppaMinAge']).toBeTruthy();
    });

    it('set form to be invalid if gender is invalid', () => {
      component.form.get('gender').patchValue(null);
      expect(component.form.get('gender').errors['required']).toBeTruthy();
    });
    it('set form to be invalid if gender is valid', () => {
      component.form.get('gender').patchValue('male');
      expect(component.form.get('gender').errors).toBeFalsy();
    });

    it('set form to be invalid if phone is invalid', () => {
      component.form.get('phone').setValue('908');
      expect(component.form.get('phone').invalid).toBeTruthy();
    });
    it('set form to be valid if phone is valid', () => {
      component.form.get('phone').setValue('2012019999');
      expect(component.form.get('phone').invalid).toBeFalsy();
    });
  });
  describe('updateValidationForDiffAddress()', () => {
    it('different address checkbox un-checked for address1', () => {
      component.updateValidationForDiffAddress(false);
      expect(component.form.get('differentPersonalAddress').get('address1').validator).toBeNull();
    });

    it('different address checkbox un-checked for address1', () => {
      component.updateValidationForDiffAddress(true);
      expect(component.form.get('differentPersonalAddress').get('address1').validator.length > 0).toBeTruthy();
    });

    it('different address checkbox un-checked for city', () => {
      component.updateValidationForDiffAddress(false);
      expect(component.form.get('differentPersonalAddress').get('city').validator).toBeNull();
    });

    it('different address checkbox un-checked for city', () => {
      component.updateValidationForDiffAddress(true);
      expect(component.form.get('differentPersonalAddress').get('city').validator.length > 0).toBeTruthy();
    });

    it('different address checkbox un-checked for state', () => {
      component.updateValidationForDiffAddress(false);
      expect(component.form.get('differentPersonalAddress').get('state').validator).toBeNull();
    });

    it('different address checkbox un-checked for state', () => {
      component.updateValidationForDiffAddress(true);
      expect(component.form.get('differentPersonalAddress').get('state').validator.length > 0).toBeTruthy();
    });

    it('different address checkbox un-checked for zipCode', () => {
      component.updateValidationForDiffAddress(false);
      expect(component.form.get('differentPersonalAddress').get('zipCode').validator).toBeNull();
    });

    it('different address checkbox un-checked for zipCode', () => {
      component.updateValidationForDiffAddress(true);
      expect(component.form.get('differentPersonalAddress').get('zipCode').validator.length > 0).toBeTruthy();
    });
  });
  describe('handleChange()', () => {
    it('when changing checkbox value to someone else', () => {
      component.handleChange('false');
      expect(component.blnInsuranceHolder).toBeTruthy();
    });

    it('when changing checkbox value to jonathon', () => {
      component.handleChange('jonathon');
      expect(component.blnInsuranceHolder).toBeFalsy();
    });
  });
  describe('labCardChange() called', () => {
    // it('Lab Card test true and apooniment lab card ', () => {
    //     const labCard = true;
    //     component.showLabCardAlert = true;
    //     component.disableContinueButton = true;
    //     expect(component.labCardChange).toMatch('true');
    //     expect(labCard).toEqual(true);
    //     expect(component.appointmentData.labCard).toEqual('true');
    //     expect(component.showLabCardAlert).toEqual(true);
    //     spyOn(dataService, 'setlabCardLocationSearch').and.returnValue(of({
    //         provider: {
    //             insuranceCompanyName: 'LAB CARD',
    //             insuranceMnemonic: 'LBCRD'
    //         },
    //         labCard: 'true'
    //     }));
    //     component.form.controls.provider.reset();
    //     expect(component.disableContinueButton).toEqual(true);
    // });
    it('Lab Card test true ', () => {
      const labCardInsurance = {
        provider: {
          insuranceCompanyName: 'LAB CARD',
          insuranceMnemonic: 'LBCRD'
        },
        labCard: 'true'
      };
      const labCard = true;
      component.showLabCardAlert = false;
      component.markFieldReadOnly = true;
      expect(component.labCardChange).toMatch('true');
      expect(labCard).toEqual(true);
      expect(component.showLabCardAlert).toEqual(false);
      spyOn(dataService, 'setlabCardLocationSearch').and.returnValue(labCardInsurance as any);
      expect(component.markFieldReadOnly).toEqual(true);
      component.form.controls.provider.patchValue(labCardInsurance.provider);
    });
    it('Lab Card test false ', () => {
      const labCardInsurance = {
        provider: {
          insuranceCompanyName: 'LAB CARD',
          insuranceMnemonic: 'LBCRD'
        },
        labCard: 'false'
      };
      const labCard = false;
      component.showLabCardAlert = false;
      component.markFieldReadOnly = false;
      expect(component.labCardChange).toMatch('false');
      expect(labCard).toEqual(false);
      expect(component.showLabCardAlert).toEqual(false);
      spyOn(dataService, 'setlabCardLocationSearch').and.returnValue(labCardInsurance as any);
      expect(component.markFieldReadOnly).toEqual(false);
      component.form.controls.provider.reset();
    });
  });
  // describe('addressAutocompleteInit()', () => {
  //     beforeEach(() => {
  //         component.ngOnInit();
  //         fixture.detectChanges();
  //     });
  //     describe('google autocomplete searchControl when loading is true', () => {
  //         beforeEach(() => {
  //             fixture.detectChanges();
  //             spyOn(googleService, 'getGoogleAutocomplete').and.callThrough();
  //             component.addressLoading = true;
  //             component.form.get('address1').patchValue('something');
  //         });

  //         it('does not call getGoogleAutocomplete', () => {
  //             expect(googleService.getGoogleAutocomplete).not.toHaveBeenCalled();
  //         });
  //     });

  //     describe('when loading is false', () => {
  //         beforeEach(
  //             fakeAsync(() => {

  //                 component.form.get('city').patchValue('Huntsville');
  //                 component.form.get('state').patchValue('AL');
  //                 component.form.get('zipCode').patchValue('45040');
  //                 tick(500);
  //             })
  //         );
  //         it(
  //             'sets options back to an empty array before the request is made',
  //             fakeAsync(() => {
  //                 fixture.detectChanges();
  //                 spyOn(googleService, 'getGoogleAutocomplete').and.returnValue(of());
  //                 component.options = mockPredictions;
  //                 component.form.get('address1').patchValue('something');
  //                 tick(500);
  //                 expect(component.options).toEqual([]);
  //             })
  //         );

  //         it(
  //             'debounces the input of street address',
  //             fakeAsync(() => {
  //                 fixture.detectChanges();
  //                 spyOn(googleService, 'getGoogleAutocomplete').and.returnValue(of());
  //                 const sampleAddress = 'newyork';
  //                 component.form.get('address1').patchValue(sampleAddress);
  //                 fixture.detectChanges();
  //                 tick(500);
  //                 expect(googleService.getGoogleAutocomplete).toHaveBeenCalledTimes(1);
  //                 expect(googleService.getGoogleAutocomplete).toHaveBeenCalledWith(sampleAddress);
  //             })
  //         );

  //         it(
  //             'sets loading to true',
  //             fakeAsync(() => {
  //                 fixture.detectChanges();
  //                 spyOn(googleService, 'getGoogleAutocomplete').and.returnValue(of());
  //                 component.options = mockPredictions;
  //                 component.form.get('address1').patchValue('something');
  //                 tick(500);
  //                 expect(component.addressLoading).toEqual(true);
  //             })
  //         );

  //         describe('successful autocomplete', () => {
  //             beforeEach(
  //                 fakeAsync(() => {
  //                     spyOn(googleService, 'getGoogleAutocomplete').and.callThrough();
  //                     component.form.get('address1').patchValue('something');
  //                     tick(500);
  //                 })
  //             );

  //             it('calls getGoogleAutocomplete', () => {
  //                 expect(googleService.getGoogleAutocomplete).toHaveBeenCalledWith('something');
  //             });

  //             it('sets the options to the results', () => {
  //                 expect(component.options).toEqual(mockPredictions);
  //             });

  //             it('sets loading to false', () => {
  //                 expect(component.addressLoading).toEqual(false);
  //             });
  //         });
  //     });
  // });

  describe('differentAddressAutocompleteInit()', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });
    describe('google autocomplete searchControl when loading is true', () => {
      beforeEach(() => {
        fixture.detectChanges();
        spyOn(googleService, 'getGoogleAutocomplete').and.callThrough();
        component.diffAddressLoading = true;
        component.form.get('differentPersonalAddress').get('address1').patchValue('something');
      });

      it('does not call getGoogleAutocomplete', () => {
        expect(googleService.getGoogleAutocomplete).not.toHaveBeenCalled();
      });
    });

    describe('when loading is false', () => {
      beforeEach(
        () => {

          component.form.get('differentPersonalAddress').get('city').patchValue('Huntsville');
          component.form.get('differentPersonalAddress').get('state').patchValue('AL');
          component.form.get('differentPersonalAddress').get('zipCode').patchValue('45040');
          // tick(500);
        });
      it(
        'sets options back to an empty array before the request is made',
        fakeAsync(() => {
          fixture.detectChanges();
          spyOn(googleService, 'getGoogleAutocomplete').and.returnValue(of());
          component.optionsDiffAddress = mockPredictions;
          component.form.get('differentPersonalAddress').get('address1').patchValue('something');
          tick(500);
          expect(component.optionsDiffAddress).toEqual([]);
        })
      );

      it(
        'debounces the input of street address',
        fakeAsync(() => {
          fixture.detectChanges();
          spyOn(googleService, 'getGoogleAutocomplete').and.returnValue(of());
          const sampleAddress = 'newyork';
          component.form.get('differentPersonalAddress').get('address1').patchValue(sampleAddress);
          fixture.detectChanges();
          tick(500);
          expect(googleService.getGoogleAutocomplete).toHaveBeenCalledTimes(1);
          expect(googleService.getGoogleAutocomplete).toHaveBeenCalledWith(sampleAddress);
        })
      );

      it(
        'sets loading to true',
        fakeAsync(() => {
          fixture.detectChanges();
          spyOn(googleService, 'getGoogleAutocomplete').and.returnValue(of());
          component.optionsDiffAddress = mockPredictions;
          component.form.get('differentPersonalAddress').get('address1').patchValue('something');
          tick(500);
          expect(component.diffAddressLoading).toEqual(true);
        })
      );

      describe('successful autocomplete', () => {
        beforeEach(
          fakeAsync(() => {
            spyOn(googleService, 'getGoogleAutocomplete').and.callThrough();
            component.form.get('differentPersonalAddress').get('address1').patchValue('something');
            tick(500);
          })
        );

        it('calls getGoogleAutocomplete', () => {
          expect(googleService.getGoogleAutocomplete).toHaveBeenCalledWith('something');
        });

        it('sets the options to the results', () => {
          expect(component.optionsDiffAddress).toEqual(mockPredictions);
        });

        it('sets loading to false', () => {
          expect(component.diffAddressLoading).toEqual(false);
        });
      });
    });
  });

  describe('onOptionSelect', () => {
    beforeEach(() => {
      spyOn(googleService, 'getGoogleCityStateZipCode').and.callThrough(); // returnValue(of());
      component.options = [mockAutocompletePrediction];
      component.form.get('address1').patchValue('2 peak st, AL, 45040');
      component.onOptionSelect(mockAutocompletePrediction);
      fixture.detectChanges();
    });

    it('calls getGoogleCityStateZipCode', () => {
      expect(googleService.getGoogleCityStateZipCode).toHaveBeenCalledWith('some-id');
    });
    it('sets address values', () => {
      expect(component.form.get('address1').value).toEqual('2 peak st');
      expect(component.form.get('state').value).toEqual('AL');
      expect(component.form.get('zipCode').value).toEqual('45040');

    });
    it('sets state to null if state not in USA', () => {
      const noStateMockAutocompletePrediction = new GoogleAutocompletePrediction();
      noStateMockAutocompletePrediction.description = null;
      component.onOptionSelect(noStateMockAutocompletePrediction);
      expect(component.form.get('state').value).toBeNull();

    });
  });

  describe('continueClicked', () => {
    beforeEach(() => {
      component.continueClicked();

      fixture.detectChanges();
    });

    it('should set the insuranceInfo to sent for verification', () => {
      expect(component.insuranceInfo.siteCode).toEqual(component.appointmentData.siteCode);
    });
    it('should set the insuranceInfo to sent for verification', () => {
      spyOn(insuranceService, 'verifyInsurance').and.callThrough();
      spyOn(dataService, 'setInsuranceData').and.callThrough();
      component.isEditFromSummaryPage = false;
      component.continueClicked();
      insuranceService.verifyInsurance(component.insuranceInfo).subscribe((res: any) => {
        expect(dataService.setInsuranceData).toHaveBeenCalled();
      });
    });

    it('should set the insuranceInfo to sent for verification', () => {
      // tslint:disable-next-line:label-position
      spyOn(insuranceService, 'verifyInsurance').and.returnValue(of({ value: false }));
      spyOn(dataService, 'setInsuranceData').and.callThrough();
      component.continueClicked();
      insuranceService.verifyInsurance(component.insuranceInfo).subscribe((res: any) => {
        expect(component.invalidId).toBeTruthy();
      });
    });

  });

  describe('onOptionSelectDiffAddress', () => {
    beforeEach(waitForAsync(() => {
      spyOn(googleService, 'getGoogleCityStateZipCode').and.callThrough(); // returnValue(of());
      component.options = [mockAutocompletePrediction];
      component.form.get('differentPersonalAddress').get('address1').patchValue('2 peak st, AL, 45040');
      component.form.get('sameas').patchValue(true);
      component.blnInsuranceHolder = true;
      component.onOptionSelectDiffAddress(mockAutocompletePrediction);
      fixture.detectChanges();

    }));

    it('calls getGoogleCityStateZipCode', () => {
      expect(googleService.getGoogleCityStateZipCode).toHaveBeenCalledWith('some-id');
    });
    it('sets address values', () => {
      expect(component.form.get('differentPersonalAddress').get('address1').value).toEqual('2 peak st');
      expect(component.form.get('differentPersonalAddress').get('state').value).toEqual('AL');
      expect(component.form.get('differentPersonalAddress').get('zipCode').value).toEqual('45040');

    });
    it('sets state to null if state not in USA', () => {
      const noStateMockAutocompletePrediction = new GoogleAutocompletePrediction();
      noStateMockAutocompletePrediction.description = null;
      component.onOptionSelectDiffAddress(noStateMockAutocompletePrediction);
      expect(component.form.get('differentPersonalAddress').get('state').value).toBeNull();

    });
  });

  describe('clearNoMatchError()', () => {
    it('check value for error,bringCardError if form provider has value', () => {
      component.form.get('provider').valueChanges.subscribe(value => {
        expect(value.length).toEqual(0);
        component.clearNoMatchError();
        expect(component.error).toBeFalsy();
        expect(component.bringCardError).toBeFalsy();
      });
    });
  });

  // describe('autocomplete zip code', () => {
  //     beforeEach(
  //         fakeAsync(() => {
  //             component.form.get('city').patchValue('Huntsville');
  //             component.form.get('state').patchValue('AL');

  //             tick(debounceTime);
  //         }),
  //     );

  //     it(
  //         'debounces the input',
  //         fakeAsync(() => {
  //             spyOn(googleService, 'getGoogleCityState').and.returnValue(of());
  //             const sampleZip = '45040';
  //             component.form.get('zipCode').patchValue(sampleZip);
  //             fixture.detectChanges();
  //             tick(debounceTime);
  //             expect(googleService.getGoogleCityState).toHaveBeenCalledTimes(1);
  //             expect(googleService.getGoogleCityState).toHaveBeenCalledWith(sampleZip);
  //         })
  //     );

  //     it(
  //         'does autofill city and state',
  //         fakeAsync(() => {
  //             component.form.get('zipCode').patchValue('45040');
  //             fixture.detectChanges();
  //             tick(debounceTime);
  //             expect(component.form.get('city').value).toEqual('Huntsville');
  //             expect(component.form.get('state').value).toEqual('AL');
  //         })
  //     );

  //     it(
  //         'does not clear city and state if zip code not found',
  //         fakeAsync(() => {
  //             spyOn(googleService, 'getGoogleCityState').and.returnValue(of());
  //             const invalidZipCode = '25816';
  //             component.form.get('zipCode').patchValue(invalidZipCode);
  //             tick(debounceTime);
  //             expect(component.form.get('city').value).toEqual('Huntsville');
  //             expect(component.form.get('state').value).toEqual('AL');
  //         })
  //     );

  //     it(
  //         'does not allow zipcodes outside the USA',
  //         fakeAsync(() => {
  //             const invalidZipCode = '45000';
  //             const responseOutsideUSA = { city: 'Toronto', state: 'ON' };
  //             const expectedErrors = { outsideUsa: true };
  //             spyOn(googleService, 'getGoogleCityState').and.returnValue(of(responseOutsideUSA));

  //             component.form.get('zipCode').patchValue(invalidZipCode);
  //             fixture.detectChanges();
  //             tick(debounceTime);
  //             expect(component.form.get('zipCode').errors).toEqual(expectedErrors);
  //         })
  //     );

  //     it(
  //         'does not allow invalid zipcode',
  //         fakeAsync(() => {
  //             const invalidZipCode = '00000';
  //             const responseInvalidZip = { city: null, state: null };
  //             const expectedErrors = { invalidzipCode: true };
  //             spyOn(googleService, 'getGoogleCityState').and.returnValue(of(responseInvalidZip));

  //             component.form.get('zipCode').patchValue(invalidZipCode);
  //             fixture.detectChanges();
  //             tick(debounceTime);
  //             expect(component.form.get('zipCode').errors).toEqual(expectedErrors);
  //         })
  //     );
  // });

  describe('onkeypressdate', () => {
    beforeEach(() => {
      spyOn(component, 'onkeypressdate');
      fixture.detectChanges();
    });

    it(
      'should get called', () => {
        const eventItem = new KeyboardEvent('keypress', { code: 'Digit2' });
        const dateElement = fixture.debugElement.query(By.css('input')).nativeElement;
        dateElement.value = '11221986';
        component.onkeypressdate(eventItem, dateElement);
        expect(component.onkeypressdate).toHaveBeenCalled();
      });

  });

  describe('onkeypressdate()', () => {
    it('should enter / after two digit is entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const dateElement = fixture.debugElement.query(By.css('input')).nativeElement;
      dateElement.value = '09';
      component.onkeypressdate(event, dateElement);
      expect(dateElement.value).toEqual('09/');
    });
    it('should not enter / if already entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const dateElement = fixture.debugElement.query(By.css('input')).nativeElement;
      dateElement.value = '09/';
      component.onkeypressdate(event, dateElement);
      expect(dateElement.value).toEqual('09/');
    });

    it('should remove one / if entered twice', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const dateElement = fixture.debugElement.query(By.css('input')).nativeElement;
      dateElement.value = '09//';
      component.onkeypressdate(event, dateElement);
      expect(dateElement.value).toEqual('09/');
    });
    it('should add / if 5 characters are entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const dateElement = fixture.debugElement.query(By.css('input')).nativeElement;
      dateElement.value = '09/09';
      component.onkeypressdate(event, dateElement);
      expect(dateElement.value).toEqual('09/09/');
    });

  });

  describe('onkeypressphone()', () => {
    it('should add - after three digit is entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('input')).nativeElement;
      phoneElement.value = '908';
      component.onkeypressphone(event, phoneElement);
      expect(phoneElement.value).toEqual('908-');
    });
    it('should not enter - if already entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('input')).nativeElement;
      phoneElement.value = '908-';
      component.onkeypressphone(event, phoneElement);
      expect(phoneElement.value).toEqual('908-');
    });

    it('should add - if 7 characters are entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('input')).nativeElement;
      phoneElement.value = '908-332';
      component.onkeypressphone(event, phoneElement);
      expect(phoneElement.value).toEqual('908-332-');
    });

    it('should add set error if 11 characters are entered', () => {
      component.ngOnInit();
      fixture.detectChanges();
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('input')).nativeElement;
      phoneElement.value = '856-854-85555';
      const expectedErrors = { invalidPhoneno: true };

      component.onkeypressphone(event, phoneElement);
      expect(component.form.get('phone').errors).toEqual(expectedErrors);
    });

  });


  /* describe('zipCodeValidationDiffAddressInit', () => {
    beforeEach(
      fakeAsync(() => {
        component.form.get('sameas').patchValue(true);
        component.blnInsuranceHolder = true;
        fixture.detectChanges();

        component.form.get('differentPersonalAddress').get('city').patchValue('Huntsville');
        component.form.get('differentPersonalAddress').get('state').patchValue('AL');
        fixture.detectChanges();

      }));

    it(
      'debounces the input',
      fakeAsync(() => {
        const spy = spyOn(googleService, 'getGoogleCityState').and.returnValue(of());
        const sampleZip = '45040';
        component.form.get('differentPersonalAddress').get('zipCode').patchValue(sampleZip);
        fixture.detectChanges();
        tick(debounceTime);
        expect(googleService.getGoogleCityState).toHaveBeenCalledTimes(1);
        expect(googleService.getGoogleCityState).toHaveBeenCalledWith(sampleZip);
      })
    );

    it(
      'does autofill city and state',
      fakeAsync(() => {
        component.form.get('differentPersonalAddress').get('zipCode').patchValue('45040');
        fixture.detectChanges();
        tick(debounceTime);
        expect(component.form.get('differentPersonalAddress').get('city').value).toEqual('Huntsville');
        expect(component.form.get('differentPersonalAddress').get('state').value).toEqual('AL');
        flushMicrotasks();

      })
    );

    it(
      'does not clear city and state if zip code not found',
      fakeAsync(() => {
        spyOn(googleService, 'getGoogleCityState').and.returnValue(of());
        const invalidZipCode = '25816';
        component.form.get('differentPersonalAddress').get('zipCode').patchValue(invalidZipCode);
        tick(debounceTime);
        expect(component.form.get('differentPersonalAddress').get('city').value).toEqual('Huntsville');
        expect(component.form.get('differentPersonalAddress').get('state').value).toEqual('AL');
      })
    );

    it(
      'does not allow zipcodes outside the USA',
      fakeAsync(() => {
        const invalidZipCode = '45000';
        const responseOutsideUSA = { city: 'Toronto', state: 'ON' };
        const expectedErrors = { outsideUsa: true };
        spyOn(googleService, 'getGoogleCityState').and.returnValue(of(responseOutsideUSA));

        component.form.get('differentPersonalAddress').get('zipCode').patchValue(invalidZipCode);
        fixture.detectChanges();
        tick(debounceTime);
        expect(component.form.get('differentPersonalAddress').get('zipCode').errors).toEqual(expectedErrors);
      })
    );

    it(
      'does not allow invalid zipcode',
      fakeAsync(() => {
        const invalidZipCode = '00000';
        const responseInvalidZip = { city: null, state: null };
        const expectedErrors = { invalidzipCode: true };
        spyOn(googleService, 'getGoogleCityState').and.returnValue(of(responseInvalidZip));

        component.form.get('differentPersonalAddress').get('zipCode').patchValue(invalidZipCode);
        fixture.detectChanges();
        tick(debounceTime);
        expect(component.form.get('differentPersonalAddress').get('zipCode').errors).toEqual(expectedErrors);
      })
    );
  }); */

  describe(('modifyAppointment() - invoked'), () => {
    it('modifyAppointmentResponse -> confimationcode present, router navigates to as-eorder-price-estimate', () => {
      fixture.detectChanges();
      const routeNavExtras = { queryParams: { confirmationCode: 'WERTY' } };

      spyOn(appointmentService, 'modifyAppointment').and.returnValue(of(createAppointmentResponse));
      component.modifyAppointment();
      expect(router.navigate).toHaveBeenCalledWith(['/find-appointment/as-find-appointment-summary'], routeNavExtras);
      expect(component.SpinnerLoading).toBeFalsy();
    });

    it('modifyAppointmentResponse -> No confirmation code, router should not navigate to as-eorder-price-estimate', () => {
      fixture.detectChanges();

      spyOn(appointmentService, 'modifyAppointment').and.returnValue(of({}));
      component.modifyAppointment();
      expect(router.navigate).not.toHaveBeenCalledWith(['/eorder/as-eorder-price-estimate']);
      expect(component.SpinnerLoading).toBeFalsy();
    });
  });

  describe(('getInsuranceForedit()'), () => {
    // tslint:disable-next-line: max-line-length
    it('when isModifyCancel is false, should call getappointmentDataForEdit,getInsuranceProvider,providerSearchInit,checkError,getLabcardValueFromDeepLink', () => {
      dataService.isModifyCancel = false;
      spyOn(component, 'providerSearchInit').and.callThrough();
      spyOn(component, 'checkError').and.callThrough();
      spyOn(component, 'getLabcardValueFromDeepLink').and.callThrough();
      spyOn(dataService, 'getappointmentDataForEdit').and.callThrough();
      spyOn(insuranceService, 'getInsuranceProvider').and.returnValue(of([
        {
          insuranceCompanyName: 'MERITAIN HEALTH AETNA',
          insuranceMnemonic: 'MERTN'
        }
      ]));

      component.getInsuranceForedit();

      expect(dataService.getappointmentDataForEdit).toHaveBeenCalled();
      expect(insuranceService.getInsuranceProvider).toHaveBeenCalledWith('BWT');
      expect(component.providerSearchInit).toHaveBeenCalled();
      expect(component.checkError).toHaveBeenCalled();
      expect(component.getLabcardValueFromDeepLink).toHaveBeenCalled();
    });
    it(' when isModifyCancel is true, should only call getmodifyAppointmentDataForEdit', () => {
      dataService.isModifyCancel = true;
      spyOn(dataService, 'getmodifyAppointmentDataForEdit').and.callThrough();
      spyOn(insuranceService, 'getInsuranceProvider').and.callThrough();

      component.getInsuranceForedit();

      expect(dataService.getmodifyAppointmentDataForEdit).toHaveBeenCalled();
      expect(insuranceService.getInsuranceProvider).toHaveBeenCalledWith('BWT');
      expect(component.confirmationCode).toEqual('INSAPPTEDIT');
      // expect(component.personalData).toEqual({
      //     firstName: 'Hello',
      //     lastName: 'World',
      //     dateOfBirth: '1964-11-26'
      // });
    });
  });

  describe('#navigateToNext', () => {
    it('when secondary insurance not selected', () => {
      component.isSecondaryNotSelected = true;
      component.navigateToNext();
      expect(router.navigate).toHaveBeenCalledWith(['/schedule-appointment/as-review-details']);
    });
    it('when secondary insurance selected', () => {
      component.isSecondaryNotSelected = false;
      component.navigateToNext();
      expect(router.navigate).toHaveBeenCalledWith(['/schedule-appointment/as-secondary-insurance']);
    });
  });
  describe('#secondaryInsuranceChange', () => {
    it('on radio button change insurance not selected', () => {
      component.secondaryInsuranceChange('false');
      expect(component.isSecondaryNotSelected).toBe(true);
    });
    it('on radio button change insurance selected', () => {
      component.secondaryInsuranceChange('true');
      expect(component.isSecondaryNotSelected).toBe(false);
    });
  });

  describe('#setPreviousUrlForEdit', () => {
    beforeEach(() => {
      component.previousUrl = '/schedule-appointment/as-personal-information';
    });
    it('should call setPreviousUrlForEdit', () => {
      component.setPreviousUrlForEdit();
      expect(component.previousUrl).toBe('/find-appointment/as-find-appointment-summary');
    });
    it('should call setPreviousUrlForEdit when not editing', () => {
      component.isEditFromSummaryPage = false;
      component.setPreviousUrlForEdit();
      expect(component.previousUrl).toBe('/schedule-appointment/as-personal-information');
    });
  });
});
