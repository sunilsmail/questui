import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockSkipInsuranceService {

  constructor() { }
  setSkipInsurance(disable) {
    return of();
  }
  getSkipInsurance(): Observable<boolean> {
    return of();
  }
  getReasonItems(){
    return of();
  }
  setCovidReasonSelected(disable: boolean) { }
  getCovidReasonSelected(): Observable<boolean> {
    return of(true);
  }
}
