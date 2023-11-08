import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PscDetails, PscFullDaySlots, PscLocationAvailability, PscTimeSlot } from 'shared/models';
import { Appointment } from 'shared/models/appointment';
import { DataService } from 'shared/services/data.service';
import { FindlocationDataService } from 'shared/services/findLocation/findlocation-data.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { UserService } from 'shared/services/user.service';
import { default as homeContent } from '../../../../../appointment/assets/content.json';
import { AsLocationDetailsDialogComponent } from './../as-location-details-dialog/as-location-details-dialog.component';
@Component({
  selector: 'as-psc-details-new',
  templateUrl: './as-psc-details-new.component.html',
  styleUrls: ['./as-psc-details-new.component.scss']
})
export class AsPscDetailsNewComponent implements OnInit {

  /** variable declation START */
  URL = 'https://www.sonoraquest.com/';
  _active: PscLocationAvailability;
  findLocationFlow: boolean;
  appointmentFlow: boolean;
  siteHoursStatusMsg: string;
  siteHoursStatusDuration: string;
  appointmentsOnly: string;
  destroy$ = new Subject<void>();
  data: any;
  existingApptTime: any;
  morning = true;
  _psc: PscLocationAvailability;
  morningSlots: Array<PscTimeSlot> = [];
  afternoonSlots: Array<PscTimeSlot> = [];
  pscDaySlots: PscFullDaySlots = new PscFullDaySlots();
  timeSelected = false;
  show = false;
  content = homeContent;
  index: number;
  // for WCAG compliance
  distanceAria: string;
  pscNameAria: string;
  pinIconAria = 'pin icon';
  private pscFullDaySlotsSubject = new BehaviorSubject(this.pscDaySlots);
  pscFullDaySlotsSubject$ = this.pscFullDaySlotsSubject.asObservable();
  siteCodeAria: string;
  showSiteCode$ = new Observable<boolean>();
  findLocationDetials: PscLocationAvailability;
  showFindlocationSiteCode$ = new Observable<boolean>();
  isAuthUser$ = new Observable<boolean>();
  loading = false;
  existingApptdata = null;
  uniqueId: number;
  /** variable declation END */

  /** input/output properties declation START */
  @Output() newAppt = new EventEmitter();
  @Output() enableContinue = new EventEmitter();
  @Output() selectedLocation = new EventEmitter();
  @Input() filterSlots: any;
  @Input() dataQuery: any;
  @Input() facilityServiceId: [];
  @Input()
  set psc(psc: PscLocationAvailability) {
    this.setPsc(psc);
    if (this.existingApptdata) {
      this.updateSlotTime(this.existingApptdata);
    }
  }
  @Input() isFindLocationFlow: boolean;
  @Input() selectedDate: string;
  @Input() showMapIcon = true;
  @Input()
  set active(active) {
    this._active = active;
  }
  @Input()
  set existingAppt(existingAppt) {
    this.existingApptdata = existingAppt;
    this.updateSlotTime(existingAppt);
  }
  @Input() isAppScheduleFlow = false;
  @Input() showCloserMessage = false;
  /** input/output properties declation END */


  constructor(private pscService: PscService,
    private dialog: MatDialog,
    private i18n: I18n,
    private dataService: DataService,
    private pscDetailsService: PscDetailsService,
    private uiPropertyService: PropertiesService,
    private findLocationService: FindlocationDataService,
    private userService: UserService,
    private router:Router) { }


  updateSlotTime(existingAppt: any) {
    this.existingApptTime = (existingAppt && this._psc &&
      ((existingAppt.siteCode === this._psc.siteCode) || (existingAppt.siteCode && this.isFindLocationFlow)) &&
      existingAppt.appointmentDate === this.selectedDate) ? existingAppt.appointmentTime : null;
  }

  ngOnInit() {
    this.index = new Date().getTime();
    this.showFindlocationSiteCode$ = this.pscDetailsService.getFindLocationEnableSiteCode();
    this.isAuthUser$ = this.userService.isAuthenticated$;
    this.showSiteCode$ = this.pscDetailsService.getEnableSiteCode();
    this.ariaLabelAssembly();
    this.pscDaySlots.pscMorningTime = this.morningSlots;
    this.pscDaySlots.pscAfternoonTime = this.afternoonSlots;
    this.pscFullDaySlotsSubject.next(this.pscDaySlots);

    this.dataService.getlocationFlowtoSchedule().pipe(takeUntil(this.destroy$)).subscribe((flow: boolean) => {
      if (flow) {
        this.getUserLocation();
      }
    });
    this.findLocationService.getfindLocationDetails().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.findLocationDetials = res;
    });
     this.uniqueId = new Date().getTime();
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

  onSelectedLocationKey(event) {
    if (event.key === 'Enter') {
      this.router.navigateByUrl('/find-location/as-location-finder-details');
      this.onSelectedLocation();
    }
  }

  enableContinueButton(data: boolean) {
    this.enableContinue.emit(data);
  }

  //  for WCAG compliance
  ariaLabelAssembly() {
    this.distanceAria = this.i18n(`Distance from your location: ${this._psc.distance} miles`);
    // this.pscNameAria = this.i18n(this._psc.name + ' location: '
    //   + this._psc.address1 + ' City: ' + this._psc.city + ' State: '
    //   + this._psc.state + ' Zip: ' + this._psc.zip);
    // tslint:disable-next-line: max-line-length
    this.pscNameAria = this.i18n(`${this._psc.name} location: ${this._psc.address1} City: ${this._psc.city} State: ${this._psc.state} Zip: ${this._psc.zip}`);
    this.siteCodeAria = this.i18n(`Site Code ${this._psc.siteCode}`);
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
  scrollTo(el: HTMLElement, event) {
    const header = document.getElementsByTagName('header')[0];
    const calender = document.getElementById('as_scheduler');
    if (header && calender) {
      const top = el.offsetTop - (header.offsetHeight + calender.offsetHeight);
      window.scrollTo(0, top);
    }
    event.stopPropagation();
    event.preventDefault();
  }

  setPsc(psc: PscLocationAvailability) {
    this._psc = psc;
    this._psc.scheduleAppt = this.dataService.locationFlowWithScheduleApp ?
      this.dataService.setSceduleApp : this.setScheduleAppt(psc.scheduleAppt);
    this.dataService.clearScheduleAppFlag(false);
    const msg = this._psc.siteHoursStatus ? this._psc.siteHoursStatus.split('-') : '';
    if (msg[0]) {
      this.siteHoursStatusMsg = msg[0].trim();
    }
    this.siteHoursStatusDuration = msg[1];
    this.appointmentsOnly = msg[2];
    const siteType = this.dataQuery !== undefined ? this.dataQuery.siteType : psc.siteType;
    const timing = this.filterSlots === true && siteType !== 'PSA' ?
      Number(this.filterTiming(this.dataQuery !== undefined ? this.dataQuery.pscTimings.split('-')[0] : psc.pscTimings.split('-')[0])) : 0;
    // separate the time slots morning and afternoon
    if (psc.availability && psc.availability.length > 0) {
      let indexOf12 = psc.availability[0].slots.map((slot) => {
        return +slot.time.replace(':', '');
      }).findIndex(slot => slot >= 1200);
      indexOf12 = indexOf12 !== -1 ? indexOf12 : psc.availability[0].slots.length;
      this.morningSlots = psc.availability[0].slots.slice(0, indexOf12);
      this.afternoonSlots = psc.availability[0].slots.slice(indexOf12);
    } else {
      this.findLocationFlow = true;
    }
  }

  openViewLocationDetailsDialog() {
    const { siteCode, distance, appointmentsOnly } = this._psc;
    this.loading = true;
    this.pscService.getPscDetails(siteCode).pipe(takeUntil(this.destroy$)).subscribe((details: PscDetails) => {
      this.loading = false;
      this.dialog.open(AsLocationDetailsDialogComponent, {
        panelClass: ['ds-modal', '--scroll-box', 'ds-grid--12', 'ds-elevation--L3'],
        disableClose: false, data: {
          siteCode, distance, appointmentsOnly
        }
      });
    }, () => {
      this.loading = false;
    });
  }
}
