import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, TestBed  } from '@angular/core/testing';
import { SecondaryInsuranceData } from 'shared/models';
import { SecondaryInsuranceResponse } from 'shared/models/create-appointment-data';
import { DateService } from './date.service';
import { SecondaryInsuranceService } from './secondary-insurance.service';

describe('SecondaryInsuranceService', () => {
  let dateService: DateService;
  let service: SecondaryInsuranceService;
  const apiResponse: SecondaryInsuranceResponse = {
    primaryInsuranceHolder: false,
    secondaryGtrAddress: {
      address1: 'address1',
      address2: 'address2',
      city: 'city',
      state: 'OH',
      zipCode: '45040'
    },
    secondaryGtrDemographics: {
      firstName: 'firstName',
      lastName: 'lastName',
      dateOfBirth: '01/01/2000',
      gender: 'MALE',
      phone: '2012019999',
      relationship: 'Spouse'
    },
    secondaryInsMemberId: '12345',
    secondaryInsGroupNumber: '2345',
    secondaryInsCompanyName: 'AETNA',
    secondaryInsMnemonic: 'AET',
    isValidMemberId: 'Y'
  };

  const uiRequest: SecondaryInsuranceData = {
    provider: {
      insuranceCompanyName: 'AETNA',
      insuranceMnemonic: 'AET'
    },
    memberId: '12345',
    groupId: '345',
    address1: 'address1',
    address2: 'address2',
    city: 'city',
    state: 'OH',
    zipCode: '45040',
    isPrimaryInsuranceHolder: 'true',
    userInfo: {
      firstName: 'firstName',
      lastName: 'lastName',
      dateOfBirth: '01/01/2000',
      gender: 'MALE',
      phone: '2012019999',
      relationship: 'Spouse'
    },
    bringCarderror: false,
    isValidMemberId: true
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        DateService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    dateService = TestBed.inject(DateService);
    service = TestBed.inject(SecondaryInsuranceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getPhoneNumber', () => {
    it('valid number', () => {
      expect(service.getPhoneNumber('201-201-9999').length).toEqual(10);
    });
    it('invalid number', () => {
      expect(service.getPhoneNumber('2012019999').length).toEqual(10);
    });
  });

  describe('#getUserInfoFiledsForUi', () => {
    it('user info fields for ui', () => {
      const uiReq = {
        firstName: 'firstName',
        lastName: 'lastName',
        dateOfBirth: '01/01/2000',
        gender: 'MALE',
        phone: '2012019999',
        relationship: 'Spouse'
      };
      expect(service.getUserInfoFiledsForUi(apiResponse)).toEqual(uiReq);
    });
    it('when empty object return null', () => {
      const uiReq = {
        firstName: null,
        lastName: null,
        dateOfBirth: null,
        gender: null,
        phone: null,
        relationship: null
      };
      expect(service.getUserInfoFiledsForUi(null)).toEqual(uiReq);
    });
  });

  describe('#getAddressFiledsForUi', () => {
    it('user info fields for ui', () => {
      const uiReq = {
        address1: 'address1',
        address2: 'address2',
        city: 'city',
        state: 'OH',
        zipCode: '45040'
      };
      expect(service.getAddressFiledsForUi(apiResponse)).toEqual(uiReq);
    });

    it('when empty object return null', () => {
      const uiReq = {
        address1: null,
        address2: null,
        city: null,
        state: null,
        zipCode: null,
      };
      expect(service.getAddressFiledsForUi(null)).toEqual(uiReq);
    });
  });

  describe('#formatSecondaryInsuranceForControls', () => {
    it('when some else not selected ui fields', () => {
      const jsonReq = JSON.parse(JSON.stringify(apiResponse));
      jsonReq.primaryInsuranceHolder = true;
      const uiReq = {
        isPrimaryInsuranceHolder: 'true',
        memberId: '12345',
        groupId: '2345',
        provider: {
          insuranceCompanyName: 'AETNA',
          insuranceMnemonic: 'AET'
        }
      };
      expect(service.formatSecondaryInsuranceForControls(jsonReq)).toEqual(uiReq);
    });
    it('when some else selected and ui fields format', () => {
      const uiReq = {
        isPrimaryInsuranceHolder: 'false',
        memberId: '12345',
        groupId: '2345',
        provider: {
          insuranceCompanyName: 'AETNA',
          insuranceMnemonic: 'AET'
        },
        address1: 'address1',
        address2: 'address2',
        city: 'city',
        state: 'OH',
        zipCode: '45040',
        userInfo: {
          firstName: 'firstName',
          lastName: 'lastName',
          dateOfBirth: '01/01/2000',
          gender: 'MALE',
          phone: '2012019999',
          relationship: 'Spouse'
        }
      };
      expect(service.formatSecondaryInsuranceForControls(apiResponse)).toEqual(uiReq);
    });
  });

  describe('#getDemographics demographics fields mapping from UI to API', () => {
    it('valid object', () => {
      const req = {
        firstName: 'firstName',
        lastName: 'lastName',
        dateOfBirth: '01/01/2000',
        gender: 'MALE',
        phone: '2012019999',
        relationship: 'Spouse'
      };
      const res = {
        firstName: 'firstName',
        lastName: 'lastName',
        dateOfBirth: '2000-01-01',
        gender: 'MALE',
        phone: '2012019999',
        relationship: 'Spouse'
      };
      expect(service.getDemographics(req)).toEqual(res);
    });

    it('when empty object return null', () => {
      expect(service.getDemographics(null)).toEqual(null);
    });
  });

  describe('#getAddress address fields mapping from UI to API', () => {
    it('valid object', () => {
      const uiRes = {
        address1: 'address1',
        address2: 'address2',
        city: 'city',
        state: 'OH',
        zipCode: '45040'
      };
      expect(service.getAddress(uiRequest)).toEqual(uiRes);
    });
    it('when empty object return null', () => {
      expect(service.getAddress(null)).toEqual(null);
    });
  });

  describe('#formatSecondaryInsurance', () => {
    it('when some one else not selected', () => {
      const uiRes = {
        primaryInsuranceHolder: true,
        secondaryInsMemberId: '12345',
        secondaryInsGroupNumber: '345',
        secondaryInsCompanyName: 'AETNA',
        secondaryInsMnemonic: 'AET',
        secondaryInsBillType: null,
        isValidMemberId: 'Y'
      };
      expect(service.formatSecondaryInsuranceToApiRequest(uiRequest)).toEqual(uiRes);
    });
    it('when some one else selected', () => {
      const req = JSON.parse(JSON.stringify(uiRequest));
      req.isPrimaryInsuranceHolder = 'false';
      const uiRes = {
        primaryInsuranceHolder: false,
        secondaryInsMemberId: '12345',
        secondaryInsGroupNumber: '345',
        secondaryInsCompanyName: 'AETNA',
        secondaryInsMnemonic: 'AET',
        secondaryInsBillType: null,
        isValidMemberId: 'Y',
        secondaryGtrAddress: {
          address1: 'address1',
          address2: 'address2',
          city: 'city',
          state: 'OH',
          zipCode: '45040'
        },
        secondaryGtrDemographics: {
          firstName: 'firstName',
          lastName: 'lastName',
          dateOfBirth: '2000-01-01',
          gender: 'MALE',
          phone: '2012019999',
          relationship: 'Spouse'
        }
      };
      expect(service.formatSecondaryInsuranceToApiRequest(req)).toEqual(uiRes);
    });
  });

});
