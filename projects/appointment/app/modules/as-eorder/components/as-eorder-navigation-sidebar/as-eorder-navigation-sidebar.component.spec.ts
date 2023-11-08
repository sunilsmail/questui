import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { AsEorderNavigationSidebarComponent } from './as-eorder-navigation-sidebar.component';

@Component({
  template: '<div></div>'
})
class MockRouteComponent { }
describe('AsEorderNavigationSidebarComponent', () => {
  let component: AsEorderNavigationSidebarComponent;
  let fixture: ComponentFixture<AsEorderNavigationSidebarComponent>;
  let eorderDataService: EorderDataService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsEorderNavigationSidebarComponent, MockRouteComponent],
      imports: [CustomPipesModule, MockI18nModule, RouterTestingModule.withRoutes([
        { path: 'eorder/as-eorder-appt-scheduler', component: MockRouteComponent }
      ])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsEorderNavigationSidebarComponent);
    component = fixture.componentInstance;
    eorderDataService = TestBed.inject(EorderDataService);
    spyOn(eorderDataService, 'getappointmentData').and.returnValue(of({
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
    } as any));
    spyOn(eorderDataService, 'getPersonalInformation').and.returnValue(of(
      {
        address1: '',
        address2: '',
        city: '',
        createAccount: '',
        dateOfBirth: new Date,
        email: 'test@gmail.com',
        firstName: 'test',
        gender: 'male',
        insuranceInfo: 'insurance-no',
        isMobile: 'yes',
        lastName: 'test',
        password: '',
        phone: '2222222222',
        preferences: {
          preference_email: true,
          preference_mobile: true
        },
        state: '',
        termsOfService: false,
        zipCode: ''
      } as any
    ));
    fixture.detectChanges();
  });
  it('should call setblnEditReasonData', () => {
    component.navigate('/eorder/as-eorder-appt-scheduler');
    spyOn(eorderDataService, 'setblnEditReasonData').and.callThrough();
  });
});
