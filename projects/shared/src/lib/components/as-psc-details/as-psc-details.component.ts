import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PscLocationAvailability } from 'shared/models';
import { Appointment } from 'shared/models/appointment';
import { DataService } from 'shared/services/data.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { default as homeContent } from '../../../../../appointment/assets/content.json';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'as-psc-details',
  templateUrl: './as-psc-details.component.html',
  styleUrls: ['./as-psc-details.component.scss']
})
export class AsPscDetailsComponent implements OnInit {
  @Output() newAppt = new EventEmitter();
  @Output() enableContinue = new EventEmitter();
  @Output() selectedLocation = new EventEmitter();
  @Input() filterSlots: any;
  @Input() dataQuery: any;
  @Input() facilityServiceId: [];
  morningSlots: any[] = [];
  afternoonSlots: any[] = [];
  URL = 'https://www.sonoraquest.com/';
  _active: PscLocationAvailability;
  findLocationFlow: boolean;
  appointmentFlow: boolean;
  siteHoursStatusMsg: string;
  siteHoursStatusDuration: string;
  appointmentsOnly: string;
  destroy$ = new Subject<void>();
  showSiteCode$ = new Observable<boolean>();
  showFindlocationSiteCode$ = new Observable<boolean>();
  isAuthUser$ = new Observable<boolean>();
  content = homeContent;
  data: any;
  @Input()
  set psc(psc: PscLocationAvailability) {
    this._psc = psc;
    // tslint:disable-next-line: max-line-th
    this._psc.scheduleAppt = this.dataService.locationFlowWithScheduleApp
                                ? this.dataService.setSceduleApp : this.setScheduleAppt(psc.scheduleAppt);
    this.dataService.clearScheduleAppFlag(false);
    const msg = this._psc.siteHoursStatus ? this._psc.siteHoursStatus.split('-') : '';
    if (msg[0]) {
      this.siteHoursStatusMsg = msg[0].trim();
    }
    this.siteHoursStatusDuration = msg[1];
    this.appointmentsOnly = msg[2];
    // tslint:disable-next-line: max-line-length
    const siteType = this.dataQuery !== undefined ? this.dataQuery.siteType : psc.siteType;
    // tslint:disable-next-line: max-line-length
    const timing = this.filterSlots === true && siteType !== 'PSA' ? Number(this.filterTiming(this.dataQuery !== undefined ? this.dataQuery.pscTimings.split('-')[0] : psc.pscTimings.split('-')[0])) : 0;
    // separate the time slots morning and afternoon
    if (psc.availability && psc.availability.length > 0) {
      let indexOf12 = psc.availability[0].slots.map((slot) => {
        return +slot.time.replace(':', '');
      }).findIndex(slot => slot >= 1200);
      indexOf12 = indexOf12 !== -1 ? indexOf12 : psc.availability[0].slots.length;
      // let indexOfTiming = psc.availability[0].slots.map((slot) => {
      //   return +slot.time.replace(':', '');
      // }).findIndex(slot => slot >= timing);
      // indexOfTiming = indexOfTiming !== -1 ? indexOfTiming : psc.availability[0].slots.length;
      // const daySiteFilter = this.dataQuery!==undefined ? this.dataQuery.pscTimings : psc.pscTimings;
      // if(daySiteFilter==='24 HRS-24 HRS' && this.filterSlots === true){
      //   const closeTiming = psc.availability[0].slots.map((slot) => {
      //     return +slot.time.replace(':', '');
      //   }).findIndex(slot => slot >= 600);
      //   const openTiming = psc.availability[0].slots.map((slot) => {
      //     return +slot.time.replace(':', '');
      //   }).findIndex(slot => slot >= 700);
      //   this.filterSlotsVal = psc.availability[0].slots.slice(0, closeTiming);
      //   this.morningSlots = psc.availability[0].slots.slice(openTiming,indexOf12);
      //   this.morningSlots=this.filterSlotsVal.concat(this.morningSlots);
      //   this.afternoonSlots = psc.availability[0].slots.slice(indexOf12);
      // }else{
      //   this.filterSlotsVal = psc.availability[0].slots.slice(0, indexOfTiming);
      this.morningSlots = psc.availability[0].slots.slice(0, indexOf12);
      this.afternoonSlots = psc.availability[0].slots.slice(indexOf12);
      // }
    } else {
      this.findLocationFlow = true;
    }
  }
  @Input()
  isFindLocationFlow: boolean;
  @Input()
  selectedDate: string;
  @Input() showMapIcon = true;
  @Input()
  set active(active) {
    // this._active = active;
    this._active = active;
  }
  existingApptTime: any;
  @Input()
  set existingAppt(existingAppt) {
    this.existingApptTime = (existingAppt &&
      ((existingAppt.siteCode === this._psc.siteCode) || (existingAppt.siteCode && this.isFindLocationFlow)) &&
      existingAppt.appointmentDate === this.selectedDate) ? existingAppt.appointmentTime : null;
  }

  morning = true;
  _psc: PscLocationAvailability;
  filterSlotsVal: any[];
  private pscMorningTimeSubject = new BehaviorSubject(this.morningSlots);
  pscMorningTime$ = this.pscMorningTimeSubject.asObservable();
  private pscAfternoonTimeSubject = new BehaviorSubject(this.morningSlots);
  pscAfternoonTime$ = this.pscAfternoonTimeSubject.asObservable();

  timeSelected = false;
  show = false;

  // for WCAG compliance
  distanceAria: string;
  pscNameAria: string;
  pinIconAria = 'pin icon';


  constructor(private pscService: PscService,
    private i18n: I18n,
    private dataService: DataService,
    private pscDetailsService: PscDetailsService,
    private userService: UserService,
    private propertyService: PropertiesService,) { }

  ngOnInit() {
    this.showSiteCode$ = this.pscDetailsService.getEnableSiteCode();
    this.showFindlocationSiteCode$ = this.pscDetailsService.getFindLocationEnableSiteCode();
    this.isAuthUser$ = this.userService.isAuthenticated$;
    this.ariaLabelAssembly();
    //  make the slots array empty when all availablity is false in morning or afternoon
    if (!this.findLocationFlow) {
      const isMorningTimeAvailable = this.morningSlots ? this.morningSlots.findIndex(slot => slot.available === true) : -1;
      const isAfternoonTimeAvailable = this.afternoonSlots ? this.afternoonSlots.findIndex(slot => slot.available === true) : -1;
      if (isMorningTimeAvailable === -1) {
        this.morningSlots.length = 0;
      }
      if (isAfternoonTimeAvailable === -1) {
        this.afternoonSlots.length = 0;
      }
    }

    // emitting timeslots as observable to feed into as-loading-container
    this.pscService.hasMorning$.subscribe(value => {
      if (value) {
        this.morning = true;
        this.pscMorningTimeSubject.next(this.morningSlots);
      } else {
        this.morning = false;
        this.pscAfternoonTimeSubject.next(this.afternoonSlots);
      }
    });
    this.dataService.getlocationFlowtoSchedule().pipe(takeUntil(this.destroy$)).subscribe((flow: boolean) => {
      if (flow) {
        this.getUserLocation();
      }
    });
  }

  selectedTime(time) {
    const appt: Appointment = {
      appointmentDate: this._psc.availability[0].date,
      appointmentTime: time,
      siteCode: this._psc.siteCode,
      name: this._psc.name,
      address1: this._psc.address1,
      address2: this._psc.address2,
      city: this._psc.city,
      state: this._psc.state,
      zip: this._psc.zip,
      phone: this._psc.phone,
      labCard: this._psc.labCard,
      latitude: this._psc.latitude,
      longitude: this._psc.longitude,
      facilityServiceId: this.facilityServiceId
    };
    if (this.data && this.data.siteCode) {
      appt.siteCode = this.data.siteCode;
      appt.zip = this.data.zip;
      appt.name = this.data.name;
      appt.address1 = this.data.address1;
      appt.address2 = this.data.address2;
      appt.city = this.data.city;
      appt.state = this.data.state;
      appt.phone = this.data.state;
    }
    if (time) {
      this.newAppt.emit(appt);
    } else {
      this.newAppt.emit(null);
    }
  }
  getUserLocation() {
    this.dataService.getUserLocation().pipe(takeUntil(this.destroy$)).subscribe((userLocation: any) => {
      this.data = userLocation;
    });
  }
  onSelectedLocation() {
    this.selectedLocation.emit(this._psc);
  }

  enableContinueButton(data: boolean) {
    this.enableContinue.emit(data);
  }

  //  for WCAG compliance
  ariaLabelAssembly() {
    this.distanceAria = this.i18n('Distance from your location: ' + this._psc.distance + ' miles');
    this.pscNameAria = this.i18n(this._psc.name + ' location: '
      + this._psc.address1 + ' City: ' + this._psc.city + ' State: '
      + this._psc.state + ' Zip: ' + this._psc.zip);
  }

  filterTiming(timing: string) {
    if (timing.split(':').length > 1) {
      const timeHour = Number(timing.split(':')[0]) + 1;
      const timeMin = timing.split(':')[1];
      return timeHour + '' + timeMin;
    }
    return 0;
  }
  goToOtherWebsite(): void {
    window.open(this.URL, '_blank');
  }
  setScheduleAppt(scheduleAppt) {
    if (scheduleAppt === null || scheduleAppt === undefined) {
      return true;
    } else {
      return scheduleAppt;
    }
  }

  // DE23132 Accessibility Fix
  scrollTo(el: HTMLElement) {
    const header = document.getElementsByTagName('header')[0];
    const calender = document.getElementById('as_scheduler');
    if (header && calender) {
      const top = el.offsetTop - (header.offsetHeight + calender.offsetHeight);
      window.scrollTo(0, top);
    }
  }
}
