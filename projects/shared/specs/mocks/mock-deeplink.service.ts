import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ReasonCategory } from 'shared/models/reason-category';

@Injectable({
  providedIn: 'root'
})
export class MockDeeplinkService {
  main: ReasonCategory[] =
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
  glucose: ReasonCategory[] =
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
  employer: ReasonCategory[] =
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
  constructor() { }
  getReasonItems() {
    return of([this.main, this.glucose, this.employer]);
  }
  isMultiselectDeeplink(value: string): boolean {
    return true;
  }
  getDeeplinkReason(value: string): string {
    return value;
  }
  setFlagFindLocationDisableBackArrow (data: boolean) { }
  getFlagFindLocationDisableBackArrow() {
    return of(true);
  }
  setFlgFindLocationDetailDisableBackArrow (data: boolean) { }
  getFlagFindLocationDetailDisableBackArrow() {
    return of(true);
  }
  setFlagFordisableReason (data: boolean) { }
  getFlagFordisableReason() {
    return of(true);
  }
}
