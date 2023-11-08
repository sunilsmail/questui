import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { InsuranceEorderAddressService } from 'shared/services/insurance-eorder-address.service';
import { PropertiesService } from 'shared/services/properties.service';
import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockEorderInsuranceAddressService } from 'shared/specs/mocks/mock-eorder-insurance-address.service';
import { MockGenderFieldsService } from 'shared/specs/mocks/mock-gender-fields-service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsEorderPriceEstimateComponent } from '../as-eorder-price-estimate/as-eorder-price-estimate.component';
import { AsEorderReviewDetailsComponent } from './as-eorder-review-details.component';

class MockRouteComponent { }

const routes = [
  { path: 'eorder/as-eorder-price-estimate', component: AsEorderPriceEstimateComponent },
  { path: 'eorder/as-eorder-personal-information', component: MockRouteComponent }
];

describe('AsEorderReviewDetailsComponent', () => {
  let component: AsEorderReviewDetailsComponent;
  let fixture: ComponentFixture<AsEorderReviewDetailsComponent>;
  let debugElement: DebugElement;
  let eorderDataService: EorderDataService;
  let insuranceEorderAddressService: InsuranceEorderAddressService;
  let router: Router;
  let propertiesService: PropertiesService;
  let genderFieldsService: GenderFieldsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsEorderReviewDetailsComponent, AsEorderPriceEstimateComponent],
      imports: [CustomPipesModule,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,],
      providers: [
        { provide: eorderDataService, useClass: MockDataService },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: InsuranceEorderAddressService, useClass: MockEorderInsuranceAddressService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        SecondaryInsuranceService,
        { provide: GenderFieldsService, useClass: MockGenderFieldsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsEorderReviewDetailsComponent);
    component = fixture.componentInstance;
    eorderDataService = TestBed.inject(EorderDataService);
    insuranceEorderAddressService = TestBed.inject(InsuranceEorderAddressService);
    propertiesService = TestBed.inject(PropertiesService);
    genderFieldsService = TestBed.inject(GenderFieldsService);
    debugElement = fixture.debugElement;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    beforeEach(() => {
      spyOn(component, 'getInsuranceData').and.callThrough();
      spyOn(component, 'getPersonalData').and.callThrough();
      spyOn(component, 'getAppointmentData').and.callThrough();
      component.ngOnInit();
    });
    // tslint:disable-next-line: max-line-length
    it('should call getInsuranceInformation,getPersonalData,getappointmentData', () => {
      expect(component.getInsuranceData).toHaveBeenCalled();
      expect(component.getPersonalData).toHaveBeenCalled();
      expect(component.getAppointmentData).toHaveBeenCalled();
    });

    it('should set insurance value for the form if insurance information is already entered', () => {
      spyOn(eorderDataService, 'getInsuranceInformation').and.returnValue(of(
        {
          insuranceData: {
            sameas: true,
            provider: 'test',
            memberId: 'test',
            groupId: '',
            primary: '',
            labCard: 'false',
            PersonalAddress: {
              address1: '',
              address2: '',
              city: '',
              state: '',
              zipCode: '',
              firstName: 'ajay',
              lastName: 'anireddy',
              dateOfBirth: '11/22/1986',
              gender: 'male',
              phone: '908-332-1767',
              relationship: '',
            },
            differentPersonalAddress: {
              address1: '',
              address2: '',
              city: '',
              state: '',
              zipCode: '',
            }
          }
        } as any
      ));
      component.ngOnInit();
      expect(component.insuranceData.insuranceData.PersonalAddress.firstName).toEqual('ajay');
    });

    it('should set personal data if personal data is present', () => {
      spyOn(eorderDataService, 'getPersonalInformation').and.returnValue(of(
        {
          firstName: 'test',
          lastName: 'user',
          zip: '',
          gender: 'male',
          address1: '',
          address2: '',
          city: '',
          state: '',
          zipCode1: '',
          emailAddress: '',
          preferences: {
            preference_email: true,
            preference_mobile: false
          },
          phone: '',
          phoneType: '',
          dob: '11/22/1986',
          validInsurance: '',
          verifyIdentity: '',
        } as any
      ));
      component.ngOnInit();
      expect(component.personalData.firstName).toEqual('test');
    });
    describe('#navigate', () => {
      const mockUrl = '/eorder/as-eorder-personal-information';
      it('sets the setblnShowLocError to false', () => {
        spyOn(eorderDataService, 'setblnShowLocError').and.callThrough();
        component.navigate(mockUrl);
        expect(eorderDataService.setblnShowLocError).toHaveBeenCalled();
      });
      it('router navigates to as-personal-information page', () => {
        spyOn(router, 'navigate').and.callThrough();
        component.navigate('/eorder/as-eorder-personal-information');
        expect(router.navigate).toHaveBeenCalledWith([mockUrl]);
      });
    });
    describe('#goToPrevious', () => {
      beforeEach(() => {
        spyOn(component, 'goToPrevious').and.callThrough();
        component.goToPrevious();
      });
      it('should call', () => {
        expect(component.goToPrevious).toHaveBeenCalled();
      });
    });
    describe('#showLocations', () => {
      beforeEach(() => {
        spyOn(component, 'showLocations').and.callThrough();
        component.showLocations();
      });
      it('should call', () => {
        expect(component.showLocations).toHaveBeenCalled();
      });
    });
    describe('#getValueByKey', () => {
      beforeEach(() => {
        spyOn(component, 'getValueByKey').and.callThrough();
        component.getValueByKey(null, null, null);
      });
      it('should call', () => {
        expect(component.getValueByKey).toHaveBeenCalled();
      });
    });
  });
});
