export class ReasonCategory {
  facilityServiceId: number;
  facilityTestType: string;
  facilityTestTypeValue: string;
  testDesc: string;
  precedence: number;
  serviceRequestor?: string;
  index?: number;
  skipInsurance?: boolean;
  visitCategory?: string;
  activeInd?: boolean;
  supressDialog?: boolean;
  deeplinkReason?: string;
  btnText?:string;
}

export class ReasonEditState {
  blnedit: boolean;
  route: string;
}
export enum serviceRequestorEnum {
  main = 'MAIN',
  glucose = 'GLUCOSE',
  employer = 'EMPLOYER',
  purchase = 'PURCHASETEST',
}


export const kitCollection = 'grail test';


export class KitCollectionEnabler {
  facilityServiceId: number;
  name: string;
  constructor() {
    this.facilityServiceId = 32;
    this.name = kitCollection;
  }
}
