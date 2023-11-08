import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { editSummaryDetails } from 'shared/models/eOrder-state-navigation';
import { CostEstimateService } from 'shared/services/eorder/easy-pay/cost-estimate.service';
import { EorderService } from 'shared/services/eorder/eorder.service';

@Injectable({
  providedIn: 'root',
})
export class GuestCostEstimateGuard implements CanActivate {
  constructor(private router: Router,
    private costEstimateService: CostEstimateService,
    private eorderService: EorderService) { }
  canActivate(): Observable<boolean> {
    return this.costEstimateService.getEstimateCostStatus().pipe(
      tap(skipCostEstimate => {
        if (skipCostEstimate) {
          this.eorderService.saveEncounter({ stateNavigation: editSummaryDetails.summaryDetails }).subscribe();
          this.router.navigate(['/eorder/as-eorder-confirmation']);
        }
      }),
      map(skipCostEstimate => !skipCostEstimate)
    );
  }
}
