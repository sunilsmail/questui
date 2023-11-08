import { Location } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PscAvailabilityQuery, PscLocationAvailability, UserLocation } from 'shared/models';
import { Appointment } from 'shared/models/appointment';
import { ReasonCategory } from 'shared/models/reason-category';
import { AnalyticsService } from 'shared/services/analytics.service';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { RouteService } from 'shared/services/route.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-find-lcn-appt-scheduler',
  templateUrl: './as-find-lcn-appt-scheduler.component.html',
  styleUrls: ['./as-find-lcn-appt-scheduler.component.scss']
})
export class AsFindLcnApptSchedulerComponent implements OnInit, OnDestroy {
  mapEnable = false;
  searchEnabled = true;
  existingAppt: any;
  activeIndex = -1;
  appointmentHasValidDate = true;

  @Output() appointment = new EventEmitter<any | null>();
  loading$ = new Subject<boolean>();
  selectedDate$ = new ReplaySubject<string>(1);
  pscs$ = new Observable<PscLocationAvailability>();
  content = homeContent;
  userLocation$ = new ReplaySubject<UserLocation>(1);
  pscs: PscLocationAvailability[];
  addresses$ = new ReplaySubject<string[]>(1);
  today = new Date();
  selectedIndex = -1;
  enableContinue: boolean;
  selectedData: Appointment;
  reasonForVisit: ReasonCategory;
  selectedTests: ReasonCategory[];
  previousUrl: string;
  backUrl: string;
  reqParams: any;
  destroy$ = new Subject<void>();
  selectedDate: string;
  isMultipleReasons: boolean;
  reasonDataForCompare: any;
  selectedZipcode: any;
  imageSrc: any;
  isReview = false;
  isEditFromSummaryPage = false;
  facilityServiceId: any;
  siteCode: string;
  phone: string;
  dataQuery: any;
  filterSlots: any;
  enableNewUI$ = new Observable<boolean>();
  schedulerMaintenance$: Observable<boolean>;

  constructor(private psc: PscService,
    private dateService: DateService,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private location: Location,
    private appointmentService: AppointmentService,
    private googleMapService: GoogleMapsService,
    private analyticsService: AnalyticsService,
    private propertiesService: PropertiesService,
    private pscDetailsService: PscDetailsService,
    private routeService: RouteService
  ) {
    // this.previousUrl = '/schedule-appointment/as-reason-for-visit';
    // this.previousUrl = '/find-location/as-location-finder-reason';

  }

  ngOnInit() {
    this.previousUrl = this.routeService.getPreviousUrl();
    this.enableNewUI$ = this.pscDetailsService.getEnableNewUi();
    this.filterSlots = this.dataService.getPeaceOfMindState()!=null ? this.dataService.getPeaceOfMindState() : true;
    this.schedulerMaintenance$ = this.propertiesService.getSchedulerMaintenancef964();
    this.getappointmentData();
    // this.getPreviousPage();
    this.getReasonData();
    this.dataService.getReasonDataFindLocation().pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.dataQuery = data;
    });
    this.getUserLocation();
    this.pscs$ = combineLatest(this.selectedDate$).pipe(
      tap(() => this.loading$.next(true)),
      map(([date]) => ({ date })),
      switchMap((params) => {
        let facilityIds = [];
        if (this.dataService.facilityServiceIds && this.dataService.facilityServiceIds.length > 0) {
          facilityIds = this.dataService.facilityServiceIds;
        } else {
          facilityIds = Array.isArray(this.dataQuery.facilityServiceId) ? this.dataQuery.facilityServiceId :
            [this.dataQuery.facilityServiceId];
        }
        const query: PscAvailabilityQuery = {
          siteCode: this.dataQuery.siteCode,
          serviceType: null,
          facilityServiceId: facilityIds,
          date: params.date,
          toDate: params.date,
          fromDate: params.date,
        };
        this.selectedDate = params.date;
        return this.psc.getPscDetailsWithSlots(query);
      }),
      map(item => {
        this.loading$.next(false);
        return { ...item[0], ...item[1], distance : this.appointmentService.distance};
      }),
    );
    this.existingAppt ? this.selectedDate$.next(this.existingAppt.appointmentDate) :
      this.selectedDate$.next(this.dateService.toDate(this.today.toString()));
  }

  goToPrevious() {
   this.location.back();
    // this.router.navigate(['/find-location/as-location-finder-details']);
  }

  getReasonData() {
    this.dataService.getReasonData().pipe(takeUntil(this.destroy$)).subscribe((reasonData: ReasonCategory) => {
      this.reasonForVisit = reasonData;
      this.reasonDataForCompare = reasonData;
      // this.backUrl = '/find-location/as-location-finder-reason';
      this.reqParams = reasonData && reasonData.serviceRequestor ? { reason: reasonData.serviceRequestor } : null;
    });
  }

  /* getPreviousPage(){
   this.dataService.getPreviousPage().subscribe((url: string) => {
      this.backUrl = url;
    });

  } */

  onDateChanged(date: string) {
    this.selectedDate$.next(this.dateService.toDate(date));
  }
  getUserLocation() {
    this.dataService.getUserLocation().pipe(takeUntil(this.destroy$)).subscribe((userLocation: any) => {
      this.userLocation$.next(userLocation);
      this.addresses$.next([userLocation.address1, userLocation.address2,
      userLocation.city, userLocation.state, userLocation.zip, '', userLocation.siteHoursStatus]);
    });
  }
  newAppt(data: Appointment, selectedIndex) {

    // this data is the selected appointment data that
    // can be used making the api call
    if (data) {
      this.enableContinue = true;
    } else {
      this.enableContinue = false;

    }
    this.selectedIndex = selectedIndex;
    // this.selectedData = data;
    if (data) {
      const appt: Appointment = {
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        siteCode: this.dataQuery.siteCode,
        name: this.dataQuery.name,
        address1: this.dataQuery.address1,
        address2: this.dataQuery.address2,
        city: this.dataQuery.city,
        state: this.dataQuery.state,
        zip: this.dataQuery.zip,
        phone: this.dataQuery.phone,
        labCard: this.dataQuery.labCard,
        latitude: this.dataQuery.latitude,
        longitude: this.dataQuery.longitude
      };
      this.existingAppt = null;
      this.selectedData = appt;
    }
  }
  getappointmentData() {
    this.dataService.getappointmentData().pipe(takeUntil(this.destroy$)).subscribe((existingAppt: any) => {
      this.existingAppt = existingAppt ? existingAppt.data : null;
      this.selectedIndex = existingAppt ? existingAppt.selectedIndex : -1;
      this.selectedZipcode = existingAppt ? existingAppt.data.zip : null;
    });
  }
  private setLocationSelectedAnalytics() {
    const location= {
      v: 11,
      locationName:this.selectedData.name,
      distance: 25,
      timeSelected: this.selectedData.appointmentTime,
      city: this.selectedData.city,
      state: this.selectedData.state
    };
    this.analyticsService.locationSearch(location);
  }
  onContinue() {
    this.dataService.setlocationFlowtoSchedule(false);
    this.selectedData = this.existingAppt ? this.existingAppt : this.selectedData;
    this.setLocationSelectedAnalytics();
    this.dataService.setappointmentData({ data: this.selectedData, selectedIndex: this.selectedIndex });
    this.router.navigate(['/schedule-appointment/as-personal-information']);
  }
  navigateToLocations() {
    this.psc.fromFindMyLocationFlow = true;
    // this.dataService.setReasonType(false);
    this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
  }
  enableContinueButton(data) {
    setTimeout(() => {
      this.enableContinue = data;
    });
  }

  parseTime(time12h) {
    const [time, modifier] = time12h.split(' ');

    // tslint:disable-next-line: prefer-const
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
