import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { EcheckinDataService } from 'shared/services/echeckin/echeckin-data.service';

@Injectable({
    providedIn: 'root',
})
export class GuestEcheckinGuard implements CanActivate {
    constructor(private router: Router, private dataService: EcheckinDataService) { }
    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<any> | boolean {
        if (this.dataService.isEcheckinFLow) {
            return this.dataService.isEcheckinFLow;
        } else {
            this.router.navigate(['/as-home']);
        }
    }
}
