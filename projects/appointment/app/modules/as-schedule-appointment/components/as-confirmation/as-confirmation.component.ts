import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Appointment, AppointmentData, AppointmentDetails } from 'shared/models/appointment';
import { Calendar } from 'shared/models/calendar';
import { CreateAppointmentResponse } from 'shared/models/create-appointment-data';
import { PersonalData } from 'shared/models/index';
import { PrintData } from 'shared/models/print-data';
import { PscDetails } from 'shared/models/psc';
import { ReasonCategory } from 'shared/models/reason-category';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { FindAppointmentService } from 'shared/services/find-appointment.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-confirmation',
  templateUrl: './as-confirmation.component.html',
  styleUrls: ['./as-confirmation.component.scss'],

  animations: [
    trigger('EnterLeave', [
      state(
        'in',
        style({
          transform: 'translate3d(0,0,0)'
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(0, 180%, 0)'
        })
      ),
      transition('in => out', animate('600ms ease-in-out')),
      transition('out => in', animate('600ms ease-in-out'))
    ])
  ]


})
export class AsConfirmationComponent implements OnInit {
  content = homeContent;
  personalData: PersonalData;
  pscDetails: PscDetails;
  appointmentData: Appointment = new Appointment();
  message: string;
  formatedDate: string;
  userLocation: string;
  pscAddress: string;
  confirmationCode: string;
  calendarData = new Calendar();
  printData = new PrintData();
  reasonData: ReasonCategory = new ReasonCategory();
  testsData: ReasonCategory[];
  facilityTestTypeValue: string;
  isTestData: boolean;
  newApptData: CreateAppointmentResponse;
  destroy$ = new Subject<void>();
  isCancelModifyEnabled$: Observable<boolean>;
  url: string;
  // facilityIds: number[];
  selectedReason: any;
  showBanner: boolean;
  stateMenu = 'out';
  clinicaltrialhippaFlag: boolean;
  showSmallerBanner = false;
  updateAsLinksFeature$: Observable<boolean>;

  constructor(private dataService: DataService,
    private dateService: DateService,
    private route: ActivatedRoute,
    private pscService: PscService,
    private router: Router,
    private propertiesService: PropertiesService,
    private findAppointmentService: FindAppointmentService) {
    this.isCancelModifyEnabled$ = this.propertiesService.getCancelModifyConfirmationScreen();
    this.dataService.getPersonalData().subscribe((data: any) => {
      this.personalData = data;
      if (data && data.preferences.preference_email && !data.preferences.preference_mobile) {
        this.message = this.content.as_confirmation.email_confirmation;
      } else if (data && data.preferences.preference_mobile && !data.preferences.preference_email) {
        this.message = this.content.as_confirmation.text_confirmation;
      } else if (data && data.preferences.preference_mobile && data.preferences.preference_email) {
        this.message = this.content.as_confirmation.both_confirmation;
      }
    });

    this.dataService.getappointmentData().subscribe((appointmentData: AppointmentData) => {
      this.appointmentData = appointmentData.data;
      this.pscAddress =
        // tslint:disable-next-line:max-line-length
        appointmentData.data ? `${appointmentData.data.address1} ${appointmentData.data.address2 ? appointmentData.data.address2 : ''} ${appointmentData.data.city} ${appointmentData.data.state} ${appointmentData.data.zip}` : null;
      this.formatedDate = appointmentData.data ? this.dateService.toDateTime(appointmentData.data.appointmentDate) : null;
      this.pscAddress += appointmentData.data.name;
    });
    this.dataService.getNewapptData().subscribe((data: CreateAppointmentResponse) => {
      this.newApptData = data;
    });
    this.dataService.getTestsData().pipe(takeUntil(this.destroy$)).subscribe((testsData: ReasonCategory[]) => {
      this.testsData = testsData;
      if (this.testsData.length > 0) {
        this.isTestData = true;
      }
    });

  }
  setPrintData() {
    if (!this.isTestData) {
      this.facilityTestTypeValue = this.reasonData.facilityTestTypeValue;
    } else if (this.isTestData && this.testsData.length === 1) {
      this.facilityTestTypeValue = this.testsData[0].facilityTestTypeValue;
    } else if (this.isTestData && this.testsData.length > 1) {
      this.facilityTestTypeValue = 'Multiple Drug Tests';
    }
    this.printData.appointmentDate = this.appointmentData.appointmentDate;
    this.printData.appointmentTime = this.appointmentData.appointmentTime;
    this.printData.name = this.appointmentData.name;
    this.printData.address1 = this.appointmentData.address1;
    this.printData.address2 = this.appointmentData.address2;
    this.printData.city = this.appointmentData.city;
    this.printData.zip = this.appointmentData.zip;
    this.printData.state = this.appointmentData.state;
    this.printData.phone = this.appointmentData.phone;
    this.printData.siteCode = this.appointmentData.siteCode;
    this.printData.facilityTestTypeValue = this.facilityTestTypeValue;
    this.printData.confirmationCode = this.confirmationCode;
    this.printData.qrcode = this.newApptData.qrCode;
    this.printData.firstName = this.personalData.firstName;
    this.pscService.getPscDetails(this.appointmentData.siteCode).pipe(takeUntil(this.destroy$)).subscribe((pscDetails: PscDetails) => {
      this.pscDetails = pscDetails;
      this.printData.landmark = this.pscDetails.landmark;
    });
    const city = this.appointmentData.phone.toString().slice(0, 3);
    const number = this.appointmentData.phone.toString().slice(3);
    this.printData.sitePhone = ('(' + city + ') ' + number).trim();
  }
  setCalendarData(apptdata?: AppointmentDetails) {
    this.calendarData.appointmentDate = this.appointmentData.appointmentDate;
    this.calendarData.appointmentTime = this.appointmentData.appointmentTime;
    this.calendarData.name = this.appointmentData.name;
    this.calendarData.address1 = this.appointmentData.address1;
    this.calendarData.address2 = this.appointmentData.address2;
    this.calendarData.city = this.appointmentData.city;
    this.calendarData.zip = this.appointmentData.zip;
    this.calendarData.state = this.appointmentData.state;
    this.calendarData.phone = this.appointmentData.phone;
    this.calendarData.siteCode = this.appointmentData.siteCode;
    this.calendarData.title = this.reasonData.facilityTestTypeValue;
    this.calendarData.confirmationCode = this.confirmationCode;
    this.calendarData.zoneId = apptdata.zoneId;
    this.calendarData.time_zone = apptdata.time_zone;
    this.calendarData = { ...this.calendarData };
  }

  ngOnInit() {
    this.updateAsLinksFeature$ = this.propertiesService.getCITUpdatedLinksFeatureFlag1421();
    combineLatest(
      this.propertiesService.getViewTestLink(),
      this.propertiesService.getViewTestLinkNewCIT(),
      this.propertiesService.getCITUpdatedLinksFeatureFlag1421(),
      this.propertiesService.getbannerFacilityIds(),
      this.dataService.getReasonData()
    ).subscribe(([viewTestLink, viewTestLinkNew, updateAsLinksFeature, facilityIds, result]) => {
      this.url = updateAsLinksFeature === true ? viewTestLinkNew : viewTestLink;
      // this.facilityIds = facilityIds;
      this.selectedReason = result.facilityServiceId;
      if (facilityIds && facilityIds.indexOf(this.selectedReason) > -1) {
        this.showBanner = true;
      } else {
        this.showBanner = false;
      }
    });

    this.propertiesService.getClinicaltrialhippaFlag().subscribe(res => {
      this.clinicaltrialhippaFlag = JSON.parse(res);
    });
    this.route.params.subscribe((params: Params) => {
      this.confirmationCode = params.confirmationCode;
    });
    navigator.geolocation.getCurrentPosition((loc: any) => {
      this.userLocation = loc.coords.latitude + '+' + loc.coords.longitude;
    });
    combineLatest(
      this.findAppointmentService.verifyAppointmentId(this.confirmationCode, false),
      this.dataService.getReasonData()
    ).subscribe(([apptdata, reasonData]: [AppointmentDetails, ReasonCategory]) => {
      this.reasonData = reasonData;
      this.setCalendarData(apptdata);
      this.setPrintData();
    });

    // this.dataService.getReasonData().subscribe((reasonData: ReasonCategory) => {
    //   this.reasonData = reasonData;
    //   this.setCalendarData();
    //   this.setPrintData();
    // });
  }

  setBannerDelay() {
    setTimeout(() => {
      this.stateMenu = 'in';
    }, 3000);
  }

  viewTests() {
    window.open(this.url);
  }

  openDirection() {
    if (this.userLocation) {
      window.open(`http://maps.google.com/maps?saddr=${this.userLocation}&daddr=${this.pscAddress}`, '_blank');
    } else {
      window.open(`http://maps.google.com/maps?daddr=${this.pscAddress}`, '_blank');
    }
  }

  printConfirmation() {
    window.print();
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (!window.location.href.includes('#')) {
      window.location.href = `${window.location.origin}/as-home`;
    }
  }
  navigateToSummaryKey(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.navigateToSummary();
    }
  }

  navigateToSummary() {
    if (this.confirmationCode) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'confirmationCode': this.confirmationCode,
        }
      };
      this.dataService.isInFLow = true;
      this.dataService.isModifyCancel = true;
      this.router.navigate(['/find-appointment/as-find-appointment-summary'], navigationExtras);
    }
  }
}
