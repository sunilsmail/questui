import { DataSource } from '@angular/cdk/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { ReasonCategory } from 'shared/models/reason-category';
import { DataService } from 'shared/services/data.service';
import { DeeplinkService } from 'shared/services/deeplink.service';
import { PropertiesService } from 'shared/services/properties.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockDeeplinkService } from 'shared/specs/mocks/mock-deeplink.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsNavigationSidebarComponent } from './as-navigation-sidebar.component';

@Component({
  template: '<div></div>'
})
class MockRouteComponent { }

describe('AsNavigationSidebarComponent', () => {
  let component: AsNavigationSidebarComponent;
  let fixture: ComponentFixture<AsNavigationSidebarComponent>;
  let dataService: DataService;
  let skipInsuranceService: SkipInsuranceService;
  let propertiesService: PropertiesService;
  let deeplinkService: DeeplinkService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsNavigationSidebarComponent, MockRouteComponent],
      imports: [CustomPipesModule, MockI18nModule, HttpClientTestingModule, RouterTestingModule.withRoutes([
        { path: 'example', component: MockRouteComponent }
      ])],
      providers: [
        { provide: DataSource, useClass: MockDataService },
        { provide: SkipInsuranceService, useClass: SkipInsuranceService },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: DeeplinkService, useClass: MockDeeplinkService },
        SecondaryInsuranceService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsNavigationSidebarComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    skipInsuranceService = TestBed.inject(SkipInsuranceService);
    deeplinkService = TestBed.inject(DeeplinkService);
    propertiesService = TestBed.inject(PropertiesService);

    spyOn(dataService, 'getReasonData').and.returnValue(of(
      {
        facilityServiceId: 3,
        facilityTestTypeValue: 'Employer Drug and Alcohol',
        testDesc: 'Select this option if your employer ordered a drug and alcohol test for you.',
        precedence: 3,
        serviceRequestor: 'EMPLOYER'
      } as ReasonCategory));

    spyOn(dataService, 'getappointmentData').and.returnValue(of(
      {
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
          zip: '10001-6975'
        }
      } as any
    ));

    spyOn(dataService, 'getPersonalData').and.returnValue(of(
      {
        address1: '',
        address2: '',
        city: '',
        createAccount: '',
        dateOfBirth: new Date,
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
          preference_mobile: true
        },
        state: '',
        termsOfService: false,
        zipCode: ''
      }
    ) as any);

    spyOn(dataService, 'getInsuranceData').and.returnValue(of({
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
        differentPersonalAddress: {
          address1: '',
          address2: '',
          city: '',
          state: '',
          zipCode: ''
        }
      }
    }) as any);
    spyOn(dataService, 'setblnEditReasonData').and.callThrough();
    spyOn(dataService, 'setblnShowLocError').and.callThrough();
    spyOn(skipInsuranceService, 'getSkipInsurance').and.callThrough();

    fixture.detectChanges();
  });

  it('should call getReasonData,getappointmentData,getPersonalData,getInsuranceData', () => {
    expect(dataService.getReasonData).toHaveBeenCalled();
    expect(dataService.getappointmentData).toHaveBeenCalled();
    expect(dataService.getPersonalData).toHaveBeenCalled();
    expect(dataService.getInsuranceData).toHaveBeenCalled();
    expect(skipInsuranceService.getSkipInsurance).toHaveBeenCalled();

  });

  it('should set ReasonData', () => {
    expect(component.reasonData.facilityServiceId).toEqual(3);
  });

  it('should call setblnEditReasonData', () => {
    component.navigate('example');
    expect(dataService.setblnEditReasonData).toHaveBeenCalled();
  });
  // it('should call setblnShowLocError', () => {
  //     component.navigate('example');
  //     expect(dataService.setblnShowLocError).toHaveBeenCalled();
  // });
});
