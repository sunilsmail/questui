import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Observable } from 'rxjs';
import { Appointment, AppointmentData } from 'shared/models/appointment';
import { editSummaryFromCancelModify, InsuranceData, PersonalData, SecondaryInsuranceData } from 'shared/models/index';
import { ReasonCategory } from 'shared/models/reason-category';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { DeeplinkService } from 'shared/services/deeplink.service';
import { PropertiesService } from 'shared/services/properties.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-navigation-sidebar',
  templateUrl: './as-navigation-sidebar.component.html',
  styleUrls: ['./as-navigation-sidebar.component.scss']
})
export class AsNavigationSidebarComponent implements OnInit {
  @Input() step: Number;
  @Input() hideInsuranceInfo: boolean;
  content = homeContent;
  reasonData: ReasonCategory;
  appointmentData: Appointment;
  personalData: PersonalData;
  insuranceData: InsuranceData;
  formatedDate: string;
  testsData: ReasonCategory[] = [];
  isTestData = false;
  blnShowError = false;
  lnNotSupportedShowError = false;
  skipInsurance$: Observable<boolean>;
  disableReason = false;
  secondaryInsuranceData: SecondaryInsuranceData;
  constructor(
    private dataService: DataService,
    private dateService: DateService,
    private router: Router,
    private i18n: I18n,
    private skipInsuranceService: SkipInsuranceService,
    private uiPropertyService: PropertiesService,
    private deeplinkSerive: DeeplinkService,
    private secondaryInsuranceService: SecondaryInsuranceService,) {
  }

  ngOnInit() {
    this.disableReasonFunction();
    this.skipInsurance$ = this.skipInsuranceService.getSkipInsurance();
    this.dataService.getReasonData().subscribe((reasonData: ReasonCategory) => {
      // this.reasonData = this.reasonData ? this.reasonData : reasonData;
      this.reasonData = reasonData ? reasonData : this.reasonData;
    });
    this.dataService.getblnShowLocError().subscribe((showerror: any) => {
      this.blnShowError = showerror;
    });
    this.dataService.getReasonNotSupportedError().subscribe((showerror: any) => {
      this.lnNotSupportedShowError = showerror;
    });
    this.dataService.getappointmentData().subscribe((appointmentData: AppointmentData) => {
      if (appointmentData && appointmentData.data) {
        this.appointmentData = appointmentData.data;
        this.formatedDate = appointmentData ? this.dateService.toDateTime(appointmentData.data.appointmentDate) : null;
      }
    });
    this.dataService.getPersonalData().subscribe((personalData: PersonalData) => {
      this.personalData = personalData;
    });
    this.dataService.getInsuranceData().subscribe((insuranceData: InsuranceData) => {
      this.insuranceData = insuranceData;
    });
    this.secondaryInsuranceService.getInsuranceData().subscribe((secondaryInsuranceData: SecondaryInsuranceData) => {
      this.secondaryInsuranceData = secondaryInsuranceData;
    });
    this.dataService.getTestsData().pipe().subscribe((testsData: ReasonCategory[]) => {
      this.testsData = testsData;
      if (this.testsData.length > 0) {
        this.isTestData = true;
      }
      else {
        this.isTestData = false;
      }
    });
    if (this.dataService.isModifyCancel) {
      if (this.dataService.editScreenName === editSummaryFromCancelModify.editPersonalInfo) {
        this.insuranceData = null;
        this.secondaryInsuranceData = null;
        this.reasonData = null;
        this.appointmentData = null;
        this.isTestData = false;
        this.testsData = null;
      } else if (this.dataService.editScreenName === editSummaryFromCancelModify.editInsuranceInfo) {
        this.personalData = null;
        this.isTestData = false;
        this.appointmentData = null;
        this.reasonData = null;
        this.testsData = null;
      } else if (this.dataService.editScreenName === editSummaryFromCancelModify.editLocation) {
        this.personalData = null;
        this.insuranceData = null;
        this.secondaryInsuranceData = null;
        this.isTestData = false;
        this.reasonData = null;
        this.testsData = null;
      }
    }
  }


  navigate(routeUrl: string) {
    if (routeUrl !== this.router.url) {
      if(routeUrl === '/schedule-appointment/as-reason-for-visit'){
        this.skipInsuranceService.setCovidReasonSelected(false);
      }
      this.dataService.setblnEditReasonData(false, this.router.url);
      // this.dataService.setblnShowLocError(false);
      this.dataService.setPreviousPage(this.router.url);
      this.router.navigate([routeUrl]);
    }
  }

  get getReasonForVisit() {
    if (this.step === 1 && !this.reasonData) {
      return this.i18n('Reason for visiting inprogress');
    } else if (this.reasonData) {
      return this.i18n('Reason for visiting Completed');
    } else {
      return this.i18n('Reason for visiting not started');
    }
  }

  get getLocationAiraLable() {
    if (this.step === 2 && !this.appointmentData) {
      return this.i18n('Location, date, and time inprogress');
    } else if (this.appointmentData) {
      return this.i18n('Location, date, and time Completed');
    } else {
      return this.i18n('Location, date, and time not started');
    }
  }

  get getWhoisVisitingAiraLable() {
    if (this.step === 3 && !this.personalData) {
      return this.i18n('Who’s visiting inprogress');
    } else if (this.personalData) {
      return this.i18n('Who’s visiting Completed');
    } else {
      return this.i18n('Who’s visiting not started');
    }
  }

  get getInsuranceInfoAiraLable() {
    if (this.step === 4 && !this.insuranceData) {
      return this.i18n('Insurance information inprogress');
    } else if (this.insuranceData) {
      return this.i18n('Insurance information Completed');
    } else {
      return this.i18n('Insurance information not started');
    }
  }

  onKeyPress(event) {
    if (event.target.parentNode) {
      event.target.parentNode.classList.add('focus');
    }
  }

  onBlur(event){
    if(event.target.parentNode){
      event.target.parentNode.classList.remove('focus');
    }
  }

  get getToDisplay() {
    if (this.testsData && this.testsData.length > 1) {
      return 'Multiple Drug Tests';
    } else if (this.testsData && this.testsData.length === 1) {
      return this.testsData[0].facilityTestTypeValue;
    } else if (this.testsData && this.testsData.length === 0 && this.reasonData && this.reasonData.facilityTestTypeValue) {
      return this.reasonData.facilityTestTypeValue;
    }
    return false;
  }

  disableReasonFunction() {
    this.deeplinkSerive.getFlagFordisableReason().subscribe(res=>{
      this.disableReason = res;
    });
  }
}

