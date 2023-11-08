export class AccountSettings {
  notifications: NotificationGroup[];
  passwordLastUpdated: string;
  securityQuestions: SecurityQuestion[];
  hipaaAuth: boolean;
  deviceAuthInfo: DeviceAuthInfo[];
  isTextEnabled: boolean;
}

export class NotificationGroup {
  type: string;
  details: NotificationDetail[];
}

export class NotificationDetail {
  notificationId: string;
  name: string;
  status: boolean;
}

export class NotificationUpdate {
  notifications: {
    type: string;
    details: {
      notificationId: string;
      status: boolean;
    }[];
  }[];
}

export class SecurityQuestion {
  questionId: string;
  question: string;
}

export class SecurityAnswer {
  questionId: string;
  questionAnswer: string;
}

export class DeviceAuthInfo {
  partnerName: string;
  linkedDate: string;
  tokenId: string;
}
