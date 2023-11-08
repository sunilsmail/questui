import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataService } from 'shared/services/data.service';
import { AuthInsuranceService } from './../services/auth-ins/auth-insurance.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInsuranceResolver implements Resolve<any>  {
  constructor(private authInsuranceService: AuthInsuranceService, private dataService: DataService,) { }
  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const param = route.data['pageName'];
    if (param === 'personalInfo') {
      this.dataService.setModifyInsurance(true);
    }
    return this.authInsuranceService.getInsuranceProfile().pipe(take(1));
  }
}
