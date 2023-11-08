import { AddressInfo, PatientAddressInfo } from '.';
import { SecondaryInsuranceResponse } from './create-appointment-data';
import { PscDetails, PscLocationAvailability, PSC } from './psc';

export class AppointmentData {
    data: Appointment;
    selectedIndex: number;
}

export class Appointment {
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
    facilityServiceId?: [];
    time_zone?: string;
    zoneId?: string;
}

export class ModifyAppointmentData {
    pscDetails: PscDetails;
    pscLocationAvailability: PscLocationAvailability;
    appointmentDetails: AppointmentDetails;
    confirmationCode: string;
    insuranceDetails?: InsuranceDetails;
    guarantor?: Guarantor;
    demographicDetails?: DemographicDetails;
}
export class ModifyCancelAppointmentData {
    pscDetails: PscDetails;
    pscLocationAvailability: PscLocationAvailability;
    appointmentDetails: AppointmentDetails;
    confirmationCode: string;
    insuranceData?: InsuranceData;
    demographicData?: PersonalData;
}

export class PersonalData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
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
  }
  export class InsuranceProvider {
    insuranceCompanyName: string;
    insuranceMnemonic: string;
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
        differentPersonalAddress?: {
            address1?: string;
            address2?: string;
            city?: string;
            state?: string;
            zipCode?: string;
        }
        addressInfo?: AddressInfo;
    };
    bringCarderror: boolean;
}
export class AppointmentDetails {
    siteCode: string;
    firstName: string;
    facilityServiceId = [];
    appointmentDate: string;
    appointmentTime: string;
    labCard: boolean;
    qrCode: string;
    message?: string;
    insuranceDetails?: InsuranceDetails;
    guarantor?: Guarantor;
    demographicDetails?: DemographicDetails;
    skipVerifyIdentity: boolean;
    skipInsurance?: boolean;
    quotedCost?: number;
    zoneId?: string;
    time_zone?: string;
    secondaryInsOptOut?: boolean;
    secondaryInsurance?: SecondaryInsuranceResponse;
    appointmentVisitReason?: string;
    patientAddressInfo?: PatientAddressInfo;
    primaryInsAddressSame?: boolean;
    pscLocationDetail?: PSC;
    actualReasonForVisit = [];
}
export class CreateAppointmentQuery {
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

}
export class CreateAppointmentResponse {
    confirmationCode: string;
    token: string;
    qrCode: string;

}
export interface InsuranceDetails {
    insCompanyName: string;
    insMemberId: string;
    insMnemonic: string;
    validInsurance?: any;
    labCard: boolean;
    insuranceAddress?: any;
    insuranceCity?: any;
    insuranceZip?: any;
    insuranceState?: any;
    insuranceName?: any;
    insuranceOptOut: boolean;
    primary: boolean;
    eorderValidInsurance?: any;
    secondaryInsOptOut?: boolean;
}

export interface Guarantor {
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
}

export interface DemographicDetails {
    firstName: string;
    lastName?: any;
    city: string;
    state: string;
    zip: string;
    gender: string;
    phoneType: string;
    dob: string;
    emailAddress: string;
    address: string;
    address2?: any;
    phone: string;
    labCardStatus: boolean;
    genderPreference?:string;
    patientAddressInfo?: PatientAddressInfo;
    race?: string;
    ethnicity?: string;
    sexualOrientation?: string;
}

