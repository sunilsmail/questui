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
import { GoogleAutocompletePrediction } from 'shared/models';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { InsuranceService } from 'shared/services/insurance.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockAppointmentService } from 'shared/specs/mocks/mock-appointment.service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { mockAutocompletePrediction, MockGoogleMapsService } from 'shared/specs/mocks/mock-google-maps.service';
import { MockInsuranceService } from 'shared/specs/mocks/mock-insurance.service';
import { MockSecondaryInsuranceService } from 'shared/specs/mocks/mock-secondary-insurance.service';
import { AsSecondaryInsuranceComponent } from './as-secondary-insurance.component';


describe('AsSecondaryInsuranceComponent', () => {
  let component: AsSecondaryInsuranceComponent;
  let fixture: ComponentFixture<AsSecondaryInsuranceComponent>;
  let secondaryInsuranceService: SecondaryInsuranceService;
  let insuranceService: InsuranceService;
  let router: Router;
  let dataService: DataService;
  let googleService: GoogleMapsService;
  let appointmentService: AppointmentService;

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
      ],
      declarations: [AsSecondaryInsuranceComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AsSecondaryInsuranceComponent);
    insuranceService = TestBed.inject(InsuranceService);
    secondaryInsuranceService = TestBed.inject(SecondaryInsuranceService);
    dataService = TestBed.inject(DataService);
    appointmentService = TestBed.inject(AppointmentService);
    component = fixture.componentInstance;
    spyOn(router, 'navigate').and.stub();
    googleService = TestBed.inject(GoogleMapsService);
    spyOn(dataService, 'getIsQuestAccountCreated').and.callFake(() => {
      return of(
        {
          firstName: 'firstName',
        }
      );
    });
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
      spyOn(component, 'addressAutocompleteInit').and.callThrough();
      spyOn(component, 'zipCodeValidationInit').and.callThrough();
      expect(component.form.get('address1')).toBeFalsy();
      expect(component.form.get('address2')).toBeFalsy();
      expect(component.form.get('city')).toBeFalsy();
      expect(component.form.get('state')).toBeFalsy();
      expect(component.form.get('zipCode')).toBeFalsy();
      expect(component.addressAutocompleteInit).not.toHaveBeenCalled();
      expect(component.zipCodeValidationInit).not.toHaveBeenCalled();
    });
  });
  describe('#handleChange', () => {
    it('when someoneelse selected', () => {
      spyOn(secondaryInsuranceService, 'addGtrControls').and.callThrough();
      component.form.get('isPrimaryInsuranceHolder').patchValue('false');
      component.handleChange('false');
      expect(secondaryInsuranceService.addGtrControls).toHaveBeenCalled();
    });
    it('when someoneelse not selected', () => {
      spyOn(component, 'addressAutocompleteInit').and.callThrough();
      spyOn(component, 'zipCodeValidationInit').and.callThrough();
      component.handleChange('true');
      component.form.get('isPrimaryInsuranceHolder').patchValue('true');
      expect(component.form.get('address1')).toBeFalsy();
      fixture.detectChanges();
      expect(component.addressAutocompleteInit).not.toHaveBeenCalled();
      expect(component.zipCodeValidationInit).not.toHaveBeenCalled();
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
        isPrimaryInsuranceHolder: 'true'
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
        bringCarderror: null
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
  describe('#onOptionSelect', () => {
    beforeEach(() => {
      spyOn(googleService, 'getGoogleCityStateZipCode').and.callThrough();
      component.handleChange('false');
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
});
