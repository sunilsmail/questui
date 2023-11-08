import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
@Injectable({
  providedIn: 'root'
})
export class GuestEorderflowGuard {

  constructor(private router: Router, private dataService: EorderDataService) { }
  canActivate(route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<any> | boolean {
      if (this.dataService.isEorderFLow) {
        this.dataService.isEorderFlowActivated(this.dataService.isEorderFLow);
          return this.dataService.isEorderFLow;
      } else {
          this.router.navigate(['/as-home']);
      }
  }
}
