import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { EorderAppointment, EorderAppointmentData, EorderInsuranceInformation, EorderPersonalInformation } from 'shared/models/eorder';
import { editSummaryFromCancelModify } from 'shared/models/index';
import { ReasonCategory } from 'shared/models/reason-category';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-eorder-navigation-sidebar',
  templateUrl: './as-eorder-navigation-sidebar.component.html',
  styleUrls: ['./as-eorder-navigation-sidebar.component.scss']
})
export class AsEorderNavigationSidebarComponent implements OnInit {
  @Input() step: Number;
  content = homeContent;
  personalInformation: EorderPersonalInformation;
  appointmentData: EorderAppointment;
  confirmationCode: string;
  insuranceInformation: EorderInsuranceInformation;
  reasonData: ReasonCategory;
  formatedDate: string;
  price: Number;
  isAlternateFlow = false;
  isEditFromEorderSummary: boolean;

  constructor(private dataService: DataService,
    private eorderDataService:EorderDataService,
    private dateService: DateService, private router: Router,
    private i18n: I18n) { }

  ngOnInit() {
    this.isEditFromEorderSummary = this.eorderDataService.isEditFromEorderSummary;
    this.eorderDataService.getAlternateFlow().subscribe(res => {
      this.isAlternateFlow = res;
    });
    this.eorderDataService.getReasonData().subscribe((data: ReasonCategory)=>{
      this.reasonData = data;
    });
    this.eorderDataService.getappointmentData().subscribe((appointmentData: EorderAppointmentData) => {
      this.appointmentData = appointmentData.data;
      const appointmetDateAndTime = this.appointmentData.appointmentDate.split('T');
      this.formatedDate = appointmetDateAndTime[0] ? this.dateService.toDateTime(appointmetDateAndTime[0]) : null;
    });
    this.eorderDataService.getPersonalInformation().subscribe((personalInfo:EorderPersonalInformation)=>{
      this.personalInformation = this.personalInformation ? this.personalInformation : personalInfo;
    });
    this.eorderDataService.getInsuranceInformation().subscribe((insuranceInfo:EorderInsuranceInformation)=>{
      this.insuranceInformation = this.insuranceInformation ? this.insuranceInformation : insuranceInfo;
    });
    this.eorderDataService.getEorderNewapptData().subscribe((data:any)=>{
      this.confirmationCode = data.confirmationCode;
    });
    this.eorderDataService.getPriceEstimation().subscribe((data:any)=>{
      this.price = data;
    });
    if(this.isEditFromEorderSummary){
      if(this.dataService.editScreenName === editSummaryFromCancelModify.editPersonalInfo){
        this.insuranceInformation = null;
        this.reasonData = null;
        this.appointmentData = null;
      //  this.isTestData = false;
      } else if(this.dataService.editScreenName === editSummaryFromCancelModify.editInsuranceInfo){
        this.personalInformation = null;
      //  this.isTestData = false;
        this.appointmentData = null;
        this.reasonData = null;
      } else if(this.dataService.editScreenName === editSummaryFromCancelModify.editLocation){
        this.personalInformation = null;
        this.insuranceInformation = null;
       // this.isTestData = false;
        this.reasonData = null;
      }
    }
}
  navigate(routeUrl: string) {
    if (routeUrl !== this.router.url) {
      this.eorderDataService.setblnEditReasonData(true, this.router.url);
      this.router.navigate([routeUrl]);
    }
  }

  getNavigationState(step, stepData, orderStep) {
    if (this.step === step && !stepData) {
      return this.i18n(orderStep + ' in-progress');
    } else if (stepData) {
      return this.i18n(orderStep + ' Completed');
    } else {
      return this.i18n(orderStep + ' not started');
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
}
