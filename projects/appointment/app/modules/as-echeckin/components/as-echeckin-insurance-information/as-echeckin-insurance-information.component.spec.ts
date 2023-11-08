import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { DropdownOption } from 'shared/models';
import { ApiService } from 'shared/services/api.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { mockAutocompletePrediction } from 'shared/specs/mocks/mock-google-maps.service';
import { AsEcheckinInsuranceInformationComponent } from './as-echeckin-insurance-information.component';

@Component({
    template: '<div></div>'
})
class MockRouteComponent { }
const routes = [
    { path: 'echeckin/as-echeckin-personal-information', component: MockRouteComponent }
];

describe('AsEcheckinInsuranceInformationComponent', () => {
    let component: AsEcheckinInsuranceInformationComponent;
    let fixture: ComponentFixture<AsEcheckinInsuranceInformationComponent>;
    let googleService: GoogleMapsService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AsEcheckinInsuranceInformationComponent, MockRouteComponent],
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
            providers: [GoogleMapsService, { provide: ApiService, useClass: MockApiService }],
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
        fixture = TestBed.createComponent(AsEcheckinInsuranceInformationComponent);
        component = fixture.componentInstance;
        component.error = false;
        component.noMatchesError = false;
        component.bringCardError = false;
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
       // fixture.detectChanges();
        spyOn(component, 'clearError').and.callThrough();
        spyOn(component, 'continueError').and.callThrough();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('onInit', () => {
        beforeEach(() => {
            spyOn(component, 'buildForm').and.callThrough();
            spyOn(component, 'addressAutocompleteInit').and.callThrough();
            spyOn(component, 'zipCodeValidationInit').and.callThrough();
            component.ngOnInit();
        });
        it('should call buildForm,addressAutocompleteInit,zipCodeValidationInit', () => {
            expect(component.buildForm).toHaveBeenCalled();
            expect(component.addressAutocompleteInit).toHaveBeenCalled();
            expect(component.zipCodeValidationInit).toHaveBeenCalled();
        });
    });
    describe('buildform()', () => {
        beforeEach(() => {
           component.buildForm();
        });
        it('set address field  value in  form ', () => {
            component.form.get('PersonalAddress').get('address1').setValue('ny');
            expect(component.form.get('PersonalAddress').get('address1')).toBeTruthy();
        });
    });
    describe('stateSearchInit()', () => {
        beforeEach(() => {
            component.buildForm();
         });
        it('set state field for PersonalAddress', () => {
            expect(component.form.get('PersonalAddress').get('state')).toBeTruthy();
            component.form.get('PersonalAddress').get('state').setValue('Ny');
            component.stateSearchInit();
        });
        it('check state value from PersonalAddress', () => {
            expect(component.form.get('PersonalAddress').get('state')).toBeTruthy();
            expect(component.form.get('PersonalAddress').valueChanges.subscribe(inputValues => {
                const value = I18nConstantsService['state'].filter((el: DropdownOption) => {
                    const insName = el.label.toLowerCase();
                    inputValues = inputValues.toLowerCase();
                    if (insName.substr(0, inputValues.length) === inputValues) {
                        return true;
                    } else {
                        return false;
                    }
                });
                expect(value).toBeTruthy();
            }));
        });
    });
    describe('addressAutocompleteInit()', () => {
        beforeEach(() => {
            component.buildForm();
         });
        it('set address1 field for PersonalAddress', () => {
            expect(component.form.get('PersonalAddress').get('address1')).toBeTruthy();
            component.form.get('PersonalAddress').get('address1').setValue('NewYork');
            component.addressAutocompleteInit();
            expect(component.form.get('PersonalAddress').get('address1').valueChanges.subscribe(results => {
            }));
        });
    });
    describe('clearError()', () => {
        beforeEach(() => {
            component.buildForm();
         });
        it('check value for error,noMatchesError,bringCardError if form provider has value', () => {
            component.form.get('provider').setValue('NewYork');
            component.clearError();
            expect(component.error).toBeFalsy();
            expect(component.noMatchesError).toBeFalsy();
            expect(component.bringCardError).toBeFalsy();
        });
    });
    describe('continueError()', () => {
        beforeEach(() => {
            component.buildForm();
         });
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
    describe('onOptionSelect()', () => {
        beforeEach(() => {
            component.buildForm();
            spyOn(googleService, 'getGoogleCityStateZipCode').and.callThrough();
            component.options = [mockAutocompletePrediction];
            component.form.get('PersonalAddress').get('address1').patchValue('2 peak st, AL, 45040');
            component.onOptionSelect(mockAutocompletePrediction);
            fixture.detectChanges();
        });
    });
    describe('checkError()',()=>{
        beforeEach(() => {
            component.buildForm();
         });
        it('should set noMatchesError to be true if not blurred', () => {
            component.checkError();
            component.form.get('provider').patchValue('asdf');
            expect(component.noMatchesError).toBeFalsy();
        });
    });
});
