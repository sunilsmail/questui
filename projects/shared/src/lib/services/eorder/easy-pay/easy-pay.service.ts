import { Injectable } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { BwPaymentCard, Env } from '@qdx-billingweb/websdk';
import { Observable, ReplaySubject } from 'rxjs';
import { EasyPayResponseType, EasyPayStatus, EorderEasypay, EorderEasypayStatus } from 'shared/models/eorder';
import { ApiService } from 'shared/services/api.service';
import { PropertiesService } from './../../properties.service';

@Injectable({
  providedIn: 'root'
})
export class EorderEasyPayService {
  /** Variable declaration START */
  serverUrl = '/guest';
  private easyPayStatus = new ReplaySubject<any>(1);
  public easyPayStatus$ = this.easyPayStatus.asObservable();
  private loadingSpinner = new ReplaySubject<any>(1);
  public loadingSpinner$ = this.loadingSpinner.asObservable();
  componentMethodCallSource = new ReplaySubject<EasyPayStatus>(1);
  public componentMethodCalled$ = this.componentMethodCallSource.asObservable();
  /** to hide the easypay when error in callback */
  private hideEasyPay = new ReplaySubject<any>(1);
  public hideEasyPay$ = this.hideEasyPay.asObservable();


  private fallbackUI = new ReplaySubject<any>(1);
  public fallbackUI$ = this.fallbackUI.asObservable();

  private withPriceEstimateAndNoCC = new ReplaySubject<boolean>(1);
  public withPriceEstimateAndNoCC$ = this.withPriceEstimateAndNoCC.asObservable();

  sdkLoadFailStatus = false;

  isSkipPaymentSelected = false;


  private skippaymentSelected = new ReplaySubject<boolean>(1);
  public skippaymentSelected$ = this.skippaymentSelected.asObservable();
  /** Variable declaration END */

  constructor(private api: ApiService, public media: MediaObserver, public propertyService: PropertiesService) { }

  /** API calls START */

  getEasyPayInit(): Observable<EorderEasypay> {
    return this.api.post<EorderEasypay>(`${this.serverUrl}/easypay/initiateTransaction`);
    // const initBillingWeb: EorderEasypay = {
    //   applicationId: 'mq-prereg',
    //   payload: '',
    //   sig: ''
    // };
    // return of(initBillingWeb);
  }

  noPayment(reason: string): Observable<any> {
    const request = {
      reason: reason
    };
    return this.api.post(`${this.serverUrl}/easypay/nopayment`, request);
  }

  /** API calls END */

  /** State management START */
  setEasyPayStatus(status: EorderEasypayStatus) {
    this.easyPayStatus.next(status);
  }

  getEasyPayStatus(): Observable<EorderEasypayStatus> {
    return this.easyPayStatus$;
  }

  setLoadingSpinner(status: boolean) {
    this.loadingSpinner.next(status);
  }

  getLoadingSpinner(): Observable<boolean> {
    return this.loadingSpinner$;
  }

  setHideEasyPay(status: boolean) {
    this.hideEasyPay.next(status);
  }

  getHideEasyPay(): Observable<boolean> {
    return this.hideEasyPay$;
  }


  setFallbackUI(status: boolean) {
    this.hideEasyPay.next(status);
  }

  getFallbackUI(): Observable<boolean> {
    return this.hideEasyPay$;
  }


  setWithPriceEstimateAndNoCC(status: boolean) {
    this.withPriceEstimateAndNoCC.next(status);
  }

  getWithPriceEstimateAndNoCC(): Observable<boolean> {
    return this.withPriceEstimateAndNoCC$;
  }

  setSkippaymentSelected(status: boolean) {
    this.skippaymentSelected.next(status);
  }
  getSkippaymentSelected(): Observable<boolean> {
    return this.skippaymentSelected$;
  }


  /** State management END */

  /** UI methods START */
  initialiseUI(data: EorderEasypay) {
    this.propertyService.getSdkEnv().subscribe((env) => {
      new BwPaymentCard().create(
        {
          env: this.getEnv(env),
          applicationId: data.applicationId, // 'mq-prereg',
          payload: data.payload,
          sig: data.sig,
          button: {
            // text: 'Finish',
            container: '#btn-next'
          },
          container: '#payment-card'
        },
        {
          // beforeSubmit: () => {
          //   console.log('beforeSubmit');
          // },
          success: success => {
            this.sdkLoadFailStatus = true;
            this.setLoadingSpinner(false);
            console.log(EasyPayResponseType.successLoading);
            this.setStyle();
            // this.setContainerHeight();
            this.containerStyle();
            this.setEasyPayStatus(new EorderEasypayStatus(EasyPayResponseType.successLoading, null));
          },
          error: status => {
            this.sdkLoadFailStatus = true;
            this.setLoadingSpinner(false);
            this.setHideEasyPay(true);
            console.error(EasyPayResponseType.errorLoading, status);
            this.setEasyPayStatus(new EorderEasypayStatus(EasyPayResponseType.errorLoading, status));
            // for showing message in confirmation page
            this.setWithPriceEstimateAndNoCC(true);
          },
          purchaseSuccess: success => {
            // this.purchaseSuccess().subscribe();
            this.callComponentMethod(false);
            console.log(EasyPayResponseType.successPayment, success);
            this.setEasyPayStatus(new EorderEasypayStatus(EasyPayResponseType.successPayment, null));
            // this.setContainerHeightOnSuccess();
            this.containerSuccessStyle(false);
            this.purchaseSuccess().subscribe();
          },
          purchaseError: status => {
            // this.purchaseError().subscribe();
            this.callComponentMethod(true);
            console.error(EasyPayResponseType.errorPayment, status);
            this.setEasyPayStatus(new EorderEasypayStatus(EasyPayResponseType.errorPayment, status));
            // this.setContainerHeightOnSuccess();
            this.containerSuccessStyle(true);
            this.purchaseError().subscribe();
          },
          formComplete: () => {
            console.log(EasyPayResponseType.formCompleted);
            this.setEasyPayStatus(new EorderEasypayStatus(EasyPayResponseType.formCompleted, null));
          },
          paymentMethodChange: (res) => {
            console.log(EasyPayResponseType.paymentMethodChange);
            this.isSkipPaymentSelected = (res === 'NP');
          //  this.setContainerHeight();
            this.containerStyle();
          }
        }
      );

      setTimeout(() => {
        if (!this.sdkLoadFailStatus) {
          this.setLoadingSpinner(false);
          this.setFallbackUI(true);
          console.log('sdk fallback method called');
           // for showing message in confirmation page
           this.setWithPriceEstimateAndNoCC(true);
        }
      }, 25000);

    });
  }

  containerStyle() {
    if (this.isSkipPaymentSelected) {
      document.getElementById('payment-card').classList.add('skip-pay');
    } else {
      document.getElementById('payment-card').classList.remove('skip-pay');
    }
  }

  containerSuccessStyle(error: boolean) {
    if (error) {
      this.setSkippaymentSelected(true);
    }
    if (this.isSkipPaymentSelected) {
      this.setSkippaymentSelected(true);
      document.getElementById('payment-card').classList.add('skip-pay-success');
      document.getElementById('payment-card').classList.remove('skip-pay');
    } else {
      document.getElementById('payment-card').classList.add('cc-success');
      document.getElementById('payment-card').classList.remove('skip-pay');
    }
  }

  setStyle() {
    const element = document.getElementById('bwpaymentcard');
    if (element) {
      element.style.width = '100%';
      element.style.border = 'none';
      element.style.height = '100%';
      // document.getElementById('payment-card').style.minHeight = '500px';
    }
  }

  callComponentMethod(error: boolean) {
    const response: EasyPayStatus = new EasyPayStatus();
    response.isSkippayment = this.isSkipPaymentSelected;
    if (!error) {
      response.status = true;
      this.componentMethodCallSource.next(response);
    } else {
      response.status = false;
      this.componentMethodCallSource.next(response);
    }
  }
  /** UI methods END */

  /** Purchase success **/
  purchaseSuccess() {
    const purchaseSuccessObject = {
      status: this.isSkipPaymentSelected ? 'NOPAYMENT': 'COMPLETED'
    };
    return this.api.post(this.serverUrl + '/easypay/updateTransaction', purchaseSuccessObject);
  }

  /** Purchase Error **/
  purchaseError() {
    const purchaseErrorObject = {
      status: 'FAILED'
    };
    return this.api.post(this.serverUrl + '/easypay/updateTransaction', purchaseErrorObject);
  }

  getEnv(env: string) {
    switch (env) {
      case 'dev':
        return Env.DVB;
      case 'qa':
        return Env.QA;
      case 'prod':
        return Env.PROD;
      case 'uat':
        return Env.UAT;
      default:
        return Env.DVB;
    }
  }

  setContainerHeight() {
    if (window.outerWidth < 432) {
      this.mobileViewOnPaymentChange();
    } else {
      this.desktopViewOnPaymentChange();
    }
    this.media.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs' || change.mqAlias === 'sm') {
        this.mobileViewOnPaymentChange();
      } else {
        this.desktopViewOnPaymentChange();
      }
    });
  }

  setContainerHeightOnSuccess() {
    if (window.outerWidth < 432) {
      this.mobileViewOnSuccess();
    } else {
      this.desktopViewOnSuccess();
    }
    this.media.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs' || change.mqAlias === 'sm') {
        this.mobileViewOnSuccess();
      } else {
        this.desktopViewOnSuccess();
      }
    });
  }

  desktopViewOnPaymentChange() {
    if (this.isSkipPaymentSelected) {
      document.getElementById('payment-card').style.minHeight = '360px';
      document.getElementById('payment-card').style.height = '360px';
    } else {
      document.getElementById('payment-card').style.minHeight = '540px';
      document.getElementById('payment-card').style.height = '540px';
    }
  }

  mobileViewOnPaymentChange() {
    if (this.isSkipPaymentSelected) {
      document.getElementById('payment-card').style.minHeight = '360px';
      document.getElementById('payment-card').style.height = '360px';
    } else {
      document.getElementById('payment-card').style.minHeight = '860px';
      document.getElementById('payment-card').style.height = '860px';
    }
  }



  desktopViewOnSuccess() {
    if (this.isSkipPaymentSelected) {
      this.setSkippaymentSelected(true);
      document.getElementById('payment-card').style.minHeight = '300px';
      document.getElementById('payment-card').style.height = '300px';
    } else {
      document.getElementById('payment-card').style.minHeight = '440px';
      document.getElementById('payment-card').style.height = '440px';
    }
  }

  mobileViewOnSuccess() {
    if (this.isSkipPaymentSelected) {
      document.getElementById('payment-card').style.minHeight = '260px';
      document.getElementById('payment-card').style.height = '260px';
    } else {
      document.getElementById('payment-card').style.minHeight = '740px';
      document.getElementById('payment-card').style.height = '740px';
    }
  }
}
