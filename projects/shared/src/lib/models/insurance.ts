export class InsuranceProvider {
  insuranceCompanyName: string;
  insuranceMnemonic: string;
  billType?: string;
}

export class InsuranceVerificationRequest {
  siteCode?: string;
  insuranceMnemonic: string;
  insuranceMemberId: string;
  insuranceGroupId: string;
  patientDOB?: string;
  patientFirstName?: string;
  patientLastName?: string;
  serviceDate?: string;
}

export class SecondaryInsurance {
  insuranceMnemonic: string;
  insuranceMemberId: string;
  insuranceGroupId: string;
}

export class InsuranceVerificationResponse {
  valid: boolean;
}


export class InsuranceData {
  data: {
    sameas: boolean;
    provider: InsuranceProvider;
    memberId: string;
    groupId: string;
    relationship: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    isPrimaryInsuranceHolder: boolean | string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    labCard: string;
    secondaryInsurance?: string;
    differentPersonalAddress?: {
      address1?: string;
      address2?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    },
    addressInfo?: AddressInfo;

  };
  isValidMemberId?: boolean;
  bringCarderror: boolean;
}

export class AddressInfo {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

export class SecondaryInsuranceData {
  provider: InsuranceProvider;
  memberId: string;
  groupId: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isPrimaryInsuranceHolder?: boolean | string;
  userInfo?: GtrDemographics;
  bringCarderror?: boolean;
  addressInfo?: AddressInfo;
  sameas?: boolean;
  isValidMemberId?: boolean;
}
export class GtrDemographics {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  relationship: string;
}


export interface Pattern {
  patternKey: string;
  patternvalue: string;
}

export interface InsuranceVerificationResponseVersion2 {
  valid: boolean;
  memberIDvalidPatterns?: Pattern[];
  groupIdvalidPattern?: Pattern[];
  errorMsg?: string;
  groupIdRequired?: boolean;
  memberIDValid?: boolean;
  gropuIdValid?: boolean;
  eligiblityValid?: boolean;
  errorType?: string;
}

export enum InsuranceError {
  noError = 'noError',
  memberIdError = 'memberId error',
  groupIdRequired = 'groupId required',
  groupIdError = 'groupId error',
  insError = 'insurance error',
  eligiblityError = 'eligiblity error',
}
