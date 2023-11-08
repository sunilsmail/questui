export class Preferences {
  preference_email: boolean;
  preference_mobile: boolean;
}

export class UserDemographic {
  prsId?: string;
  firstName: string;
  middleInitial: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  primaryPhone: string;
  phoneType?: string;
  secondaryPhone?: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  isQuestUser?: boolean;
  isAuthEditFlow?:boolean;
  genderPreference?: string;
  preferences?: Preferences;
  patientAddressInfo?: PatientAddressInfo;
  race?: string;
  ethnicity?: string;
  sexualOrientation?: string;
}

export class PersonalData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  genderPreference?: string;
  isMobile: string;
  phone: string;
  preferences: {
    preference_email: boolean;
    preference_mobile: boolean;
  };
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  termsOfService: boolean;
  insuranceInfo: string;
  createAccount: string;
  password: string;
  patientAddressInfo?: PatientAddressInfo;
  race?: string;
  ethnicity?: string;
  sexualOrientation?: string;
}

export class PatientAddressInfo {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

export enum editSummaryFromCancelModify {
  editPersonalInfo = 'editPersonalInfo',
  editInsuranceInfo = 'editInsuranceInfo',
  editLocation = 'editLocation',
  editReason = 'editReason'
}
