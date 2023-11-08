

export class Demographics {
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  phone: string;
}

export class AddressInfo {
  address1: string;
  address2: string;
  city: string;
  zip: string;
  state: string;
}

export class InsuranceFromPrs {
  insuranceProfileId: string;
  insuranceMnemonic: string;
  insuranceType: string;
  insuranceCompanyName: string;
  insuranceMemberId: string;
  effectiveStartYYYYMM: string;
  effectiveEndYYYYMM: string;
  employerName: string;
  insuranceBillType: string;
  insuranceGroup: string;
  insuranceGroupNumber: string;
  activeInd: string;
  relation: string;
  demographics: Demographics;
  addressInfo: AddressInfo;
}

export class AuthUserInsurance {
  primaryInsurance: InsuranceFromPrs;
  secondaryInsurance: InsuranceFromPrs;
}

export class InsuranceBillType {
  providerListToPrsList = new Map();
  prsListToProviderList = new Map();
  constructor() {
    this.providerListToPrsList.set('Private Ins', 'PRVINS');
    this.providerListToPrsList.set('Medicare', 'MEDICARE');
    this.providerListToPrsList.set('Medicaid', 'MEDICAID');

    this.prsListToProviderList.set('PRVINS', 'Private Ins');
    this.prsListToProviderList.set('MEDICARE', 'Medicare');
    this.prsListToProviderList.set('MEDICAID', 'Medicaid');
  }
  //   Medicaid
  //   Patient
  //   Private Ins
  //   Medicare
}
