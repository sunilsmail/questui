import { AddressInfo, PatientAddressInfo } from '.';
import { SecondaryInsuranceResponse } from './create-appointment-data';
import { PscDetails, PscLocationAvailability } from './psc';

export class EorderAppointmentData {
    data: EorderAppointment;
    selectedIndex: number;
}

export class EorderAppointment {
    appointmentDate: string;
    appointmentTime: any;
    siteCode: string;
    name: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    phone: number;
    labCard?: string;
    latitude?: number;
    longitude?: number;
}

export class EorderModifyAppointmentData {
    pscDetails: PscDetails;
    pscLocationAvailability: PscLocationAvailability;
    appointmentDetails: EorderAppointmentDetails;
    confirmationCode: string;
    insuranceData?: EorderInsurance;
    demographics?: EorderDemographics;
}

export class EorderAppointmentDetails {
    siteCode: string;
    firstName: string;
    facilityServiceId = [];
    appointmentDate: string;
    appointmentTime: string;
    labCard: boolean;
    qrCode?: string;
}

export class EorderPersonalInformation {
    firstName: string;
    lastName: string;
    zip: string;
    gender: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    zipCode1: string;
    emailAddress: string;
    phone: string;
    phoneType: string;
    preferences: Preferences;
    dob: string;
    validInsurance: string;
    verifyIdentity: string;
    labCardStatus: boolean;
    patientAddressInfo?: PatientAddressInfo;
    genderPreference?: string;
    race?: string;
    ethnicity?: string;
    sexualOrientation?: string;
}

export class Preferences {
    preference_email: boolean;
    preference_mobile: boolean;
}

export class InsuranceProvider {
    insuranceCompanyName: string;
    insuranceMnemonic: string;
}

export class InsuranceVerificationRequest {
    siteCode: string;
    insuranceMnemonic: string;
    insuranceMemberId: string;
    insuranceGroupId: string;
    patientDOB: string;
    patientFirstName: string;
    patientLastName: string;
    serviceDate: string;
}

export class InsuranceVerificationResponse {
    valid: boolean;
}


export class EorderInsuranceInformation {
    insuranceData: {
        sameas: boolean;
        provider: InsuranceProvider;
        memberId: string;
        groupId: string;
        primary: string;
        labCard: string;
        secondaryInsurance?: string;
        PersonalAddress?: {
            address1: string;
            address2: string;
            city: string;
            state: string;
            zipCode: string;
            firstName: string;
            lastName: string;
            dateOfBirth: string;
            gender: string;
            relationship: string;
            phone: string;
        };
        differentPersonalAddress?: {
            address1: string;
            address2: string;
            city: string;
            state: string;
            zipCode: string;
        };
      addressInfo?: AddressInfo;
      primaryInsAddressSame?: boolean;
    };
    isValidMemberId?: boolean;
    bringCarderror: boolean;
}
export class EorderCreateAppointmentData {
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
    sendEmail: string;
    confirmationCode: string;
    secondaryInsOptOut?: boolean;
    secondaryInsurance?: SecondaryInsuranceResponse;
    genderPreference?: string;
    race?: string;
    ethnicity?: string;
    sexualOrientation?: string;
    isValidMemberId?: any;
}
export class EorderCreateAppointmentResponse {
    confirmationCode: string;
    token: string;
    qrCode: string;
}

export class PriceEstimate {
    status: string;
    responseBody: {
        price: number;
    };
}
export class EorderDemographics {
    demographics: Demographics;
    emailNotify: boolean;
    smsNotify: boolean;
}
export class Demographics {
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    phone: string;
    phoneType: string;
    email: string;
    address?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
}
export class EorderInsurance {
    emailNotify: boolean;
    smsNotify: boolean;
    secondaryInsOptOut: boolean | string;
    insurance: {
        eorderValidInsurance: string;
        insCompanyName: string;
        insMemberId: string;
        insMnemonic: string;
        insuranceAddress: string;
        insuranceCity: string;
        insuranceName: string;
        insuranceOptOut: boolean;
        insuranceState: string;
        insuranceZip: string;
        labCard: boolean;
        primary: boolean;
        validInsurance: string;
        insuranceGroupId?: string;
    };
    guarantor: {
        firstName?: any;
        lastName?: any;
        address?: any;
        city?: any;
        state?: any;
        zip?: any;
        phone?: any;
        relationship?: any;
        usePreregAddress: boolean;
        guarantorOptOut: boolean;
        dateOfBirth?: any;
        gender?: any;
        formatedDate?: any;
        address2?: any;
    };
}


export class EorderEasypay {
  applicationId: string;
  payload: string;
  sig: string;
}

export class EorderEasypayStatus {
  responseType: string;
  errorCode: string;
  constructor(type: string, errorCode: string) {
    this.responseType = type;
    this.errorCode = errorCode;
  }
}

export class CostEstimateStatus {
  skipCostEstimate: boolean;
  quotedCost: number;
  type: string;
  enableEasyPay: boolean;
}


export enum EasyPayResponseType {
  successLoading = 'SUCCESS_LOADING_SDK',
  errorLoading = 'ERROR_LOADING_SDK',
  successPayment = 'SUCCESS_PAYMENT',
  errorPayment = 'ERROR_PAYMENT',
  formCompleted = 'FORM_COMPLETED',
  noPayment = 'NO_PAYMENT',
  paymentMethodChange = 'paymentMethodChange'
}

export class EasyPayStatus {
  status: boolean;
  isSkippayment: boolean;
}
