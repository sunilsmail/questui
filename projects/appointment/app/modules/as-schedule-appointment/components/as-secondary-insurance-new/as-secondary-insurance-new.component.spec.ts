import { group } from '@angular/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { GoogleAutocompletePrediction, Pattern } from 'shared/models';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { InsuranceValidationService } from 'shared/services/insurance-validation.service';
import { InsuranceService } from 'shared/services/insurance.service';
import { PropertiesService } from 'shared/services/properties.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockAppointmentService } from 'shared/specs/mocks/mock-appointment.service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { mockAutocompletePrediction, MockGoogleMapsService } from 'shared/specs/mocks/mock-google-maps.service';
import { MockInsuranceValidationService } from 'shared/specs/mocks/mock-insurance-validation.service';
import { MockInsuranceService } from 'shared/specs/mocks/mock-insurance.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockSecondaryInsuranceService } from 'shared/specs/mocks/mock-secondary-insurance.service';
import { AsSecondaryInsuranceNewComponent } from './as-secondary-insurance-new.component';


describe('AsSecondaryInsuranceNewComponent', () => {
  let component: AsSecondaryInsuranceNewComponent;
  let fixture: ComponentFixture<AsSecondaryInsuranceNewComponent>;
  let secondaryInsuranceService: SecondaryInsuranceService;
  let insuranceService: InsuranceService;
  let router: Router;
  let dataService: DataService;
  let googleService: GoogleMapsService;
  let appointmentService: AppointmentService;
  let insuranceValidationService: InsuranceValidationService;
  let propertiesService: PropertiesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        CustomPipesModule,
        MockI18nModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule
      ],
      providers: [
        { provide: GoogleMapsService, useClass: MockGoogleMapsService },
        { provide: InsuranceService, useClass: MockInsuranceService },
        { provide: DataService, useClass: MockDataService },
        { provide: SecondaryInsuranceService, useClass: MockSecondaryInsuranceService },
        { provide: AppointmentService, useClass: MockAppointmentService },
        { provide: InsuranceValidationService, useClass: MockInsuranceValidationService },
        { provide: PropertiesService, useClass: MockPropertiesService },
      ],
      declarations: [AsSecondaryInsuranceNewComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AsSecondaryInsuranceNewComponent);
    insuranceService = TestBed.inject(InsuranceService);
    secondaryInsuranceService = TestBed.inject(SecondaryInsuranceService);
    dataService = TestBed.inject(DataService);
    appointmentService = TestBed.inject(AppointmentService);
    propertiesService = TestBed.inject(PropertiesService);
    component = fixture.componentInstance;
    spyOn(router, 'navigate').and.stub();
    googleService = TestBed.inject(GoogleMapsService);
    insuranceValidationService = TestBed.inject(InsuranceValidationService);
    spyOn(dataService, 'getIsQuestAccountCreated').and.callFake(() => {
      return of(
        {
          firstName: 'firstName',
        }
      );
    });
    spyOn(propertiesService, 'getGooglemapsOptimizationF4191').and.callThrough();
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('#buildform', () => {
    beforeEach(() => {
      component.buildForm();
    });
    it('set provider field  value in  form ', () => {
      component.form.get('provider').patchValue('AETNA');
      expect(component.form.get('provider')).toBeTruthy();
    });
    it('set memberId field  value in  form ', () => {
      component.form.get('memberId').patchValue('W987654321');
      expect(component.form.get('memberId')).toBeTruthy();
    });
    it('set groupId field  value in  form ', () => {
      component.form.get('groupId').patchValue('1234');
      expect(component.form.get('groupId')).toBeTruthy();
    });
    it('set isPrimaryInsuranceHolder field  value in  form ', () => {
      component.form.get('isPrimaryInsuranceHolder').patchValue('true');
      expect(component.form.get('isPrimaryInsuranceHolder')).toBeTruthy();
    });
    it('no address1 when primary insurance holder', () => {
      expect(component.form.get('address1')).toBeFalsy();
      expect(component.form.get('address2')).toBeFalsy();
      expect(component.form.get('city')).toBeFalsy();
      expect(component.form.get('state')).toBeFalsy();
      expect(component.form.get('zipCode')).toBeFalsy();
    });
  });
  describe('#handleChange', () => {
    it('when someoneelse selected', () => {
      component.form.get('isPrimaryInsuranceHolder').patchValue('false');
      component.handleChange('false');
      expect(component.gtrSelected).toBe(true);
    });
    it('when someoneelse not selected', () => {
      component.handleChange('true');
      component.form.get('isPrimaryInsuranceHolder').patchValue('true');
      expect(component.gtrSelected).toBe(false);
      fixture.detectChanges();
    });
  });
  describe('#bindForm', () => {
    it('bindform when some one not selected', () => {
      const res = {
        provider: {
          insuranceCompanyName: 'AETNA',
          insuranceMnemonic: 'AUSHC',
          genericCarrier: false
        },
        memberId: 'W987654321',
        groupId: '1234',
        isPrimaryInsuranceHolder: 'true',
        sameas: false
      };
      spyOn(secondaryInsuranceService, 'getInsuranceData').and.returnValue(of(res));
      spyOn(component.form, 'patchValue').and.callThrough();
      component.bindForm();
      expect(component.form.patchValue).toHaveBeenCalledWith(res, { emitEvent: false });
    });
    it('bindform when some one selected', () => {
      const res = {
        provider: {
          insuranceCompanyName: 'AETNA',
          insuranceMnemonic: 'AUSHC',
          genericCarrier: false
        },
        memberId: 'W987654321',
        groupId: '1234',
        isPrimaryInsuranceHolder: 'false',
        address1: '45040 Corte Rosa',
        address2: '',
        city: 'Temecula',
        state: 'CA',
        zipCode: '92592',
        userInfo: {
          firstName: 'firstname',
          lastName: 'lastname',
          dateOfBirth: '1999-12-31T18:30:00.000Z',
          gender: 'Male',
          phone: '2012019999',
          relationship: 'Spouse'
        },
        bringCarderror: null,
        sameas: false
      };
      spyOn(secondaryInsuranceService, 'getInsuranceData').and.returnValue(of(res));
      spyOn(component, 'handleChange').and.callThrough();
      component.bindForm();
      expect(component.handleChange).toHaveBeenCalledWith(res.isPrimaryInsuranceHolder);
    });
  });

  describe('#navigateToNext', () => {
    it('navigate to next', () => {
      component.navigateToNext();
      expect(router.navigate).toHaveBeenCalledWith(['/schedule-appointment/as-review-details']);
    });
  });
  describe('#resetInsurance', () => {
    it('reset insurance', () => {
      spyOn(secondaryInsuranceService, 'setInsuranceData').and.callThrough();
      component.resetInsurance();
      expect(secondaryInsuranceService.setInsuranceData).toHaveBeenCalledWith(null);
    });
  });

  describe('continueClicked', () => {
    beforeEach(() => {
      component.form.get('provider').patchValue({
        insuranceCompanyName: 'AETNA',
        insuranceMnemonic: 'AUSHC',
        genericCarrier: false
      });
      component.continueClicked();
      fixture.detectChanges();
    });
    it('should set the insuranceInfo to sent for verification, and verification Success', () => {
      spyOn(insuranceValidationService, 'verifySecondaryInsuranceV2').and.callThrough();
      spyOn(dataService, 'setInsuranceData').and.callThrough();
      component.continueClicked();
      expect(insuranceValidationService.verifySecondaryInsuranceV2).toHaveBeenCalled();
    });
    it('should set the insuranceInfo to sent for verification, and memberId verification failed', () => {
      spyOn(insuranceValidationService, 'verifySecondaryInsuranceV2').and.callFake(() => {
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
      spyOn(dataService, 'setInsuranceData').and.callThrough();
      component.continueClicked();
      expect(insuranceValidationService.verifySecondaryInsuranceV2).toHaveBeenCalled();
      expect(component.errorMessageType).toBe('memberId error');
    });
    it('should set the insuranceInfo to sent for verification, and groupId verification failed with patterns available', () => {
      const groupIdPatterns: Pattern[] = [{ 'patternKey': 'one', 'patternvalue': 'AAAANNNNN' },
      { 'patternKey': 'two', 'patternvalue': 'AAAAAAAANNNNNNNN' }];
      spyOn(insuranceValidationService, 'verifySecondaryInsuranceV2').and.callFake(() => {
        return of(
          {
            valid: false,
            memberIDvalidPatterns: null,
            groupIdvalidPattern: groupIdPatterns,
            errorMsg: null,
            groupIdRequired: false,
            gropuIdValid: false,
            eligiblityValid: false,
            memberIDValid: true,
            errorType: 'groupId error'
        }
        );
      });
      spyOn(dataService, 'setInsuranceData').and.callThrough();
      component.continueClicked();
      expect(insuranceValidationService.verifySecondaryInsuranceV2).toHaveBeenCalled();
      expect(component.errorMessageType).toBe('groupId error');
      expect(component.validPatterns).toEqual(groupIdPatterns);
    });
    it('should set the insuranceInfo to sent for verification, and groupId verification failed', () => {
      spyOn(insuranceValidationService, 'verifySecondaryInsuranceV2').and.callFake(() => {
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
      spyOn(dataService, 'setInsuranceData').and.callThrough();
      component.continueClicked();
      expect(insuranceValidationService.verifySecondaryInsuranceV2).toHaveBeenCalled();
      expect(component.errorMessageType).toBe('groupId error');
    });
    it('should set the insuranceInfo to sent for verification, verification failed and Insurance errorCount > 0', () => {
      spyOn(insuranceValidationService, 'verifySecondaryInsuranceV2').and.callFake(() => {
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
      spyOn(dataService, 'setInsuranceData').and.callThrough();
      spyOn(component, 'navigateToNext').and.callThrough();
      component.memberIdGroupIdErrorCount = 2;
      component.continueClicked();
      expect(insuranceValidationService.verifySecondaryInsuranceV2).toHaveBeenCalled();
      expect(component.navigateToNext).toHaveBeenCalled();
    });
  });

});
