import { TestBed } from '@angular/core/testing';
import { ReasonCategory } from 'shared/models/reason-category';
import { DataService } from './data.service';

const reason = {
  facilityServiceId: 1,
  facilityTestType: 'phlebotomy',
  facilityTestTypeValue: 'Routine Lab(most common)',
  testDesc: 'Select this option if your tests are not one of the prior options.',
  precedence: 1,
  serviceRequestor: null
};

const personal = {
  address1: '',
  address2: '',
  city: '',
  createAccount: '',
  dateOfBirth: '11/11/1999',
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
};

const verifyIdentityData = {
  dob:'12/22/1991',
  lastName: 'hello'
};

const insurance = {
  data: {
    sameas: true,
    provider: {
      insuranceCompanyName: 'aetna',
      insuranceMnemonic: 'string'
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
    labCard: 'true',
    differentPersonalAddress: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: ''
    }
  },
  bringCarderror: null
};

const appointment = {
  data: {
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
  },
  selectedIndex: 1
};

describe('DataService', () => {
  let service: DataService;
  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(DataService);
  });

  it('should return reason data', () => {
    service.setReasonData(reason);
    service.getReasonData().subscribe((reasonData) => {
      expect(service.isInFLow).toBeTruthy();
      expect(reasonData.facilityTestTypeValue).toEqual('Routine Lab(most common)');
    });
  });
  it('should return test data', () => {
    service.setTestsData([{
      facilityServiceId: 5,
      facilityTestType: 'phlebotomy',
      facilityTestTypeValue: 'some',
      testDesc: 'some',
      precedence: 1,
      serviceRequestor: 'some'
    }]);
    service.getTestsData().subscribe((testData: ReasonCategory[]) => {
      expect(testData[0].facilityTestTypeValue).toEqual('some');
    });
  });
  it('should return appointment data', () => {
    service.setappointmentData(appointment);
    service.getappointmentData().subscribe((appointmentData) => {
      expect(service.isInFLow).toBeTruthy();
      expect(appointmentData.data.appointmentTime).toEqual('12:45');
    });
  });
  it('should return personal data', () => {
    service.setPersonalData(personal);
    service.getPersonalData().subscribe((personalData) => {
      expect(service.isInFLow).toBeTruthy();
      expect(personalData.lastName).toEqual('sohel');
    });
  });
  it('should return insurance data', () => {
    service.setInsuranceData(insurance);
    service.getInsuranceData().subscribe((data) => {
      expect(service.isInFLow).toBeTruthy();
      expect(data.data.provider.insuranceCompanyName).toEqual('aetna');
    });
  });
  it('should return account creation data', () => {
    service.setIsQuestAccountCreated(5);
    service.getIsQuestAccountCreated().subscribe((data) => {
      expect(data).toEqual(5);
    });
  });
  it('should return location data', () => {
    service.setUserLocation(5);
    service.getUserLocation().subscribe((data) => {
      expect(data).toEqual(5);
    });
  });
  it('should return findlocation reason data', () => {
    service.setfindLocationReason(5);
    service.getfindLocationReason().subscribe((data) => {
      expect(data).toEqual(5);
    });
  });

  it('should clear all data', () => {
    service.clearAllData();
    service.getfindLocationReason().subscribe((reasonData) => {
      expect(reasonData).toEqual(null);
    });
  });
  it('should return verifyIdentity data', () => {
    service.setVerifyIdentityData(verifyIdentityData);
    service.getVerifyIdentityData().subscribe((verifyData) => {
      expect(verifyData.lastName).toEqual('hello');
      expect(verifyData.dob).toEqual('12/22/1991');
    });
  });
});
