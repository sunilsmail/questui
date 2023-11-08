import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { PscLocationAvailability } from 'shared/models';

@Injectable({
  providedIn: 'root'
})
export class FindlocationDataService {
  private findLocationDetailSubject = new ReplaySubject<PscLocationAvailability>(1);
  findLocationDetailSubject$ = this.findLocationDetailSubject.asObservable();

  constructor() { }
  setfindLocationDetails(data) {
    this.findLocationDetailSubject.next(data);
  }
  getfindLocationDetails() {
    return this.findLocationDetailSubject$;
  }
}
