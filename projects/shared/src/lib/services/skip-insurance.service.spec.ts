import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { MockAppointmentService } from 'shared/specs/mocks/mock-appointment.service';
import { AppointmentService } from './appointment.service';
import { SkipInsuranceService } from './skip-insurance.service';


describe('SkipInsuranceService', () => {
  let appointmentService: AppointmentService;
  let skipInsuranceService: SkipInsuranceService;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AppointmentService, useClass: MockAppointmentService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    appointmentService = TestBed.inject(AppointmentService);
    skipInsuranceService = TestBed.inject(SkipInsuranceService);
  });
  it('should be created', () => {
    const service: SkipInsuranceService = TestBed.inject(SkipInsuranceService);
    expect(service).toBeTruthy();
  });
});
