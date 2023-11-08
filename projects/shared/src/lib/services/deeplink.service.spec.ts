import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReasonCategory } from 'shared/models/reason-category';
import { MockAppointmentService } from 'shared/specs/mocks/mock-appointment.service';
import { AppointmentService } from './appointment.service';
import { DeeplinkService } from './deeplink.service';



describe('DeeplinkService', () => {
  const main: ReasonCategory[] =
    [
      {
        'facilityServiceId': 1,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'All Other Tests',
        'testDesc': 'Select this option for the majority of your testing needs that are not listed below.',
        'precedence': 1,
        'serviceRequestor': null,
        'activeInd': true,
        'skipInsurance': false
      },
      {
        'facilityServiceId': 4,
        'facilityTestType': 'Glucose',
        'facilityTestTypeValue': 'Glucose',
        'testDesc': 'Select this option to let us know your specific glucose testing need.',
        'precedence': 2,
        'serviceRequestor': 'GLUCOSE',
        'activeInd': true,
        'skipInsurance': false
      },
      {
        'facilityServiceId': 2,
        'facilityTestType': 'Employer Drug and Alcohol',
        'facilityTestTypeValue': 'Employer Drug and Alcohol',
        'testDesc': 'Select this option if your employer ordered a drug and alcohol test for you.',
        'precedence': 3,
        'serviceRequestor': 'EMPLOYER',
        'activeInd': true,
        'skipInsurance': true
      },
      {
        'activeInd': true,
        'facilityServiceId': 26,
        'facilityTestType': 'COVID INFECTION TEST',
        'facilityTestTypeValue': 'COVID-19 Active Infection',
        'precedence': 8,
        'serviceRequestor': null,
        'skipInsurance': false,
        // tslint:disable-next-line: max-line-length
        'testDesc': 'This swab test detects whether you currently have an active COVID-19 infection. A diagnosis can guide you and your doctor or healthcare provider to make an informed decision about self-isolating to protect your family and friends.',

      }
    ];
  const glucose: ReasonCategory[] =
    [
      {
        'facilityServiceId': 16,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Glucose(most common)',
        'testDesc': 'This is a typical 15-minute draw to determine your blood sugar (glucose) levels.',
        'precedence': 1,
        'serviceRequestor': null,
        'activeInd': true,
        'skipInsurance': false
      },
      {
        'facilityServiceId': 15,
        'facilityTestType': 'GLUCOSE TOLERANCE',
        'facilityTestTypeValue': 'Glucose Tolerance(1-3 hours) ',
        // tslint:disable-next-line: max-line-length
        'testDesc': 'Determines your blood sugar (glucose) levels taken at timed intervals over 1-3 hours to screen for diabetes, prediabetes, and gestational diabetes.',
        'precedence': 2,
        'serviceRequestor': null,
        'activeInd': true,
        'skipInsurance': false
      }
    ];
  const employer: ReasonCategory[] =
    [
      {
        'facilityServiceId': 12,
        'facilityTestType': 'ELECTRONIC CFF',
        'facilityTestTypeValue': 'Electronic Order',
        'testDesc': 'Select this option if you were NOT provided a multi-part paper form for drug testing.',
        'precedence': 1,
        'serviceRequestor': null,
        'activeInd': true,
        'skipInsurance': true
      },
      {
        'facilityServiceId': 18,
        'facilityTestType': 'SAP (NON-DOT) COLLECTIONS',
        'facilityTestTypeValue': 'Urine',
        // tslint:disable-next-line: max-line-length
        'testDesc': 'Detects the presence of drugs using a urine sample. Typically used for pre-employment, random or post-accident testing. Donor provided paper order form.',
        'precedence': 2,
        'serviceRequestor': null,
        'activeInd': true,
        'skipInsurance': true
      }
    ];
  let deeplinkService: DeeplinkService;
  let appointmentService: AppointmentService;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [DeeplinkService,
      { provide: AppointmentService, useClass: MockAppointmentService },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  }));
  beforeEach(() => {
    appointmentService = TestBed.inject(AppointmentService);
    deeplinkService = TestBed.inject(DeeplinkService);
  });
  it('should be created', () => {
    expect(deeplinkService).toBeTruthy();
  });
  describe('#getReasonItems', () => {
    beforeEach(() => {
      spyOn(deeplinkService, 'getReasonItems').and.returnValue(of([main, glucose, employer]));
    });
    it('should call', () => {
      deeplinkService.getReasonItems().subscribe(reasons => {
        expect(reasons.length).toEqual(3);
      });
    });
  });
  describe('#isMultiselectDeeplink', () => {
    it('should call', () => {
      expect(deeplinkService.isMultiselectDeeplink('PHLEBOTOMY,')).toEqual(false);
    });
    it('should call', () => {
      expect(deeplinkService.isMultiselectDeeplink('PHLEBOTOMY,PHLEBOTOMY')).toEqual(false);
    });
    it('should call', () => {
      expect(deeplinkService.isMultiselectDeeplink('PHLEBOTOMY,ELECTRONIC CFF')).toEqual(true);
    });
  });
  describe('#getDeeplinkReason', () => {
    it('should call', () => {
      expect(deeplinkService.getDeeplinkReason('PHLEBOTOMY,')).toEqual('PHLEBOTOMY');
    });
    it('should call', () => {
      expect(deeplinkService.getDeeplinkReason('PHLEBOTOMY,PHLEBOTOMY')).toEqual('PHLEBOTOMY');
    });

  });
});
