import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { of, Observable } from 'rxjs';
import { DeeplinkService } from 'shared/services/deeplink.service';

@Injectable({
  providedIn: 'root'
})
export class DeepLinkReasonResolver implements Resolve<any>  {
  constructor(private deeplinkSerive: DeeplinkService) { }
  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const data = route.queryParams['reasonForVisit'] || route.queryParams['reason'];
    if (data) {
      return this.deeplinkSerive.getReasonItems();
    } else {
      return of([]);
    }
  }
}
