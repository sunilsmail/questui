import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { fakeAsync, tick, waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { GoogleAutocompletePrediction } from 'shared/models';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { mockAutocompletePrediction, MockGoogleMapsService } from 'shared/specs/mocks/mock-google-maps.service';
import { AsEorderAddressComponent } from './as-eorder-address.component';
const debounceTime = 200;

describe('', () => {
  let component: AsEorderAddressComponent;
  let fixture: ComponentFixture<AsEorderAddressComponent>;
  let router: Router;
  let googleService: GoogleMapsService;

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
      ],
      declarations: [AsEorderAddressComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AsEorderAddressComponent);
    component = fixture.componentInstance;
    spyOn(router, 'navigate').and.stub();
    googleService = TestBed.inject(GoogleMapsService);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('init', () => {
    beforeEach(() => {
      spyOn(component, 'buildForm').and.callThrough();
      spyOn(component, 'addressAutocompleteInit').and.callThrough();
      spyOn(component, 'zipCodeValidationInit').and.callThrough();
      spyOn(component, 'stateSearchInit').and.callThrough();
      component.init();
    });
    it('should call buildForm,addressAutocompleteInit,zipCodeValidationInit,stateSearchInit', () => {
      expect(component.buildForm).toHaveBeenCalled();
      expect(component.addressAutocompleteInit).toHaveBeenCalled();
      expect(component.zipCodeValidationInit).toHaveBeenCalled();
      expect(component.stateSearchInit).toHaveBeenCalled();

    });
  });
  describe('#buildform', () => {
    beforeEach(() => {
      component.buildForm();
    });
    it('set address1 field  value in  form ', () => {
      component.addressForm.get('address1').setValue('280 Dobbs Ferry Rd');
      expect(component.addressForm.get('address1')).toBeTruthy();
    });
    it('set address2 field  value in  form ', () => {
      component.addressForm.get('address2').setValue('Sprain Brook Medical Center');
      expect(component.addressForm.get('address2')).toBeTruthy();
    });
    it('set city field  value in  form ', () => {
      component.addressForm.get('city').setValue('White Plains');
      expect(component.addressForm.get('city')).toBeTruthy();
    });
    it('set state field  value in  form ', () => {
      component.addressForm.get('state').setValue('NY');
      expect(component.addressForm.get('state')).toBeTruthy();
    });
    it('set zipCode field  value in  form ', () => {
      component.addressForm.get('zipCode').setValue('10607-1900');
      expect(component.addressForm.get('zipCode')).toBeTruthy();
    });
  });

  describe('addressAutocompleteInit()', () => {
    beforeEach(() => {
      component.buildForm();
    });
    it('set address1 field for addressForm', () => {
      expect(component.addressForm.get('address1')).toBeTruthy();
      component.addressForm.get('address1').setValue('NewYork');
      component.addressAutocompleteInit();
    });
    it('should call getFilterResult', () => {
      const value = 'New Haven';
      spyOn(component, 'getFilterResult').and.callThrough();
      component.getFilterResult(value);
      expect(component.getFilterResult).toHaveBeenCalled();
    });
  });
  describe('zipCodeValidationInit()', () => {
    beforeEach(() => {
      fakeAsync(() => {
        component.addressForm.get('city').patchValue('Huntsville');
        component.addressForm.get('state').patchValue('AL');
        component.addressForm.get('zip').patchValue('45040');
      }),
      component.disableCityAutoComplete = false;
      component.zipCodeValidationInit();
      fixture.detectChanges();
    });
    it(
      'debounces the input',
      fakeAsync(() => {
        spyOn(googleService, 'getGoogleCityState').and.returnValue(of());
        const sampleZip = '45040';
        component.addressForm.get('zipCode').patchValue(sampleZip);
        fixture.detectChanges();
        tick(debounceTime);
        expect(googleService.getGoogleCityState).toHaveBeenCalled();
        expect(googleService.getGoogleCityState).toHaveBeenCalledWith(sampleZip);
      })
    );
    it(
      'does autofill city and state',
      fakeAsync(() => {
        component.addressForm.get('zipCode').patchValue('45040');
        fixture.detectChanges();
        tick(debounceTime);
        expect(component.addressForm.get('city').value).toEqual('Huntsville');
        expect(component.addressForm.get('state').value).toEqual('AL');
      })
    );
    it('should call checkStateZipValidation if region end multi cities with same zipcode checking', () => {
      const response = {
        city: 'Puerto Real',
        state: 'PR',
      };
      spyOn(component, 'checkStateZipValidation').and.callThrough();
      component.checkStateZipValidation(response);
      expect(component.checkStateZipValidation).toHaveBeenCalled();
    });
  });

  describe('#onOptionSelect', () => {
    beforeEach(() => {
      spyOn(googleService, 'getGoogleCityStateZipCode').and.callThrough();
      component.options = [mockAutocompletePrediction];
      component.addressForm.get('address1').patchValue('2 peak st, AL, 45040');
      component.onOptionSelect(mockAutocompletePrediction);
      fixture.detectChanges();
    });

    it('calls getGoogleCityStateZipCode', () => {
      expect(googleService.getGoogleCityStateZipCode).toHaveBeenCalledWith('some-id');
    });
    it('sets address values', () => {
      expect(component.addressForm.get('address1').value).toEqual('2 peak st');
      expect(component.addressForm.get('state').value).toEqual('AL');
      expect(component.addressForm.get('zipCode').value).toEqual('45040');
    });
    it('sets state to null if state not in USA', () => {
      const noStateMockAutocompletePrediction = new GoogleAutocompletePrediction();
      noStateMockAutocompletePrediction.description = null;
      component.onOptionSelect(noStateMockAutocompletePrediction);
      expect(component.addressForm.get('state').value).toBeNull();
    });
  });
  describe('stateSearchInit()', () => {
    beforeEach(() => {
      component.stateSearchInit();
      fixture.detectChanges();
    });
    it('should get no state if input value doesn\'t match the character of statename', () => {
      const searchField: DebugElement = fixture.debugElement.query(By.css('#as_insurance_state_txt'));
      searchField.nativeElement.value = 'as';
      searchField.nativeElement.dispatchEvent(new Event('input'));
      expect(component.stateResult.length).toEqual(0);
    });

    it('should empty the state option if no input', () => {
      const searchField: DebugElement = fixture.debugElement.query(By.css('#as_insurance_state_txt'));
      searchField.nativeElement.value = '';
      searchField.nativeElement.dispatchEvent(new Event('input'));
      expect(component.stateResult.length).toEqual(52);
    });
  });

  describe('onKeyUp()', () => {
    it('should set disableCityAutoComplete to false', () => {
      component.onKeyup();
      expect(component.disableCityAutoComplete).toBeFalsy();
    });
  });

  describe('getFilterResult()', () => {
    it('should call getGoogleAutocomplete', () => {
      spyOn(googleService, 'getGoogleAutocomplete').and.callThrough();
    });
    it('should set addressLoading to false', () => {
      expect(component.addressLoading).toBeFalsy();
    });
  });
});
