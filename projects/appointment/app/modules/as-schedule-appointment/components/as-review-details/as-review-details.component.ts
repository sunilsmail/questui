import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError, BehaviorSubject, Observable, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Appointment, AppointmentData } from 'shared/models/appointment';
import { CreateAppointmentData, CreateAppointmentResponse } from 'shared/models/create-appointment-data';
import { InsuranceData, PatientAddressInfo, PersonalData, SecondaryInsuranceData } from 'shared/models/index';
import { ReasonCategory } from 'shared/models/reason-category';
import { AppointmentService } from 'shared/services/appointment.service';
import { ClinicalTrailsService } from 'shared/services/clinical-trails/clinical-trails.service';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { DeeplinkService } from 'shared/services/deeplink.service';
import { InsuranceAddressService } from 'shared/services/insurance-address.service';
import { PropertiesService } from 'shared/services/properties.service';
import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { TealiumAnalyticsService } from 'shared/services/tealium-analytics.service';
import { TealiumEventService } from 'shared/services/tealium-event.service';
import { UserCurrentLocationService } from 'shared/services/user-current-location.service';
import { UserService } from 'shared/services/user.service';
import { default as homeContent } from '../../../../../assets/content.json';
import { AsNeverMindDialogComponent } from '../as-never-mind-dialog/as-never-mind-dialog.component';


@Component({
  selector: 'as-review-details',
  templateUrl: './as-review-details.component.html',
  styleUrls: ['./as-review-details.component.scss']
})
export class AsReviewDetailsComponent implements OnInit, OnDestroy {
  blnShowError = false;
  content = homeContent;
  insuranceData: InsuranceData = new InsuranceData();
  personalData: PersonalData = new PersonalData();
  reasonData: ReasonCategory = new ReasonCategory();
  testsData: ReasonCategory[];
  isTestData: boolean;
  facilityServiceId: number[] = [];
  appointmentData: Appointment = new Appointment();
  createAppointmentInfo: CreateAppointmentData;
  SpinnerLoading = false;
  personalInfoForm: FormGroup;
  // pass null if user location not needed
  center$ = of(null);
  // remove below line before production
  addresses = new BehaviorSubject([]);
  // Uncomment below line before production
  // addresses = new BehaviorSubject(['']);
  addresses$ = this.addresses.asObservable();
  formatedDate: string;
  destroy$ = new Subject<void>();
  imageSrc: any;
  neverMindText = 'Never mind';
  isButtonEnabled = true;
  isLoggedIn = false;
  skipInsurance$: Observable<boolean>;
  disableReason = false;
  secondaryInsData: SecondaryInsuranceData = new SecondaryInsuranceData();
  mandatoryAddressf1687 = false;
  constructor(private dataService: DataService,
    private dateService: DateService,
    private appointmentService: AppointmentService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private location: Location,
    private userService: UserService,
    private router: Router,
    private skipInsuranceService: SkipInsuranceService,
    private insuranceAddressService: InsuranceAddressService,
    private tealiumAnalyticsService: TealiumAnalyticsService,
    private uiPropertyService: PropertiesService,
    private deeplinkSerive: DeeplinkService,
    private secondaryInsuranceService: SecondaryInsuranceService,
    private userCurrentLocationService: UserCurrentLocationService,
    private tealiumEventService: TealiumEventService,
    private genderFieldsService: GenderFieldsService,
    private clinicalTrailsService: ClinicalTrailsService) {
    this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/ds-images/ds-icon-error-24.svg`);
  }

  ngOnInit() {
    this.uiPropertyService.getMandatoryAddressf1687().subscribe((val: boolean) => {
      this.mandatoryAddressf1687 = val;
    });
    this.disableReasonFunction();
    this.dataService.setAppState('isReviewed', true);
    this.getInsuranceData();
    this.getPersonalData();
    this.getReasonData();
    this.getTestsData();
    this.getAppointmentData();
    this.getSecondaryInsuranceData();
    this.skipInsurance$ = this.skipInsuranceService.getSkipInsurance();
    if (this.testsData && this.testsData.length > 0) {
      this.testsData.forEach(test => this.facilityServiceId.push(test.facilityServiceId));
    }
    else {
      this.facilityServiceId.push(this.reasonData.facilityServiceId);
    }
    this.getAuthUser();
  }

  getAuthUser() {
    this.userService.isAuthenticated$.subscribe((isAuth) => {
      this.isLoggedIn = isAuth;
    });
  }

  getSecondaryInsuranceData() {
    this.secondaryInsuranceService.getInsuranceData().pipe(takeUntil(this.destroy$)).subscribe((secondaryIns: SecondaryInsuranceData) => {
      this.secondaryInsData = secondaryIns;
    });
  }


  getInsuranceData() {
    this.dataService.getInsuranceData().pipe(takeUntil(this.destroy$)).subscribe((insuranceData: InsuranceData) => {
      this.insuranceData = insuranceData;
    });
  }
  getPersonalData() {
    this.dataService.getPersonalData().pipe(takeUntil(this.destroy$)).subscribe((personalData: PersonalData) => {
      this.personalData = personalData;
    });
  }
  getReasonData() {
    this.dataService.getReasonData().pipe(takeUntil(this.destroy$)).subscribe((reasonData: ReasonCategory) => {
      this.reasonData = reasonData;
    });
  }
  getTestsData() {
    this.dataService.getTestsData().pipe(takeUntil(this.destroy$)).subscribe((testsData: ReasonCategory[]) => {
      this.testsData = testsData;
      if (this.testsData.length > 0) {
        this.isTestData = true;
      }
    });
  }
  getAppointmentData() {
    this.dataService.getappointmentData().pipe(takeUntil(this.destroy$)).subscribe((appointmentData: AppointmentData) => {
      this.appointmentData = (appointmentData && appointmentData.data) ? appointmentData.data : null;
      if (appointmentData) {
        this.showMap(appointmentData.data);
      }
      this.formatedDate = appointmentData ? this.dateService.toDateTime(appointmentData.data.appointmentDate) : null;
    });
  }
  goToPrevious() {
    this.location.back();
  }
  showMap(data: Appointment) {
    const address = { position: { lat: data.latitude, lng: data.longitude } };
    this.addresses.next([address]);
  }
  clearDataKey(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.clearData();
    }
  }
  clearData() {
    this.openDialog();
    // this.dataService.clearAllData();
  }
  openDialog(): void {
    const data = {
      message: 'If you proceed, you will lose all of your progress and return to the home screen.',
      nevermind: true
    };
    const dialogRef = this.dialog.open(AsNeverMindDialogComponent, {
      // height: '251px',
      // width: '328px',
      data: data, // {name: this.name, animal: this.animal},
      autoFocus: false
    });
    dialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        dialogRef.close();
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      // on close do something here
      document.getElementById('never-mind-link').focus();
      document.getElementById('never-mind-link-desktop')?.focus();
    });
  }
  scheduleAppointment() {
    this.clinicalTrailsService.logClinicalTrailsMetrics().subscribe();
    if (this.insuranceData && this.insuranceData.data && this.insuranceData.data.sameas &&
      this.insuranceData.data.sameas === null) {
      this.insuranceData.data.sameas = false;
    }
    // console.log(this.insuranceAddressService.getAddressFields(this.insuranceData));
    this.SpinnerLoading = true;
    this.createAppointmentInfo = {
      channel: 'AS Web',
      siteCode: this.appointmentData.siteCode,
      firstName: this.personalData.firstName,
      lastName: this.personalData.lastName,
      dateOfBirth: this.dateService.toDate(this.personalData.dateOfBirth),
      gender: this.personalData.gender,
      phone: this.personalData.phone.replace(/-/g, ''),
      phoneType: this.personalData.isMobile,
      email: this.personalData.email,
      facilityServiceId: this.facilityServiceId,
      appointmentDate: this.appointmentData.appointmentDate,
      appointmentTime: this.appointmentData.appointmentTime,
      walkIn: null,
      emailOptIn: this.personalData.preferences.preference_email,
      textMessageOptIn: this.personalData.preferences.preference_mobile,
      pushNotificationOptIn: false,
      labCard: (this.insuranceData && this.insuranceData.data && this.insuranceData.data.labCard === 'true') ? true : false,
      insuranceMemberId: this.insuranceData && this.insuranceData.data ? this.insuranceData.data.memberId : null,
      insuranceGroupNumber: this.insuranceData && this.insuranceData.data ? this.insuranceData.data.groupId : null, // optional
      insuranceCompanyName: this.insuranceData && this.insuranceData.data ? this.insuranceData.data.provider.insuranceCompanyName : null,
      insuranceMnemonic: this.insuranceData && this.insuranceData.data ? this.insuranceData.data.provider.insuranceMnemonic : null,
      insuranceBillType: this.insuranceData && this.insuranceData.data ? this.insuranceData.data.provider.billType : null,
      insuranceOptOut: this.personalData.insuranceInfo !== 'insurance-provide',
      guarantorFirstName: this.insuranceData && this.insuranceData.data ? this.insuranceData.data.firstName : null,// 'John',
      guarantorLastName: this.insuranceData && this.insuranceData.data ? this.insuranceData.data.lastName : null,// 'Doe',
      guarantorDateOfBirth: (this.insuranceData && this.insuranceData.data && this.insuranceData.data.dateOfBirth) ? this.dateService.
        toDate(this.insuranceData.data.dateOfBirth) : null,// '2019-09-18',
      guarantorGender: this.insuranceData && this.insuranceData.data ? this.insuranceData.data.gender : null,
      guarantorPhone:
        (this.insuranceData &&
          this.insuranceData.data &&
          this.insuranceData.data.phone) ? this.insuranceData.data.phone.replace(/-/g, '') : null,
      // '2125551212',
      guarantorRelationship: this.insuranceData && this.insuranceData.data ? this.insuranceData.data.relationship : null,// 'Spouse',
      guarantorOptOut: false,
      primaryInsuranceHolder: this.insuranceData && this.insuranceData.data ? this.insuranceData.data.isPrimaryInsuranceHolder : null,
      visitCategory: this.getVisitCategory(),
      ...this.insuranceAddressService.getAddressFields(this.insuranceData, this.mandatoryAddressf1687),
      patientAddressInfo: this.getPatientAddress(),
      genderPreference: this.getGenderFields('genderPreference'),
      race: this.getGenderFields('race'),
      ethnicity: this.getGenderFields('ethnicity'),
      sexualOrientation: this.getGenderFields('sexualOrientation'),
      isValidMemberId: this.insuranceData?.isValidMemberId ? 'Y': 'N',
    };
    this.prepareSecondaryInsObject();
    if (this.dataService.searchCovidAppointmentsBy) {
      this.createAppointmentInfo.facilityServiceId = [this.dataService.searchCovidAppointmentsBy];
    }
    this.appointmentService.createAppointment(this.createAppointmentInfo, this.isLoggedIn).pipe(
      catchError(err => {
        this.blnShowError = true;
        this.neverMindText = 'Start Over';
        this.isButtonEnabled = false;
        return throwError(err);
      })
    ).subscribe((res: CreateAppointmentResponse) => {
      this.SpinnerLoading = false;

      const loginId = this.userService.getUserLoginId();
      if (res.confirmationCode) {
        this.createAppointmentTealiumLogEvent();
        this.dataService.setNewapptData(res);
        this.router.navigate(['/schedule-appointment/as-confirmation', { confirmationCode: res.confirmationCode }]);
      } else {
        // show
      }
    }, (err) => {
      this.SpinnerLoading = false;
      const loginId = this.userService.getUserLoginId();
      this.tealiumAnalyticsService.tealiumView(this.tealiumEventService.eventError(err, loginId, this.isLoggedIn));
    });
  }

  prepareSecondaryInsObject() {
    if (this.insuranceData && this.insuranceData.data && this.insuranceData.data.secondaryInsurance === 'true' && this.secondaryInsData) {
      this.createAppointmentInfo = {
        ...this.createAppointmentInfo,
        secondaryInsOptOut: false,
        secondaryInsurance: this.secondaryInsuranceService.formatSecondaryInsuranceToApiRequest(this.secondaryInsData,
          this.mandatoryAddressf1687)
      };
    } else {
      this.createAppointmentInfo = { ...this.createAppointmentInfo, secondaryInsOptOut: true, secondaryInsurance: null };
    }
  }

  getPersonalDataByKey(key: string): string {
    if (this.personalData && this.personalData[key]) {
      return this.personalData[key];
      // when appointment for #gurantor and a different primary address
    } else if (this.insuranceData && this.insuranceData.data && this.insuranceData.data[key] &&
      this.insuranceData.data.differentPersonalAddress[key]) {
      return this.insuranceData.data.differentPersonalAddress[key];
    }
    // when appointment for #gurantor and no changes in primary address && also appointment for #self
    else if (this.insuranceData && this.insuranceData.data && this.insuranceData.data[key]) {
      return this.insuranceData.data[key];
    }
    else {
      return null;
    }
  }

  getAddressFields(key: string) {
    if (this.insuranceData && this.insuranceData.data && this.insuranceData.data.sameas) {
      return this.getGuarantorDataByKey(key);
    }
    return this.getPersonalDataByKey(key);
  }

  getAddressFieldsSameAs(key: string) {
    if (this.insuranceData && this.insuranceData.data && !this.insuranceData.data.sameas) {
      return this.getGuarantorDataByKey(key);
    }
    return this.getPersonalDataByKey(key);
  }

  getGuarantorDataByKey(key: string): string {
    if (this.personalData && this.personalData.createAccount && this.insuranceData
      && this.insuranceData.data) {
      return this.insuranceData.data[key];
      // when #gurantor selected and a different primary address
    } if (this.insuranceData && this.insuranceData.data && this.insuranceData.data.differentPersonalAddress &&
      this.insuranceData.data.differentPersonalAddress[key] && this.insuranceData.data[key]) {
      return this.insuranceData.data[key];
    }     // when #gurantor selected and no changes in primary address && also for #self
    if (this.insuranceData && this.insuranceData.data && this.insuranceData.data.differentPersonalAddress &&
      this.insuranceData.data.differentPersonalAddress[key]) {
      return this.insuranceData.data.differentPersonalAddress[key];
    }
    else {
      return null;
    }
  }

  showLocations() {
    // this.dataService.setInsuranceData({ data: '', bringCarderror: true });
    this.dataService.setPreviousPage('/schedule-appointment/as-review-details');
    this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigate(routeUrl: string) {
    this.dataService.setblnEditReasonData(true, this.router.url);
    this.dataService.setblnShowLocError(false);
    this.router.navigate([routeUrl]);
  }
  getVisitCategory(): string {
    if (this.testsData && this.testsData.length > 0 && this.testsData[0].visitCategory) {
      return this.testsData[0].visitCategory;
    }
    return null;
  }
  private disableReasonFunction() {
    this.deeplinkSerive.getFlagFordisableReason().subscribe(res => {
      this.disableReason = res;
    });
  }
  getPatientAddress() {
    const patientAddressInfo: PatientAddressInfo = {
      ... this.personalData.patientAddressInfo
    };
    if (patientAddressInfo.address1 && patientAddressInfo.city && patientAddressInfo.zipCode) {
      return patientAddressInfo;
    }
    return null;
  }

  createAppointmentTealiumLogEvent() {
    const appointmentDetailsTealium = {
      appointment_date: this.dateService.toDateMMDDYY(this.createAppointmentInfo.appointmentDate),
      appointment_location_city: this.appointmentData?.city,
      appointment_location_name: this.appointmentData?.name,
      appointment_location_state: this.appointmentData?.state,
      appointment_location_zip: this.appointmentData?.zip,
      appointment_site_code: this.appointmentData?.siteCode
    };
    const loginId = this.userService.getUserLoginId();
    if (this.isLoggedIn) {
      this.userService.userDemographics$.subscribe(resp => {
        this.tealiumAnalyticsService.tealiumView(
          this.tealiumEventService.createAppointment
            (appointmentDetailsTealium, resp, loginId, this.isLoggedIn, this.userCurrentLocationService.showLocationDetectIcon));
      });
    } else {
      this.tealiumAnalyticsService.tealiumView(
        this.tealiumEventService.createAppointment
          (appointmentDetailsTealium, null, loginId, this.isLoggedIn, this.userCurrentLocationService.showLocationDetectIcon));
    }
  }

  getGenderFields(fieldName: string) {
    if (this.personalData[fieldName]) {
      return this.personalData[fieldName];
    } else if (this.genderFieldsService.selectedValues
      && this.genderFieldsService.selectedValues[fieldName]) {
      return this.genderFieldsService.selectedValues[fieldName];
    } else {
      return null;
    }
  }

}
