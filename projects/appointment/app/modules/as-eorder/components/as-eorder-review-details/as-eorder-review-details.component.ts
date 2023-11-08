import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError, BehaviorSubject, Observable, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { SecondaryInsuranceData } from 'shared/models';
import { editSummaryDetails } from 'shared/models/eOrder-state-navigation';
import {
  EorderAppointment, EorderAppointmentData, EorderCreateAppointmentData,
  EorderCreateAppointmentResponse, EorderInsuranceInformation, EorderPersonalInformation
} from 'shared/models/eorder';
import { ReasonCategory } from 'shared/models/reason-category';
import { AppointmentService } from 'shared/services/appointment.service';
import { DateService } from 'shared/services/date.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { InsuranceEorderAddressService } from 'shared/services/insurance-eorder-address.service';
import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { getValueByKeys } from 'shared/utils/util';
import { default as homeContent } from '../../../../../assets/content.json';
import { PropertiesService } from './../../../../../../shared/src/lib/services/properties.service';

@Component({
  selector: 'as-eorder-review-details',
  templateUrl: './as-eorder-review-details.component.html',
  styleUrls: ['./as-eorder-review-details.component.scss']
})
export class AsEorderReviewDetailsComponent implements OnInit, OnDestroy {
  blnShowError = false;
  content = homeContent;
  insuranceData: EorderInsuranceInformation = new EorderInsuranceInformation();
  personalData: EorderPersonalInformation = new EorderPersonalInformation();
  reasonData: ReasonCategory = new ReasonCategory();
  testsData: ReasonCategory[];
  isTestData: boolean;
  facilityServiceId: number[] = [];
  appointmentData: EorderAppointment = new EorderAppointment();
  eorderCreateAppointmentInfo: EorderCreateAppointmentData;
  SpinnerLoading = false;
  personalInfoForm: FormGroup;
  center$ = of(null);
  // remove below line before production
  addresses = new BehaviorSubject([]);
  // Uncomment below line before production
  // addresses = new BehaviorSubject(['']);
  addresses$ = this.addresses.asObservable();
  formatedDate: string;
  destroy$ = new Subject<void>();
  imageSrc: any;
  isButtonEnabled = true;
  confirmationCode: string;
  isAlternateFlow: boolean;
  secondaryInsData: SecondaryInsuranceData = new SecondaryInsuranceData();
  mandatoryAddressf1687 = false;

  constructor(private eorderDataService: EorderDataService,
    private eorderService: EorderService,
    private dateService: DateService,
    private appointmentService: AppointmentService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private location: Location,
    private router: Router,
    private insuranceEorderAddressService: InsuranceEorderAddressService,
    private secondaryInsuranceService: SecondaryInsuranceService,
    private propertiesService: PropertiesService,
    private genderFieldsService: GenderFieldsService) {
    this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/ds-images/ds-icon-error-24.svg`);
  }

  ngOnInit() {
    this.readFF1687();
    this.getAlternateFlowStatus();
    this.getReasonData();
    this.getTestsData();
    this.getInsuranceData();
    this.getPersonalData();
    this.getAppointmentData();
    this.getConfirmationCode();
    this.getFacilityServiceId();
    this.getSecondaryInsuranceData();
  }

  readFF1687() {
    this.propertiesService.getMandatoryAddressf1687().subscribe((val: boolean) => {
      this.mandatoryAddressf1687 = val;
    });
  }

  getSecondaryInsuranceData() {
    this.secondaryInsuranceService.getInsuranceData().pipe(takeUntil(this.destroy$)).subscribe((secondaryIns: SecondaryInsuranceData) => {
      this.secondaryInsData = secondaryIns;
    });
  }

  getAlternateFlowStatus() {
    this.eorderDataService.getAlternateFlow().subscribe(res => {
      this.isAlternateFlow = res;
    });
  }
  getFacilityServiceId() {
    this.eorderDataService.getFacilityServiceId().subscribe(res => {
      this.facilityServiceId = res;
    });
  }

  getReasonData() {
    this.eorderDataService.getReasonData().pipe(takeUntil(this.destroy$)).subscribe((reasonData: ReasonCategory) => {
      this.reasonData = reasonData;
    });
  }
  getTestsData() {
    this.eorderDataService.getTestsData().pipe(takeUntil(this.destroy$)).subscribe((testsData: ReasonCategory[]) => {
      this.testsData = testsData;
      if (this.testsData.length > 0) {
        this.isTestData = true;
      }
    });
  }

  getInsuranceData() {
    // tslint:disable-next-line: max-line-length
    this.eorderDataService.getInsuranceInformation().pipe(takeUntil(this.destroy$)).subscribe((insuranceData: EorderInsuranceInformation) => {
      this.insuranceData = insuranceData;
    });
  }
  getPersonalData() {
    this.eorderDataService.getPersonalInformation().pipe(takeUntil(this.destroy$)).subscribe((personalData: EorderPersonalInformation) => {
      this.personalData = personalData;
    });
  }
  getAppointmentData() {
    this.eorderDataService.getappointmentData().pipe(takeUntil(this.destroy$)).subscribe((appointmentData: EorderAppointmentData) => {
      this.appointmentData = appointmentData.data;
      if (appointmentData) {
        this.showMap(appointmentData.data);
      }
      this.formatedDate = appointmentData ? this.dateService.toDateTime(appointmentData.data.appointmentDate) : null;
    });
  }
  getConfirmationCode() {
    this.eorderDataService.getConfirmationCode().pipe(takeUntil(this.destroy$)).subscribe((code: string) => {
      this.confirmationCode = code;
    });
  }
  goToPrevious() {
    // this.router.navigate(['/eorder/as-eorder-insurance-information']);
    this.location.back();
  }
  showMap(data: EorderAppointment) {
    const address = { position: { lat: data.latitude, lng: data.longitude } };
    this.addresses.next([address]);
  }

  showLocations() {
    // this.eorderDataService.setInsuranceData({ data: '', bringCarderror: true });
    this.eorderDataService.setPreviousPage('/eorder/as-eorder-review-details');
    this.router.navigate(['/eorder/as-eorder-appt-scheduler']);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigate(routeUrl: string) {
    this.eorderDataService.setblnEditReasonData(true, this.router.url);
    this.eorderDataService.setAltEditFlow(true);
    this.eorderDataService.setblnShowLocError(false);
    this.router.navigate([routeUrl]);
  }
  onContinue() {
    if (this.mandatoryAddressf1687) {
      this.continueClickNew();
    } else {
      this.onContinueOld();
    }
  }

  continueClickNew() {
    try {
      this.SpinnerLoading = true;
      this.eorderCreateAppointmentInfo = {
        channel: 'AS Web',
        siteCode: this.appointmentData.siteCode,
        firstName: this.personalData.firstName,
        lastName: this.personalData.lastName,
        dateOfBirth: this.dateService.toDate(this.personalData.dob),
        gender: this.personalData.gender,
        phone: this.personalData.phone.replace(/-/g, ''),
        phoneType: this.personalData.phoneType,
        email: this.personalData.emailAddress.toLocaleLowerCase(),
        facilityServiceId: this.facilityServiceId,
        appointmentDate: this.appointmentData.appointmentDate,
        appointmentTime: this.appointmentData.appointmentTime,
        confirmationCode: this.confirmationCode,
        walkIn: null,
        emailOptIn: this.personalData.preferences.preference_email,
        textMessageOptIn: this.personalData.preferences.preference_mobile,
        pushNotificationOptIn: false,
        labCard: (this.insuranceData && this.insuranceData.insuranceData && this.insuranceData.insuranceData.labCard === 'true') ?
          true : false,
        insuranceMemberId: this.insuranceData && this.insuranceData.insuranceData ?
          this.insuranceData.insuranceData.memberId : null,
        insuranceGroupNumber: this.insuranceData && this.insuranceData.insuranceData ?
          this.insuranceData.insuranceData.groupId : null,
        insuranceCompanyName: this.insuranceData && this.insuranceData.insuranceData ?
          this.insuranceData.insuranceData.provider.insuranceCompanyName : null,
        insuranceMnemonic: this.insuranceData && this.insuranceData.insuranceData ?
          this.insuranceData.insuranceData.provider.insuranceMnemonic : null,
        insuranceOptOut: null,
        guarantorFirstName: getValueByKeys(this.insuranceData, ['insuranceData', 'firstName']),
        guarantorLastName: getValueByKeys(this.insuranceData, ['insuranceData', 'lastName']),
        guarantorDateOfBirth: getValueByKeys(this.insuranceData, ['insuranceData', 'dateOfBirth']) ?
          this.dateService.toDate(getValueByKeys(this.insuranceData, ['insuranceData', 'dateOfBirth'])) : null,
        guarantorGender: getValueByKeys(this.insuranceData, ['insuranceData', 'gender']),
        guarantorRelationship: getValueByKeys(this.insuranceData, ['insuranceData', 'relationship']),
        guarantorPhone: getValueByKeys(this.insuranceData, ['insuranceData', 'phone']) ?
          getValueByKeys(this.insuranceData, ['insuranceData', 'phone']).replace(/-/g, '') : null,
        guarantorOptOut: false,
        primaryInsuranceHolder: getValueByKeys(this.insuranceData, ['insuranceData', 'primary']),
        sendEmail: 'delayed',
        ...this.insuranceEorderAddressService.geteOrderAddressFields(this.insuranceData, this.personalData, true),
        genderPreference: this.getGenderFields('genderPreference'),
        race: this.getGenderFields('race'),
        ethnicity: this.getGenderFields('ethnicity'),
        sexualOrientation: this.getGenderFields('sexualOrientation'),
        isValidMemberId: this.insuranceData?.isValidMemberId ? 'Y': 'N',
      };
      this.prepareSecondaryInsObject();
      this.eorderService.EordercreateAppointment(this.eorderCreateAppointmentInfo).pipe(
        catchError(err => {
          this.blnShowError = true;
          return throwError(err);
        })
      ).subscribe((res: EorderCreateAppointmentResponse) => {
        this.SpinnerLoading = false;
        if (res.confirmationCode) {
          this.saveEncounter();
          this.eorderDataService.setEorderNewapptData(res);
          this.eorderDataService.setPreviousPage('/eorder/as-eorder-review-details');
          this.router.navigate(['/eorder/as-eorder-price-estimate']);
        } else {
          // show error
        }
      }, (err) => {
        this.SpinnerLoading = false;
      });
    }
    catch (ex) {
      console.log(ex);
      this.SpinnerLoading = false;
    }
  }

  onContinueOld() {
    try {
      this.SpinnerLoading = true;
      this.eorderCreateAppointmentInfo = {
        channel: 'AS Web',
        siteCode: this.appointmentData.siteCode,
        firstName: this.personalData.firstName,
        lastName: this.personalData.lastName,
        dateOfBirth: this.dateService.toDate(this.personalData.dob),
        gender: this.personalData.gender,
        phone: this.personalData.phone.replace(/-/g, ''),
        phoneType: this.personalData.phoneType,
        email: this.personalData.emailAddress.toLocaleLowerCase(),
        facilityServiceId: this.facilityServiceId,
        appointmentDate: this.appointmentData.appointmentDate,
        appointmentTime: this.appointmentData.appointmentTime,
        confirmationCode: this.confirmationCode,
        walkIn: null,
        emailOptIn: this.personalData.preferences.preference_email,
        textMessageOptIn: this.personalData.preferences.preference_mobile,
        pushNotificationOptIn: false,
        labCard: (this.insuranceData && this.insuranceData.insuranceData && this.insuranceData.insuranceData.labCard === 'true') ?
          true : false,
        insuranceMemberId: this.insuranceData && this.insuranceData.insuranceData ?
          this.insuranceData.insuranceData.memberId : null,
        insuranceGroupNumber: this.insuranceData && this.insuranceData.insuranceData ?
          this.insuranceData.insuranceData.groupId : null, // optional
        insuranceCompanyName: this.insuranceData && this.insuranceData.insuranceData ?
          this.insuranceData.insuranceData.provider.insuranceCompanyName : null,
        insuranceMnemonic: this.insuranceData && this.insuranceData.insuranceData ?
          this.insuranceData.insuranceData.provider.insuranceMnemonic : null,
        insuranceOptOut: null,
        // address: this.personalData.address ? this.personalData.address : null,
        // address2: this.personalData.address2 ? this.personalData.address2 : null,
        // city: this.personalData.city ? this.personalData.city : null,
        // state: this.personalData.state ? this.personalData.state : null,
        // zip: this.personalData.zip ? this.personalData.zip : null,
        guarantorFirstName: (this.insuranceData && this.insuranceData.insuranceData && this.insuranceData.insuranceData.PersonalAddress) ?
          this.getValueByKey(this.insuranceData, this.insuranceData.insuranceData.PersonalAddress, 'firstName') : null,
        guarantorLastName: (this.insuranceData && this.insuranceData.insuranceData && this.insuranceData.insuranceData.PersonalAddress) ?
          this.getValueByKey(this.insuranceData, this.insuranceData.insuranceData.PersonalAddress, 'lastName') : null,
        guarantorDateOfBirth: (this.insuranceData && this.insuranceData.insuranceData && this.insuranceData.insuranceData.PersonalAddress &&
          this.insuranceData.insuranceData.PersonalAddress.dateOfBirth) ? this.dateService.
            toDate(this.insuranceData.insuranceData.PersonalAddress.dateOfBirth) : null,
        guarantorGender: (this.insuranceData && this.insuranceData.insuranceData && this.insuranceData.insuranceData.PersonalAddress) ?
          this.getValueByKey(this.insuranceData, this.insuranceData.insuranceData.PersonalAddress, 'gender') : null,
        // address of guarantor start
        // guarantorAddress: getValueByKeys(this.insuranceData, ['insuranceData', 'differentPersonalAddress', 'address1']),
        // guarantorAddress2: getValueByKeys(this.insuranceData, ['insuranceData', 'differentPersonalAddress', 'address2']),
        // guarantorCity: getValueByKeys(this.insuranceData, ['insuranceData', 'differentPersonalAddress', 'city']),
        // guarantorState: getValueByKeys(this.insuranceData, ['insuranceData', 'differentPersonalAddress', 'state']),
        // guarantorZip: getValueByKeys(this.insuranceData, ['insuranceData', 'differentPersonalAddress', 'zipCode']),
        // address of guarantor end
        guarantorPhone:
          (this.insuranceData &&
            this.insuranceData.insuranceData &&
            this.insuranceData.insuranceData.PersonalAddress.phone) ?
            this.insuranceData.insuranceData.PersonalAddress.phone.replace(/-/g, '') : null,
        guarantorRelationship: (this.insuranceData && this.insuranceData.insuranceData
          && this.insuranceData.insuranceData.PersonalAddress) ?
          this.getValueByKey(this.insuranceData, this.insuranceData.insuranceData.PersonalAddress, 'relationship') : null,
        guarantorOptOut: false,
        primaryInsuranceHolder: getValueByKeys(this.insuranceData, ['insuranceData', 'primary']),
        sendEmail: 'delayed',
        ...this.insuranceEorderAddressService.geteOrderAddressFields(this.insuranceData, this.personalData),
        genderPreference: this.getGenderFields('genderPreference'),
        race: this.getGenderFields('race'),
        ethnicity: this.getGenderFields('ethnicity'),
        sexualOrientation: this.getGenderFields('sexualOrientation'),
      };
      this.prepareSecondaryInsObject();
      this.eorderService.EordercreateAppointment(this.eorderCreateAppointmentInfo).pipe(
        catchError(err => {
          this.blnShowError = true;
          return throwError(err);
        })
      ).subscribe((res: EorderCreateAppointmentResponse) => {
        this.SpinnerLoading = false;
        if (res.confirmationCode) {
          this.saveEncounter();
          this.eorderDataService.setEorderNewapptData(res);
          this.eorderDataService.setPreviousPage('/eorder/as-eorder-review-details');
          this.router.navigate(['/eorder/as-eorder-price-estimate']);
        } else {
          // show error
        }
      }, (err) => {
        this.SpinnerLoading = false;
      });
    }
    catch (ex) {
      this.SpinnerLoading = false;
    }
  }

  prepareSecondaryInsObject() {
    if (this.insuranceData && this.insuranceData.insuranceData &&
      this.insuranceData.insuranceData.secondaryInsurance === 'true' && this.secondaryInsData) {
      this.eorderCreateAppointmentInfo.secondaryInsOptOut = false;
      this.eorderCreateAppointmentInfo.secondaryInsurance = this.secondaryInsuranceService
        .formatSecondaryInsuranceToApiRequest(this.secondaryInsData, this.mandatoryAddressf1687);
    } else {
      this.eorderCreateAppointmentInfo.secondaryInsOptOut = true;
      this.eorderCreateAppointmentInfo.secondaryInsurance = null;
    }
  }

  getValueByKey(data, object, key) {
    let value;
    return value = data && object ? object[key] : null;
  }

  saveEncounter() {
    this.eorderService.saveEncounter({ stateNavigation: editSummaryDetails.costEstimate }).subscribe();
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
