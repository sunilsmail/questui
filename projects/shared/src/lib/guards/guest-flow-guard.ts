import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from 'shared/services/data.service';

@Injectable({
    providedIn: 'root',
})
export class GuestFlowGuard implements CanActivate {
    constructor(private router: Router, private dataService: DataService) { }
    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<any> | boolean {
        if (this.dataService.isInFLow) {
            return this.dataService.isInFLow;
        } else {
            this.router.navigate(['/as-home']);
        }
    }
}
