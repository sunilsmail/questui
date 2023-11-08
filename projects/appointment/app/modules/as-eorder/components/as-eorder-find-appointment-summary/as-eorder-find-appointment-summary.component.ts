import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Observable, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { SecondaryInsuranceData } from 'shared/models';
import { AppointmentDetails} from 'shared/models/appointment';
import { Calendar } from 'shared/models/calendar';
import { EorderDemographics, EorderInsurance, EorderModifyAppointmentData } from 'shared/models/eorder';
import { PrintData } from 'shared/models/print-data';
import { PscDetails, PscLocationAvailability } from 'shared/models/psc';
import { ReasonCategory } from 'shared/models/reason-category';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { FindAppointmentService } from 'shared/services/find-appointment.service';
import { InsuranceService } from 'shared/services/insurance.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-eorder-find-appointment-summary',
  templateUrl: './as-eorder-find-appointment-summary.component.html',
  styleUrls: ['./as-eorder-find-appointment-summary.component.scss']
})
export class AsEorderFindAppointmentSummaryComponent implements OnInit {
  content = homeContent;
  facilityTestTypeValue: any;
  confirmationCode: string;
  pscDetails: PscDetails;
  pscLocationAvailability: PscLocationAvailability;
  destroy$ = new Subject<void>();
  appointmentDetails: AppointmentDetails;
  calendarData = new Calendar();
  printData = new PrintData();
  loading = false;
  personalData: EorderDemographics = new EorderDemographics();
  insuranceData: EorderInsurance = new EorderInsurance();
  estimatedPrice: Number;
  bringCarderror: boolean;
  secondaryInsuranceEnabled = false;
  secondaryInsData: SecondaryInsuranceData = new SecondaryInsuranceData();
  mandatoryAddressf1687 = false;
  constructor(
    private pscService: PscService,
    private route: ActivatedRoute,
    private findAppointmentService: FindAppointmentService,
    public dataService: DataService,
    private appointmentService: AppointmentService,
    private router: Router,
    private eorderService: EorderService,
    private eorderDataService: EorderDataService,
    private insuranceService: InsuranceService,
    private dateService: DateService,
    public cd: ChangeDetectorRef,
    private propertiesService: PropertiesService,
    private secondaryInsuranceService: SecondaryInsuranceService,
    private genderFieldsService: GenderFieldsService) {
  }

  ngOnInit() {
    this.getSecondaryInsuranceInfo();
    this.readFeatureFlagForf1687();
    this.route.queryParams
      .pipe(filter(params => params.confirmationCode))
      .subscribe(params => {
        this.confirmationCode = params.confirmationCode;
      });
    this.loading = true;
    this.getSummaryDetials();
  }
  private getReasonsById(){
    this.getReasons().pipe(takeUntil(this.destroy$)).subscribe(reasons=>{
      this.setFacilityTestTypeValue(reasons);
    });
  }
  getPrice() {
    this.getPriceInfo().pipe(takeUntil(this.destroy$)).subscribe(estimatedCost => {
      try {
        this.estimatedPrice = estimatedCost.responseBody.price;
        if (+this.estimatedPrice === 0) {
          this.estimatedPrice = null;
        }
      }
      catch (ex) {
        this.estimatedPrice = null;
        // this.loading = false;
      }
    });
  }

  private getSummaryDetials() {
    forkJoin(this.getAppointmentDetails().pipe(takeUntil(this.destroy$)),
    this.propertiesService.getEaypayEnhancementF89().pipe(takeUntil(this.destroy$)))
      .pipe()
      .subscribe(([response, flag ]:[AppointmentDetails,boolean]) => {
        if (response['message'] === 'cancelled') {
          this.router.navigate(['./']);
          return of(null);
        }

        this.genderFieldsService.userPersonalData = response.demographicDetails;
        this.appointmentDetails = response;
        this.getReasonsById();
        if(flag){
          this.getSummaryWithFeatureF89(response);
        }
        else{
          this.getSummaryWithOutFeatureF89(response);
        }
      });
  }
  getSummaryWithOutFeatureF89(response: AppointmentDetails) {
    this.getSummaryDetails(response).subscribe(([pscDetails, demographics, insurance, estimatedCost]) => {
      this.setValues(insurance, demographics, pscDetails);
      this.setEstimatedPrice(estimatedCost.responseBody.price);
      this.setCalenderAndPrint();
      this.loading = false;
    }, () => {
      this.loading = false;
      this.router.navigate(['./']);
      return of(null);
    });
  }

  private getSummaryWithFeatureF89(response: AppointmentDetails) {
    this.getSummaryDetailsWithF89(response).subscribe(([pscDetails, demographics, insurance]) => {
      this.setValues(insurance, demographics, pscDetails);
      this.setEstimatedPrice(response.quotedCost);
      this.setCalenderAndPrint();
      this.loading = false;
    }, () => {
      this.loading = false;
      this.router.navigate(['./']);
      return of(null);
    });
  }

  private setEstimatedPrice(price: number) {
    try {
      this.estimatedPrice = price;
      if (+this.estimatedPrice === 0) {
        this.estimatedPrice = null;
      }
    }
    catch (ex) {
      this.estimatedPrice = null;
    }
  }

  private setCalenderAndPrint() {
    this.setPrintData();
    this.setCalendarData();
    this.cd.detectChanges();
  }

  private setValues(insurance: any, demographics: any, pscDetails: PscDetails) {
    this.insuranceData = insurance;
    this.personalData = demographics;
    this.pscDetails = pscDetails;
  }

  getSummaryDetailsWithF89(response) {
    return forkJoin(this.getLocationDetails(response.siteCode).pipe(takeUntil(this.destroy$)),
      this.getDemographicsInfo().pipe(takeUntil(this.destroy$)),
      this.getInsuranceInfo().pipe(takeUntil(this.destroy$)),
    );

  }
  getSummaryDetails(response) {
    return forkJoin(this.getLocationDetails(response.siteCode).pipe(takeUntil(this.destroy$)),
      this.getDemographicsInfo().pipe(takeUntil(this.destroy$)),
      this.getInsuranceInfo().pipe(takeUntil(this.destroy$)),
      this.getPriceInfo().pipe(takeUntil(this.destroy$)),
    );
  }
  getAppointmentDetails(): Observable<AppointmentDetails> {
    return this.findAppointmentService.verifyAppointmentId(this.confirmationCode, false);
  }
  getLocationDetails(siteCode: string): Observable<PscDetails> {
    return this.pscService.getPscDetails(siteCode);
  }
  getReasons(): Observable<ReasonCategory[]> {
    if (this.appointmentDetails.facilityServiceId.length > 0) {
      // tslint:disable-next-line: max-line-length
      if (this.appointmentDetails.facilityServiceId[0] <= 6) {
        return this.appointmentService.getReasons('MAIN');
      }
      else if (this.appointmentDetails.facilityServiceId[0] >= 7 && this.appointmentDetails.facilityServiceId[0] < 15
        || this.appointmentDetails.facilityServiceId[0] === 18 || this.appointmentDetails.facilityServiceId[0] === 20) {
        return this.appointmentService.getReasons('EMPLOYER');
      }
      else if (this.appointmentDetails.facilityServiceId[0] >= 15 && this.appointmentDetails.facilityServiceId[0] <= 16) {
        return this.appointmentService.getReasons('GLUCOSE');
      }
      else {
        return this.appointmentService.getReasons('MAIN');
      }
    }
  }
  setFacilityTestTypeValue(reasons: ReasonCategory[]) {
    if (this.appointmentDetails.facilityServiceId.length > 1) {
      this.facilityTestTypeValue = 'Multiple Drug tests';
    } else {
      const result = reasons.find(({ facilityServiceId }) => facilityServiceId === this.appointmentDetails.facilityServiceId[0]);
      this.facilityTestTypeValue = result !== undefined ? result.facilityTestTypeValue : '';
    }
  }
  getDemographicsInfo(): Observable<any> {
    return this.eorderService.getBasicEncounterInfo('demographics');
  }
  getInsuranceInfo(): Observable<any> {
    return this.eorderService.getBasicEncounterInfo('insurance');
  }
  getPriceInfo(): Observable<any> {
    return this.eorderService.getPricingInfo();
  }
  navigate(routeUrl: string, screenName: string) {
    this.dataService.editScreenName = screenName;
    // this.personalData.demographics.dob= this.dateService.toDate(this.personalData.demographics.dob);
    const modifyAppointmentData: EorderModifyAppointmentData = {
      pscDetails: this.pscDetails,
      pscLocationAvailability: this.pscLocationAvailability,
      appointmentDetails: this.appointmentDetails,
      confirmationCode: this.confirmationCode,
      insuranceData: this.insuranceData,
      demographics: this.personalData
    };
    this.eorderDataService.isEditFromEorderSummary= true;
    this.eorderDataService.setappointmentDataForEdit(modifyAppointmentData);
    this.router.navigate([routeUrl]);
   // }
  }
  onLocationEdit(flow: string) {
  }
  printConfirmation() {
    window.print();
  }
  openDirection() {
    const pscAddress = this.pscDetails ?
      (`${this.pscDetails.name} ${this.pscDetails.address1} (${this.pscDetails.address2} ?
    (${this.pscDetails.address2}) : '')${this.pscDetails.city}`) : '';
    window.open(`http://maps.google.com/maps?daddr=${pscAddress}`, '_blank');
  }
  setPrintData() {
    this.printData.appointmentDate = this.appointmentDetails.appointmentDate;
    this.printData.appointmentTime = this.appointmentDetails.appointmentTime;
    this.printData.name = this.pscDetails.name;
    this.printData.address1 = this.pscDetails.address1;
    this.printData.address2 = this.pscDetails.address2;
    this.printData.city = this.pscDetails.city;
    this.printData.zip = this.pscDetails.zip;
    this.printData.state = this.pscDetails.state;
    this.printData.phone = this.pscDetails.phone;
    this.printData.siteCode = this.appointmentDetails.siteCode;
    this.printData.facilityTestTypeValue = this.facilityTestTypeValue;
    this.printData.confirmationCode = this.confirmationCode;
    this.printData.qrcode = 'data:image/png;base64,' + this.appointmentDetails.qrCode + '';
    this.printData.firstName = this.appointmentDetails.firstName;
    const city = this.pscDetails.phone.toString().slice(0, 3);
    const number = this.pscDetails.phone.toString().slice(3);
    this.printData.sitePhone = ('(' + city + ') ' + number).trim();
    this.printData.landmark = this.pscDetails.landmark;
  }
  setCalendarData() {
    this.calendarData.appointmentDate = this.appointmentDetails.appointmentDate;
    this.calendarData.appointmentTime = this.appointmentDetails.appointmentTime;
    this.calendarData.name = this.pscDetails.name;
    this.calendarData.address1 = this.pscDetails.address1;
    this.calendarData.address2 = this.pscDetails.address2;
    this.calendarData.city = this.pscDetails.city;
    this.calendarData.zip = this.pscDetails.zip;
    this.calendarData.state = this.pscDetails.state;
    this.calendarData.phone = this.pscDetails.phone;
    this.calendarData.siteCode = this.appointmentDetails.siteCode;
    this.calendarData.title = this.facilityTestTypeValue;
    this.calendarData.confirmationCode = this.confirmationCode;
    this.calendarData.zoneId = this.appointmentDetails.zoneId;
    this.calendarData.time_zone = this.appointmentDetails.time_zone;
  }

  getSecondaryInsuranceInfo() {
    this.getSecIns();
    this.getSecondaryInsuranceData();
  }
  getSecondaryInsuranceData() {
    this.secondaryInsuranceService.getInsuranceData().pipe(takeUntil(this.destroy$)).subscribe((secondaryIns: SecondaryInsuranceData) => {
      this.secondaryInsData = secondaryIns;
    });
  }
  getSecIns() {
    this.eorderService.getBasicEncounterInfo('secondaryInsurance').pipe(takeUntil(this.destroy$))
      .subscribe((secondaryIns: any) => {
        if (secondaryIns && secondaryIns.secondaryInsurance) {
          const insData = this.secondaryInsuranceService.
            formatSecondaryInsuranceForControls(secondaryIns.secondaryInsurance, this.mandatoryAddressf1687);
          this.secondaryInsuranceService.setInsuranceData(insData);
        }
      });
  }
  readFeatureFlagForf1687() {
    this.propertiesService.getMandatoryAddressf1687().subscribe((value)=>{
      this.mandatoryAddressf1687 = value;
    });
  }
}
