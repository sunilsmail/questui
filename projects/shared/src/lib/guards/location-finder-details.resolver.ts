import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { PscLocationAvailability } from 'shared/models';
import { DataService } from 'shared/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class LocationFinderDetailsResolver implements Resolve<Observable<PscLocationAvailability>> {
  constructor(private dataService: DataService, private http: HttpClient) { }
  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PscLocationAvailability> {
    // without take observable won't complete and hence Resolver won't resolve
    return this.dataService.getfindLocationSelectedLocation().pipe(take(1));
  }
}
