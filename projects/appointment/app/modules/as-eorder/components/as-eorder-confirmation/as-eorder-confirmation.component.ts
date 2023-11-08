import { ChangeDetectorRef } from '@angular/core';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Observable, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { Appointment, AppointmentData } from 'shared/models/appointment';
import { Calendar } from 'shared/models/calendar';
import { CreateAppointmentResponse } from 'shared/models/create-appointment-data';
import { CostEstimateStatus } from 'shared/models/eorder';
import { PersonalData } from 'shared/models/index';
import { PrintData } from 'shared/models/print-data';
import { PscDetails } from 'shared/models/psc';
import { ReasonCategory } from 'shared/models/reason-category';
import { AppointmentService } from 'shared/services/appointment.service';
import { DateService } from 'shared/services/date.service';
import { CostEstimateService } from 'shared/services/eorder/easy-pay/cost-estimate.service';
// import { EorderEasyPayService } from 'shared/services/eorder/easy-pay/easy-pay.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-eorder-confirmation',
  templateUrl: './as-eorder-confirmation.component.html',
  styleUrls: ['./as-eorder-confirmation.component.scss']
})
export class AsEorderConfirmationComponent implements OnInit {
  content = homeContent;
  personalData: PersonalData;
  pscDetails: PscDetails;
  appointmentData: Appointment = new Appointment();
  message: string;
  formatedDate: string;
  userLocation: string;
  pscAddress: string;
  confirmationCode: string;
  calendarData: Calendar;
  printData = new PrintData();
  reasonData: ReasonCategory = new ReasonCategory();
  testsData: ReasonCategory[];
  facilityTestTypeValue: string;
  isTestData: boolean;
  newApptData: CreateAppointmentResponse;
  destroy$ = new Subject<void>();
  appointmentInfo: any;
  isAlternateFlow: boolean;
  estimatedCost: string;
  facilityServiceId: any;
  isCCNotLoaded$: Observable<boolean>;
  easypayEnhancement$: Observable<boolean>;
  skippaymentSelection$: Observable<boolean>;
  easypayEnhancementF411$: Observable<boolean>;


  constructor(
    private eorderDataService: EorderDataService,
    private eorderService: EorderService,
    private dateService: DateService,
    private route: ActivatedRoute,
    private pscService: PscService,
    private appointmentService: AppointmentService,
    public cd: ChangeDetectorRef,
    // private eOrderEasyPayService: EorderEasyPayService,
    private propertiesService: PropertiesService,
    private costEstimateService: CostEstimateService,
  ) {
    this.eorderDataService.getEorderNewapptData().subscribe((data: any) => {
      this.newApptData = data;
      this.confirmationCode = data.confirmationCode;
    });
    this.eorderDataService.getPersonalInformation().subscribe((data: any) => {
      this.personalData = data;
      if (data && data.preferences.preference_email && !data.preferences.preference_mobile) {
        this.message = this.content.as_confirmation.email_confirmation;
      } else if (data && data.preferences.preference_mobile && !data.preferences.preference_email) {
        this.message = this.content.as_confirmation.text_confirmation;
      } else if (data && data.preferences.preference_mobile && data.preferences.preference_email) {
        this.message = this.content.as_confirmation.both_confirmation;
      }
    });

    this.eorderDataService.getappointmentData().subscribe((appointmentData: AppointmentData) => {
      this.appointmentData = appointmentData.data;
      this.pscAddress =
        // tslint:disable-next-line:max-line-length
        appointmentData.data
          ? `${appointmentData.data.address1} ${appointmentData.data.address2 ? appointmentData.data.address2 : ''} ${appointmentData.data.city
          } ${appointmentData.data.state} ${appointmentData.data.zip}`
          : null;
      this.formatedDate = appointmentData.data
        ? this.dateService.toDateTime(appointmentData.data.appointmentDate)
        : null;
      this.pscAddress += appointmentData.data.name;
    });
    this.eorderDataService.getReasonData().subscribe((reasonData: ReasonCategory) => {
      this.reasonData = reasonData;
    });
    this.eorderDataService.getAlternateFlow().subscribe(res => {
      this.isAlternateFlow = res;
    });
    this.eorderDataService.getFacilityServiceId().subscribe(res => {
      this.facilityServiceId = res;
      this.getReasons().pipe(takeUntil(this.destroy$)).subscribe((reasons) => {
        this.setFacilityTestTypeValue(reasons);
      });
    });
  }
  getReasons(): Observable<ReasonCategory[]> {
    if (this.facilityServiceId.length > 0) {
      // tslint:disable-next-line: max-line-length
      if (this.facilityServiceId[0] <= 6) {
        return this.appointmentService.getReasons('MAIN');
      }
      else if (this.facilityServiceId[0] >= 7 && this.facilityServiceId[0] < 15) {
        return this.appointmentService.getReasons('EMPLOYER');
      }
      else if (this.facilityServiceId[0] >= 15 && this.facilityServiceId[0] <= 16) {
        return this.appointmentService.getReasons('GLUCOSE');
      }
      else {
        return this.appointmentService.getReasons('MAIN');
      }
    }
  }
  setFacilityTestTypeValue(reasons: ReasonCategory[]) {
    if (this.facilityServiceId.length > 1) {
      this.facilityTestTypeValue = 'Multiple Drug tests';
    } else {
      const result = reasons.find(({ facilityServiceId }) => facilityServiceId === this.facilityServiceId[0]);
      this.facilityTestTypeValue = result !== undefined ? result.facilityTestTypeValue : '';
    }
  }
  setPrintData() {
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
    this.printData.estimatedCost = this.estimatedCost;
    this.printData = { ...this.printData };
    this.pscService
      .getPscDetails(this.appointmentData.siteCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe((pscDetails: PscDetails) => {
        this.pscDetails = pscDetails;
        this.printData.landmark = this.pscDetails.landmark;
        this.printData = { ...this.printData };
        this.cd.detectChanges();
        window.print();
      });
    const city = this.appointmentData.phone.toString().slice(0, 3);
    const number = this.appointmentData.phone.toString().slice(3);
    this.printData.sitePhone = ('(' + city + ') ' + number).trim();
  }
  setCalendarData() {
    this.eorderService.getBasicEncounterInfo('appointment').subscribe(encounter => {
      this.appointmentInfo = encounter.appointment;
      // if(this.appointmentInfo && !this.isAlternateFlow){
      // this.facilityTestTypeValue = this.appointmentInfo.siteDetails.appointmentVisitReason;
      // }else {
      //   this.facilityTestTypeValue = this.facilityTestTypeValue;
      // }
      this.calendarData = new Calendar();
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
      this.calendarData.confirmationCode = this.confirmationCode;
      this.calendarData.title = this.facilityTestTypeValue;
      this.calendarData.zoneId = this.appointmentData.zoneId;
      this.calendarData.time_zone = this.appointmentData.time_zone;
      this.calendarData = { ...this.calendarData };
    });
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((loc: any) => {
      this.userLocation = loc.coords.latitude + '+' + loc.coords.longitude;
    });
    this.sendApptConfirmation();
    this.setCalendarData();
    this.getPriceEstimate();
    this.checkCreditCardLoadingStatus();
    this.getSkippaymentSelection();
  }

  getPriceEstimate() {
    this.propertiesService.getEaypayEnhancementF89().pipe(
      take(1),
      switchMap((enableF89: boolean) => {
        if (enableF89) {
          return this.costEstimateService.getCostEstimate().pipe(
            take(1),
            switchMap((status: CostEstimateStatus) => {
              if (status.skipCostEstimate) {
                return of(status.quotedCost);
              } else {
                return this.getPriceFromCostEstimateScreen();
              }
            })
          );
        } else {
          return this.getPriceFromCostEstimateScreen();
        }
      })
    ).subscribe((price: string) => {
      this.estimatedCost = price;
    });
  }

  getPriceFromCostEstimateScreen() {
    return this.eorderDataService.getPriceEstimation();
  }

  openDirection() {
    if (this.userLocation) {
      window.open(`http://maps.google.com/maps?saddr=${this.userLocation}&daddr=${this.pscAddress}`, '_blank');
    } else {
      window.open(`http://maps.google.com/maps?daddr=${this.pscAddress}`, '_blank');
    }
  }

  printConfirmation() {
    this.eorderService.getBasicEncounterInfo('appointment').subscribe(encounter => {
      this.appointmentInfo = encounter.appointment;
      // if(this.appointmentInfo && !this.isAlternateFlow){
      // this.facilityTestTypeValue = this.appointmentInfo.siteDetails.appointmentVisitReason;
      // } else {
      //   this.facilityTestTypeValue = this.reasonData.facilityTestTypeValue;
      // }
      this.setPrintData();
    });
  }
  sendApptConfirmation() {
    const params = {
      type: 'CONFIRM',
      send: 'immediate'
    };
    this.eorderService.sendEorderMail(params).subscribe(
      res => {
        const result = res;
      },
      error => { }
    );
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (!window.location.href.includes('#')) {
      window.location.href = `${window.location.origin}/as-home`;
    }
  }

  checkCreditCardLoadingStatus() {
    this.easypayEnhancement$ = this.propertiesService.getEaypayEnhancementF89();
    //  this.isCCNotLoaded$ = this.eOrderEasyPayService.getWithPriceEstimateAndNoCC();
    this.isCCNotLoaded$ = this.costEstimateService.getWithPriceEstimateAndNoCC();
  }

  getSkippaymentSelection() {
    this.easypayEnhancementF411$ = this.propertiesService.getEasyPayEnhancementF411();
    this.skippaymentSelection$ = this.costEstimateService.getSkippaymentSelected();
  }
}
