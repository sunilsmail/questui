import { of, Observable } from 'rxjs';
import { CostEstimateStatus } from 'shared/models/eorder';

export class MockCostEstimateService {
  verifyIdentityTokenEnabled = true;
  getEstimateCostStatus() {
    return of(true);
  }

  getEasypayStatus() {
    const res = new CostEstimateStatus();
    res.skipCostEstimate = true;
    res.quotedCost = 10;
    res.type = 'COMPLETED';
    return of(res);
  }

  setCostEstimate(status: CostEstimateStatus) { }

  getCostEstimate() {
    const res = new CostEstimateStatus();
    res.skipCostEstimate = true;
    res.quotedCost = 10;
    res.type = 'COMPLETED';
    return of(res);
  }
  getWithPriceEstimateAndNoCC(): Observable<boolean> {
    return of(false);
  }
  setWithPriceEstimateAndNoCC(status: boolean) {  }

  setSkippaymentSelected(status: boolean) {
  }
  getSkippaymentSelected(): Observable<boolean> {
    return of(false);
  }
}
