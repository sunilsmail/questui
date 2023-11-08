import { Location } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { combineLatest, of, Observable, ReplaySubject, Subject } from 'rxjs';
import { catchError, filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { AsGenderFieldsDialogComponent } from 'shared/components/as-gender-fields-dialog/as-gender-fields-dialog.component';
import { PersonalData, PscAvailabilityQuery, PscLocationAvailability, PscLocationAvailabilityQuery, UserLocation } from 'shared/models';
import { Appointment } from 'shared/models/appointment';
import { ModifyAppointment, ModifyAppointmentResponse } from 'shared/models/create-appointment-data';
import { EorderAppointment, EorderModifyAppointmentData, EorderPersonalInformation } from 'shared/models/eorder';
import { GenderFeildsWithState, GenderMandatoryFields, GenderRaceOptions } from 'shared/models/gender-race-options';
import { ReasonCategory, ReasonEditState } from 'shared/models/reason-category';
import { AnalyticsService } from 'shared/services/analytics.service';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { LocationService } from 'shared/services/maps/location-service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { default as homeContent } from '../../../../../assets/content.json';


@Component({
  selector: 'as-eorder-appt-scheduler',
  templateUrl: './as-eorder-appt-scheduler.component.html',
  styleUrls: ['./as-eorder-appt-scheduler.component.scss']
})
export class AsEorderApptSchedulerComponent implements OnInit, OnDestroy {
  numResults = 20;
  mapEnable = false;
  searchEnabled = true;
  existingAppt: any;
  activeIndex = -1;
  appointmentHasValidDate = true;

  @Output() appointment = new EventEmitter<any | null>();
  @Output() locationChanged = new EventEmitter<boolean>();
  loading$ = new Subject<boolean>();
  selectedDate$ = new ReplaySubject<string>(1);
  pscs$: Observable<PscLocationAvailability[]>;
  content = homeContent;
  hasChangedLocation = false;
  userLocation$ = new ReplaySubject<UserLocation>(1);
  labCardPscs: PscLocationAvailability[];
  addresses$ = new ReplaySubject<string[]>(1);
  today = new Date();
  selectedIndex = -1;
  enableContinue: boolean;
  selectedData: EorderAppointment;
  reasonForVisit: ReasonCategory;
  selectedTests: ReasonCategory[];
  previousUrl: string;
  reqParams: any;
  previousUrlWithParams: string;
  destroy$ = new Subject<void>();
  existingUserLocation: UserLocation;
  selectedDate: string;
  // showLocations: number;
  isMultipleReasons: boolean;
  reasonDataForCompare: any;
  selectedZipcode: any;
  imageSrc: any;
  isReview = false;
  isEditFromSummaryPage = false;
  existingApptData: any;
  confirmationCode: string;
  facilityServiceId: any;
  previousPage: string;
  siteCode: string;
  // firstName: any;
  phone: string;
  modifyAppointmentInfo: ModifyAppointment;
  destination: string;
  isLabCard: boolean;
  labCard: string;
  isFindLocationFlow: boolean;
  reasonData: any;
  orderDetails: any;
  userLocation: any;
  // tslint:disable-next-line: max-line-length
  appointmentData: { address1: any; address2: any; appointmentDate: any; appointmentTime: any; city: any; labCard: boolean; latitude: any; longitude: any; name: any; phone: any; siteCode: any; state: any; zip: any; };
  pscLocationAvailability: any;
  backState = false;
  isAlternateFlow: boolean;
  blnShowError = false;
  showLnNotSupportedError: boolean;
  hideBlnError: boolean;
  facilityTypeValue: any;
  siteCodeSelected: any;
  altReview: boolean;
  userPhone: string;
  appoinmentDataSummary: EorderModifyAppointmentData;
  newAppointObject: EorderModifyAppointmentData;
  locLoading = false;
  enableNewUI$ = new Observable<boolean>();
  initOffset = 0;
  private _enableShowMore = false;
  pscs: PscLocationAvailability[] = [];
  islocChange = false;
  modifiedSelectedDate = null;
  genderRaceOptions: GenderRaceOptions[] = [];
  mandatoryFields: GenderMandatoryFields = null;
  personalInformation: EorderPersonalInformation = null;
  googlemapsOptimizationF4191 = false;
  constructor(private psc: PscService,
    private dateService: DateService,
    private dataService: DataService,
    private eorderService: EorderService,
    private eorderDataService: EorderDataService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private appointmentService: AppointmentService,
    private googleMapService: GoogleMapsService,
    private location: Location,
    private analyticsService: AnalyticsService,
    private propertiesService: PropertiesService,
    private pscDetailsService: PscDetailsService,
    private route: ActivatedRoute,
    private genderFieldsService: GenderFieldsService,
    public dialog: MatDialog,
    private locationService: LocationService,
  ) {
    // this.phone = this.findAppointmentservice.phone;
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
    this.getAppointmentDataSummary();
    this.getblnEditReasonData();
    this.getAltEditFlow();
    this.getPreviousUrl();
    this.getAlternateFlowStatus();
    if (this.altReview) {
      this.getappointmentDataReview();
    } else if (!this.isReview && !this.backState) {
      this.getAppointmentDataForEdit();
    } else {
      this.getappointmentDataReview();
    }
    this.getTestsData();
    this.getReasonType();
    this.previousUrl = '/eorder/as-eorder-personal-information';
    this.eorderDataService.getlabCardLocationSearch().subscribe((labCardData: boolean | {}) => {
      if (typeof (labCardData) === 'boolean') {
        this.isLabCard = labCardData;
      } else {
        this.labCard = labCardData['labCard'];
      }
    });
    if (!this.isReview) {
      this.existingAppt ? this.selectedDate$.next(this.existingAppt.appointmentDate) :
        this.selectedDate$.next(this.dateService.toDate(this.today.toString()));
    }
    this.pscs$ = this.getLocationDateObservable$();
    this.getUserLocation();
    this.getVerificationInfo();
    this.getUserDemoData();
  }

  getAppointmentDataForEdit() {
    this.eorderService.getEncounterInfoWithoutCahce('appointment').subscribe((encounter: any) => {
      if (encounter.appointment) {
        if (encounter.appointment.appointmentDate !== null) {
          this.existingAppt = encounter.appointment;
          const appointmetDateAndTime = encounter.appointment.appointmentDate.split('T');
          encounter.appointment.appointmentDate = appointmetDateAndTime[0];
          encounter.appointment.appointmentTime = appointmetDateAndTime[1].split(':').splice(0, 2).join(':');
          const query = {
            // date: params.date,// this.today.toString(),
            toDate: encounter.appointment.appointmentDate,
            fromDate: encounter.appointment.appointmentDate
          };
          this.psc.appointmentWithPscIsAvailable(query, encounter.appointment.appointmentTime).subscribe((data) => {
            if (data && !this.isReview && !this.backState) {
              this.selectedZipcode = encounter.appointment.siteDetails.siteZip ? encounter.appointment.siteDetails.siteZip : null;
              this.editAppointment(encounter.appointment);
            } else {
            }
          });
        } else {
          this.showLnNotSupportedError = false;
        }
        if (encounter.appointment.facilityServiceId) {
          this.facilityServiceId = encounter.appointment.facilityServiceId;
          this.eorderDataService.setFacilityServiceId(this.facilityServiceId);
        }
        this.confirmationCode = encounter.appointment.confirmation ? encounter.appointment.confirmation : null;
        if (this.confirmationCode) {
          this.eorderDataService.setConfirmationCode(this.confirmationCode);
        }
      }
    });
  }

  getAlternateFlowStatus() {
    this.eorderDataService.getAlternateFlow().subscribe(res => {
      this.isAlternateFlow = res;
      if (this.isAlternateFlow) {
        this.getReasonNotSupportedError();
        this.getblnShowLocError();
      }
    });
  }
  getAlternateFacilityID() {
    this.eorderDataService.getAltFacilityServiceID().subscribe(id => {
      this.facilityServiceId = id;
    });
  }
  getPscAvailability(appointment) {
    this.hasChangedLocation = true;
    const zip = appointment.siteDetails ? appointment.siteDetails.siteZip : appointment.zip;
    this.googleMapService.getLatLngByZipcode(zip)
      .subscribe((coords: any) => {
        this.getPscAvailabilityLogic(appointment, coords);
      }, (error) => {
        const response = error.data;
      });
  }
  getPscAvailabilityWithOutGoogleMaps(appointment) {
    this.hasChangedLocation = true;
    const zip = appointment.siteDetails ? appointment.siteDetails.siteZip : appointment.zip;
    const coords = this.locationService.getLatLngByZipcode(zip);
    this.getPscAvailabilityLogic(appointment, coords);
  }

  getPscAvailabilityLogic(appointment, coords) {
    if (coords?.latitude && coords?.longitude) {
      const userLocation: UserLocation = {
        latitude: coords.latitude,
        longitude: coords.longitude
      };
      this.onLocationChange(userLocation);
      this.getAppointment(appointment);
    }
    else if (appointment?.latitude && appointment?.longitude) {
      const userLocation: UserLocation = {
        latitude: appointment.latitude,
        longitude: appointment.longitude
      };
      this.onLocationChange(userLocation);
      this.getAppointment(appointment);
    } else {
      this.eorderDataService.getappointmentData().pipe(take(1)).subscribe((existingAppt: any) => {
        const userLocation: UserLocation = {
          latitude: existingAppt.data.latitude,
          longitude: existingAppt.data.longitude
        };
        this.onLocationChange(userLocation);
        this.getAppointment(appointment);
      });
    }
  }

  getAppointment(appointment: any) {

    if (this.isReview) {
      this.selectedDate$.next(appointment.appointmentDate);
    }
    if (parseInt(appointment.appointmentTime, 10) >= 12) {
      this.psc.hasMorning$.next(false);
    }
    this.selectedZipcode = appointment.siteDetails ? appointment.siteDetails.siteZip ?
      appointment.siteDetails.siteZip : null : appointment.zip;
    if (appointment.appointmentDate.includes('T')) {
      const appointmetDateAndTime = appointment.appointmentDate.split('T');
      appointment.appointmentDate = appointmetDateAndTime[0];
      appointment.appointmentTime = appointmetDateAndTime[1].split(':').splice(0, 2).join(':');
    }
    this.existingAppt = {
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      siteCode: appointment.siteDetails ? appointment.siteDetails.appointmentSite : appointment.siteCode,
      name: appointment.siteDetails ? appointment.siteDetails.siteName : appointment.name,
      address1: appointment.siteDetails ? appointment.siteDetails.siteAddress1 : appointment.address1,
      address2: appointment.siteDetails ? appointment.siteDetails.siteAddress2 : appointment.address2,
      city: appointment.siteDetails ? appointment.siteDetails.siteCity : appointment.city,
      state: appointment.siteDetails ? appointment.siteDetails.siteState : appointment.state,
      zip: appointment.siteDetails ? appointment.siteDetails.siteZip : appointment.zip,
      phone: appointment.siteDetails ? appointment.siteDetails.phone : appointment.phone,
      confirmation: appointment.confirmation,
    };
    this.selectedDate = appointment.appointmentDate;
  }

  getFacilitySeviceTypeValue() {
    this.eorderDataService.getFacilityServiceType().subscribe(res => {
      this.facilityTypeValue = res;
    });
  }
  checkAppointmentExist(selectedAppointment) {
    this.siteCodeSelected = selectedAppointment.siteDetails ?
      selectedAppointment.siteDetails.appointmentSite : selectedAppointment.siteCode;
    const params: PscAvailabilityQuery = {
      siteCode: selectedAppointment.siteDetails ? selectedAppointment.siteDetails.appointmentSite : selectedAppointment.siteCode,
      date: selectedAppointment.appointmentDate,
      serviceType: null,
      facilityServiceId: this.facilityServiceId,
      fromDate: selectedAppointment.appointmentDate,
      toDate: selectedAppointment.appointmentDate
    };
    this.getFacilitySeviceTypeValue();
    this.loading$.next(true);
    let showLnNotSupportedError: boolean; // check reason changed supports location
    this.psc.getPscDetails(this.siteCodeSelected).subscribe(details => {
      const servicesNotSupported = details.servicesNotOffered;
      for (let i = 0; i < this.facilityTypeValue.length; i++) {
        if (servicesNotSupported.includes(this.facilityTypeValue[i])) {
          showLnNotSupportedError = true;
          break;
        } else {
          showLnNotSupportedError = false;
        }
      }
      if (!showLnNotSupportedError) {
        this.psc.appointmentIsAvailable(params, selectedAppointment.appointmentTime).subscribe((data) => {
          this.loading$.next(false);
          this.eorderDataService.setReasonNotSupportedError(false);
          if (data) {
            this.eorderDataService.setblnShowLocError(false);
            this.eorderDataService.setblnEditReasonData(false);
          } else {
            this.eorderDataService.setblnShowLocError(true);
          }
        }, (error) => {
          // ERROR HANDLING HERE
          this.loading$.next(false);
        });
      } else {
        this.eorderDataService.setReasonNotSupportedError(true);
      }
    });
  }
  editAppointment(appointment) {
    this.confirmationCode = appointment.timeTradeConfirmationNumber;
    this.facilityServiceId = appointment.facilityServiceId ? appointment.facilityServiceId : this.facilityServiceId;
    this.siteCode = appointment.siteDetails ? appointment.siteDetails.appointmentSite : appointment.siteCode;
    if (this.isAlternateFlow) {
      this.getAlternateFacilityID();
      this.checkAppointmentExist(appointment);
    }
    if (!this.googlemapsOptimizationF4191) {
      this.getPscAvailability(appointment);
    } else {
      this.getPscAvailabilityWithOutGoogleMaps(appointment);
    }
  }
  getappointmentDataReview() {
    if (this.altReview) {
      this.getAlternateFacilityID();
    } else {
      this.eorderDataService.getFacilityServiceId().subscribe(id => {
        this.facilityServiceId = id;
      });
    }
    this.eorderDataService.getappointmentData().pipe(take(1)).subscribe((existingAppt: any) => {
      this.existingAppt = existingAppt ? existingAppt.data : null;
      this.selectedIndex = existingAppt ? existingAppt.selectedIndex : null;
      this.selectedZipcode = existingAppt ? existingAppt.data.zip : null;
      this.siteCode = this.existingAppt.siteCode;
      // this.hasChangedLocation = true;
      this.editAppointment(this.existingAppt);
    });
  }
  getPreviousUrl() {
    this.dataService.getPreviousPage().pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.previousPage = data;
    });
    this.eorderDataService.getAppointmentNavigation().subscribe((status) => {
      if (status) {
        this.backState = true;
      }
    });
  }

  goToPrevious() {
    this.eorderDataService.setPreviousUrlDemographic(true);
    this.eorderDataService.setAppointmentNavigation(true);
    this.eorderDataService.setblnEditReasonData(false, this.router.url);
    this.location.back();
  }

  getVerificationInfo() {
    this.dataService.getVerificationInfo().pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.phone = data.phone;
      this.confirmationCode = data.confirmationCode;
    });
  }

  getAppointmentDataSummary() {
    this.eorderDataService.getappointmentDataForEdit().subscribe(data => {
      this.appoinmentDataSummary = data;
      this.existingAppt = data.appointmentDetails;
      this.confirmationCode = data.confirmationCode;
      this.userPhone = data.demographics.demographics.phone;
    });
  }

  getUserLocation() {
    this.dataService.getUserLocation().pipe(takeUntil(this.destroy$)).subscribe((userLocation: UserLocation) => {
      if (this.existingAppt && this.existingUserLocation !== userLocation) {
        this.existingUserLocation = userLocation;
        // this.hasChangedLocation = true;
        // this.userLocation$.next(userLocation);
        this.onLocationChange(userLocation);
      }
    });
  }

  getLocationDateObservable$() {
    return combineLatest(this.userLocation$, this.selectedDate$).pipe(
      filter(() => this.hasChangedLocation),
      tap(() => this.loading$.next(true)),
      map(([loc, date]) => ({ loc, date })),
      switchMap(params => {
        this.modifiedSelectedDate = params.date;
        const query: PscLocationAvailabilityQuery = {
          // date: params.date,// this.today.toString(),
          toDate: params.date,
          fromDate: params.date,
          ...this.getLatLongSelected(params),
          // longitude: params.loc.longitude,
          // latitude: params.loc.latitude,
          maxReturn: this.numResults,
          facilityServiceId: this.facilityServiceId,
          firstPscToReturn: 0,
          miles: 25,
          filterForAvailability: false, // switch to false request from bhimesh
          includeWaitTime: false,
          onlyAvailableSlots: false,
          offset: (this.initOffset * 5),
        };
        setTimeout(() => {
          this.enableContinue = false;
        });
        // this.selectedDate = params.date;
        // this.showLocations = 5;
        if (this.labCard === 'true') {
          query.labCard = true;
        } else {
          query.labCard = this.isLabCard;
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
        this.labCardPscs = pscs;
      }
      ),
      tap(() => {
        this.loading$.next(false);
        this.locLoading = false;
      }, () => {
        this.loading$.next(false);
        this.locLoading = false;
      })
    );
  }

  getblnEditReasonData() {
    this.eorderDataService.getblnEditReasonData().pipe(takeUntil(this.destroy$)).subscribe((blnEdit: ReasonEditState) => {
      this.isReview = blnEdit.blnedit;
      this.destination = blnEdit.route === this.router.url ? '/eorder/as-eorder-review-details' : blnEdit.route;
    });
  }

  getAltEditFlow() {
    this.eorderDataService.getAltEditFlow().subscribe((value: boolean) => {
      this.altReview = value;
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

  // showmore() {
  //   this.showLocations += 5;
  // }

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
      state: this.selectedData.state
    };
    this.analyticsService.locationSearch(location);
  }
  onContinue() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'confirmationCode': this.confirmationCode,
      }
    };
    if (this.existingAppt) {
      this.existingAppt = { ...this.existingAppt, appointmentDate: this.modifiedSelectedDate };
    }
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
    this.selectedData.labCard = this.getLabcardFromSiteCode(this.selectedData.siteCode);
    this.dataService.setPreviousPage('/eorder/as-eorder-appt-scheduler');
    this.dataService.setblnEditReasonData(false);
    this.eorderDataService.setappointmentData({ data: this.selectedData, selectedIndex: this.selectedIndex });
    if (this.isReview) {
      this.router.navigate([this.destination]);
    } else if (this.altReview) {
      this.router.navigate(['/eorder/as-eorder-review-details']);
    } else if (this.eorderDataService.isEditFromEorderSummary) {
      this.modifyAppointment();
    }
    else {
      this.router.navigate(['/eorder/as-eorder-insurance-information']);
    }
  }

  enableContinueButton(data) {
    setTimeout(() => {
      this.enableContinue = data;
    });
  }

  modifyAppointment() {
    this.modifyAppointmentInfo = {
      channel: 'AS Web',
      labCard: false,
      authentication: {
        'confirmationCode': this.confirmationCode,
        'phone': this.userPhone
      },
      slot: {
        'siteCode': this.selectedData.siteCode,
        'facilityServiceId': this.facilityServiceId,
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
    this.locLoading = true;
    this.appointmentService.modifyAppointment(this.modifyAppointmentInfo).subscribe((res: ModifyAppointmentResponse) => {
      this.locLoading = false;
      if (res.confirmationCode) {
        this.dataService.setNewapptData(res);
        const navigationExtras: NavigationExtras = {
          queryParams: {
            'confirmationCode': res.confirmationCode,
          }
        };
        if (this.isLabCard === true || this.labCard === 'true') {
          const newAppointObject = {
            siteCode: this.selectedData.siteCode,
            firstName: this.selectedData.name,
            facilityServiceId: this.facilityServiceId,
            appointmentDate: this.selectedData.appointmentDate,
            appointmentTime: this.selectedData.appointmentTime,
            labCard: JSON.parse(this.selectedData.labCard)
          };
          this.appoinmentDataSummary.appointmentDetails = newAppointObject;
          this.appoinmentDataSummary.appointmentDetails.facilityServiceId = this.facilityServiceId;
          this.appoinmentDataSummary.insuranceData.insurance.labCard = JSON.parse(this.selectedData.labCard);
          this.eorderDataService.setappointmentDataForEdit(this.appoinmentDataSummary);
          this.router.navigate(['/eorder/as-eorder-insurance-information']);
        } else {
          this.router.navigate(['/eorder/as-eorder-price-estimate']);
        }
      } else {
        // show error
      }
    }, (error) => {
      this.locLoading = false;
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
  // check whether location selected supports reason changed
  getReasonNotSupportedError() {
    this.eorderDataService.getReasonNotSupportedError().pipe(takeUntil(this.destroy$)).subscribe((showerror: any) => {
      this.showLnNotSupportedError = showerror;
    });
  }
  getblnShowLocError() {
    this.eorderDataService.getblnShowLocError().pipe(takeUntil(this.destroy$)).subscribe((showerror: any) => {
      this.blnShowError = showerror;
    });
  }
  getLabcardFromSiteCode(siteCode: string): string {
    if (this.labCardPscs && this.labCardPscs.length > 0) {
      return this.labCardPscs.filter(x => x.siteCode === siteCode)[0].labCard;
    }
    return null;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByFn(index, item: PscLocationAvailability) {
    return item.siteCode;
  }

  showmore() {
    if (this.initOffset < 4) {
      this.islocChange = false;
      this.initOffset++;
      this.locLoading = true;
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
        this.mandatoryFields = { ...value };
        this.eorderDataService.setPersonalInformation({
          ...this.personalInformation,
          ...this.mandatoryFields
        });
        const paramas = {
          demographics:
          {
            ...this.personalInformation,
            ...this.mandatoryFields,
            dateOfBirth: this.dateService.toDate(this.personalInformation.dob),
            phone: this.personalInformation.phone?.replace(/\-+/g, ''),
            email: this.personalInformation?.emailAddress,
          },
          emailNotify: this.personalInformation.preferences.preference_email,
          smsNotify: this.personalInformation.preferences.preference_mobile
        };
        this.eorderService.saveEncounter(paramas).subscribe();
        this.onContinueClick();
      }
    });
  }

  getGenderFieldsFromApi() {
    if (this.route.snapshot && this.route.snapshot.data) {
      this.genderRaceOptions = this.route.snapshot.data.fields;
      this.googlemapsOptimizationF4191 = this.route.snapshot.data?.f4191;
    }
  }

  getUserDemoData() {
    this.eorderDataService.getPersonalInformation().subscribe((data: EorderPersonalInformation) => {
      this.personalInformation = data;
    });
  }

}
