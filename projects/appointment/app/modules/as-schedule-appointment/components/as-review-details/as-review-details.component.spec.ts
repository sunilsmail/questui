import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { InsuranceData } from 'shared/models';
import { AppointmentService } from 'shared/services/appointment.service';
import { ClinicalTrailsService } from 'shared/services/clinical-trails/clinical-trails.service';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { DeeplinkService } from 'shared/services/deeplink.service';
import { InsuranceAddressService } from 'shared/services/insurance-address.service';
import { PropertiesService } from 'shared/services/properties.service';
import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { MockAppointmentService } from 'shared/specs/mocks/mock-appointment.service';
import { MockClinicalTrailsService } from 'shared/specs/mocks/mock-clinical-trails-service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockDeeplinkService } from 'shared/specs/mocks/mock-deeplink.service';
import { MockGenderFieldsService } from 'shared/specs/mocks/mock-gender-fields-service';
import { MockInsuranceAddressService } from 'shared/specs/mocks/mock-insurance-address.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsConfirmationComponent } from '../as-confirmation/as-confirmation.component';
import { AsReviewDetailsComponent } from './as-review-details.component';
const testList = [
  {
    facilityServiceId: 1,
    facilityTestType: 'PHLEBOTOMY',
    facilityTestTypeValue: 'All Other Tests',
    testDesc: 'Select this option for the majority of your testing needs that are not listed below.',
    precedence: 1,
    serviceRequestor: null,
    index: 0,
    skipInsurance: false,
    visitCategory: 'Quest',
  },
];
class MockRouteComponent { }
const routes = [
  { path: 'schedule-appointment/as-confirmation', component: AsConfirmationComponent },
  { path: 'schedule-appointment/as-personal-information', component: MockRouteComponent }
];
describe('AsReviewDetailsComponent', () => {
  let component: AsReviewDetailsComponent;
  let fixture: ComponentFixture<AsReviewDetailsComponent>;
  let debugElement: DebugElement;
  let dataService: DataService;
  let dateService: DateService;
  let appointmentService: AppointmentService;
  let insuranceAddressService: InsuranceAddressService;
  let router: Router;
  let propertiesService: PropertiesService;
  let deeplinkService: DeeplinkService;
  let genderFieldsService: GenderFieldsService;
  let clinicalTrailsService: ClinicalTrailsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsReviewDetailsComponent, AsConfirmationComponent],
      imports: [CustomPipesModule,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        MatDialogModule],
      providers: [
        { provide: AppointmentService, useClass: MockAppointmentService },
        { provide: DataService, useClass: MockDataService },
        { provide: dateService, useClass: DateService },
        { provide: insuranceAddressService, useClass: MockInsuranceAddressService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: DeeplinkService, useClass: MockDeeplinkService },
        SecondaryInsuranceService,
        { provide: GenderFieldsService, useClass: MockGenderFieldsService },
        { provide: ClinicalTrailsService, useClass: MockClinicalTrailsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsReviewDetailsComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    dateService = TestBed.inject(DateService);
    appointmentService = TestBed.inject(AppointmentService);
    insuranceAddressService = TestBed.inject(InsuranceAddressService);
    deeplinkService = TestBed.inject(DeeplinkService);
    propertiesService = TestBed.inject(PropertiesService);
    genderFieldsService = TestBed.inject(GenderFieldsService);
    clinicalTrailsService = TestBed.inject(ClinicalTrailsService);
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
      spyOn(component, 'getReasonData').and.callThrough();
      spyOn(component, 'getTestsData').and.callThrough();
      spyOn(component, 'getAppointmentData').and.callThrough();
      // spyOn(component, 'hideInsuranceInformation').and.callThrough();
      component.ngOnInit();
    });
    // tslint:disable-next-line: max-line-length
    it('should call getInsuranceData,getPersonalData,getReasonData,getTestsData,getappointmentData', () => {
      expect(component.getInsuranceData).toHaveBeenCalled();
      expect(component.getPersonalData).toHaveBeenCalled();
      expect(component.getReasonData).toHaveBeenCalled();
      expect(component.getTestsData).toHaveBeenCalled();
      expect(component.getAppointmentData).toHaveBeenCalled();
      //  expect(component.hideInsuranceInformation).toHaveBeenCalled();
    });

    it('should set insurance value for the form if insurance information is already entered', () => {
      const ins: InsuranceData = {
        bringCarderror: false,
        data: {
          sameas: true,
          provider: {
            insuranceCompanyName: 'test',
            insuranceMnemonic: 'test'
          },
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
          differentPersonalAddress: {
            address1: '',
            address2: '',
            city: '',
            state: '',
            zipCode: ''
          }
        }
      };
      spyOn(dataService, 'getInsuranceData').and.returnValue(of(ins));
      component.ngOnInit();
      expect(component.insuranceData.data.firstName).toEqual('ajay');
    });

    it('should set appointment data if appointment data is already present', () => {
      component.ngOnInit();
      expect(component.appointmentData.address1).toEqual('160 W 26Th St');
    });

    it('should set personal data if personal data is present', () => {
      component.ngOnInit();
      expect(component.personalData).toEqual({
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

    // describe('#hideInsuranceInformation', ()=> {
    //     it('hide the hideInsuranceInfo if facilityServiceId is 1 or 25 or 26 or 6', () => {
    //       dataService.getHideInsuranceInfo().subscribe(data => {
    //           expect(component.hideInsuranceInfo).toEqual(data);
    //       });
    //     });
    // });

    describe('#createAppointment', () => {

      it('should create appointment', () => {
        spyOn(router, 'navigate').and.callThrough();
        spyOn(appointmentService, 'createAppointment').and.callThrough();
        spyOn(clinicalTrailsService, 'logClinicalTrailsMetrics').and.returnValue(of(null));
        component.scheduleAppointment();
        expect(router.navigate).toHaveBeenCalledWith(['/schedule-appointment/as-confirmation', { confirmationCode: 'WERTY' }]);
      });

      /* it('should fail create appointment', () => {
          component.appointmentData.siteCode = null;
          spyOn(appointmentService, 'createAppointment').and.callThrough();
          component.scheduleAppointment();
          expect(component.scheduleAppointment).toThrowError();
          expect(component.blnShowError).toBeTruthy();
          expect(component.neverMindText).toEqual('Start Over');

      }); */
    });

  });

  it('Go to home page while clicking on nevermind button', () => {
    const onClickMock = spyOn(component, 'clearData');
    fixture.detectChanges();
    debugElement.query(By.css('#never-mind-link')).triggerEventHandler('click', null);
    expect(onClickMock).toHaveBeenCalled();
    fixture.detectChanges();
  });

  describe('#navigate', () => {
    const mockUrl = '/schedule-appointment/as-personal-information';
    it('sets the setblnEditReasonData to true', () => {
      spyOn(dataService, 'setblnEditReasonData').and.callThrough();
      component.navigate(mockUrl);
      expect(dataService.setblnEditReasonData).toHaveBeenCalled();
    });
    it('sets the setblnShowLocError to true', () => {
      spyOn(dataService, 'setblnShowLocError').and.callThrough();
      component.navigate(mockUrl);
      expect(dataService.setblnShowLocError).toHaveBeenCalled();
    });
    it('router navigates to as-personal-information page', () => {
      spyOn(router, 'navigate').and.callThrough();
      component.navigate('/schedule-appointment/as-personal-information');
      expect(router.navigate).toHaveBeenCalledWith([mockUrl]);
    });
  });
  describe('#getVisitCategory', () => {
    beforeEach(() => {
      spyOn(component, 'getVisitCategory').and.callThrough();
    });
    it('it should return null', () => {
      expect(component.getVisitCategory()).toBeNull();
    });
    it('it should return value', () => {
      component.testsData = testList;
      expect(component.getVisitCategory()).toEqual('Quest');
    });
  });
});
