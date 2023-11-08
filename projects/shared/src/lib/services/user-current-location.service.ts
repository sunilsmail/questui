import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserLocation } from 'shared/models';

const CURRENT_POSITION_OPTIONS: PositionOptions = {
  timeout: 10000,
  enableHighAccuracy: false,
  maximumAge: 0
};

const QUEST_HEADQUARTERS_LOCATION = {
  longitude: -74.04402809999999,
  latitude: 40.7865504
};

@Injectable({
  providedIn: 'root'
})
export class UserCurrentLocationService {
  private userCurrentLocationSubject: ReplaySubject<UserLocation> = new ReplaySubject(1);
  private userCurrentLocation$: Observable<UserLocation> = this.userCurrentLocationSubject.asObservable();
  loaded = false;
  showLocationDetectIcon = true;

  constructor() { }

  getCurrentPosition(useDefaultOnError: boolean = true): Observable<UserLocation> {
    // console.log(useDefaultOnError);
    if (!this.loaded) {
      navigator.geolocation.getCurrentPosition(
        this.positionSuccess,
        error => {
          this.positionError(useDefaultOnError);
        },
        CURRENT_POSITION_OPTIONS
      );
    }
    return this.userCurrentLocation$.pipe(take(1));
  }

  private positionSuccess = (position: any): void => {
    // console.log(position);
    const { longitude, latitude } = position.coords;
    this.userCurrentLocationSubject.next({ longitude, latitude });
    this.loaded = true;
  }

  private positionError = (useDefault: boolean): void => {
    this.showLocationDetectIcon = false;
    if (useDefault) {
      // console.log(QUEST_HEADQUARTERS_LOCATION);
      this.userCurrentLocationSubject.next(QUEST_HEADQUARTERS_LOCATION);
    } else {

      // console.log('null its null');
      this.userCurrentLocationSubject.next(null);
    }
  }
}
