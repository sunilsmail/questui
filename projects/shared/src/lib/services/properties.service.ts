import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { of, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GenderRaceOptions } from 'shared/models/gender-race-options';
import { UiProperties } from 'shared/models/ui-properties';
import { ApiService } from './api.service';

const key = 'GTM-PSBMWCM';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  constructor(private api: ApiService) { }

  getUiProperties(): Observable<UiProperties> {
    return this.api.post<UiProperties>('guest/getUiProperties');
  }

  getGoogleApiKey(): Observable<any> {
    return this.api.get('/guest/getGoogleApiKey');
  }


  /**
   * for now key is hardcoded it should come from backend in future
   */

  // getGoogleTagManagerKey(): Observable<string> {
  // }

  setGoogleTagManager() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${key}');`;
    document.head.appendChild(script);
  }

  getGoogleApiDelayTime() {
    return this.getUiProperties().pipe(map(props => props.googleApiDelayInterval));
  }

  getMaxApptScheduleDays() {
    return this.getUiProperties().pipe(map(props => props.maxApptScheduleDays));
  }
  getIdleTimeout() {
    return this.getUiProperties().pipe(map(props => props.idleTimeOut));
  }
  getIdleTimeOutWarning() {
    return this.getUiProperties().pipe(map(props => props.idleTimeOutWarning));
  }
  getMyquestSite(path: string = '') {
    return this.getUiProperties().pipe(map(props => `${props.myquestSite}${path}`));
  }
  getCITSite(path: string = '') {
    return this.getUiProperties().pipe(map(props => `${props.citSite}${path}`));
  }
  getAppointmentLogoutLink() {
    return this.getUiProperties().pipe(
      map(props => {
        return props.appointmentLink.replace('patient/appointment', 'mq-service/');
      })
    );
  }

  getResendConfCodeTimeDelay() {
    return this.getUiProperties().pipe(map(props => props.resendConfCodeDelayTime));
  }

  getContactUsLink() {
    return this.getUiProperties().pipe(map(props => props.contactUsLink));
  }

  getFindRightTestLink() {
    return this.getUiProperties().pipe(map(props => props.findRightTest));
  }

  getCovidTestingOptionsLink() {
    return this.getUiProperties().pipe(map(props => props.covidTestingOptions));
  }

  getViewOfferingUrl() {
    return this.getUiProperties().pipe(map(props => props.viewOfferingLink));
  }

  getLegacyCreateAccountLink() {
    return this.getUiProperties().pipe(map(props => props.legacyCreateAccountLink));
  }

  getSignInLink() {
    return this.getUiProperties().pipe(map(props => props.casLegacyAppointmentLoginUrl));
  }
  getViewOfferingAllOtherTestUrl() {
    return this.getUiProperties().pipe(map(props => props.viewOfferingAllOtherTest));
  }
  getViewOfferingActiveInfectionUrl() {
    return this.getUiProperties().pipe(map(props => props.viewOfferingCovidActiveinfection));
  }
  getViewOfferingAntiBodyUrl() {
    return this.getUiProperties().pipe(map(props => props.viewOfferingLink));
  }

  getMqCreateAccountLink() {
    return this.getUiProperties().pipe(map(props => props.createAccountLink));
  }
  getAsGoogleOptimize(): Observable<string> {
    return this.getUiProperties().pipe(map(props => props.asBetaGoogleOptimizeUrl));
  }

  setAsGoogleOptimize() {
    this.getAsGoogleOptimize()
      .pipe(filter(url => !!url))
      .subscribe(url => {
        const script = document.createElement('script');
        script.setAttribute('src', `${url}`);
        document.head.appendChild(script);
      });
  }

  getChatbotAvailUrl() {
    return this.getUiProperties().pipe(map(props => props.chatbotAvailUrl));
  }
  getChatbotJsUrl(): Observable<string> {
    return this.getUiProperties().pipe(map(props => props.chatbotJsUrl));
  }
  getChatbotCssUrl(): Observable<string> {
    return this.getUiProperties().pipe(map(props => props.chatbotQDCssUrl));
  }
  getChatbotConfig(): Observable<string> {
    return this.getUiProperties().pipe(map(props => props.chatbotEnabled));
  }
  getFAQLink() {
    return this.getUiProperties().pipe(map(props => props.myquestASFaqs));
  }
  getLegacyAccountSettings() {
    return this.getUiProperties().pipe(map(props => props.scheduleAppointmentLink));
  }

  getCancelModifyConfirmationScreen() {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.enableCancelModifyConfScreen)));
  }

  getLegacyResendEmailLink() {
    return of('https://de-dev.mq.questdiagnostics.com/patient/email-confirmation');
  }
  getsafetyMeasureLink() {
    return this.getUiProperties().pipe(map(props => props.safetyMeasuresUrl));
  }
  getMaskPolicyLink() {
    return this.getUiProperties().pipe(map(props => props.maskPolicyUrl));
  }
  getTestingOptionLink() {
    return this.getUiProperties().pipe(map(props => props.testOptionsUrl));
  }
  getFaqLink() {
    return this.getUiProperties().pipe(map(props => props.faqUrl));
  }
  getOutOfPocketLink() {
    return this.getUiProperties().pipe(map(props => props.outOfPocketTestingUrl));
  }

  getEnableEasyPay(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.enableEasyPay)));
  }

  getSdkEnv() {
    return this.getUiProperties().pipe(map(props => props.SDKEasyPayENV));
  }
  getQualtricProperties() {
    return this.getUiProperties().pipe(map(props => props.qualtricsASScriptId));
  }
  getQualtricUrl() {
    return this.getUiProperties().pipe(map(props => props.qualtricsASUrl));
  }
  enableQualtrics() {
    return this.getUiProperties().pipe(map(props => props.enableASQualtrics));
  }
  getQualtricsASScriptValue() {
    return this.getUiProperties().pipe(map(props => props.qualtricsASValue));
  }

  getEaypayEnhancementF89(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f89_easypay_enhancements)));
  }

  getRecaptchaEnable(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.activateCaptcha)));
  }

  getASOpenEordersF221(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f221_as_openeorders)));
  }
  getEasyPayEnhancementF411(): Observable<boolean> {
    //  return this.getUiProperties().pipe(map(props => JSON.parse('true')));
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f411_easypay_enhancements)));
  }
  getASClesF589(): Observable<boolean> {
    // return this.getUiProperties().pipe(map(props => JSON.parse('true')));
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f589_as_cles)));
  }
  getLandingPageChangesF474(): Observable<boolean> {
    // return this.getUiProperties().pipe(map(props => JSON.parse('true')));
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f474_as_landingpage_changes)));
  }
  getHomePageCovidSection(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.homepage_covid_section)));
  }
  getLandingPageCovidFacilityIds(): Observable<number[]> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.landingpage_covid_facilityIds)));
  }
  getbannerFacilityIds(): Observable<number[]> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.banner_facilityIds)));
  }

  getClinicaltrialhippaFlag() {
    return this.getUiProperties().pipe(map(props => {
      if (props.feature_flag_f229_mq_clinicaltrialhippa === 'true') {
        return JSON.parse(props.feature_flag_f229_mq_clinicaltrialhippa);
      } else {
        return false;
      }
    }
    ));
  }

  getCtcConnectUrl() {
    return this.getUiProperties().pipe(map(props => props.f229_as_ctconnect));
  }

  getSkipPayors(): Observable<string[]> {
    return this.getUiProperties().pipe(map(props => props.easypay_skip_pricing_payors.split(',')));
  }

  getcovidAlertContent(): Observable<string> {
    return this.getUiProperties().pipe(map(props => props.covidAlertContent));
  }

  getLandingPageCovidSectionLink() {
    return this.getUiProperties().pipe(map(props => props.LandingPageCovidSectionLink));
  }

  getQuestCovidDialogLink() {
    return this.getUiProperties().pipe(map(props => props.QuestCovidDialogLink));
  }

  getCovidFilterLink() {
    return this.getUiProperties().pipe(map(props => props.covidFilterLink));
  }
  getViewTestLink() {
    return this.getUiProperties().pipe(map(props => props.viewTestLink));
  }
  getLabsLink() {
    return this.getUiProperties().pipe(map(props => props.getLabsRedirectLink));
  }

  getHomeService(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f668_getlabs_homeservice)));
  }

  getSchedulerMaintenancef964(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f964_scheduler_maintenance)));
  }

  getSchedulerMaintenancef1385(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f1385_scheduler_maintenance)));

  }

  getRitAidLocationsf1269(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f1269_rit_aid_locations)));
  }
  getViewTestLinkNewCIT() {
    return this.getUiProperties().pipe(map(props => props.viewTestLinkNew));
  }

  getTealiumScriptEnv(): Observable<string> {
    return this.getUiProperties().pipe(map(props => props.tealiumScriptEnv));
  }
  getTealiumScriptSrc(): Observable<string> {
    return this.getUiProperties().pipe(map(props => props.tealiumScriptSrc));
  }
  getTealiumScriptUrl(): Observable<string> {
    return this.getUiProperties().pipe(map(props => props.tealiumScriptUrl));
  }
  addTealiumScriptHead() {
    this.getTealiumScriptSrc()
      .subscribe(src => {
        if (src) {
          const script = document.createElement('script');
          script.src = `${src}`;
          script.async = false;
          script.defer = true;
          document.head.appendChild(script);
        }
      });
  }
  setTealiumScriptBody() {
    this.getTealiumScriptUrl()
      .subscribe(scriptKey => {
        if (scriptKey) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = `(function(a,b,c,d){
              a='${scriptKey}';
              b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=true;
              a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a);
            })();`;
          document.body.appendChild(script);
        }
      });
  }

  loadTealiumScripts() {
    this.getTealiumScriptEnv().subscribe((env: string) => {
      if (env) {
        const headUrl = `//tags.tiqcdn.com/utag/questdiagnostics/main/${env}/utag.sync.js`;
        const bodyUrl = `//tags.tiqcdn.com/utag/questdiagnostics/main/${env}/utag.js`;
        const script = document.createElement('script');
        script.src = `${headUrl}`;
        script.async = false;
        document.head.appendChild(script);
        if (bodyUrl) {
          const scriptBody = document.createElement('script');
          scriptBody.type = 'text/javascript';
          scriptBody.innerHTML = `(function(a,b,c,d){
                  a='${bodyUrl}';
                  b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=true;
                  a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a);
                })();`;
          document.body.appendChild(scriptBody);
        }
      }
    });
  }
  addOneTrustCookie() {
    combineLatest([this.getOneTrustScripts(), this.getOneTrustFlag()])
      .pipe(filter(([script, flag]) => !!flag))
      .subscribe(([scripts, flag]) => {
        console.log('One Trust - Appointment');
        const scriptsList = scripts.split('#');
        const data_domain_script = scriptsList[scriptsList.length - 1];
        scriptsList.pop();
        scriptsList.push('function OptanonWrapper() { }');
        for (let script = 0; script < scriptsList.length; script++) {
          const ele = document.createElement('script');
          if (script === scriptsList.length - 1) {
            ele.innerHTML = scriptsList[script];
          } else {
            ele.src = scriptsList[script];
          }
          if (script === 1) {
            ele.charset = 'UTF-8';
            ele.setAttribute('data-domain-script', data_domain_script);
          }
          ele.type = 'text/javascript';
          if (typeof ele !== 'undefined') {
            document.getElementsByTagName('head')[0].appendChild(ele);
          }
        }
      });
  }
  getOneTrustScripts(): Observable<string> {
    return this.getUiProperties().pipe(map(props => props.one_trust_scripts_for_appointment));
  }
  getOneTrustFlag(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => props.feature_flag_f1270_one_trust));
  }
  getCITUpdatedLinksFeatureFlag1421(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f1421_updateAsLinks)));
  }
  getcovidFilterLinkNew(): Observable<string> {
    return this.getUiProperties().pipe(map(props => props.covidFilterLinkNew));
  }
  getviewOfferingAllOtherTestNewUrl(): Observable<string> {
    return this.getUiProperties().pipe(map(props => props.viewOfferingAllOtherTestNew));
  }
  getviewOfferingCovidActiveinfectionNewUrl(): Observable<string> {
    return this.getUiProperties().pipe(map(props => props.viewOfferingCovidActiveinfectionNew));
  }
  getviewOfferingAntiBodyLinkNewUrl(): Observable<string> {
    return this.getUiProperties().pipe(map(props => props.viewOfferingLinkNew));
  }
  getMandatoryAddressf1687(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f1687_mandatory_address)));
  }
  getEasypayFixesf2100(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f2100_easypay_fixes)));
  }
  getCovidAntibodyNewCitLink() {
    return this.getUiProperties().pipe(map(props => props.covidAntibodyNewCitLink));
  }
  getSMSConsentLanguage() {
    return this.getUiProperties().pipe(map(props => props.SMS_Consent_Language));
  }
  getOpenInvoicesf91(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f91_open_invoices)));
  }
  getGenderRaceOptions(): Observable<GenderRaceOptions[]> {
    return this.getUiProperties().pipe(map(props => props.gender_race_options));
  }

  getClinicalTrialHipaaContentLink(): Observable<any> {
    return this.getUiProperties().pipe(map(props => props.clinical_trial_hipaa_content_link));
  }

  getQuestHealthSite(route?): Observable<any> {
    return this.getUiProperties().pipe(map(props => {
      let questHealthSite = props.questHealthSite;
      if (questHealthSite.slice(-1) !== '/') {
        questHealthSite += '/';
      }

      return route ? questHealthSite + route : questHealthSite;
    }));
  }

  getTransgenderFieldsPopupContent(): Observable<any> {
    return this.getUiProperties().pipe(map(props => {
      return {
        title: props.transgender_fields_popup_title,
        content: props.transgender_fields_popup_content
      };
    }));
  }

  getTransgenderContent(): Observable<string> {
    return this.getUiProperties().pipe(map(props => null));
  }

  getInsurancePrefillF3904(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => JSON.parse(props.feature_flag_f3904_prefill_insurance)));
  }

  getGooglemapsOptimizationF4191(): Observable<boolean> {
    return this.getUiProperties().pipe(map(props => props.feature_flag_f4191_googlemaps_optimization));
  }
  getGooglemapsOptimizationUrls(): Observable<any> {
    return this.getUiProperties().pipe(map(props => {
      return {
        usZipsUrl: props.usZipsUrl,
        pscZipsUrl: props.pscZipsUrl,
        enabled: props.feature_flag_f4191_googlemaps_optimization
      };
    }));
  }
}
