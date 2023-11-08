export enum ExpiryStatus {
  userConfirmsTestToCompleted = 'userConfirmsTestToCompleted',
  orderTestAlreadyCompleted = 'orderTestAlreadyCompleted',
  orderHasExpired = 'orderHasExpired',
  orderNotFound = 'orderNotFound',
  alreadyAccessedFromAnotherAccount = 'alreadyAccessedFromAnotherAccount',
  emailUnsubscribe = 'emailUnsubscribe',
  emailUnsubscribeFailed = 'emailUnsubscribeFailed'
}

export class ExpiryErrorMessage {
  icon: string;
  title: string;
  line1: string;
  line2: string;
  line3: string;
  hasQuestLoginButton: boolean;
  dialogTopColorClass: string;
}

export class OpenEorders {
  token: string;
  active?: string;
  testOrders?: string;
  doctorFirstName?: string;
  doctorLastName?: string;
}

export class EmailUnsubscribe {
  token: string;
  metricsType: number;
}


export class EmailUnsubscribeResponse {
  responseCode?: number;
  responseMessage?: string;
}
