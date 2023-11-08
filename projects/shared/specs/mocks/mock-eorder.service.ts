import { of, Observable } from 'rxjs';
import { EmailUnsubscribe, EmailUnsubscribeResponse, InsuranceVerificationRequest } from 'shared/models';

export const mockEncounter = {
    preRegEncounterId: 10069718,
    token: 'Ca61J2guvx9yUWylI7GOPClquDhqdsfBbSkfYt-3hXRL2aRdRLEe4p3INhREY3RZyx8oPnxsbYdwfP_OLVyTQA',
    active: 'T',
    emailOutreach: 'F',
    labCardStatus: 'F',
    appointVisitReason: '',
    firstName: 'STINCHCOMB',
    lastName: 'GREGORY',
    city: 'HARRISBURG',
    state: 'PA',
    zip: '17102',
    phone: '7177422299',
    address: '2313 AARON SMITH DRIVE',
    gender: 'M',
    dob: '1964-11-26T18:30:00.000+0000',
    authAttempts: 0,
    verifyIdentity: 'T',
    validInsurance: 'F',
    eOrderValidInsurance: 'F'
};

export const mockTokenInfo = {
    'data': {
        'encounter': {
            'sessionAuthentication': {
                'userVerified': false,
                'failedVerificationAttemptsInSession': 0
            },
            'authentication': {
                'authAttempts': null,
                'nextAllowedVerificationDate': null
            },
            'eOrder': {
                'firstName': 'GREGORY',
                'doctorFirstName': 'ANTONIO',
                'doctorLastName': 'COLMENAR'
            }
        }
    }
};

export const mockPricingInfo = {
  successData: {
    status: 'success',
    responseBody: {
      price: 25
    }
  },
  failureData: {
    status: 'failed',
    responseBody: {
      price: null
    }
  }
};

export const mockEorderDemographicsInfo = {
  demographics: {
      address: '160 W 26Th St',
      address2: null,
      city: 'New York',
      phone: '6466468031',
      phoneType: 'Mobile',
      state: 'NY',
      zip: '10001-6975',
      firstName: 'STINCHCOMB',
      lastName: 'GREGORY',
      gender: 'M',
      dob: '1964-11-26T18:30:00.000+0000',
      email: 'unit.test@aaabbb.com'
  }
};

export const mockEorderInsuranceInfo = {
  insCompanyName: 'AETHNA PARENT',
  insMemberId: '1234567',
  insMnemonic: 'MERTN',
  insuranceAddress: '2313 AARON SMITH DRIVE',
  insuranceCity: 'Charlotte',
  insuranceName: 'MERITAIN HEALTH AETNA',
  insuranceOptOut: false,
  insuranceState: 'NC',
  insuranceZip: '28078',
  labCard: false,
  primary: true,
  validInsurance: true
};
export class MockEorderService {

  getEncounterInfo(token: String) {
    return of(mockTokenInfo);
  }
  verifyIdentity(params) {
    return of(mockEncounter);
  }

  getSampleAlreadyTakenByToken(token: String) {
    const response = { status : 'success'};
    return of(response);
  }
  getPriceEstimate() {
    return of(mockPricingInfo);
  }
  getPricingInfo() {
    return of({
          'status': 'success',
          'responseBody': {
              'price': '25'
          }
      });
  }
  sendEorderMail(params) {
    return of('');
  }
  getBasicEncounterInfo() {
    return of({
      title: 'string',
      appointmentDate: '12/15/2020',
      appointmentTime: '15 : 00',
      siteCode: 'XYZ',
      name: 'QD',
      address1: '2313 AARON SMITH DRIVE',
      address2: 'street-2',
      city: 'HARRISBURG',
      state: 'PA',
      zip: '17102',
      phone: '7177422299',
      confirmationCode: 'ASDFGH'
    });
  }

  saveEncounter(input: any): Observable<any> {
    return of({});
  }

  verifyInsurance(body: InsuranceVerificationRequest) {
    return  of({ valid: true});
  }

  emailUnsubscribe(payload: EmailUnsubscribe): Observable<EmailUnsubscribeResponse> {
    return of({ responseCode: 200, responseMessage: '' });
  }

  getEncounterInfoWithoutCahce(ins: string){
    return of({});
  }
}
