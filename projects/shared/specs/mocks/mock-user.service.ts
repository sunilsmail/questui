import { of, Observable } from 'rxjs';
import { CreateAccountQuery, TermsAndConditions } from '../../src/lib/models';

/* import { LoginCredentials } from 'shared/models/login-credentials'; */
export const mockTermsAndConditions = new TermsAndConditions();
mockTermsAndConditions.termsText = 'foo';
mockTermsAndConditions.termsVersion = 'bar';
export const mockUserDemographic = {
  prsId: 'zkX95mcwzigV_-1HA5fLTA==',
  firstName: 'Sunils',
  middleInitial: 'K',
  lastName: 'Amujuri',
  dateOfBirth: '1990/07/01',
  sex: 'Male',
  primaryPhone: '2012019999',
  secondaryPhone: null,
  email: 'sunilkumar.x.amujuri@questdiagnostics.com',
  address1: 'Los Angeles Avenue Northeast',
  address2: 'Pawtucket',
  city: 'Atlanta',
  state: 'GA',
  zipCode: '30306'
};

export const mockUserSummaries = {
  data: [
      {
          orderHistory: false,
          prsId: 'zkX95mcwzigV_-1HA5fLTA==',
          'loginId': 'testuser123456',
          'loggedIn': true,
          'firstName': 'Sunils',
          'middleInitial': null,
          'lastName': 'Amujuri',
          'emailConfirmed': true,
          'kbaCompleted': false,
          'hipaaAuth': true,
          'latestAccountTcAccepted': true,
          'latestSubaccountTcAccepted': false,
          'showPhr': false,
          'relationshipVerified': null,
          'subAccountRelationshipStatus': null,
          'docUploaded': false,
          'directAddress': null,
          'lockOut': false
      }
  ]
};
/* export const mockUserDemographic: UserDemographic = {
  prsId: '-99999',
  address1: '123 Main St.',
  address2: 'Appt. 12A',
  city: 'Springfield',
  dateOfBirth: '2000-05-01',
  firstName: 'John',
  lastName: 'Doe',
  middleInitial: 'M',
  primaryPhone: '2125551212',
  // secondaryPhone: undefined,
  secondaryPhone: '2125551213',
  phoneType: 'Mobile',
  sex: 'Male',
  state: 'NY',
  zipCode: '10101-1234',
  email: 'email@example.com'
};
export const mockprsAuthenticationResponse: PrsResponse = { prsId: 'fasdfadsf', prsResponseCode: 0 };

export const mockForgotUsernameResponse: ForgotUsernameResponse = {
  responseCode: '200',
  responseMessage: 'Got Username Successful',
  accountId: null,
  userName: 'testing123 - Last login date: 28-JAN-2019',
  responseMsg: null
};

export const mockResetPasswordResponse: ResetPasswordResponse = {
  prsResponsecode: 0,
  emailSent: false
};

export const mockSendVerificationCodeResponse: SendVerificationCodeResponse = {
  status: 'Success',
  responseCode: '200',
  responseMessage: null,
  emailMatched: false
};

export const mockEmailExistsResponse: EmailExistsResponse = {
  prsId: 'PhK6UouAVkhQb6BWm2a7pg==',
  prsResponsecode: 0
};

export const mockSecurityQuestion = new SecurityQuestion();
mockSecurityQuestion.question = 'question?';
mockSecurityQuestion.questionId = 'foo';

export const mockAdvancedAccessCount = new AdvancedAccessCountWithUser();
mockAdvancedAccessCount.prsId = 'myPrsId';
mockAdvancedAccessCount.count = 2;
mockAdvancedAccessCount.firstName = 'John';



export const mockAccountExistsResponse = new AccountExistsResponse();
mockAccountExistsResponse.push('test@gmail.com');

export const mockResendConfirmationEmailResponse = new ResendConfirmationEmailResponse();
mockResendConfirmationEmailResponse.status = 'success';

export const mockRecoverAccountResponse = new RecoverAccountResponse();
mockRecoverAccountResponse.ResponseCode = 200; */

export class MockUserService {


  isAuthenticated$ = of(false);
  isEmailConfirmSubject$ = of(false);
  userDemographics$ = of(mockUserDemographic);
/*  hasDirectAddress$ = of(true);
  navigateToSignin$ = new BehaviorSubject(false);
  hasNewCustomer$ = new BehaviorSubject(true);
  isActionRequired$ = of(true);

  getUserSummaries(): Observable<UserSummary[]> {
    const userSummary = new UserSummary();
    userSummary.firstName = 'John';
    userSummary.lastName = 'Doe';
    userSummary.directAddress = 'test@myquest.questdiagnostics.com';

    return of([userSummary]);
  }

  getUserDemographics(): Observable<UserDemographic> {
    return of(mockUserDemographic);
  }

  updateUserDemographics(userDemo: UserDemographic): Observable<any> {
    return of(userDemo);
  }

  getAccountSettings(): Observable<AccountSettings> {
    const accountSettings = new AccountSettings();
    const notification = new NotificationGroup();
    const detail = new NotificationDetail();

    detail.notificationId = 'TestId';
    notification.details = [detail];
    accountSettings.notifications = [notification];
    accountSettings.securityQuestions = [mockSecurityQuestion];

    return of(accountSettings);
  }

  updateAccountSettingsNotifications(
    type: string,
    details: { notificationId: string; status: boolean }[]
  ): Observable<any> {
    return of('foo');
  }

  updateAccountSettingsHipaa(isHipaaAuthorized: boolean) {
    return of(null);
  }

  connectPhysician(lastName: string, dob: string, pin: string) {
    return of(null);
  }

  acceptCaregiverInvitation(token: string) {
    return of(null);
  }

  validateCaregiver(token: string): Observable<CaregiverValidationResponse> {
    return of(null);
  }

  isKbaCompleted(): Observable<boolean> {
    return of(false);
  }

  isHipaaAuthorized(): Observable<boolean> {
    return of(false);
  }

  hasActionsRequired(includeHipaa: boolean = true, includeKba: boolean = true): Observable<boolean> {
    return of(true);
  }

  disconnectLinkedDevice(tokenId: string) {
    return of(true);
  }

  getUserSecurityQuestions() {
    return of([mockSecurityQuestion]);
  }

  getSecurityQuestions() {
    return of([mockSecurityQuestion]);
  }

  updateSecurityQuestions(answers: SecurityAnswer[]): Observable<any> {
    return of('foo');
  }

  getUnreadCounts(prsId: string): Observable<UnreadCounts> {
    return of(new UnreadCounts());
  }

  getKbaQuestions(ssn?: string): Observable<KbaQuestionsResponse> {
    return of(new KbaQuestionsResponse());
  }

  sendKbaAnswers(kbaAnswerQuery: KbaAnswerQuery[]): Observable<KbaQuestionsResponse> {
    return of(new KbaQuestionsResponse());
  }

  usernameAvailable(username: string): Observable<boolean> {
    return of(false);
  }

  isDirectAddressAvailable(username: string): Observable<boolean> {
    return of(false);
  }

  createDirectAddress(username: string) {
    return of(true);
  }

  getLoggedInUser(users: Array<UserSummary>): UserSummary {
    const userSummary = new UserSummary();
    userSummary.firstName = 'John';
    userSummary.lastName = 'Doe';
    userSummary.prsId = '-1';
    userSummary.directAddress = 'test@myquest.questdiagnostics.com';

    return userSummary;
  }

  isMarylandUser(): Observable<boolean> {
    return of(false);
  }

  getAdvancedAccessCount(): Observable<AdvancedAccessCountWithUser[]> {
    return of([mockAdvancedAccessCount]);
  }

   */
  getTermsAndConditions(): Observable<TermsAndConditions> {
    return of(mockTermsAndConditions);
  }
  createAccount(body: CreateAccountQuery, captcha: string) {
    return of(true);
  }
/*
  accountExists(data: UserDemographic) {
    return of(mockAccountExistsResponse);
  }

  resendConfirmationEmail(data: SendUpdateEmail) {
    return of(mockResendConfirmationEmailResponse);
  }

  recoverAccount(data: SendUpdateEmail) {
    return of(mockRecoverAccountResponse);
  }

   prsAuthentication(credentials: LoginCredentials) {
    return of(PrsResponse);
  }

  forgotUsername(data: ForgotUsernameModel) {
    return of(mockForgotUsernameResponse);
  }

  emailExists(body: CreateAccountQuery, captcha: string) {
    return of(PrsResponse);
  }

  sendVerificationCode(body) {
    return of(true);
  }

  resetPassword(body) {
    return of(true);
  } */

  getUserDemographics() {
    const data = {
      prsId: 'zkX95mcwzigV_-1HA5fLTA==',
      firstName: 'Sunils',
      middleInitial: 'K',
      lastName: 'Amujuri',
      dateOfBirth: '1990-07-01',
      sex: 'Male',
      primaryPhone: '2012019999',
      secondaryPhone: null,
      email: 'sunilkumar.x.amujuri@questdiagnostics.com',
      address1: 'Los Angeles Avenue Northeast',
      address2: 'Pawtucket',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30306'
    };
    return of(data);
  }

  getUserDetails(){
    const data = {
      prsId: 'zkX95mcwzigV_-1HA5fLTA==',
      firstName: 'Sunils',
      middleInitial: 'K',
      lastName: 'Amujuri',
      dateOfBirth: '1990-07-01',
      sex: 'Male',
      primaryPhone: '2012019999',
      secondaryPhone: null,
      email: 'sunilkumar.x.amujuri@questdiagnostics.com',
      address1: 'Los Angeles Avenue Northeast',
      address2: 'Pawtucket',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30306'
    };
    return of(data);
  }

  getUserdata() {
    const data = {
      prsId: 'zkX95mcwzigV_-1HA5fLTA==',
      firstName: 'Sunils',
      middleInitial: 'K',
      lastName: 'Amujuri',
      dateOfBirth: '1990-07-01',
      sex: 'Male',
      primaryPhone: '2012019999',
      secondaryPhone: null,
      email: 'sunilkumar.x.amujuri@questdiagnostics.com',
      address1: 'Los Angeles Avenue Northeast',
      address2: 'Pawtucket',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30306'
    };
    return of(data);
  }

}
