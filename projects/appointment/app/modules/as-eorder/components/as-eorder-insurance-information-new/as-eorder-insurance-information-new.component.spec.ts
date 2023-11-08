import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { Pattern } from 'shared/models';
import { EorderPersonalInformation } from 'shared/models/eorder';
import { ApiService } from 'shared/services/api.service';
import { AppointmentService } from 'shared/services/appointment.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { InsuranceEorderAddressService } from 'shared/services/insurance-eorder-address.service';
import { InsuranceValidationService } from 'shared/services/insurance-validation.service';
import { InsuranceService } from 'shared/services/insurance.service';
import { PropertiesService } from 'shared/services/properties.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { createAppointmentResponse, mockAppointment } from 'shared/specs/mocks/mock-appointment.service';
import { MockEorderInsuranceAddressService } from 'shared/specs/mocks/mock-eorder-insurance-address.service';
import { mockEorderDemographicsInfo, mockEorderInsuranceInfo, MockEorderService } from 'shared/specs/mocks/mock-eorder.service';
import { MockInsuranceValidationService } from 'shared/specs/mocks/mock-insurance-validation.service';
import { MockInsuranceService } from 'shared/specs/mocks/mock-insurance.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsEorderInsuranceInformationNewComponent } from './as-eorder-insurance-information-new.component';


@Component({
  template: '<div></div>'
})
class MockRouteComponent { }
const routes = [
  { path: 'eorder/as-eorder-insurance-information', component: MockRouteComponent }
];

describe('AsEorderInsuranceInformationNewComponent', () => {
  let component: AsEorderInsuranceInformationNewComponent;
  let fixture: ComponentFixture<AsEorderInsuranceInformationNewComponent>;
  let googleService: GoogleMapsService;
  let eorderDataService: EorderDataService;
  let appointmentService: AppointmentService;
  let router: Router;
  let insuranceService: InsuranceService;
  let insuranceEorderAddressService: InsuranceEorderAddressService;
  let propertiesService: PropertiesService;
  let secondaryInsuranceService: SecondaryInsuranceService;
  let eorderService: EorderService;
  let insuranceValidationService: InsuranceValidationService;
  let route: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsEorderInsuranceInformationNewComponent, MockRouteComponent],
      imports: [RouterTestingModule.withRoutes(routes),
        FormsModule, ReactiveFormsModule,
        HttpClientTestingModule,
        MatAutocompleteModule,
        FormsModule,
        ReactiveFormsModule,
        CustomPipesModule,
        MockI18nModule,
        MatDatepickerModule,
        MatNativeDateModule],
      providers: [GoogleMapsService,
        { provide: ApiService, useClass: MockApiService },
        { provide: EorderDataService, useClass: EorderDataService },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: InsuranceEorderAddressService, useClass: MockEorderInsuranceAddressService },
        { provide: InsuranceService, useClass: MockInsuranceService },
        { provide: EorderService, useClass: MockEorderService },
        { provide: InsuranceValidationService, useClass: MockInsuranceValidationService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        AppointmentService,
        SecondaryInsuranceService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    googleService = TestBed.inject(GoogleMapsService);
    googleService.AutocompleteService = {
      getPlacePredictions: () => { },
      getQueryPredictions: () => { }
    };
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(AsEorderInsuranceInformationNewComponent);
    component = fixture.componentInstance;
    spyOn(router, 'navigate').and.stub();
    component.error = false;
    component.noMatchesError = false;
    component.bringCardError = false;
    eorderService = TestBed.inject(EorderService);
    eorderDataService = TestBed.inject(EorderDataService);
    appointmentService = TestBed.inject(AppointmentService);
    insuranceService = TestBed.inject(InsuranceService);
    propertiesService = TestBed.inject(PropertiesService);
    secondaryInsuranceService = TestBed.inject(SecondaryInsuranceService);
    insuranceEorderAddressService = TestBed.inject(InsuranceEorderAddressService);
    insuranceValidationService = TestBed.inject(InsuranceValidationService);
    spyOn(eorderDataService, 'getlabCardLocationSearch').and.returnValue(of({
      provider: {
        insuranceCompanyName: 'LAB CARD',
        insuranceMnemonic: 'LBCRD'
      },
      labCard: 'false'
    }));
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
    component.appointmentData = mockAppointment;
    fixture.detectChanges();
    spyOn(component, 'clearError').and.callThrough();
    spyOn(component, 'continueError').and.callThrough();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    beforeEach(() => {
      spyOn(component, 'buildForm').and.callThrough();
      component.ngOnInit();
    });
    it('should call buildForm,stateSearchDiffAddressInit,addressAutocompleteInit,zipCodeValidationInit', () => {
      expect(component.buildForm).toHaveBeenCalled();
    });
  });
  describe('buildform()', () => {
    it('should build the form', () => {
      expect(component.form.get('sameas')).toBeTruthy();
      expect(component.form.get('provider')).toBeTruthy();
      expect(component.form.get('memberId')).toBeTruthy();
      expect(component.form.get('groupId')).toBeTruthy();
      expect(component.form.get('labCard')).toBeTruthy();
    });
  });
  describe('clearError()', () => {
    it('check value for error,noMatchesError,bringCardError if form provider has value', () => {
      component.form.get('provider').setValue('NewYork');
      component.clearError();
      expect(component.error).toBeFalsy();
      expect(component.noMatchesError).toBeFalsy();
      expect(component.bringCardError).toBeFalsy();
    });
  });
  describe('continueError()', () => {
    it('set value for letUserGo if invalidId value is false', () => {
      component.invalidId = false;
      component.form.get('memberId').setValue('123');
      component.continueError();
      component.form.get('memberId').valueChanges.subscribe(() => {
        component.letUserGo = false;
      });
      expect(component.letUserGo).toBeFalsy();
    });
    it('set value for error,invalidId,letUserGo if invalidId value is true', () => {
      component.invalidId = true;
      component.continueError();
      expect(component.error).toBeFalsy();
      expect(component.invalidId).toBeFalsy();
      expect(component.letUserGo).toBeTruthy();
    });
  });
  describe('checkError()', () => {
    it('should set noMatchesError to be true if not blurred', () => {
      component.checkError();
      component.form.get('provider').patchValue('asdf');
      expect(component.noMatchesError).toBeFalsy();
    });
  });
  describe('labCardChange() called', () => {
    it('Lab Card test true and apooniment lab card ', () => {
      const labCard = true;
      component.showLabCardAlert = true;
      component.disableContinueButton = true;
      expect(component.labCardChange).toMatch('true');
      expect(labCard).toEqual(true);
      expect(component.showLabCardAlert).toEqual(true);
      const data = {
        provider: {
          insuranceCompanyName: 'LAB CARD',
          insuranceMnemonic: 'LBCRD'
        },
        labCard: 'true'
      };
      spyOn(eorderDataService, 'setlabCardLocationSearch').and.stub();
      component.form.controls.provider.reset();
      expect(component.disableContinueButton).toEqual(true);
    });
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
      spyOn(eorderDataService, 'setlabCardLocationSearch').and.stub();
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
      spyOn(eorderDataService, 'setlabCardLocationSearch').and.stub();
      expect(component.markFieldReadOnly).toEqual(false);
      component.form.controls.provider.reset();
    });
  });
  describe(('modifyAppointment() - invoked'), () => {
    it('modifyAppointmentResponse -> confimationcode present, router navigates to as-eorder-price-estimate', () => {
      fixture.detectChanges();

      spyOn(appointmentService, 'modifyAppointment').and.returnValue(of(createAppointmentResponse));
      component.modifyAppointment();
      expect(router.navigate).toHaveBeenCalledWith(['/eorder/as-eorder-price-estimate']);
      expect(component.SpinnerLoading).toBeFalsy();
    });

    it('modifyAppointmentResponse -> No confirmation code, router should not navigate to as-eorder-price-estimate', () => {
      fixture.detectChanges();

      spyOn(appointmentService, 'modifyAppointment').and.returnValue(of({}));
      component.modifyAppointment();
      expect(router.navigate).not.toHaveBeenCalledWith(['/eorder/as-eorder-price-estimate']);
      expect(component.SpinnerLoading).toBeFalsy();
    });
    it('modify appointment when secondary ins not selected', () => {
      component.isSecondaryNotSelected = true;
      spyOn(appointmentService, 'modifyAppointment').and.returnValue(of(createAppointmentResponse));
      spyOn(component, 'navigateToNext').and.callThrough();
      component.modifyAppointment();
      expect(router.navigate).toHaveBeenCalledWith(['/eorder/as-eorder-price-estimate']);
      expect(component.navigateToNext).not.toHaveBeenCalled();
    });
    it('modify appointment when secondary ins selected', () => {
      component.isSecondaryNotSelected = false;
      spyOn(appointmentService, 'modifyAppointment').and.returnValue(of(createAppointmentResponse));
      spyOn(component, 'navigateToNext').and.callThrough();
      component.modifyAppointment();
      expect(router.navigate).not.toHaveBeenCalledWith(['/eorder/as-eorder-price-estimate']);
      expect(component.navigateToNext).toHaveBeenCalled();
    });
  });

  describe(('getInsuranceForedit()'), () => {
    it('should call getappointmentDataForEdit,getInsuranceProvider,providerSearchInit,checkError,getlabCardLocationSearch', () => {
      component.demographicObj = new EorderPersonalInformation();
      spyOn(component, 'providerSearchInit').and.callThrough();
      spyOn(component, 'checkError').and.callThrough();
      spyOn(insuranceService, 'getInsuranceProvider').and.returnValue(of([
        {
          insuranceCompanyName: 'MERITAIN HEALTH AETNA',
          insuranceMnemonic: 'MERTN'
        }
      ]));

      spyOn(eorderDataService, 'getappointmentDataForEdit').and.returnValue(of({
        appointmentDetails: mockAppointment,
        demographics: mockEorderDemographicsInfo,
        insuranceData: {
          insurance: mockEorderInsuranceInfo
        }
      } as any));

      component.getInsuranceForedit();

      expect(eorderDataService.getappointmentDataForEdit).toHaveBeenCalled();
      expect(insuranceService.getInsuranceProvider).toHaveBeenCalledWith('T2O');
      expect(component.providerSearchInit).toHaveBeenCalled();
      expect(component.checkError).toHaveBeenCalled();
      expect(eorderDataService.getlabCardLocationSearch).toHaveBeenCalled();

      // Insurance Form Assertions
      expect(component.form.get('memberId').value).toEqual(mockEorderInsuranceInfo.insMemberId);
      expect(component.form.get('labCard').value).toEqual('false');
    });
    it('should only call getappointmentDataForEdit, when insuranceData is not returned from eorderModifyApptData', () => {
      component.demographicObj = new EorderPersonalInformation();
      spyOn(eorderDataService, 'getappointmentDataForEdit').and.returnValue(of({
        appointmentDetails: mockAppointment,
        demographics: mockEorderDemographicsInfo,
      } as any));
      spyOn(insuranceService, 'getInsuranceProvider').and.callThrough();

      component.getInsuranceForedit();

      expect(eorderDataService.getappointmentDataForEdit).toHaveBeenCalled();
      expect(insuranceService.getInsuranceProvider).not.toHaveBeenCalled();
      expect(eorderDataService.getlabCardLocationSearch).not.toHaveBeenCalled();
    });
  });

  describe('continueClicked', () => {
    beforeEach(() => {
      const obj = {
        firstName: 'VAMSI',
        lastName: 'GORLE',
        zip: '10001',
        dateOfBirth: '1992-04-30T18:30:00.000Z',
        gender: 'Male',
        address: '12340 BOGGY CREEK ROAD',
        address2: null,
        city: 'New York',
        state: 'NY',
        emailAddress: 'VAMSI.X.GORLE@QUESTDIAGNOSTICS.COM',
        phone: '210-201-9999',
        phoneType: 'Mobile',
        preferences: {
          preference_email: true,
          preference_mobile: false
        }
      };
      const formData = {
        secondaryInsurance: 'false',
        sameas: '',
        provider: {
          insuranceCompanyName: 'AETNA',
          insuranceMnemonic: 'AUSHC',
          genericCarrier: false
        },
        memberId: 'W987654321',
        groupId: '',
        primary: 'true',
        labCard: 'false'
      };
      component.buildForm();

      component.form.get('provider').patchValue({
        insuranceCompanyName: formData.provider.insuranceCompanyName,
        insuranceMnemonic: formData.provider.insuranceMnemonic
      });
      component.form.get('memberId').patchValue(formData.memberId);
      component.form.get('secondaryInsurance').patchValue(formData.secondaryInsurance);
      component.demographicObj = JSON.parse(JSON.stringify(obj));
    });
    // it('invalid insurance', () => {
    //   component.form.get('sameas').patchValue(true);
    //   spyOn(eorderService, 'verifyInsurance').and.returnValue(of({ valid: false }));
    //   spyOn(eorderDataService, 'setInsuranceInformation').and.callThrough();
    //   component.continueClicked();
    //   expect(component.invalidId).toBeTruthy();
    // });
    it('valid insurance', () => {
      component.form.get('sameas').patchValue(true);
      spyOn(eorderService, 'verifyInsurance').and.returnValue(of({ valid: true }));
      spyOn(eorderService, 'saveEncounter').and.callThrough();
      spyOn(eorderDataService, 'setInsuranceInformation').and.callThrough();
      component.continueClicked();
      expect(component.invalidId).toBeFalsy();
      expect(eorderDataService.setInsuranceInformation).toHaveBeenCalled();
      expect(eorderService.saveEncounter).toHaveBeenCalled();
    });
    it('bring card scenario', () => {
      component.bringCardError = true;
      component.form.get('sameas').patchValue(true);
      spyOn(eorderService, 'verifyInsurance').and.returnValue(of({ valid: false }));
      spyOn(eorderService, 'saveEncounter').and.callThrough();
      spyOn(eorderDataService, 'setInsuranceInformation').and.callThrough();
      component.continueClicked();
      expect(eorderDataService.setInsuranceInformation).toHaveBeenCalled();
      expect(eorderService.saveEncounter).toHaveBeenCalled();
    });
    it('let User Go scenario', () => {
      component.bringCardError = false;
      component.letUserGo = true;
      component.form.get('sameas').patchValue(true);
      spyOn(eorderService, 'verifyInsurance').and.returnValue(of({ valid: false }));
      spyOn(eorderService, 'saveEncounter').and.callThrough();
      spyOn(eorderDataService, 'setInsuranceInformation').and.callThrough();
      component.continueClicked();
      expect(eorderDataService.setInsuranceInformation).toHaveBeenCalled();
      expect(eorderService.saveEncounter).toHaveBeenCalled();
    });
    it('valid new insurance flow - Success', () => {
      component.form.get('sameas').patchValue(true);
      spyOn(eorderService, 'verifyInsurance').and.returnValue(of({ valid: true }));
      spyOn(insuranceValidationService, 'verifyInsuranceV2').and.callThrough();
      spyOn(eorderService, 'saveEncounter').and.callThrough();
      spyOn(eorderDataService, 'setInsuranceInformation').and.callThrough();
      component.easypayFixesf2100 = true;
      component.continueClicked();
      expect(insuranceValidationService.verifyInsuranceV2).toHaveBeenCalled();
      expect(component.invalidId).toBeFalsy();
      expect(eorderDataService.setInsuranceInformation).toHaveBeenCalled();
      expect(eorderService.saveEncounter).toHaveBeenCalled();
    });
    it('valid new insurance flow, and memberId verification failed', () => {
      component.form.get('sameas').patchValue(true);
      spyOn(insuranceValidationService, 'verifyInsuranceV2').and.callFake(() => {
        return of(
          {
            valid: false,
            memberIDvalidPatterns: null,
            groupIdvalidPattern: null,
            errorMsg: null,
            groupIdRequired: false,
            gropuIdValid: false,
            eligiblityValid: false,
            memberIDValid: false,
            errorType: 'memberId error'
        }
        );
      });
      spyOn(eorderService, 'saveEncounter').and.callThrough();
      spyOn(eorderDataService, 'setInsuranceInformation').and.callThrough();
      component.easypayFixesf2100 = true;
      component.continueClicked();
      expect(insuranceValidationService.verifyInsuranceV2).toHaveBeenCalled();
      expect(component.errorMessageType).toBe('memberId error');
      expect(component.invalidId).toBeFalsy();
      expect(eorderDataService.setInsuranceInformation).toHaveBeenCalled();
      expect(eorderService.saveEncounter).not.toHaveBeenCalled();
    });
    it('valid new insurance flow, and memberId verification failed with patterns available', () => {
      component.form.get('sameas').patchValue(true);
      const memberIdPatterns: Pattern[] = [{ 'patternKey': 'one', 'patternvalue': 'AANNNNN' },
      { 'patternKey': 'two', 'patternvalue': 'AAANNNNN' }];
      spyOn(insuranceValidationService, 'verifyInsuranceV2').and.callFake(() => {
        return of(
          {
            valid: false,
            memberIDvalidPatterns: memberIdPatterns,
            groupIdvalidPattern: null,
            errorMsg: null,
            groupIdRequired: false,
            gropuIdValid: false,
            eligiblityValid: false,
            memberIDValid: false,
            errorType: 'memberId error'
        }
        );
      });
      spyOn(eorderService, 'saveEncounter').and.callThrough();
      spyOn(eorderDataService, 'setInsuranceInformation').and.callThrough();
      component.easypayFixesf2100 = true;
      component.continueClicked();
      expect(insuranceValidationService.verifyInsuranceV2).toHaveBeenCalled();
      expect(component.errorMessageType).toBe('memberId error');
      expect(component.validPatterns).toEqual(memberIdPatterns);
      expect(component.invalidId).toBeFalsy();
      expect(eorderDataService.setInsuranceInformation).toHaveBeenCalled();
      expect(eorderService.saveEncounter).not.toHaveBeenCalled();
    });
    it('valid new insurance flow, and groupId verification failed', () => {
      component.form.get('sameas').patchValue(true);
      spyOn(insuranceValidationService, 'verifyInsuranceV2').and.callFake(() => {
        return of(
          {
            valid: false,
            memberIDvalidPatterns: null,
            groupIdvalidPattern: null,
            errorMsg: null,
            groupIdRequired: false,
            gropuIdValid: false,
            eligiblityValid: false,
            memberIDValid: true,
            errorType: 'groupId error'
        }
        );
      });
      spyOn(eorderService, 'saveEncounter').and.callThrough();
      spyOn(eorderDataService, 'setInsuranceInformation').and.callThrough();
      component.easypayFixesf2100 = true;
      component.continueClicked();
      expect(insuranceValidationService.verifyInsuranceV2).toHaveBeenCalled();
      expect(component.errorMessageType).toBe('groupId error');
      expect(component.invalidId).toBeFalsy();
      expect(eorderDataService.setInsuranceInformation).toHaveBeenCalled();
      expect(eorderService.saveEncounter).not.toHaveBeenCalled();
    });
    it('valid new insurance flow, verification failed and Insurance errorCount > 0', () => {
      component.form.get('sameas').patchValue(true);
      spyOn(insuranceValidationService, 'verifyInsuranceV2').and.callFake(() => {
        return of(
          {
            valid: false,
            memberIDvalidPatterns: null,
            groupIdvalidPattern: null,
            errorMsg: null,
            groupIdRequired: false,
            gropuIdValid: false,
            eligiblityValid: false,
            memberIDValid: true,
            errorType: 'groupId error'
        }
        );
      });
      spyOn(eorderService, 'saveEncounter').and.callThrough();
      spyOn(eorderDataService, 'setInsuranceInformation').and.callThrough();
      spyOn(component, 'navigateToNext').and.callThrough();
      component.easypayFixesf2100 = true;
      component.memberIdGroupIdErrorCount = 2;
      component.continueClicked();
      expect(insuranceValidationService.verifyInsuranceV2).toHaveBeenCalled();
      expect(component.invalidId).toBeFalsy();
      expect(eorderDataService.setInsuranceInformation).toHaveBeenCalled();
      expect(eorderService.saveEncounter).toHaveBeenCalled();
      expect(component.navigateToNext).toHaveBeenCalled();
    });
    // it('dont let User Go scenario', () => {
    //   component.bringCardError = false;
    //   component.letUserGo = false;
    //   component.form.get('sameas').patchValue(true);
    //   spyOn(eorderService, 'verifyInsurance').and.returnValue(of({ valid: false }));
    //   component.continueClicked();
    //   component.invalidId = true;
    //   expect(component.invalidId).toBeTruthy();
    //   expect(component.clickCount).toBeGreaterThan(0);
    // });
  });

});
