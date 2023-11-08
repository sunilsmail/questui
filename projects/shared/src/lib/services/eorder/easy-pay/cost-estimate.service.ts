import { Injectable } from '@angular/core';
import { of, Observable, ReplaySubject } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { CostEstimateStatus } from 'shared/models/eorder';
import { ApiService } from 'shared/services/api.service';
import { PropertiesService } from '../../properties.service';

@Injectable({
  providedIn: 'root'
})
export class CostEstimateService {
  /** Variable declaration START */
  serverUrl = '/guest';
  private costEstimate = new ReplaySubject<CostEstimateStatus>(1);
  public costEstimate$ = this.costEstimate.asObservable();
  private withPriceEstimateAndNoCC = new ReplaySubject<boolean>(1);
  public withPriceEstimateAndNoCC$ = this.withPriceEstimateAndNoCC.asObservable();
  private skippaymentSelected = new ReplaySubject<boolean>(1);
  public skippaymentSelected$ = this.skippaymentSelected.asObservable();
  public verifyIdentityTokenEnabled: boolean;
  /** Variable declaration END */

  constructor(
    private api: ApiService,
    public propertyService: PropertiesService) { }

  /** API calls START */
  getEstimateCostStatus(): Observable<boolean> {
    return this.propertyService.getEaypayEnhancementF89().pipe(
      take(1),
      switchMap((enableF89: boolean) => {
        if (enableF89) {
          return this.getEasypayStatus().pipe(
            map((estimateStatus: CostEstimateStatus) => {
              this.setCostEstimate(estimateStatus);
              this.verifyIdentityTokenEnabled = estimateStatus.enableEasyPay;
              return estimateStatus && estimateStatus.skipCostEstimate;
            })
          );
        }
        return of(false);
      })
    );
  }

  getEasypayStatus(): Observable<CostEstimateStatus> {
    return this.api.get<CostEstimateStatus>(this.serverUrl + '/easypay/easyPayTransactionStatus');
    // return of({
    //   skipCostEstimate: false,
    //   quoatedCost: 10
    // });
  }

  /** API calls END */

  /** State management START */
  setCostEstimate(status: CostEstimateStatus) {
    this.costEstimate.next(status);
  }

  getCostEstimate(): Observable<CostEstimateStatus> {
    return this.costEstimate$;
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

}
