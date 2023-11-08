import { of, Observable } from 'rxjs';
import { UiProperties } from 'shared/models/ui-properties';

const uiProperties = new UiProperties();
uiProperties.scheduleAppointmentLink = 'appointments.com';
uiProperties.modifyAppointmentLink = 'appointments.com?confirmationcode=';
uiProperties.billingLink = 'billing.com';
uiProperties.createAccountLink = 'account.com';
uiProperties.googleMapKey = 'map-key';
uiProperties.googleTagManagerKey = 'manager-key';
uiProperties.pscLocationUrl = 'psc-location.com';
uiProperties.myquestSite = 'myquest.com';
uiProperties.citSite = 'cit.com';
uiProperties.citFaqs = 'citfaq.com';
uiProperties.casLoginUrl = 'cas.com';
uiProperties.casForgotusernameExecution = 'forgot-username-execution';
uiProperties.myquestFaqs = 'myquestfaq.com';
uiProperties.appointmentLink = 'appointment-link.com';
uiProperties.preregistrationLink = 'prereg-link.com';
uiProperties.directAddressDomainName = 'domain-name.com';
uiProperties.idleTimeOut = 20;
uiProperties.idleTimeOutWarning = 15;
uiProperties.chatbotEnabled = 'true';
uiProperties.googleApiDelayInterval = 500;
uiProperties.care360DomainName = 'care-domain-name';
uiProperties.chatbotAvailUrl = 'availbility-url';
uiProperties.googleApiDelayInterval = 500;
uiProperties.covidTestingOptions = 'covid-19/patients';
uiProperties.findRightTest = 'covid-testing-options';
uiProperties.legacyCreateAccountLink = 'https://myquest-uat2.qdx.com/patient/create-account';
uiProperties.casLegacyAppointmentLoginUrl = 'cas.com';
uiProperties.asBetaGoogleOptimizeUrl = 'googleOptimize.com';
uiProperties.chatbotQDJsUrl = 'botchat.min.js';
uiProperties.chatbotCssUrl = 'botchat.css';
uiProperties.myquestASFaqs = '/myquest-faq1/AppointmentSchedule.htm';
uiProperties.LegacyAccountSettings = 'https://de-dev.mq.questdiagnostics.com/patient/account-settings';
uiProperties.viewOfferingLink = 'cit.com/products/covid-19-antibody-test';
uiProperties.QuestCovidDialogLink = 'http://QuestCOVID19.com';
uiProperties.viewOfferingCovidActiveinfection = 'cit.com/products/covid-19-active-infection';
uiProperties.viewOfferingAllOtherTest = 'cit.com/products?category=All';
uiProperties.SDKEasyPayENV = 'dev';
uiProperties.feature_flag_f89_easypay_enhancements = 'true';
uiProperties.feature_flag_f86_as_enhancements = 'true';
uiProperties.gender_preference = '[{"key":"Male","value":"M"}, {"key":"Female","value":"F"}]';
uiProperties.covidFilterLinkNew = 'https://www.new-url.com';
uiProperties.viewOfferingAllOtherTestNew = 'https://www.new-url.com';
uiProperties.viewOfferingCovidActiveinfectionNew = 'https://www.new-url.com';
uiProperties.viewOfferingLinkNew = 'https://www.new-url.com';
uiProperties.one_trust_scripts_for_appointment = 'test#test3#2345';
uiProperties.feature_flag_f1270_one_trust = false;
uiProperties.feature_flag_f1687_mandatory_address = 'true';
uiProperties.covidAntibodyNewCitLink = 'questhealth';
uiProperties.SMS_Consent_Language = 'SMS_Consent_Language';
export const mockUiProperties = uiProperties;

export const mockGoogleApiKeyResponse = {
  googleApiKey: 'map-key'
};


export class MockPropertiesService {
  getGoogleApiKey(): Observable<any> {
    return of({ googleApiKey: 'someGoogleMapKey' });
  }

  setGoogleTagManager() { }

  getGoogleApiDelayTime() {
    return of(uiProperties.googleApiDelayInterval);
  }

  getIdleTimeout() {
    return of(uiProperties.idleTimeOut);
  }
  getIdleTimeOutWarning() {
    return of(uiProperties.idleTimeOutWarning);
  }

  getResendConfCodeTimeDelay() {
    return of(5000);
  }

  getContactUsLink() {
    return of(uiProperties.contactUsLink);
  }

  getMaxApptScheduleDays() {
    return of(195);
  }
  getCovidTestingOptionsLink() {
    return of(uiProperties.covidTestingOptions);
  }
  getFindRightTestLink() {
    return of(uiProperties.findRightTest);
  }
  getViewOfferingUrl() {
    return of(uiProperties.viewOfferingLink);
  }
  getLegacyCreateAccountLink() {
    return of(uiProperties.legacyCreateAccountLink);
  }

  getSignInLink() {
    return of(uiProperties.casLegacyAppointmentLoginUrl);
  }

  getMqCreateAccountLink() {
    return of(uiProperties.legacyCreateAccountLink);
  }
  getASGoogleOptimize(): Observable<string> {
    return of(uiProperties.asBetaGoogleOptimizeUrl);
  }
  setAsGoogleOptimize() { }
  getChatbotAvailUrl() {
    return of(uiProperties.chatbotAvailUrl);
  }
  getChatbotJsUrl(): Observable<string> {
    return of(uiProperties.chatbotQDJsUrl);
  }
  getChatbotCssUrl(): Observable<string> {
    return of(uiProperties.chatbotQDCssUrl);
  }
  getChatbotConfig(): Observable<string> {
    return of(uiProperties.chatbotEnabled);
  }

  getFAQLink() {
    return of(uiProperties.myquestASFaqs);
  }
  getLegacyAccountSettings() {
    return of(uiProperties.LegacyAccountSettings);
  }

  getMyquestSite() {
    return of(uiProperties.myquestSite);
  }

  getCancelModifyConfirmationScreen() {
    return of(false);
  }

  getLegacyResendEmailLink() {
    return of('https://de-dev.mq.questdiagnostics.com/patient/email-confirmation');
  }
  getsafetyMeasureLink() {
    return of(uiProperties.safetyMeasuresUrl);
  }
  getMaskPolicyLink() {
    return of(uiProperties.maskPolicyUrl);
  }
  getTestingOptionLink() {
    return of(uiProperties.testOptionsUrl);
  }
  getFaqLink() {
    return of(uiProperties.faqUrl);
  }
  getOutOfPocketLink() {
    return of(uiProperties.outOfPocketTestingUrl);
  }

  getEnableEasyPay() {
    return of(false);
  }

  getViewOfferingAntiBodyUrl() {
    return of(uiProperties.viewOfferingLink);
  }

  getViewOfferingActiveInfectionUrl() {
    return of(uiProperties.viewOfferingCovidActiveinfection);
  }

  getViewOfferingAllOtherTestUrl() {
    return of(uiProperties.viewOfferingAllOtherTest);
  }

  getSdkEnv(env: string) {
    return of(uiProperties.SDKEasyPayENV);
  }
  getQualtricProperties() {
    return of(uiProperties.qualtricsASScriptId);
  }
  getQualtricUrl() {
    return of(uiProperties.qualtricsASUrl);
  }
  enableQualtrics() {
    return of(uiProperties.enableASQualtrics);
  }
  getQualtricsASScriptValue() {
    return of(uiProperties.qualtricsASValue);
  }
  getEaypayEnhancementF89() {
    return of(JSON.stringify(
      uiProperties.feature_flag_f89_easypay_enhancements));
  }

  getRecaptchaEnable() {
    return of(JSON.stringify(uiProperties.activateCaptcha));
  }

  getASOpenEordersF221(): Observable<boolean> {
    return of(true);
  }
  getEasyPayEnhancementF411(): Observable<boolean> {
    return of(true);
  }
  getASClesF589(): Observable<boolean> {
    return of(true);
  }
  getLandingPageChangesF474(): Observable<boolean> {
    return of(true);
  }
  getHomePageCovidSection(): Observable<boolean> {
    return of(true);
  }
  getLandingPageCovidFacilityIds(): Observable<number[]> {
    return of([25, 26]);
  }

  getClinicaltrialhippaFlag() {
    return of(true);
  }

  getCtcConnectUrl() {
    return of(uiProperties.feature_flag_f229_mq_clinicaltrialhippa);
  }

  getEasypaySkipPricingPayors(): Observable<string[]> {
    return of(['MCR', 'PAMC']);
  }

  getcovidAlertContent(): Observable<string> {
    return of('<span>covid alert banner</span>');
  }
  getLandingPageCovidSectionLink() {
    return of('QuestDirectTest.com');
  }
  getQuestCovidDialogLink() {
    return of(uiProperties.QuestCovidDialogLink);
  }

  getCovidFilterLink() {
    return of('http://questdirect.questdiagnostics.com/products?search=covid');
  }
  getLabsLink() {
    return of('http://questdirect.questdiagnostics.com/products?search=covid');
  }

  getHomeService() {
    return of(true);
  }

  getSchedulerMaintenancef964(): Observable<boolean> {
    return of(true);
  }

  getSchedulerMaintenancef1385(): Observable<boolean> {
    return of(true);
  }
  getRitAidLocationsf1269(): Observable<boolean> {
    return of(false);
  }

  getViewTestLink() {
    return of('http://questdirect.questdiagnostics.com/products?search=covid');
  }
  getTealiumScriptSrc() {
    return of(uiProperties.tealiumScriptSrc);
  }
  getTealiumScriptUrl() {
    return of(uiProperties.tealiumScriptUrl);
  }
  addTealiumScriptHead() { }
  setTealiumScriptBody() { }
  loadTealiumScripts() { }
  getTealiumScriptEnv() {
    return of('dev');
  }
  addOneTrustCookie() { }
  getOneTrustScripts(): Observable<string> {
    return of('test#test1#1234567');
  }
  getOneTrustFlag(): Observable<boolean> {
    return of(false);
  }
  getCITUpdatedLinksFeatureFlag1421(): Observable<boolean> {
    return of(true);
  }
  getcovidFilterLinkNew(): Observable<string> {
    return of(uiProperties.covidFilterLinkNew);
  }
  getviewOfferingAllOtherTestNewUrl(): Observable<string> {
    return of(uiProperties.viewOfferingAllOtherTestNew);
  }
  getviewOfferingCovidActiveinfectionNewUrl(): Observable<string> {
    return of(uiProperties.viewOfferingCovidActiveinfectionNew);
  }
  getviewOfferingAntiBodyLinkNewUrl(): Observable<string> {
    return of(uiProperties.viewOfferingLinkNew);
  }
  getMandatoryAddressf1687(): Observable<boolean> {
    return of(true);
  }

  getEasypayFixesf2100() {
    return of(true);
  }
  getCovidAntibodyNewCitLink() {
    return of(uiProperties.covidAntibodyNewCitLink);
  }
  getSMSConsentLanguage() {
    return of(uiProperties.SMS_Consent_Language);
  }
  getOpenInvoicesf91() {
    return of(false);
  }

  getTransgenderFieldsPopupContent() {
    return of({
      title: 'props.transgender_fields_popup_title',
      content: 'props.transgender_fields_popup_content'
    });
  }

  getTransgenderContent() {
    return of('TransgenderContent');
  }

  getGenderRaceOptions() {
    return of([
      {
        'field_name': 'gender_preference',
        'options': [
          {
            'key': 'D',
            'value': 'Choose not to disclose'
          },
          {
            'key': 'F',
            'value': 'Female'
          },
          {
            'key': 'X',
            'value': 'Genderqueer, neither exclusively female nor male'
          },
          {
            'key': 'M',
            'value': 'Male'
          },
          {
            'key': 'FTM',
            'value': 'Transgender female-to-male/Trans Man'
          },
          {
            'key': 'MTF',
            'value': 'Transgender male-to-female/Trans Woman'
          },
          {
            'key': 'TNOS',
            'value': 'Additional gender category or other'
          }
        ],
        'enabled': true,
        'displayState': [
          'All'
        ],
        'requiredState': [

        ]
      },
      {
        'field_name': 'race',
        'options': [
          {
            'key': 'D',
            'value': 'Choose not to disclose'
          },
          {
            'key': 'I',
            'value': 'American Indian or Alaska Native'
          },
          {
            'key': 'A',
            'value': 'Asian'
          },
          {
            'key': 'B',
            'value': 'Black or African American'
          },
          {
            'key': 'P',
            'value': 'Native Hawaiian or Other Pacific Islander'
          },
          {
            'key': 'W',
            'value': 'White'
          },
          {
            'key': 'O',
            'value': 'Other'
          },
          {
            'key': 'U',
            'value': 'Unknown'
          }
        ],
        'enabled': true,
        'displayState': [
          'ALL'
        ],
        'requiredState': [
          'NJ'
        ]
      },
      {
        'field_name': 'ethnicity',
        'options': [
          {
            'key': 'D',
            'value': 'Choose not to disclose'
          },
          {
            'key': 'H',
            'value': 'Hispanic or Latino'
          },
          {
            'key': 'N',
            'value': 'Non-Hispanic or Non-Latino'
          },
          {
            'key': 'O',
            'value': 'Other'
          },
          {
            'key': 'U',
            'value': 'Unknown'
          }
        ],
        'enabled': true,
        'displayState': [
          'ALL'
        ],
        'requiredState': [
          'NJ'
        ]
      },
      {
        'field_name': 'Sexual_orientation',
        'options': [
          {
            'key': 'D',
            'value': 'Choose not to disclose'
          },
          {
            'key': 'BI',
            'value': 'Bisexual'
          },
          {
            'key': 'HOM',
            'value': 'Lesbian, gay, or homosexual'
          },
          {
            'key': 'HET',
            'value': 'Straight or heterosexual'
          },
          {
            'key': 'SE',
            'value': 'Something else'
          },
          {
            'key': 'DK',
            'value': 'Don\'t know'
          }
        ],
        'enabled': true,
        'displayState': [
          'ALL'
        ],
        'requiredState': [

        ]
      }
    ]);
  }

  getInsurancePrefillF3904() {
    return of(true);
  }

  getGooglemapsOptimizationF4191(): Observable<boolean> {
    return of(true);
  }

  getGooglemapsOptimizationUrls() {
    return of({
      usZipsUrl: 'usZipsUrl',
      pscZipsUrl: 'pscZipsUrl',
      enabled: true
    });
  }
}
