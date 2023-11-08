import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { OpenBalanceService } from 'shared/services/open-balance/open-balance.service';
import { PropertiesService } from 'shared/services/properties.service';

@Injectable({
  providedIn: 'root',
})
export class OpenBalanceGuard implements CanActivate {
  constructor(
    private router: Router,
    private propertiesService: PropertiesService,
    private openBalanceService: OpenBalanceService,) { }
  canActivate(): Observable<boolean> {
    return this.propertiesService.getOpenInvoicesf91().pipe(
      concatMap((f91) => {
        if (f91) {
          return this.openBalanceService.getOpenBalances().pipe(
            tap((apiRes) => {
              if (apiRes) {
                this.router.navigate(['/eorder/as-open-balance/confirmation']);
              }
            }),
            map((apiRes) => {
              return true;
            }),
            catchError(e => of(true))
          );
        } else {
          return of(true);
        }
      }),
      catchError(e => of(true)),
    );
  }
}

    //   return forkJoin([
    //     this.openBalanceService.getOpenBalances().pipe(map((res) => res), catchError(e => of(null))),
    //     this.propertiesService.getOpenInvoicesf91().pipe(map((res) => res), catchError(e => of(false))),
    //   ]
    //   ).pipe(
    //     tap(([openBalance, f91]: [OpenBalanceApiResponse, boolean]) => {
    //       if (f91 && openBalance) {
    //         this.router.navigate(['/eorder/as-open-balance/confirmation']);
    //       }
    //     }),
    //     map(([openBalance, f91]: [OpenBalanceApiResponse, boolean,]) => {
    //       return !f91;
    //     })
    //   );
    // }




