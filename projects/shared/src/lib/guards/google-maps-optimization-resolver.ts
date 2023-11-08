import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PropertiesService } from 'shared/services/properties.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsOptimizationResolver implements Resolve<any>  {
  constructor(private propertiesService: PropertiesService) { }
  public resolve(): Observable<boolean> {
    return this.propertiesService.getGooglemapsOptimizationF4191();
  }
}
