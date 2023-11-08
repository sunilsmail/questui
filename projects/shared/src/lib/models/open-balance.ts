export interface PatientName {
  lastName: string;
  firstName: string;
  midInit: string;
}

export interface LastDate {
  year: string;
  month: string;
  day: string;
}

export interface BilledDate {
  year: string;
  month: string;
  day: string;
}

export interface Dob {
  year: string;
  month: string;
  day: string;
}

export interface Address {
  state: string;
  city: string;
  zip: string;
  addr1: string;
  attn: string;
  addr2: string;
}

export interface DateOfService {
  year: string;
  month: string;
  day: string;
}

export interface Aritem {
  patientName: PatientName;
  lastDate: LastDate;
  billedDate: BilledDate;
  dob: Dob;
  address: Address;
  legalEnt: string;
  dateOfService: DateOfService;
  amountDue: string;
  billNbr: string;
  billedAmt: string;
  billStatus: string;
  formCode: string;
  insId: string;
  clientNbr: string;
  billType: string;
  labNbr: string;
  accessionNbr: string;
  fileStatus: string;
  physicianName: string;
  lastRejCd: string;
  searchType: string;
  followupType: string;
  insShortName: string;
  followupCode: string;
  adjCd: string;
  searchMethod: string;
  searchConfidence: string;
  pendingPaymentAmount: string;
}

export interface SearchARResponse {
  respCode: string;
  serviceDenialErrMsg: string;
  message: string;
  lastKeyData: string;
  endPoint: string;
  resp2: string;
  totalMinDue: string;
  serviceDenialEligible: string;
  originalTotalMinDue: string;
  resp: string;
  moreData: string;
  totalPendingPaymentAmount: number;
  originalServiceDenialEligible: string;
  totalOverDue: number;
  aritem: Aritem[];
}

export interface OpenBalanceApiResponse {
  responseCode?: string;
  searchARResponse?: SearchARResponse;
  token?: string;
  responseMessage?: string;
}

export interface OBUiBindControls {
  minimumPayment: number;
  pastDueBalance: number;
  totalBalance: number;
  titleBalance: number;
}

export enum OBEnum {
  minimumPayment = 'minimum-payment',
  pastDueBalance = 'past-due-balance',
  totalBalance = 'total-balance'
}
