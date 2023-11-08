import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDeeplinkReasonService {

  reasonsListArray = [];
  constructor() { }
  newReasonDeeplink() {
  }
  getDefaultReason() {
    return of([]);
  }
}
