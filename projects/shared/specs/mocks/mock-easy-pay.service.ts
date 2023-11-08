import { of, Observable } from 'rxjs';
import { EasyPayResponseType, EasyPayStatus, EorderEasypay, EorderEasypayStatus } from 'shared/models/eorder';


export class MockEorderEasyPayService {
  response: EasyPayStatus = {
    status: false,
    isSkippayment: false
  };
  componentMethodCalled$ = of(this.response);
  isSkipPaymentSelected = false;
  getEasyPayInit() {
    const data: EorderEasypay = {
      applicationId: 'mq-prereg',
      payload: 'payload',
      sig: 'sig'
    };
    return of(data);
  }
  setEasyPayStatus() {

  }
  getEasyPayStatus() {
    const data = new EorderEasypayStatus(EasyPayResponseType.successLoading, null);
    return of(data);
  }

  initialiseUI(data: EorderEasypay) { }

  noPayment() {
    return of({});
  }

  setLoadingSpinner(status: boolean) { }

  getLoadingSpinner(): Observable<boolean> {
    return of(false);
  }

  setHideEasyPay(status: boolean) { }

  getHideEasyPay(): Observable<boolean> {
    return of(false);
  }

  setFallbackUI(status: boolean) { }

  getFallbackUI(): Observable<boolean> {
    return of(false);
  }

  setWithPriceEstimateAndNoCC(status: boolean) {  }

  getWithPriceEstimateAndNoCC(): Observable<boolean> {
    return of(false);
  }

  setSkippaymentSelected(status: boolean) {
  }
  getSkippaymentSelected(): Observable<boolean> {
    return of(false);
  }
}
