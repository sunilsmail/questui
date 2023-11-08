import { Location } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { combineLatest, of, Observable, ReplaySubject, Subject } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { AsGenderFieldsDialogComponent } from 'shared/components/as-gender-fields-dialog/as-gender-fields-dialog.component';
import {
  GetlabsLocationRequest, GetlabsResponse, PersonalData, PscLocationAvailability,
  PscLocationAvailabilityQuery, UserLocation
} from 'shared/models';
import { Appointment, ModifyAppointmentData, ModifyCancelAppointmentData } from 'shared/models/appointment';
import { ModifyAppointment, ModifyAppointmentResponse } from 'shared/models/create-appointment-data';
import { GenderFeildsWithState, GenderMandatoryFields, GenderRaceOptions } from 'shared/models/gender-race-options';
import { ReasonCategory, ReasonEditState } from 'shared/models/reason-category';
import { AnalyticsService } from 'shared/services/analytics.service';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { FindAppointmentService } from 'shared/services/find-appointment.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { LocationService } from 'shared/services/maps/location-service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { RouteService } from 'shared/services/route.service';
import { TealiumAnalyticsService } from 'shared/services/tealium-analytics.service';
import { TealiumEventService } from 'shared/services/tealium-event.service';
import { UserCurrentLocationService } from 'shared/services/user-current-location.service';
import { UserService } from 'shared/services/user.service';
import { HomeCollectionsService } from '../../../../../../shared/src/lib/services/home-collections/home-collections.service';
import { default as homeContent } from '../../../../../assets/content.json';
import { AsGetlabsDialogComponent } from '../as-getlabs-dialog/as-getlabs-dialog.component';
import { AsGetlabsLearnMoreDialogComponent } from '../as-getlabs-learn-more-dialog/as-getlabs-learn-more-dialog.component';
import { AsPeaceOfMindTestDialogComponent } from '../as-peace-of-mind-test-dialog/as-peace-of-mind-test-dialog.component';
import { AsPurchaseMyOwnTestDialogComponent } from '../as-purchase-my-own-test-dialog/as-purchase-my-own-test-dialog.component';
@Component({
  selector: 'as-appt-scheduler-without-google-maps',
  templateUrl: './as-appt-scheduler-without-google-maps.component.html',
  styleUrls: ['./as-appt-scheduler-without-google-maps.component.scss']
})
export class AsApptSchedulerWithoutGoogleMapsComponent implements OnInit, OnDestroy {

  @Output() appointment = new EventEmitter<any | null>();
  @Output() locationChanged = new EventEmitter<boolean>();

  numResults = 5;
  locationsLoading = false;
  mapEnable = false;
  searchEnabled = true;
  existingAppt: any;
  activeIndex = -1;
  isLoggedIn = false;
  appointmentHasValidDate = true;
  loading$ = new Subject<boolean>();
  selectedDate$ = new ReplaySubject<string>(1);
  pscs$: Observable<PscLocationAvailability[]>;
  content = homeContent;
  cardContent = [];
  hasChangedLocation = false;
  userLocation$ = new ReplaySubject<UserLocation>(1);
  pscs: PscLocationAvailability[] = [];
  today = new Date();
  selectedIndex = -1;
  enableContinue: boolean;
  selectedData: Appointment;
  reasonForVisit: ReasonCategory;
  selectedTests: ReasonCategory[];
  previousUrl = '/schedule-appointment/as-reason-for-visit';
  reqParams: any;
  previousUrlWithParams: string;
  destroy$ = new Subject<void>();
  existingUserLocation: UserLocation;
  selectedDate: string;
  isMultipleReasons: boolean;
  reasonDataForCompare: any;
  selectedZipcode: any;
  imageSrc: any;
  blnShowError = false;
  isReview = false;
  isEditFromSummaryPage = false;
  existingApptData: any;
  confirmationCode: string;
  facilityServiceId: any;
  previousPage: string;
  siteCode: string;
  phone: string;
  modifyAppointmentInfo: ModifyAppointment;
  destination: string;
  isLabCard = 'false';
  isFindLocationFlow: boolean;
  filterSlots: boolean;
  facilityTestTypeValue: string;
  showLnNotSupportedError: boolean;
  hideBlnError: boolean;
  appoinmentDataSummary: ModifyCancelAppointmentData;
  loading = false;
  appointmentData: ModifyAppointmentData;
  enableNewUI$ = new Observable<boolean>();
  view: string;
  asHomeService$ = new Observable<boolean>();
  displayLab = false;
  modifyAppointmentData: any;
  userdefinedZip: string;
  initOffset = 0;
  _enableShowMore = false;
  islocChange = false;
  labRedicredtedLink: any;
  genderRaceOptions: GenderRaceOptions[] = [];
  mandatoryFields: GenderMandatoryFields = null;
  personalInformation: PersonalData;
  constructor(private psc: PscService,
    private dateService: DateService,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private appointmentService: AppointmentService,
    private locationService: LocationService,
    private location: Location,
    public dialog: MatDialog,
    private analyticsService: AnalyticsService,
    private propertiesService: PropertiesService,
    private pscDetailsService: PscDetailsService,
    private findAppointmentService: FindAppointmentService,
    private tealiumAnalyticsService: TealiumAnalyticsService,
    private userService: UserService,
    private routeService: RouteService,
    private tealiumEventService: TealiumEventService,
    private userCurrentLocationService: UserCurrentLocationService,
    private route: ActivatedRoute,
    private genderFieldsService: GenderFieldsService,
    private homeCollectionsService: HomeCollectionsService,
  ) {
    this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/ds-images/ds-icon-error-24.svg`);
  }

  get enableShowMore(): boolean {
    return this._enableShowMore;
  }
  set enableShowMore(value: boolean) {
    this._enableShowMore = value;
  }

  ngOnInit() {
    this.getGenderFieldsFromApi();
    this.enableNewUI$ = this.pscDetailsService.getEnableNewUi();
    this.asHomeService$ = this.propertiesService.getHomeService().pipe(tap((flag) => {
      if (flag) {
        this.locationOnchange();
      }
    }));
    this.setUiType();
    this.getPreviousUrl();
    this.getAppointmentDataForEdit();
    this.getReasonData();
    this.getTestsData();
    this.getReasonNotSupportedError();
    this.getblnShowLocError();
    this.getReasonType();
    this.getappointmentData();
    this.getblnEditReasonData();
    if (this.dataService.isModifyCancel) {
      this.getAppointmentDataSummary();
    }
    this.userService.isAuthenticated$.subscribe((isAuth) => {
      this.isLoggedIn = isAuth;
    });
    this.dataService.getlocationFlowtoSchedule().pipe(takeUntil(this.destroy$)).subscribe((flow: boolean) => {
      if (flow) {
        this.getAppointmentDataForLocation();
        this.previousUrl = '/find-location/as-location-finder-reason';
      } else {
        this.previousUrl = '/schedule-appointment/as-reason-for-visit';
        if (this.dataService.isMainCovidActiveInfectionSelected) {
          this.previousUrl = '/schedule-appointment/as-active-infection-symptoms';
        }
      }
    });
    this.dataService.getlabCardLocationSearch().subscribe((labCardData: any) => {
      this.isLabCard = labCardData.labCard;
    });
    this.pscs$ = this.getLocationDateObservable$();
    // this.pscs$ = this.psc.getPscsWithAvailability(null).pipe(delay(3000));
    this.existingAppt ? this.selectedDate$.next(this.existingAppt.appointmentDate) :
      this.selectedDate$.next(this.dateService.toDate(this.today.toString()));
    // this.pscs$ = of(this.pscs);
    this.getUserLocation();
    this.getVerificationInfo();
    this.getFacilitySeviceTypeValue();
    // this.getLocationDataForEdit();
    if (this.dataService.isMainCovidActiveInfectionSelected) {
      this.previousUrl = '/schedule-appointment/as-active-infection-symptoms';
    }
    this.setPreviousUrlForEdit();
    this.getUserDemoData();
  }

  setUiType() {
    this.enableNewUI$.subscribe((val) => {
      if (val) {
        this.view = 'new';
      } else {
        this.view = 'old';
      }
    });
  }

  // check whether location selected supports reason changed
  getReasonNotSupportedError() {
    this.dataService.getReasonNotSupportedError().pipe(takeUntil(this.destroy$)).subscribe((showerror: any) => {
      this.showLnNotSupportedError = showerror;
    });
  }


  getPreviousUrl() {
    this.dataService.getPreviousPage().pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.previousPage = data;
    });
  }

  goToPrevious() {
    this.location.back();
  }

  getVerificationInfo() {
    if (this.appointmentData && this.appointmentData.appointmentDetails) {
      if (!this.appointmentData.appointmentDetails.skipVerifyIdentity) {
        this.dataService.getVerificationInfo().pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
          this.phone = data.phone;
          this.confirmationCode = data.confirmationCode;
        });
      } else {
        this.phone = this.appointmentData.appointmentDetails.demographicDetails.phone;
        this.confirmationCode = this.appointmentData.confirmationCode;
      }
    }
  }
  getAppointmentDataSummary() {
    this.dataService.getmodifyAppointmentDataForEdit().subscribe((data) => {
      this.appoinmentDataSummary = data;
      this.confirmationCode = data.confirmationCode;
      this.phone = data.demographicData.phone;
    });
  }
  getUserLocation() {
    this.dataService.getUserLocation().pipe(takeUntil(this.destroy$)).subscribe((userLocation: UserLocation) => {
      if (this.existingAppt && this.existingUserLocation !== userLocation) {
        this.existingUserLocation = userLocation;
        this.hasChangedLocation = true;
        this.userLocation$.next(userLocation);
      }
    });
  }

  getLocationDateObservable$() {
    return combineLatest([this.userLocation$, this.selectedDate$]).pipe(
      filter(() => this.hasChangedLocation),
      tap(() => this.loading$.next(true)),
      map(([loc, date]) => ({ loc, date })),
      mergeMap(params => {
        const query: PscLocationAvailabilityQuery = {
          toDate: params.date,
          fromDate: params.date,
          ...this.getLatLongSelected(params),
          maxReturn: this.numResults,
          facilityServiceId: this.facilityServiceId ?
            this.facilityServiceId : this.getFacilityService(),// [ this.reasonForVisit.facilityServiceId ],
          firstPscToReturn: 0,
          miles: 25,
          filterForAvailability: false, // switch to false request from bhimesh
          includeWaitTime: false,
          onlyAvailableSlots: false,
          offset: (this.initOffset * 5),
        };

        if (query.facilityServiceId[0] === 28) {
          query.serviceType = 'ASYMPTOMATIC COVID TEST';
          query.accessType = 'ps-nys';
        }
        if (this.dataService.searchCovidAppointmentsBy) {
          query.facilityServiceId = [this.dataService.searchCovidAppointmentsBy];
          query.accessType = 'COVID-19 OBSERVED';
        }
        if (this.dataService.siteType) {
          query.siteType = this.dataService.siteType;
        }
        setTimeout(() => {
          this.enableContinue = false;
        });
        this.selectedDate = params.date;
        if (this.isLabCard === 'true') {
          query.labCard = true;
        }

        return this.psc
          .getPscsWithAvailability(query)
          .pipe(catchError(() => of(new Array<PscLocationAvailability>())));
      }),
      map((result) => {
        const output = [...this.pscs, ...result];
        this.pscs = output;
        this.enableShowMore = (this.pscs.length < 20 && result.length >= 5);
        return output;
      }),
      tap(pscs => {
        if (this.existingAppt && !this.hideBlnError && !this.blnShowError) {
          this.blnShowError = pscs.filter(psc => psc.siteCode === this.existingAppt.siteCode).length === 0;
          this.dataService.setblnShowLocError(this.blnShowError);
        }
      }
      ),
      tap(() => { this.loading$.next(false); this.locationsLoading = false; },
        () => { this.loading$.next(false); this.locationsLoading = false; })
    );
  }

  getblnEditReasonData() {
    this.dataService.getblnEditReasonData().pipe(takeUntil(this.destroy$)).subscribe((blnEdit: ReasonEditState) => {
      this.isReview = blnEdit.blnedit;
      this.destination = blnEdit.route === this.router.url ? '/schedule-appointment/as-review-details' : blnEdit.route;
    });
  }

  getappointmentData() {
    this.dataService.getappointmentData().pipe(takeUntil(this.destroy$)).subscribe((existingAppt: any) => {
      this.existingAppt = existingAppt ? existingAppt.data : null;
      this.selectedIndex = existingAppt ? existingAppt.selectedIndex : null;
      this.selectedZipcode = existingAppt ? existingAppt.data.zip : null;
      if (this.previousPage === '/schedule-appointment/as-review-details') {
        this.selectedIndex = null;
        this.existingAppt.appointmentTime = null;
      }
    });
  }

  getReasonType() {
    this.dataService.getReasonType().pipe(takeUntil(this.destroy$)).subscribe((isMultiple: boolean) => {
      this.isMultipleReasons = isMultiple;
    });
  }

  getTestsData() {
    this.dataService.getTestsData().pipe(takeUntil(this.destroy$)).subscribe((testsData: ReasonCategory[]) => {
      this.selectedTests = testsData;
    });
  }

  getReasonData() {
    this.dataService.getReasonData().pipe(takeUntil(this.destroy$)).subscribe((reasonData: ReasonCategory) => {
      if (typeof reasonData === 'string') {
        this.reasonForVisit = reasonData;
        this.reasonDataForCompare = reasonData;
        // this.previousUrl = '/schedule-appointment/as-reason-for-visit';
        this.reqParams = reasonData ? { reason: reasonData } : null;
        this.previousUrlWithParams = reasonData ?
          '/schedule-appointment/as-reason-for-visit?reason=' + reasonData : this.previousUrl;
      } else {
        this.reasonForVisit = reasonData;
        this.reasonDataForCompare = reasonData;
        // this.previousUrl = '/schedule-appointment/as-reason-for-visit';
        this.reqParams = reasonData && reasonData.serviceRequestor ? { reason: reasonData.serviceRequestor } : null;
        this.previousUrlWithParams = reasonData && reasonData.serviceRequestor ?
          '/schedule-appointment/as-reason-for-visit?reason=' + reasonData.serviceRequestor : this.previousUrl;
      }
    });
  }

  getblnShowLocError() {
    this.dataService.getblnShowLocError().pipe(takeUntil(this.destroy$)).subscribe((showerror: any) => {
      this.blnShowError = showerror;
    });
  }

  getFacilitySeviceTypeValue() {
    if (!this.selectedTests) {
      if (this.reasonForVisit && this.reasonForVisit.facilityTestTypeValue) {
        this.facilityTestTypeValue = this.reasonForVisit.facilityTestTypeValue;
      }
    } else if (this.selectedTests && this.selectedTests.length === 1) {
      this.facilityTestTypeValue = this.selectedTests[0].facilityTestTypeValue;
    } else if (this.selectedTests && this.selectedTests.length > 1) {
      this.facilityTestTypeValue = 'Multiple Drug Tests';
    }
  }

  getFacilityService() {
    const facilityServiceId = [];
    if (this.selectedTests && this.selectedTests.length !== 0 && this.isMultipleReasons) {
      this.selectedTests.forEach(selectedTest => facilityServiceId.push(selectedTest.facilityServiceId));
    } else if (this.selectedTests && this.selectedTests.length !== 0 &&
      !this.isMultipleReasons && (this.reasonDataForCompare?.serviceRequestor === 'GLUCOSE'
        || this.reasonDataForCompare?.serviceRequestor === 'PURCHASETEST')) {
      this.selectedTests.forEach(selectedTest => facilityServiceId.push(selectedTest.facilityServiceId));
    }
    else {
      facilityServiceId.push(this.reasonForVisit.facilityServiceId);
    }
    return facilityServiceId;
  }

  onLocationChange(location: UserLocation) {
    this.islocChange = true;
    this.pscs.length = 0;
    this.hasChangedLocation = true;
    this.locationChanged.emit(true);
    this.existingUserLocation = location;
    this.userLocation$.next(location);
    this.dataService.setUserLocation(location);
    this.blnShowError = false;
    this.hideBlnError = true;
    this.showLnNotSupportedError = false;
    this.dataService.setlocationFlowtoSchedule(false);
  }

  onDateChanged(date: string) {
    this.pscs.length = 0;
    this.selectedDate$.next(this.dateService.toDate(date));
  }

  newAppt(data: Appointment, selectedIndex) {
    this.blnShowError = false;
    // this data is the selected appointment data that
    // can be used making the api call
    if (data) {
      this.enableContinue = true;
    } else {
      this.enableContinue = false;

    }
    this.existingAppt = null;
    this.selectedIndex = selectedIndex;
    this.selectedData = data;
  }
  private setLocationSelectedAnalytics() {
    const location = {
      v: 11,
      locationName: this.selectedData.name,
      distance: 25,
      timeSelected: this.selectedData.appointmentTime,
      city: this.selectedData.city,
      state: this.selectedData.state,
      view: this.view
    };
    this.analyticsService.locationSearch(location);
  }
  onContinue() {
    this.selectedData = this.existingAppt ? this.existingAppt : this.selectedData;

    this.genderFieldsService.fieldsWithState = new GenderFeildsWithState(this.genderRaceOptions, this.selectedData.state);
    if (this.genderFieldsService.validateRequiredFields().length > 0) {
      this.showMandatoryFields();
      return false;
    }

    this.onContinueClick();

  }
  onContinueClick() {
    this.setLocationSelectedAnalytics();
    if (this.isEditFromSummaryPage || this.dataService.isModifyCancel) {
      this.modifyAppointment();
      // this.router.navigate(['/find-appointment/as-find-appointment-summary'], navigationExtras);
    } else if (this.isReview) {
      this.router.navigate([this.destination]);
    } else if (this.isLabCard === 'true') {
      this.router.navigate(['/schedule-appointment/as-insurance-information']);
    } else if (this.previousPage && this.previousPage !== this.router.url && !this.psc.fromFindMyLocationFlow) {
      this.router.navigate([this.previousPage]);
      this.psc.fromFindMyLocationFlow = false;
    } else if (this.selectedTests) {
      this.router.navigate(['/schedule-appointment/as-personal-information']);
    } else {
      this.router.navigate(['/schedule-appointment/as-personal-information']);
    }
    this.dataService.setPreviousPage('/schedule-appointment/as-appt-scheduler');
    this.dataService.setblnEditReasonData(false);
    this.dataService.setReasonDataFindLocation(null);
    this.dataService.setblnShowLocError(false);
    this.dataService.setReasonNotSupportedError(false);
    this.dataService.setappointmentData({ data: this.selectedData, selectedIndex: this.selectedIndex });
  }

  enableContinueButton(data) {
    setTimeout(() => {
      this.enableContinue = data;
    });
  }

  getAppointmentDataForEdit() {
    this.dataService.getappointmentDataForEdit().subscribe((modifyAppointmentData: ModifyAppointmentData) => {
      const coords = this.locationService.getLatLngByZipcode(modifyAppointmentData.pscDetails.zip);
      this.isEditFromSummaryPage = true;
      this.hasChangedLocation = true;
      this.appointmentData = modifyAppointmentData;
      this.editAppointment(modifyAppointmentData);
      const userLocation: UserLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude
      };
      this.locationChanged.emit(true);
      this.userLocation$.next(userLocation);
    });
  }

  editAppointment(modifyAppointmentData: ModifyAppointmentData) {
    this.confirmationCode = modifyAppointmentData.confirmationCode;
    this.facilityServiceId = modifyAppointmentData.appointmentDetails.facilityServiceId;
    this.siteCode = modifyAppointmentData.pscDetails.siteCode;

    this.selectedIndex = modifyAppointmentData.pscLocationAvailability.availability[0].slots
      .findIndex(x => x.time === modifyAppointmentData.appointmentDetails.appointmentTime);

    if (parseInt(modifyAppointmentData.appointmentDetails.appointmentTime, 10) >= 12) {
      this.psc.hasMorning$.next(false);
    }
    this.selectedZipcode = modifyAppointmentData.pscDetails ? modifyAppointmentData.pscDetails.zip : null;
    this.existingAppt = {
      appointmentDate: modifyAppointmentData.appointmentDetails.appointmentDate,
      appointmentTime: modifyAppointmentData.appointmentDetails.appointmentTime,
      siteCode: modifyAppointmentData.pscDetails.siteCode,
      name: modifyAppointmentData.pscDetails.name,
      address1: modifyAppointmentData.pscDetails.address1,
      address2: modifyAppointmentData.pscDetails.address2,
      city: modifyAppointmentData.pscDetails.city,
      state: modifyAppointmentData.pscDetails.state,
      zip: modifyAppointmentData.pscDetails.zip,
      phone: modifyAppointmentData.pscDetails.phone
    };
    this.selectedDate = modifyAppointmentData.appointmentDetails.appointmentDate;
  }

  modifyAppointment() {

    this.modifyAppointmentInfo = {
      channel: 'AS Web',
      labCard: false,
      authentication: {
        'confirmationCode': this.confirmationCode,
        'phone': this.phone.replace(/-/g, '')
      },
      slot: {
        'siteCode': this.selectedData.siteCode,
        'facilityServiceId': this.facilityServiceId ?
          this.facilityServiceId : this.getFacilityService(),
        'appointmentDate': this.selectedData.appointmentDate,
        'appointmentTime': this.selectedData.appointmentTime,
      },
      notificationPreferences: {
        'pushNotificationOptIn': null,
      }
    };

    if (this.mandatoryFields) {
      this.modifyAppointmentInfo = {
        ...this.modifyAppointmentInfo,
        transgenderFields: {
          genderPreference: this.mandatoryFields.genderPreference,
          race: this.mandatoryFields.race,
          ethnicity: this.mandatoryFields.ethnicity,
          sexualOrientation: this.mandatoryFields.sexualOrientation,
        }
      };
    }

    this.loading = true;
    this.appointmentService.modifyAppointment(this.modifyAppointmentInfo).subscribe((res: ModifyAppointmentResponse) => {
      this.loading = false;
      if (res.confirmationCode) {
        this.modifyTealiumLogEvent();
        this.findAppointmentService.appointmentDetails = null;
        this.dataService.setNewapptData(res);
        const navigationExtras: NavigationExtras = {
          queryParams: {
            'confirmationCode': res.confirmationCode,
          }
        };
        if (this.isLabCard === 'true' && this.appoinmentDataSummary && this.dataService.isModifyCancel &&
          this.appoinmentDataSummary.appointmentDetails) {
          this.appoinmentDataSummary.appointmentDetails = this.existingAppt;
          this.appoinmentDataSummary.appointmentDetails.facilityServiceId = this.facilityServiceId ?
            this.facilityServiceId : this.getFacilityService();
          this.dataService.setmodifyAppointmentDataForEdit(this.appoinmentDataSummary);
          this.dataService.editScreenName = 'editInsuranceInfo';
          this.router.navigate(['/schedule-appointment/as-insurance-information']);
        }
        else if (this.isLabCard === 'true' && !this.dataService.isModifyCancel) {
          this.appointmentData.appointmentDetails = this.existingAppt;
          this.appointmentData.appointmentDetails.facilityServiceId = this.facilityServiceId ?
            this.facilityServiceId : this.getFacilityService();
          this.dataService.setappointmentDataForEdit(this.appointmentData);
          this.router.navigate(['/schedule-appointment/as-insurance-information']);
        }
        else {
          this.router.navigate(['/find-appointment/as-find-appointment-summary'], navigationExtras);
        }
      }
    }, (error) => {
      // show error
      this.loading = false;
      const loginId = this.userService.getUserLoginId();
      this.tealiumAnalyticsService.tealiumView(this.tealiumEventService.eventError(error, loginId, this.isLoggedIn));
    });
  }
  getAppointmentDataForLocation() {
    this.dataService.getReasonDataFindLocation().pipe(
      takeUntil(this.destroy$),
    ).subscribe((data: any) => {
      if (!this.selectedZipcode) {
        this.selectedZipcode = data ? data.zip : null;
      }
      const coords = this.locationService.getLatLngByZipcode(this.selectedZipcode);
      this.hasChangedLocation = true;
      this.selectedZipcode = data ? data.zip : this.selectedZipcode;
      const userLocation: UserLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude
      };
      this.locationChanged.emit(true);
      this.userLocation$.next(userLocation);
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

  // load zipcode from find location screen

  getLocationDataForEdit() {
    this.dataService.getfindLocationSelectedLocation()
      .subscribe((locationFinderData: PscLocationAvailability) => {
        const coords = this.locationService.getLatLngByZipcode(locationFinderData.zip);
        this.isEditFromSummaryPage = true;
        this.hasChangedLocation = true;
        this.selectedZipcode = locationFinderData.zip;
        const userLocation: UserLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude
        };
        this.locationChanged.emit(true);
        this.userLocation$.next(userLocation);
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AsPeaceOfMindTestDialogComponent, {
      panelClass: 'as-peace-of-mind',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((value) => {
      this.filterSlots = value;
      this.previousUrl = '/schedule-appointment/as-reason-for-visit';
    });
  }
  openPurchaseOwnDialog(): void {
    const dialogRef = this.dialog.open(AsPurchaseMyOwnTestDialogComponent, {
      panelClass: ['ds-modal', '--scroll-box', 'ds-grid--12', 'ds-elevation--L3'],
      autoFocus: false
    });
  }

  goToOtherWebsitePopup(): void {
    const dialogRef = this.dialog.open(AsGetlabsDialogComponent, {
      autoFocus: false
    });
  }
  learnMore(): void {
    const dialogRef = this.dialog.open(AsGetlabsLearnMoreDialogComponent, {
      autoFocus: false,
      panelClass: ['ds-modal', '--scroll-box', 'ds-grid--12', 'ds-elevation--L3'],
    });
  }
  bookNow(): void {
    this.homeCollectionsService.logBooknow();
    this.homeCollectionsService.saveHomeCollectionsMetrics().subscribe();
    window.open(this.pscDetailsService.labRedirectedLink, '_blank');

  }
  onZipProvide(zip) {
    this.userdefinedZip = zip;
  }
  locationOnchange() {
    this.userLocation$.pipe(
      mergeMap((location: UserLocation) => {
        return this.locationService.getLocByLatLong(location.latitude, location.longitude);
      }),
      mergeMap((address) => {
        const facilityId = this.facilityServiceId ? this.facilityServiceId : this.getFacilityService();
        this.homeCollectionsService.zipCode = address.zip;
        const body: GetlabsLocationRequest = {
          facilityServiceId: facilityId[0],
          city: this.userdefinedZip ? null : address.city,
          zipCode: address.zip,
          state: address.state,
          userdefinedZip: this.userdefinedZip ? this.userdefinedZip : null
        };
        if (this.dataService.searchCovidAppointmentsBy) {
          body.facilityServiceId = this.dataService.searchCovidAppointmentsBy;
        }
        return this.pscDetailsService.getLabsLocation(body);
      }),
    ).subscribe((res: GetlabsResponse) => {
      if (res) {
        this.displayLab = res.getLabsEnabled ? true : false;
        if (this.displayLab) {
          this.pscDetailsService.labRedirectedLink = res.supportedPartner[0].link;
          this.cardContent = res.supportedPartner[0].partnerText.split('\n');
          this.pscDetailsService.partnerName = res.supportedPartner[0].partnerName;
          this.pscDetailsService.homeCollectMetricsId = res.homeCollectMetricsId;
        }
      } else {
        this.displayLab = false;
      }
    });
  }

  setPreviousUrlForEdit() {
    if (this.isEditFromSummaryPage || this.dataService.isModifyCancel) {
      if (this.routeService.labcardRoute) {
        this.previousUrl = this.routeService.labcardRoute;
      } else {
        this.previousUrl = this.routeService.getSummaryUrl();
      }
    }
  }

  modifyTealiumLogEvent() {
    const appointmentDetailsTealium = {
      appointment_date: this.dateService.toDateMMDDYY(this.modifyAppointmentInfo.slot.appointmentDate),
      appointment_location_city: this.selectedData?.city,
      appointment_location_name: this.selectedData?.name,
      appointment_location_state: this.selectedData?.state,
      appointment_location_zip: this.selectedData?.zip,
      appointment_site_code: this.selectedData?.siteCode
    };
    const loginId = this.userService.getUserLoginId();
    if (this.isLoggedIn) {
      this.userService.userDemographics$.subscribe(resp => {
        this.tealiumAnalyticsService.tealiumView(
          this.tealiumEventService.modifyAppointment
            (appointmentDetailsTealium, resp, loginId, this.isLoggedIn, this.userCurrentLocationService.showLocationDetectIcon));
      });
    } else {
      this.tealiumAnalyticsService.tealiumView(
        this.tealiumEventService.modifyAppointment
          (appointmentDetailsTealium, null, loginId, this.isLoggedIn, this.userCurrentLocationService.showLocationDetectIcon));
    }
  }

  trackByFn(index, item: PscLocationAvailability) {
    return item.siteCode;
  }

  showmore() {
    if (this.initOffset < 4) {
      this.islocChange = false;
      this.initOffset++;
      this.locationsLoading = true;
      this.dataService.getUserLocation().pipe(take(1)).subscribe((userLocation: UserLocation) => {
        this.existingUserLocation = userLocation;
        this.hasChangedLocation = true;
        this.userLocation$.next(userLocation);
      });
    }
    this.loading$.next(false);
  }

  getLatLongSelected(selectedLatLong: any) {
    return {
      longitude: (this.existingAppt?.longitude && !this.islocChange) ? this.existingAppt?.longitude : selectedLatLong.loc.longitude,
      latitude: (this.existingAppt?.latitude && !this.islocChange) ? this.existingAppt?.latitude : selectedLatLong.loc.latitude,
    };
  }

  showMandatoryFields() {
    this.dialog.open(AsGenderFieldsDialogComponent, {
      panelClass: ['ds-modal', '--scroll-box', 'ds-grid--12', 'ds-elevation--L3'],
      autoFocus: false
    }).afterClosed().subscribe((value: GenderMandatoryFields) => {
      if (value) {
        this.mandatoryFields = value;
        this.dataService.setPersonalData({
          ...this.personalInformation,
          ...this.mandatoryFields
        });
        this.onContinueClick();
      }
    });
  }

  getGenderFieldsFromApi() {
    if (this.route.snapshot && this.route.snapshot.data) {
      this.genderRaceOptions = this.route.snapshot.data.fields;
    }
  }

  getUserDemoData() {
    this.dataService.getPersonalData().subscribe((data: PersonalData) => {
      this.personalInformation = data;
    });
  }

}
