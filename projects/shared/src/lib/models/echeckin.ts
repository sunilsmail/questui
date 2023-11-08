
export class EcheckinPersonalInformation {
    firstName: string;
    gender: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    insuranceCheck: boolean;
}

export class InsuranceProvider {
    insuranceCompanyName: string;
    insuranceMnemonic: string;
}
export class EcheckinInsuranceInformation {
    insuranceData: {
        sameas: boolean;
        provider: InsuranceProvider;
        memberId: string;
        groupId: string;
        relationship: string;
        address1: string;
        address2: string;
        city: string;
        state: string;
        zipCode: string;
        primary: boolean;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        gender: string;
        phone: string;
        labCard: string;
    };
    bringCarderror: boolean;
}
