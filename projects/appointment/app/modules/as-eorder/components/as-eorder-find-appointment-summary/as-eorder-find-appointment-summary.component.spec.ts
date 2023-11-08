import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { ApiService } from 'shared/services/api.service';
import { AppointmentService } from 'shared/services/appointment.service';
import { DateService } from 'shared/services/date.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { FindAppointmentService } from 'shared/services/find-appointment.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { MockAppointmentService } from 'shared/specs/mocks/mock-appointment.service';
import { MockEorderService } from 'shared/specs/mocks/mock-eorder.service';
import { MockFindAppointmentService } from 'shared/specs/mocks/mock-find-appointment';
import { MockGenderFieldsService } from 'shared/specs/mocks/mock-gender-fields-service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockPscService } from 'shared/specs/mocks/mock-psc.service';
import { AsEorderFindAppointmentSummaryComponent } from './as-eorder-find-appointment-summary.component';

describe('AsEorderFindAppointmentSummaryComponent', () => {
  let component: AsEorderFindAppointmentSummaryComponent;
  let fixture: ComponentFixture<AsEorderFindAppointmentSummaryComponent>;
  let pscService: PscService;
  let findAppointmentService: FindAppointmentService;
  let appointmentService: AppointmentService;
  let eorderService: EorderService;
  let dateService: DateService;
  let propertiesService: PropertiesService;
  let genderFieldsService: GenderFieldsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsEorderFindAppointmentSummaryComponent ],
      imports: [HttpClientTestingModule,CustomPipesModule,
                RouterTestingModule.withRoutes([]),CustomPipesModule],
      providers: [ { provide: ApiService, useClass: MockApiService },
        { provide: PscService, useClass: MockPscService },
        { provide: FindAppointmentService, useClass: MockFindAppointmentService },
        { provide: AppointmentService, useClass: MockAppointmentService },
        { provide: DateService, useClass: DateService },
        { provide: EorderService, useClass: MockEorderService},
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: GenderFieldsService, useClass: MockGenderFieldsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    pscService = TestBed.inject(PscService);
    findAppointmentService = TestBed.inject(FindAppointmentService);
    appointmentService = TestBed.inject(AppointmentService);
    eorderService = TestBed.inject(EorderService);
    dateService = TestBed.inject(DateService);
    fixture = TestBed.createComponent(AsEorderFindAppointmentSummaryComponent);
    component = fixture.componentInstance;
    propertiesService = TestBed.inject(PropertiesService);
    genderFieldsService = TestBed.inject(GenderFieldsService);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // describe('#navigate', () => {
  //   it('should call navigate', () => {
  //     spyOn(component, 'navigate').and.callThrough();
  //     expect(component.personalData.demographics.dob).toEqual(dateService.toDate(component.personalData.demographics.dob));
  //     component.navigate('/eorder/as-eorder-insurance-information','');
  //     expect(component.navigate).toHaveBeenCalled();
  //   });
  // });
  describe('#printConfirmation', () => {
    it('should call printConfirmation', () => {
      spyOn(component, 'printConfirmation').and.callThrough();
      component.printConfirmation();
      expect(component.printConfirmation).toHaveBeenCalled();
    });
  });
  describe('#getPrice', () => {
    it('should call getPrice', () => {
      spyOn(component, 'getPrice').and.callThrough();
      component.getPrice();
      expect(component.getPrice).toHaveBeenCalled();
    });
  });
});

