import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PropertiesService } from 'shared/services/properties.service';

@Injectable({
  providedIn: 'root'
})
export class GenderRaceOptionsResolver implements Resolve<any>  {
  constructor(private propertiesService: PropertiesService) { }
  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.propertiesService.getGenderRaceOptions();
  }
}
