import { PatientAddressInfo } from './user-demographic';


export class AppointmentData {
  name?: string;
  appointmentDate: string;
  appointmentTime: string;
  siteCode: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
}
export class CreateAppointmentData {
  channel: string;
  siteCode: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  phoneType: string;
  email: string;
  pushNotification?: object;
  facilityServiceId: Array<any>;
  appointmentDate: string;
  appointmentTime: string;
  walkIn: string;
  emailOptIn: boolean;
  textMessageOptIn: boolean;
  pushNotificationOptIn: boolean;
  labCard: boolean;
  insuranceMemberId: string;
  insuranceGroupNumber: string;
  insuranceCompanyName: string;
  insuranceMnemonic: string;
  insuranceOptOut: boolean;
  insuranceBillType?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  guarantorFirstName?: string;
  guarantorLastName?: string;
  guarantorDateOfBirth?: string;
  guarantorGender?: string;
  guarantorAddress?: string;
  guarantorAddress2?: string;
  guarantorCity?: string;
  guarantorState?: string;
  guarantorZip?: string;
  guarantorPhone?: string;
  guarantorRelationship?: string;
  guarantorOptOut?: boolean;
  primaryInsuranceHolder: boolean | string;
  visitCategory?: string;
  preregAddress?: string;
  preregAddress2?: string;
  preregCity?: string;
  preregState?: string;
  preregZip?: string;
  genderPreference?:string;
  secondaryInsOptOut?: boolean;
  secondaryInsurance?: SecondaryInsuranceResponse;
  patientAddressInfo?: PatientAddressInfo;
  race?: string;
  ethnicity?: string;
  sexualOrientation?: string;
  isValidMemberId?: string;
}

export class SecondaryInsuranceResponse {
  primaryInsuranceHolder: boolean | string;
  secondaryGtrAddress?: SecondaryGtrAddress;
  secondaryGtrDemographics?: SecondaryGtrDemographics;
  secondaryInsMemberId: string;
  secondaryInsGroupNumber: string;
  secondaryInsCompanyName: string;
  secondaryInsMnemonic: string;
  secondaryInsBillType?: string;
  secondaryGtrAddressSame?: boolean;
  isValidMemberId?: string;
}

export class SecondaryInsuranceSaveEncounter{
  secondaryInsurance: SecondaryInsuranceResponse;
  secondaryInsOptOut?: boolean | string;
}
export class SecondaryGtrAddress {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

export class SecondaryGtrDemographics {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  relationship: string;
}

export class CreateAppointmentResponse {
  confirmationCode: string;
  token: string;
  qrCode: string;

}

export class ModifyAppointment {
  channel: string;
  labCard: boolean;
  slot: {
    siteCode: string;
    facilityServiceId: Array<any>;
    appointmentDate: string;
    appointmentTime: string;
    // walkIn: string
  };
  authentication: {
    'confirmationCode': string,
    'phone': string
  };
  notificationPreferences?: {
    emailOptIn?: boolean,
    pushNotificationOptIn: null,
    textMessageOptIn?: boolean
  };
  demographics?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
    phoneType?: string;
    email?: string;
    address?: string,
    address2?: string,
    city?: string,
    state?: string,
    zip?: string,
    genderPreference?: string,
    race?: string,
    ethnicity?: string,
    sexualOrientation?: string,
  };
  preregistration?: {
    isValidMemberId?: any;
    insuranceMemberId: string;
    insuranceGroupNumber: string;
    insuranceCompanyName: string;
    insuranceMnemonic: string;
    insuranceBillType?: string;
    insuranceOptOut: boolean;
    address: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    guarantorFirstName: string;
    guarantorLastName: string;
    guarantorDateOfBirth: string;
    guarantorGender: string;
    guarantorAddress: string;
    guarantorAddress2: string;
    guarantorCity: string;
    guarantorState: string;
    guarantorZip: string;
    guarantorPhone: string;
    guarantorRelationship: string;
    guarantorOptOut: boolean;
    primaryInsuranceHolder: boolean;
    preregAddress?: string,
    preregAddress2?: string,
    preregCity?: string,
    preregState?: string,
    preregZip?: string,
    secondaryInsOptOut?: boolean,
    secondaryInsurance?: SecondaryInsuranceResponse
  };
  transgenderFields?:{
    genderPreference?: string,
    race?: string,
    ethnicity?: string,
    sexualOrientation?: string
  };
}

export class ModifyAppointmentResponse {
  confirmationCode: string;
  token: string;
  qrCode: string;
}

export class InsuranceValidation {
  memberId: string;
  groupId: string;
  insuranceName: string;
}
