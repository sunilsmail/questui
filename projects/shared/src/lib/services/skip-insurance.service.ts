import { Injectable } from '@angular/core';
import { forkJoin, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReasonCategory } from 'shared/models/reason-category';
import { AppointmentService } from './appointment.service';

@Injectable({
  providedIn: 'root'
})
export class SkipInsuranceService {
  private skipInsurance = new ReplaySubject<any>(1);
  public skipInsurance$ = this.skipInsurance.asObservable();
  destroy$ = new Subject<void>();
  result: ReasonCategory;
  private covidReasonSelected = new ReplaySubject<boolean>(1);
  public covidReasonSelected$ = this.covidReasonSelected.asObservable();

  private parentByFacilityId = new ReplaySubject<ReasonCategory>(1);
  parentByFacilityId$ = this.parentByFacilityId.asObservable();
  storeServiceRequestor: any[];

  constructor(private appointmentService: AppointmentService) { }
  setSkipInsurance(disable) {
    this.skipInsurance.next(disable);
  }
  getSkipInsurance(): Observable<boolean> {
    return this.skipInsurance$;
  }
  setCovidReasonSelected(disable: boolean) {
    this.covidReasonSelected.next(disable);
  }
  getCovidReasonSelected(): Observable<boolean> {
    return this.covidReasonSelected$;
  }
  public getReasonItems() {
    return forkJoin(this.appointmentService.getReasons('MAIN').pipe(takeUntil(this.destroy$)),
      this.appointmentService.getReasons('GLUCOSE').pipe(takeUntil(this.destroy$)),
      this.appointmentService.getReasons('EMPLOYER').pipe(takeUntil(this.destroy$))
    );
  }
}
