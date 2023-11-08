import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
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
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { mockAutocompletePrediction, MockGoogleMapsService } from 'shared/specs/mocks/mock-google-maps.service';
import { AsEcheckinPersonalInformationComponent } from './as-echeckin-personal-information.component';
const debounceTime = 200;
const mockPredictions = new Array(5).fill(new GoogleAutocompletePrediction());
describe('AsEcheckinPersonalInformationComponent', () => {
  let component: AsEcheckinPersonalInformationComponent;
  let fixture: ComponentFixture<AsEcheckinPersonalInformationComponent>;
  let googleMapsService: GoogleMapsService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsEcheckinPersonalInformationComponent],
      imports: [ReactiveFormsModule,
        FormsModule,
        CustomPipesModule,
        MatAutocompleteModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MockI18nModule,
        MatDatepickerModule,
        MatNativeDateModule
      ],
      providers: [
        { provide: GoogleMapsService, useClass: MockGoogleMapsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsEcheckinPersonalInformationComponent);
    googleMapsService = TestBed.inject(GoogleMapsService);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onInit', () => {
    beforeEach(() => {
      spyOn(component, 'buildForm').and.callThrough();
      spyOn(component, 'addressAutocompleteInit').and.callThrough();
      spyOn(component, 'stateSearchInit').and.callThrough();
      spyOn(component, 'zipCodeValidationInit').and.callThrough();
      component.ngOnInit();
    });
    it('should call buildForm,addressAutocompleteInit', () => {
      expect(component.buildForm).toHaveBeenCalled();
      expect(component.addressAutocompleteInit).toHaveBeenCalled();
      expect(component.stateSearchInit).toHaveBeenCalled();
    });
  });
  describe('buildform()', () => {
    it('should build the form', () => {
      expect(component.personalInfoForm.get('firstName')).toBeTruthy();
      expect(component.personalInfoForm.get('gender')).toBeTruthy();
      expect(component.personalInfoForm.get('address')).toBeTruthy();
      expect(component.personalInfoForm.get('address2')).toBeTruthy();
      expect(component.personalInfoForm.get('city')).toBeTruthy();
      expect(component.personalInfoForm.get('state')).toBeTruthy();
      expect(component.personalInfoForm.get('zip')).toBeTruthy();
      expect(component.personalInfoForm.get('insuranceCheck')).toBeTruthy();
    });
    it('set form to be valid if firstName is valid', () => {
      component.personalInfoForm.get('firstName').setValue('Jhone');
      expect(component.personalInfoForm.get('firstName').invalid).toBeFalsy();
    });
    it('set form to be invalid if firstName is invalid', () => {
      // tslint:disable-next-line: max-line-length
      component.personalInfoForm.get('firstName').setValue('JhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhoneJhone');
      expect(component.personalInfoForm.get('firstName').invalid).toBeTruthy();
    });
    it('set form to be valid if gender is valid', () => {
      component.personalInfoForm.get('gender').setValue('M');
      expect(component.personalInfoForm.get('gender').invalid).toBeFalsy();
    });
    it('set form to be invalid if gender is invalid', () => {
      component.personalInfoForm.get('gender').setValue('');
      expect(component.personalInfoForm.get('gender').invalid).toBeTruthy();
    });
    it('set form to be valid if zip is valid', () => {
      component.personalInfoForm.get('zip').setValue('54009');
      expect(component.personalInfoForm.get('zip').invalid).toBeFalsy();
    });
    it('set form to be invalid if zip is invalid', () => {
      component.personalInfoForm.get('zip').setValue('N');
      expect(component.personalInfoForm.get('zip').invalid).toBeTruthy();
    });
  });
  describe('addressAutocompleteInit()', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });
    describe('google autocomplete searchControl when loading is true', () => {
      beforeEach(() => {
        fixture.detectChanges();
        spyOn(googleMapsService, 'getGoogleAutocomplete').and.callThrough();
        component.addressLoading = true;
        component.personalInfoForm.get('address').patchValue('something');
      });

      it('does not call getGoogleAutocomplete', () => {
        expect(googleMapsService.getGoogleAutocomplete).not.toHaveBeenCalled();
      });
    });
    describe('when loading is false', () => {
      beforeEach(
        fakeAsync(() => {
          component.personalInfoForm.get('city').patchValue('Huntsville');
          component.personalInfoForm.get('state').patchValue('AL');
          component.personalInfoForm.get('zip').patchValue('45040');
          tick(500);
        })
      );
      it(
        'sets options back to an empty array before the request is made',
        fakeAsync(() => {
          fixture.detectChanges();
          spyOn(googleMapsService, 'getGoogleAutocomplete').and.returnValue(of());
          component.options = mockPredictions;
          component.personalInfoForm.get('address').patchValue('something');
          tick(500);
          expect(component.options).toEqual([]);
        })
      );

      it(
        'debounces the input of street address',
        fakeAsync(() => {
          fixture.detectChanges();
          spyOn(googleMapsService, 'getGoogleAutocomplete').and.returnValue(of());
          const sampleAddress = 'newyork';
          const types = ['(regions)', 'address'];
          component.personalInfoForm.get('address').patchValue(sampleAddress);
          fixture.detectChanges();
          tick(500);
          expect(googleMapsService.getGoogleAutocomplete).toHaveBeenCalledTimes(1);
          expect(googleMapsService.getGoogleAutocomplete).toHaveBeenCalledWith(sampleAddress, types);
        })
      );

      it(
        'sets loading to true',
        fakeAsync(() => {
          fixture.detectChanges();
          spyOn(googleMapsService, 'getGoogleAutocomplete').and.returnValue(of());
          component.options = mockPredictions;
          component.personalInfoForm.get('address').patchValue('something');
          tick(500);
          expect(component.addressLoading).toEqual(false);
        })
      );

      describe('successful autocomplete', () => {
        beforeEach(
          fakeAsync(() => {
            spyOn(googleMapsService, 'getGoogleAutocomplete').and.callThrough();
            component.personalInfoForm.get('address').patchValue('something');
            tick(500);
          })
        );

        it('calls getGoogleAutocomplete', () => {
          const types = ['(regions)', 'address'];
          expect(googleMapsService.getGoogleAutocomplete).toHaveBeenCalledWith('something', types);
        });

        it('sets the options to the results', () => {
          expect(component.options).toEqual(mockPredictions);
        });

        it('sets loading to false', () => {
          expect(component.addressLoading).toEqual(false);
        });
      });
    });
  });
  describe('stateSearchInit()', () => {
    beforeEach(() => {
      component.stateSearchInit();
      fixture.detectChanges();
    });
    it('should get no state if input value doesn\'t match the character of statename', () => {
      const searchField: DebugElement = fixture.debugElement.query(By.css('#eCheckin_as_personal_state_txt'));
      searchField.nativeElement.value = 'as';
      searchField.nativeElement.dispatchEvent(new Event('input'));
      expect(component.stateResult.length).toEqual(0);
    });
    it('should empty the state option if no input', () => {
      const searchField: DebugElement = fixture.debugElement.query(By.css('#eCheckin_as_personal_state_txt'));
      searchField.nativeElement.value = '';
      searchField.nativeElement.dispatchEvent(new Event('input'));
      expect(component.stateResult.length).toEqual(52);
    });
  });
  describe('zipCodeValidationInit()', () => {
    beforeEach(() => {
      fakeAsync(() => {
        component.personalInfoForm.get('city').patchValue('Huntsville');
        component.personalInfoForm.get('state').patchValue('AL');
        component.personalInfoForm.get('zip').patchValue('45040');
        tick(debounceTime);
      }),
        component.zipCodeValidationInit();
      fixture.detectChanges();
    });
    it(
      'debounces the input',
      fakeAsync(() => {
        spyOn(googleMapsService, 'getGoogleCityState').and.returnValue(of());
        const sampleZip = '45040';
        component.personalInfoForm.get('zip').patchValue(sampleZip);
        fixture.detectChanges();
        tick(debounceTime);
        expect(googleMapsService.getGoogleCityState).toHaveBeenCalledTimes(1);
        expect(googleMapsService.getGoogleCityState).toHaveBeenCalledWith(sampleZip);
      })
    );
    it(
      'does autofill city and state',
      fakeAsync(() => {
        component.personalInfoForm.get('zip').patchValue('45040');
        fixture.detectChanges();
        tick(debounceTime);
        expect(component.personalInfoForm.get('city').value).toEqual('Huntsville');
        expect(component.personalInfoForm.get('state').value).toEqual('AL');
      })
    );
    it(
      'does not clear city and state if zip code not found',
      fakeAsync(() => {
        spyOn(googleMapsService, 'getGoogleCityState').and.returnValue(of());
        component.personalInfoForm.get('state').patchValue('');
        fixture.detectChanges();
        tick(debounceTime);
      })
    );
  });
  describe('onOptionSelect', () => {
    beforeEach(() => {
      spyOn(googleMapsService, 'getGoogleCityStateZipCode').and.callThrough(); // returnValue(of());
      component.options = [mockAutocompletePrediction];
      component.personalInfoForm.get('address').patchValue('2 peak st, AL, 45040');
      component.onOptionSelect(mockAutocompletePrediction);
      fixture.detectChanges();
    });

    it('calls getGoogleCityStateZipCode', () => {
      expect(googleMapsService.getGoogleCityStateZipCode).toHaveBeenCalledWith('some-id');
    });
    it('sets address values', () => {
      expect(component.personalInfoForm.get('address').value).toEqual('2 peak st');
      expect(component.personalInfoForm.get('state').value).toEqual('AL');
      expect(component.personalInfoForm.get('zip').value).toEqual('45040');

    });
    it('sets state to null if state not in USA', () => {
      const noStateMockAutocompletePrediction = new GoogleAutocompletePrediction();
      noStateMockAutocompletePrediction.description = null;
      component.onOptionSelect(noStateMockAutocompletePrediction);
      expect(component.personalInfoForm.get('state').value).toBeNull();

    });
  });
  describe('goToNext', () => {
    beforeEach(() => {
      component.personalInfoForm.get('insuranceCheck').patchValue(true);
    });
    it('call', () => {
      component.goToNext();
      expect(component.personalInfoForm.get('insuranceCheck').value).toBeTruthy();
    });
  });
});
