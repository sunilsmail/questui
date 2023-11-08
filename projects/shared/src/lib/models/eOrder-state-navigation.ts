export enum editSummaryDetails {
  whoIsVisiting = 'whoIsVisiting',
  locationDateAndTime = 'APPOINTMENT',
  insuranceInfo = 'insuranceInfo',
  reasonForVisit = 'reasonForVisit',
  summaryDetails = 'summaryDetails',
  costEstimate = 'costEstimate',
  cancel = 'cancel',
  pastDate = 'pastDate',
  maxAttemptsFailed = '3authAttempts'
}

export class VerifyIdentityResponse {
  nextAllowed?: any;
  verifyIdentity: string;
  authAttempts: number;
  confirmation?: string;
  stateNavigation?: any;
  enableEasypay?: boolean;
}

export class OpenEordersStateNavigation{
  stateNavigation?: string;
  navigateToPage?: string;
  confirmationCode?: string;
}
