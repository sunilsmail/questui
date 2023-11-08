export class ClinicalTrailsSignupRequest {
  firstName: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth: string;
  email: string;
  gender?: string;
  city?: string;
  state?: string;
  zipCode: any;
  country?: string;
  primaryPhoneNumber: string;
  mobilePhoneNumber?: string;
  hipaaAuthorizationDate?: string;
  addressLine1?: string;
  addressLine2?: string;
  empiId?: string;
  source?: string = AppName.MyQuest;
  eSignatureFirstName?: string;
  eSignatureLastName?: string;
  subDateAndTime?: string;
  timeZone?: string;
  action?: string = ActionName.grant;
  channel?: string = AppName.MyQuest;
  hipaaRevocationDate?: string;
  countryDesc?: string;
  stateDesc?: string;
  ethnicityDesc?: string;
  genderDesc?: string;
  raceDesc?: string;
}

export enum AppName {
  MyQuest = 'MyQuest',
  ApptSchedular = 'ApptSchedular',
  Mulesoft = 'Mulesoft'
}

export enum ActionName {
  grant = 'grant'
}

export class HipaaAuthorizationMetricsRequest {
  viewName?: string = ViewName.whoIsVisiting;
  showHipaaDialog: boolean;
  selfAppointment: boolean;
  someoneElse?: boolean;
  hipaaOptin: boolean;
  firstName: string;
  lastName: string;
}



export enum ViewName {
  whoIsVisiting = 'who is visiting',
  reviewDetails = 'review details',
}
