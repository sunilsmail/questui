import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { OpenEorders } from 'shared/models';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { PropertiesService } from 'shared/services/properties.service';

@Injectable({
  providedIn: 'root',
})
export class OpenEordersGuard implements CanActivate {
  constructor(
    private router: Router,
    private eOrderStateNavigationService: EorderStateNavigationService,
    private propertiesService: PropertiesService) { }
  canActivate(): Observable<boolean> {
    // return this.eOrderStateNavigationService.getOpenEorders().pipe(
    //   tap(orders => {
    //     if (orders.length === 0) {
    //       this.router.navigate(['/as-home']);
    //     }
    //   }),
    //   map(orders => orders.length > 0)
    // );
    return forkJoin(
      this.propertiesService.getASOpenEordersF221(),
      this.eOrderStateNavigationService.getOpenEorders()).pipe(
        tap(([f221Enabled, orders]: [boolean, OpenEorders[]]) => {
          if (!f221Enabled || orders.length === 0) {
            this.router.navigate(['/as-home']);
          }
        }),
        map(([f221Enabled, orders]: [boolean, OpenEorders[]]) => {
          return f221Enabled && orders.length > 0;
        })
      );
  }
}
