import { Injectable } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { BwPaymentCard, Env } from '@qdx-billingweb/websdk';
import { Observable, ReplaySubject } from 'rxjs';
import { EasyPayResponseType, EorderEasypay, EorderEasypayStatus } from 'shared/models/eorder';
import { ApiService } from 'shared/services/api.service';
import { PropertiesService } from './../../properties.service';

@Injectable({
  providedIn: 'root'
})
export class EorderEasyPayOldService {
  /** Variable declaration START */
  serverUrl = '/guest';
  private easyPayStatus = new ReplaySubject<any>(1);
  public easyPayStatus$ = this.easyPayStatus.asObservable();
  private loadingSpinner = new ReplaySubject<any>(1);
  public loadingSpinner$ = this.loadingSpinner.asObservable();
  private componentMethodCallSource = new ReplaySubject<any>(1);
  public componentMethodCalled$ = this.componentMethodCallSource.asObservable();
  /** to hide the easypay when error in callback */
  private hideEasyPay = new ReplaySubject<any>(1);
  public hideEasyPay$ = this.hideEasyPay.asObservable();


  private fallbackUI = new ReplaySubject<any>(1);
  public fallbackUI$ = this.fallbackUI.asObservable();

  private withPriceEstimateAndNoCC = new ReplaySubject<boolean>(1);
  public withPriceEstimateAndNoCC$ = this.withPriceEstimateAndNoCC.asObservable();

  sdkLoadFailStatus = false;
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
            text: 'Finish',
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
            this.purchaseSuccess().subscribe();
            this.callComponentMethod();
            console.log(EasyPayResponseType.successPayment, success);
            this.setEasyPayStatus(new EorderEasypayStatus(EasyPayResponseType.successPayment, null));
            this.purchaseSuccess().subscribe(purchaseSuccess => {
            });
          },
          purchaseError: status => {
            this.purchaseError().subscribe();
            console.error(EasyPayResponseType.errorPayment, status);
            this.setEasyPayStatus(new EorderEasypayStatus(EasyPayResponseType.errorPayment, status));
            this.purchaseError().subscribe(purchaseError => {
            });
          },
          formComplete: () => {
            console.log(EasyPayResponseType.formCompleted);
            this.setEasyPayStatus(new EorderEasypayStatus(EasyPayResponseType.formCompleted, null));
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

  setStyle() {
    const element = document.getElementById('bwpaymentcard');
    if (element) {
      element.style.width = '100%';
      element.style.border = 'none';
      element.style.height = '100%';
    }
  }

  callComponentMethod() {
    this.componentMethodCallSource.next();
  }
  /** UI methods END */

  /** Purchase success **/
  purchaseSuccess() {
    const purchaseSuccessObject = {
      status: 'COMPLETED'
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
}
