import { Injectable } from '@angular/core';
import { forkJoin, BehaviorSubject,Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { serviceRequestorEnum, ReasonCategory } from 'shared/models/reason-category';
import { AppointmentService } from './appointment.service';

@Injectable({
  providedIn: 'root'
})
export class DeeplinkService {
  destroy$ = new Subject<void>();
  private backArrowdeepLinkSubject = new BehaviorSubject<boolean>(false);
  backArrowdeepLinkSubject$ = this.backArrowdeepLinkSubject.asObservable();

  private backArrowLocationDetailsSubject = new BehaviorSubject<boolean>(false);
  backArrowLocationDetailsSubject$ = this.backArrowLocationDetailsSubject.asObservable();

  private reasondisableSubject = new BehaviorSubject<boolean>(false);
  reasondisableSubject$ = this.reasondisableSubject.asObservable();

  constructor(private appointmentService: AppointmentService) { }
  public getReasonItems(){
    return forkJoin(this.appointmentService.
      getReasons(serviceRequestorEnum.main, new ReasonCategory(), true).pipe(takeUntil(this.destroy$)),
      this.appointmentService.getReasons(serviceRequestorEnum.glucose, new ReasonCategory(), true).pipe(takeUntil(this.destroy$)),
      this.appointmentService.getReasons(serviceRequestorEnum.employer, new ReasonCategory(), true).pipe(takeUntil(this.destroy$))
    );
  }
  isMultiselectDeeplink(value: string): boolean {
    let retVal = false;
    if (value.includes(',')) {
      const unique = value.split(',').filter((v, i, a) => a.indexOf(v) === i && v !== '');
      retVal = unique.length > 1;
    }
    return retVal;
  }
  getDeeplinkReason(value: string): string {
    let retVal = value;
    if (value.includes(',')) {
      const unique = value.split(',').filter((v, i, a) => a.indexOf(v) === i && v !== '');
      if (unique.length === 1) {
        retVal = unique[0];
      }
    }
    return retVal;
  }
  setFlagFindLocationDisableBackArrow (data) {
    this.backArrowdeepLinkSubject.next(data);
  }
  getFlagFindLocationDisableBackArrow() {
    return this.backArrowdeepLinkSubject$;
  }
  setFlgFindLocationDetailDisableBackArrow (data) {
    this.backArrowLocationDetailsSubject.next(data);
  }
  getFlagFindLocationDetailDisableBackArrow() {
    return this.backArrowLocationDetailsSubject$;
  }
  setFlagFordisableReason (data) {
    this.reasondisableSubject.next(data);
  }
  getFlagFordisableReason() {
    return this.reasondisableSubject$;
  }
}
