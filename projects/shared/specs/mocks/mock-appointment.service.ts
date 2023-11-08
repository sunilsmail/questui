import { of, Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { CreateAppointmentData } from 'shared/models/create-appointment-data';
import { ReasonCategory } from '../../src/lib/models/reason-category';

const reason = new ReasonCategory();
reason.facilityServiceId = 1;
reason.facilityTestTypeValue = 'All Other Tests';
reason.testDesc = 'Select this option if your tests are not one of the prior options.';
reason.precedence = 1;
reason.serviceRequestor = null;
reason.skipInsurance = false;
reason.facilityTestType = null;
reason.index = null;

const reasonList = [reason];
export const mockReason = reason;
reason.serviceRequestor = '2';
export const mockReasonWithServiceRequestor = reason;

export const mockAppointment = {
  address1: '160 W 26Th St',
  address2: null,
  appointmentDate: '2019-10-24',
  appointmentTime: '12:45',
  city: 'New York',
  name: 'Quest Diagnostics - NYC-26th St PSC - Employer Drug Testing Not Offered',
  phone: 6466468031,
  siteCode: 'T2O',
  state: 'NY',
  zip: '10001-6975',
  labCard: 'true'
};

export const mockTestsList = [
  {
    facilityServiceId: 7,
    facilityTestType: 'phlebotomy',
    facilityTestTypeValue: 'Urine Drug Test Electronic',
    testDesc:
      // tslint:disable-next-line: max-line-length
      'Detects the presence of drugs using a urine sample. Typically used for pre-employment,random or post-accident testing. Order placed electronically by employer.',
    facServiceId: 'ELECTRONIC CFF',
    timeTradeTestingId: 'drug',
    precedence: 1,
    serviceRequestor: null,
    h20TestingId: '2'
  },
  {
    facilityServiceId: 8,
    facilityTestType: 'phlebotomy',
    facilityTestTypeValue: 'Urine Drug Test Paper',
    testDesc:
      // tslint:disable-next-line: max-line-length
      'Detects the presence of drugs using a urine sample. Typically used for pre-employment,random or post-accident testing. Donor provided paper order form.',
    facServiceId: 'SAP (NON-DOT) COLLECTIONS',
    timeTradeTestingId: 'drug',
    precedence: 2,
    serviceRequestor: null,
    h20TestingId: '2'
  }
];

export const createAppointmentResponse = {
  confirmationCode: 'WERTY',
  token: 'asdfsadf',
  qrCode: 'asdfasdf'
};

export const mockReasonList = [...reasonList];

export class MockAppointmentService {
  /*  getAppointmentDetail(id: string): Observable<Appointment> {
      return of(appointmentList.find(value => value.appointmentId === id));
    } */

  getReasons(): Observable<ReasonCategory[]> {
    return of(mockReasonList);
  }
  createAppointment(body: CreateAppointmentData) {
    return body.siteCode ? of(createAppointmentResponse) : throwError('error');
  }
  getSkipInsurance(category: String, selectedCategory?: ReasonCategory, progData?: ReasonCategory): boolean {
    if (category === 'PURCHASETEST') {
      return selectedCategory ? selectedCategory.skipInsurance : false;
    }
    return progData ? progData.skipInsurance : false;
  }
  getVisitCategory(category: string): string {
    if (category === 'PURCHASETEST') {
      return 'QuestDirect';
    }
    return null;
  }
}
