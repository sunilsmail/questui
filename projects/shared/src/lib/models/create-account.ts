import { SecurityAnswer } from './account-settings';
import { TermsAccepted } from './terms-and-conditions';
import { UserDemographic } from './user-demographic';

export class CreateAccountDetails {
  username: string;
  password: string;
  terms: TermsAccepted;
  securityQuestions: SecurityAnswer[];
}

export class CreateAccountQuery extends UserDemographic {
  username: string;
  password: string;
  terms: TermsAccepted;
  securityQuestions: SecurityAnswer[];
}

export class CreateAccountDetailsWithCaptcha {
  accountDetails: CreateAccountDetails;
  captcha: string;
}

export class CreateAccountPageInfo {
  currentpage: string;
  data: {};
  captchaStr?: string;
}
