import { DatePipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { combineLatest, of, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { AppointmentData, ModifyAppointmentData } from 'shared/models/appointment';
import { AuthUserInsurance } from 'shared/models/auth-user-ins';
import { ModifyAppointmentResponse } from 'shared/models/create-appointment-data';
import { GenderMandatoryFields, GenderRaceOptions } from 'shared/models/gender-race-options';
import {
  PatientAddressInfo,
  PersonalData,
  UserDemographic
} from 'shared/models/index';
import { ReasonEditState } from 'shared/models/reason-category';
import { PhonePipe } from 'shared/pipes/phone.pipe';
import { AppointmentService } from 'shared/services/appointment.service';
import { AuthInsuranceService } from 'shared/services/auth-ins/auth-insurance.service';
import { ClinicalTrailsService } from 'shared/services/clinical-trails/clinical-trails.service';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { PropertiesService } from 'shared/services/properties.service';
import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
import { RouteService } from 'shared/services/route.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { UserService } from 'shared/services/user.service';
import { formatDOB, formatPhone, getValueByKeys } from 'shared/utils/util';
import { regex } from 'shared/utils/validation/regex-patterns';
import { CustomValidators } from 'shared/utils/validation/validators';
import { default as homeContent } from '../../../../../assets/content.json';
import { GenderPrefFieldName } from './../../../../../../shared/src/lib/models/gender-race-options';
import { NJ_State } from './../../../../../../shared/src/lib/utils/util';


@Component({
  selector: 'as-personal-information',
  templateUrl: './as-personal-information.component.html',
  styleUrls: ['./as-personal-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsPersonalInformationComponent implements OnInit, OnDestroy {
  @ViewChild('as_AddressSearchTxt') searchInput: ElementRef<any>;
  options: google.maps.places.AutocompletePrediction[] = [];
  controlSub: Subscription;
  addressLoading = false;
  destroy$ = new Subject<any>();
  delayTime: number;
  minDate = new Date();
  maxDate = new Date();
  content = homeContent;
  personalInfoForm: FormGroup;
  states = this.i18nConstants.states;
  stateResult = this.states;
  cityFromAPI: any;
  stateFromAPI: any;
  isReview: boolean;
  destination: string;
  isFindLocationFlow: boolean;
  previousUrl: string;
  facilityServiceId: any;
  confirmationCode: string;
  modifyAppointmentInfo: any;
  navigationExtras: NavigationExtras;
  insuranceDataExist: boolean;
  modifyAppointmentSummary: ModifyAppointmentData;
  isPersonalDataAvailable: boolean;
  skipInsurance$: Observable<boolean>;
  fromAuthUserEdit = false;
  loading = false;
  // showPreference: boolean;
  childComponentSuccess$ = new ReplaySubject<boolean>(1);
  schedulerMaintenanceF1385$: Observable<boolean>;
  SMSConsentLanguage$: Observable<string>;
  genderRaceOptions: GenderRaceOptions[] = [];
  disableMobilePreference = false;
  contentFromApi$ = new Observable<string>();
  googlemapsOptimizationF4191$: Observable<boolean>;
  personalInfoData: PersonalData = null;
  authUserInsurance: AuthUserInsurance;
  insurancePrefillF3904$ = new Observable<boolean>();
  isAuthFlow: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private i18nConstants: I18nConstantsService,
    private googleMapService: GoogleMapsService,
    private dataService: DataService,
    private dateService: DateService,
    private location: Location,
    private appointmentService: AppointmentService,
    private skipInsuranceService: SkipInsuranceService,
    private datePipe: DatePipe,
    private phonePipe: PhonePipe,
    private propertyService: PropertiesService,
    private routeService: RouteService,
    private route: ActivatedRoute,
    private genderFieldsService: GenderFieldsService,
    private clinicalTrailsService: ClinicalTrailsService,
    private authInsuranceService: AuthInsuranceService,
    private secondaryInsuranceService: SecondaryInsuranceService
  ) {
    this.childComponentSuccess$.next(false);
  }

  ngOnInit() {
    this.insurancePrefillF3904$ = this.propertyService.getInsurancePrefillF3904();
    this.googlemapsOptimizationF4191$ = this.propertyService.getGooglemapsOptimizationF4191();
    this.contentFromApi$ = this.propertyService.getTransgenderContent();
    this.getGenderFieldsFromApi();
    this.SMSConsentLanguage$ = this.propertyService.getSMSConsentLanguage();
    this.schedulerMaintenanceF1385$ = this.propertyService.getSchedulerMaintenancef1385();
    /* this.propertiesService.getGoogleApiDelayTime().subscribe(delayTime => {
      this.delayTime = delayTime;
    }); */
    const currentYear = this.minDate.getFullYear();
    this.minDate.setFullYear(currentYear - 120);
    // this.maxDate.setFullYear(currentYear - 13);
    this.buildForm();
    this.isMobileCheckInit();
    this.getblnEditReasonData();
    this.getFlow();
    this.skipInsuranceInfo();
    // this.dataService.getPersonalData().pipe(takeUntil(this.destroy$)).subscribe((personalData) => {
    //   if (personalData) {
    //     this.isPersonalDataAvailable = true;
    //     this.personalInfoForm.setValue(personalData);
    //   }
    // });
    this.bindUserData();
    this.dataService.getVerifyIdentityData().pipe(takeUntil(this.destroy$))
      .subscribe((verifyIdentityData) => {
        if (verifyIdentityData) {
          if (!this.isPersonalDataAvailable) {
            this.personalInfoForm.patchValue({
              dateOfBirth: verifyIdentityData.dob,
              lastName: verifyIdentityData.lastName
            });
          }
        }
      });
    this.userService.getUserdata().pipe(takeUntil(this.destroy$)).subscribe((userDemographics) => {
      this.setFormForAuthUser(userDemographics);
    });

    this.dataService.getInsuranceData().pipe(takeUntil(this.destroy$)).subscribe((insuranceData) => {
      if (insuranceData) {
        this.insuranceDataExist = true;
        if (this.authInsuranceService.selectedInsuranceType === 'insurance-prs') {
          this.personalInfoForm.patchValue({ insuranceInfo: 'insurance-prs' });
        } else {
          this.personalInfoForm.patchValue({ insuranceInfo: 'insurance-provide' });
        }
      }
    });
    if (this.dataService.isModifyCancel) {
      this.dataService.getmodifyAppointmentDataForEdit().subscribe((modifyAppointmentData: ModifyAppointmentData) => {
        this.modifyAppointmentSummary = modifyAppointmentData;
      });
    }
    this.setPreviousUrlForEdit();
    this.userService.isAuthenticated$.pipe().subscribe(isAuth => {
      this.isAuthFlow = isAuth;
    });
  }

  private setFormForAuthUser(userDemographics: UserDemographic) {
    if (!this.isPersonalDataAvailable) {
      this.personalInfoForm.patchValue({
        dateOfBirth: this.datePipe.transform(userDemographics.dateOfBirth, 'MM/dd/yyyy'),
        lastName: userDemographics.lastName,
        firstName: userDemographics.firstName,
        email: userDemographics.email,
        gender: userDemographics.sex,

      });
      this.personalInfoForm.get('dateOfBirth').markAsTouched();
      try {
        this.personalInfoForm.patchValue({
          race: userDemographics.race,
          ethnicity: userDemographics.ethnicity,
        });
        this.personalInfoForm.patchValue({
          genderPreference: userDemographics.genderPreference,
          sexualOrientation: userDemographics.sexualOrientation,
        });
      } catch (ex) {
        console.log('race control not found');
      }
      // if (userDemographics.genderPreference) {
      //   const genderPreference = this.getGenderPreference.filter(x => x.value === userDemographics.genderPreference);
      //   this.personalInfoForm.patchValue({
      //     genderPreference: genderPreference[0].value
      //   });
      // }
      // determine phone number to use
      const phoneDetails = this.getPhoneNumberByType(userDemographics);
      if (phoneDetails != null && phoneDetails.size > 0) {
        this.personalInfoForm.patchValue({
          phone: formatPhone(phoneDetails.get('phoneNumber'), this.personalInfoForm.get('phone')),
          isMobile: phoneDetails.get('phoneType')
        });
      }
    }
    if (userDemographics.isAuthEditFlow) {
      this.fromAuthUserEdit = userDemographics.isAuthEditFlow;
      this.dataService.getappointmentDataForEdit().subscribe((data: ModifyAppointmentData) => {
        this.modifyAppointmentSummary = data;
      });
      const formValue = this.personalInfoForm.value;
      formValue.preferences['preference_mobile'] = this.personalInfoForm.get('preferences').get('preference_mobile').value;
      this.dataService.setPersonalData(formValue);
      this.personalInfoForm.get('insuranceInfo').setValidators(null);
      if (userDemographics && userDemographics.preferences) {
        this.personalInfoForm.get('preferences').patchValue(userDemographics.preferences);
      }
    }
  }


  skipInsuranceInfo() {
    this.skipInsurance$ = this.skipInsuranceService.getSkipInsurance();
    this.skipInsurance$.subscribe((status) => {
      if (status) {
        this.personalInfoForm.patchValue({ insuranceInfo: 'insurance-later' });
      }
    });
  }

  getPhoneNumberByType(userDemographics: UserDemographic) {
    let phoneDetailsMap = new Map<string, string>();
    if (userDemographics.primaryPhone && userDemographics.primaryPhone != null) {
      phoneDetailsMap.set('phoneNumber', userDemographics.primaryPhone);
      phoneDetailsMap.set('phoneType', 'Mobile');
    } else if (userDemographics.secondaryPhone && userDemographics.secondaryPhone != null) {
      phoneDetailsMap.set('phoneNumber', userDemographics.secondaryPhone);
      phoneDetailsMap.set('phoneType', 'Landline');
    } else {
      phoneDetailsMap = null;
    }
    return phoneDetailsMap;
  }

  getFlow() {
    this.dataService.getFindLocationFlow().pipe(takeUntil(this.destroy$)).subscribe((result: boolean) => {
      this.isFindLocationFlow = result;
    });
    if (this.isFindLocationFlow) {
      this.previousUrl = '/schedule-appointment/as-find-lcn-appt-scheduler';
    } else {
      this.previousUrl = '/schedule-appointment/as-appt-scheduler';
    }
  }

  isMobileCheckInit() {
    this.personalInfoForm.get('isMobile').valueChanges.subscribe((selected: string) => {
      if (selected === 'Landline') {
        this.personalInfoForm.get('preferences').get('preference_mobile').patchValue(false);
        this.personalInfoForm.get('preferences').get('preference_mobile').disable();
        this.disableMobilePreference = true;
        this.personalInfoForm.get('preferences').get('preference_email').patchValue(true);
      } else {
        this.personalInfoForm.get('preferences').get('preference_mobile').enable();
        this.disableMobilePreference = false;
      }
    });
  }

  buildForm() {
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.maxLength(75), Validators.pattern(regex.firstName), Validators.required]],
      lastName: ['', [Validators.maxLength(75), Validators.pattern(regex.lastName), Validators.required]],
      dateOfBirth: ['', [Validators.required, CustomValidators.dateValidations(this.minDate, this.maxDate)]],
      // dateOfBirth: ['', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.maxLength(60), Validators.pattern(regex.email), Validators.required]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(12), Validators.pattern(regex.phoneNumber), Validators.required]],
      isMobile: ['', [Validators.required]],
      preferences: new FormGroup({
        preference_email: new FormControl(true),
        preference_mobile: new FormControl(false),
      }, CustomValidators.requireCheckboxesToBeCheckedValidator()),
      insuranceInfo: ['', [Validators.required]],
      genderPreference: [''],
      race: [''],
      ethnicity: [''],
      sexualOrientation: ['']
    });
  }



  continueClicked() {
    this.loading = true;
    this.updateGenderFields();
    // in personalInfoForm.value preference_mobile is not getting, manually updating value for preference_mobile
    const formValue = this.personalInfoForm.value;
    formValue.preferences['preference_mobile'] = this.personalInfoForm.get('preferences').get('preference_mobile').value;
    formValue.phone = formatPhone(formValue.phone);
    formValue.dateOfBirth = formatDOB(formValue.dateOfBirth);
    this.dataService.setPersonalData(formValue);
    this.genderFieldsService.userPersonalData = { ...formValue };
    /*  this.personalInfo = {

      };
      if(this.personalInfoForm.get('createAccount').value){
        this.createAccount();
      } */
    const userAccount = new UserDemographic();
    userAccount.firstName = this.personalInfoForm.get('firstName').value;
    if (!this.clinicalTrailsService?.signedUser?.firstName) {
      this.clinicalTrailsService.signedUser.firstName = this.personalInfoForm.get('firstName').value;
      this.clinicalTrailsService.signedUser.lastName = this.personalInfoForm.get('lastName').value;
    }

    // userAccount.isQuestUser = this.personalInfoForm.get('createAccount').value;
    this.dataService.setIsQuestAccountCreated(userAccount);
    if (this.dataService.isModifyCancel || this.fromAuthUserEdit) {
      this.modifyAppointment(this.modifyAppointmentSummary);
    }
    else if (this.personalInfoForm.get('insuranceInfo').value === 'insurance-prs') {
      this.loading = false;
      this.authInsuranceService.selectedInsuranceType = 'insurance-prs';
      if (this.insuranceDataExist && this.dataService.isModifyCancel && this.destination) {
        this.router.navigate([this.destination], this.navigationExtras);
      } else if (this.insuranceDataExist && this.destination) {
        this.router.navigate([this.destination]);
      } else {
        this.authInsuranceService.isModifyFlow = false;
        this.authInsuranceService.setPrimaryInsuranceData(this.authUserInsurance);
        this.router.navigate(['/schedule-appointment/as-review-details']);
      }
    }
    else if (this.personalInfoForm.get('insuranceInfo').value === 'insurance-provide') {
      this.loading = false;
      if (this.insuranceDataExist && this.dataService.isModifyCancel && this.destination) {
        this.router.navigate([this.destination], this.navigationExtras);
      } else if (this.insuranceDataExist && this.destination) {
        this.router.navigate([this.destination]);
      } else {
        if (this.isAuthFlow && this.authInsuranceService.selectedInsuranceType!=='insurance-provide') {
          this.authInsuranceService.isModifyFlow = false;
          this.authInsuranceService.setPrimaryInsuranceData(this.authUserInsurance);
        }
        this.router.navigate(['/schedule-appointment/as-insurance-information']);
      }
    } else if (
      this.personalInfoForm.get('insuranceInfo').value === 'insurance-no' ||
      this.personalInfoForm.get('insuranceInfo').value === 'insurance-later') {
      this.loading = false;
      this.dataService.setInsuranceData(null);
      this.secondaryInsuranceService.setInsuranceData(null);
      if (this.destination === '/schedule-appointment/as-insurance-information' || !this.destination) {
        this.router.navigate(['/schedule-appointment/as-review-details']);
      } else {
        this.router.navigate([this.destination]);
      }
    } else {
      this.loading = false;
      this.router.navigate(['/schedule-appointment/as-review-details']);
    }
  }
  getPhoneNumber(data) {
    if (getValueByKeys(data, ['demographicData', 'phone'])) {
      return getValueByKeys(data, ['demographicData', 'phone']);
    } else if (getValueByKeys(data, ['demographicDetails', 'phone'])) {
      return getValueByKeys(data, ['demographicDetails', 'phone']);
    }
  }
  modifyAppointment(data) {
    try {
      let patientAddress = null;
      try {
        patientAddress = <PatientAddressInfo>this.personalInfoForm.get('patientAddressInfo').value;
      }
      catch (ex) {
        patientAddress = null;
      }
      this.modifyAppointmentInfo = {
        channel: 'AS Web',
        labCard: false,
        authentication: {
          'confirmationCode': data.confirmationCode,
          'phone': this.getPhoneNumber(data).replace(/-/g, '')
        },
        slot: {
          'siteCode': getValueByKeys(data, ['appointmentDetails', 'siteCode']),
          'facilityServiceId': getValueByKeys(data, ['appointmentDetails', 'facilityServiceId']),
          'appointmentDate': getValueByKeys(data, ['appointmentDetails', 'appointmentDate']),
          'appointmentTime': getValueByKeys(data, ['appointmentDetails', 'appointmentTime']),
        },
        notificationPreferences: {
          'pushNotificationOptIn': null,
          'emailOptIn': this.personalInfoForm.get('preferences').get('preference_email').value,
          'textMessageOptIn': this.personalInfoForm.get('preferences').get('preference_mobile').value
        },
        demographics: {
          'firstName': this.personalInfoForm.get('firstName').value,
          'lastName': this.personalInfoForm.get('lastName').value,
          'dateOfBirth': this.dateService.toDate(this.personalInfoForm.get('dateOfBirth').value),
          'gender': this.personalInfoForm.get('gender').value,
          'phone': this.personalInfoForm.get('phone').value.replace(/-/g, ''),
          'phoneType': this.personalInfoForm.get('isMobile').value,
          'email': this.personalInfoForm.get('email').value,
          'genderPreference': this.personalInfoForm.get('genderPreference').value,
          patientAddressInfo: {
            ...patientAddress
          },
          race: this.personalInfoForm.get('race').value,
          ethnicity: this.personalInfoForm.get('ethnicity').value,
          sexualOrientation: this.personalInfoForm.get('sexualOrientation').value,
        },
      };
      this.appointmentService.modifyAppointment(this.modifyAppointmentInfo).subscribe((res: ModifyAppointmentResponse) => {
        this.loading = false;
        if (res.confirmationCode) {
          this.dataService.setNewapptData(res);
          this.navigationExtras = {
            queryParams: {
              'confirmationCode': res.confirmationCode,
            }
          };
          this.dataService.isInFLow = true;
          this.router.navigate(['/find-appointment/as-find-appointment-summary'], this.navigationExtras);
        } else {
          this.loading = false;
        }
      });
    }
    catch (ex) {
      this.loading = false;
    }
  }

  getblnEditReasonData() {
    this.dataService.getblnEditReasonData().pipe(takeUntil(this.destroy$)).subscribe((blnEdit: ReasonEditState) => {
      this.isReview = blnEdit.blnedit;
      this.destination = blnEdit.route === this.router.url ? '/schedule-appointment/as-review-details' : blnEdit.route;
    });
  }

  onkeypressdate(event: KeyboardEvent, dateElement: HTMLInputElement) {
    const currentValue = dateElement.value;
    if (event.code !== 'Backspace' && (currentValue.match(/^\d{2}$/) !== null || currentValue.match(/^\d{2}\/\/$/) !== null)) {
      dateElement.value = currentValue.substring(0, 2) + '/';
    } else if (
      event.code !== 'Backspace' &&
      (currentValue.match(/^\d{2}\/\d{2}$/) !== null || currentValue.match(/^\d{2}\/\d{2}\/\/$/) !== null)
    ) {
      dateElement.value = currentValue.substring(0, 5) + '/';
    }
  }

  onkeypressphone(event: KeyboardEvent, phoneElement: HTMLInputElement) {
    const currentValue = phoneElement.value;
    // if (event['keyCode'] === 8) {
    //   return false;
    // }
    // checking phone number length
    if (currentValue) {
      const phone = currentValue.replace(/\-+/g, '');
      if (phone.length > 10) {
        this.personalInfoForm.get('phone').setErrors({ invalidPhoneno: true });
        return;
      }
    }
    if (event.code !== 'Backspace' && (currentValue.match(/^\d{3}$/) !== null || currentValue.match(/^\d{3}\/\/$/) !== null)) {
      phoneElement.value = currentValue.substring(0, 3) + '-';
    } else if (event.code !== 'Backspace' && (currentValue.match(/^\d{3}\-\d{3}$/) !== null ||
      currentValue.match(/^\d{3}\-\d{3}\/\/$/) !== null)) {
      phoneElement.value = currentValue.substring(0, 7) + '-';
    }
  }

  goToPrevious() {
    /* if(this.isFindLocationFlow){
      this.router.navigate(['/schedule-appointment/as-find-lcn-appt-scheduler']);
    }else{
      this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
    } */
    this.location.back();
    this.dataService.setPreviousPage(this.router.url);
  }
  onkeyup(event, dateElement) {
    const currentValue = dateElement.value;
    const arrDOB = currentValue.split('/');
    const letters = /^[0-9/]+$/;
    if (!String(currentValue).match(letters)) {
      return false;
    }
    /** for every key press adding slash to the input control */
    if (event.keyCode !== 8 && (currentValue.match(/^\d{2}$/) !== null || currentValue.match(/^\d{2}\/\/$/) !== null)) {
      dateElement.value = currentValue.substring(0, 2) + '/';
    } else if (
      event.keyCode !== 8 &&
      (currentValue.match(/^\d{2}\/\d{2}$/) !== null || currentValue.match(/^\d{2}\/\d{2}\/\/$/) !== null)
    ) {
      dateElement.value = currentValue.substring(0, 5) + '/';
    }

    /** to add prefix zero for month and day */
    if (arrDOB.length === 3 && (currentValue.length === 8 || currentValue.length === 10)) {
      dateElement.value = this.prefixZeroForDate(arrDOB);
    }

    /**to handle pasted data*/
    if (currentValue.indexOf('/') === -1 && currentValue.length === 8) {
      // 01012000
      dateElement.value = `${currentValue.substr(0, 2)}/${currentValue.substr(2, 2)}/${currentValue.substr(4, 4)}`;
    } else if (currentValue.indexOf('/') === -1 && currentValue.length === 6) {
      // 112000
      dateElement.value = `0${currentValue.substr(0, 1)}/0${currentValue.substr(1, 1)}/${currentValue.substr(2, 4)}`;
    } else if (currentValue.indexOf('/') === -1 && currentValue.length === 7) {
      // 1012000
      dateElement.value = `0${currentValue.substr(0, 1)}/${currentValue.substr(1, 2)}/${currentValue.substr(3, 4)}`;
    }
    this.personalInfoForm.get('dateOfBirth').patchValue(dateElement.value);
  }

  focusOut(event) {
    /** when fousing out from DOB field and checking month and day are prefixed with zero when single digit. */
    const controlValue = event.target.value;
    const arrDOB = controlValue.split('/');
    if (arrDOB.length === 3 && arrDOB[2].length === 4) {
      event.target.value = this.prefixZeroForDate(arrDOB);
    } else {
      if (controlValue.length > 0) {
        this.personalInfoForm.get('dateOfBirth').setErrors({ invalidDateNew: true });
      }
    }
  }

  prefixZeroForDate(arrDOB: string[]): string {
    if (arrDOB.length === 3) {
      for (let i = 0; i <= arrDOB.length; i++) {
        /** adding prefix zero to month and day if their length is 1 */
        if (i === 0 || i === 1) {
          if (arrDOB[i].length === 1) {
            arrDOB[i] = `0${arrDOB[i]}`;
          }
        }
      }
      return `${arrDOB[0]}/${arrDOB[1]}/${arrDOB[2]}`;
    }
  }

  onKeyPress(event) {
    /** allowing only numbers and forward slash */
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57) && charCode !== 47) {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addChildForm(name: string, group: FormGroup) {
    this.personalInfoForm.addControl(name, group);
    this.childComponentSuccess$.next(true);
    this.bindAddressFromAuthUser();
  }

  bindAddressFromAuthUser() {
    combineLatest(this.userService.getUserdata(), this.childComponentSuccess$)
      .pipe(
        take(1),
        takeUntil(this.destroy$))
      .subscribe(([userDetails, value]: [UserDemographic, boolean]) => {
        if (value && userDetails) {
          let addressInfo = new PatientAddressInfo();
          if (userDetails.patientAddressInfo) {
            addressInfo = {
              address1: getValueByKeys(userDetails, ['patientAddressInfo', 'address1']),
              address2: getValueByKeys(userDetails, ['patientAddressInfo', 'address2']),
              city: getValueByKeys(userDetails, ['patientAddressInfo', 'city']),
              state: getValueByKeys(userDetails, ['patientAddressInfo', 'state']),
              zipCode: getValueByKeys(userDetails, ['patientAddressInfo', 'zipCode']),
            };
          }
          else if (this.personalInfoData) {
            addressInfo = {
              address1: getValueByKeys(this.personalInfoData, ['patientAddressInfo', 'address1']),
              address2: getValueByKeys(this.personalInfoData, ['patientAddressInfo', 'address2']),
              city: getValueByKeys(this.personalInfoData, ['patientAddressInfo', 'city']),
              state: getValueByKeys(this.personalInfoData, ['patientAddressInfo', 'state']),
              zipCode: getValueByKeys(this.personalInfoData, ['patientAddressInfo', 'zipCode']),
            };
          } else if (!this.dataService.isModifyCancel) {
            addressInfo = {
              address1: userDetails.address1,
              address2: userDetails.address2,
              city: userDetails.city,
              state: userDetails.state,
              zipCode: userDetails.zipCode
            };
          }

          this.personalInfoForm.get('patientAddressInfo').patchValue(addressInfo);
        }
      });
  }

  setPreviousUrlForEdit() {
    if (this.dataService.isModifyCancel || this.fromAuthUserEdit) {
      this.previousUrl = this.routeService.getSummaryUrl();
    }
  }

  bindUserData() {
    combineLatest([this.dataService.getPersonalData(), this.childComponentSuccess$])
      .pipe(
        // take(1),
        takeUntil(this.destroy$))
      .subscribe(([personalData, childBinded]: [PersonalData, boolean]) => {
        const personDemo: PersonalData = JSON.parse(JSON.stringify(personalData));
        this.personalInfoData = personDemo;
        if (!childBinded && personalData) {
          // delete personDemo.patientAddressInfo;
          this.isPersonalDataAvailable = true;
          this.personalInfoForm.patchValue(personDemo);
          this.bindGenderFields();
        } else if (childBinded && personalData) {
          const personDemoData: PersonalData = JSON.parse(JSON.stringify(personalData));
          this.isPersonalDataAvailable = true;
          if (!personDemoData.hasOwnProperty('patientAddressInfo')) {
            personDemoData.patientAddressInfo = {
              address1: null,
              address2: null,
              city: null,
              state: null,
              zipCode: null
            };
          }
          this.personalInfoForm.patchValue(personDemoData);
          this.bindGenderFields();
        }
      });
  }

  getGenderFieldsFromApi() {
    if (this.route.snapshot && this.route.snapshot.data) {
      this.genderRaceOptions = this.route.snapshot.data.fields;
      this.authUserInsurance = this.route.snapshot.data.authInsurance as AuthUserInsurance;
    }
  }

  addValidation(values: string[]) {
    values.forEach((controlName) => {
      this.personalInfoForm.get(controlName).setValidators(Validators.required);
      this.personalInfoForm.get(controlName).updateValueAndValidity();
    });
  }

  resetValidation(values: string[]) {
    values.forEach((controlName) => {
      this.personalInfoForm.get(controlName).setValidators(null);
      this.personalInfoForm.get(controlName).updateValueAndValidity();
    });
  }

  get getRace$() {
    const options = this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.Race);
    if (options) {
      return of(options);
    }
    else if (this.fromAuthUserEdit && this.modifyAppointmentSummary) {
      return of(this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.Race,
        this.modifyAppointmentSummary?.appointmentDetails?.pscLocationDetail?.state));
    }
    return this.dataService.getappointmentData().pipe(map((appointmentData: AppointmentData) => {
      return this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.Race,
        appointmentData?.data?.state?.toLowerCase());
    }));
  }

  get getEthnicity$() {
    const options = this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.Ethnicity);
    if (options) {
      return of(options);
    }
    else if (this.fromAuthUserEdit && this.modifyAppointmentSummary) {
      return of(this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.Ethnicity,
        this.modifyAppointmentSummary?.appointmentDetails?.pscLocationDetail?.state));
    }
    return this.dataService.getappointmentData().pipe(map((appointmentData: AppointmentData) => {
      return this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.Ethnicity,
        appointmentData?.data?.state?.toLowerCase());
    }));
  }

  get getGenderPreference$() {
    const options = this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.GenderPreference);
    if (options) {
      return of(options);
    }
    else if (this.fromAuthUserEdit && this.modifyAppointmentSummary) {
      return of(this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.GenderPreference,
        this.modifyAppointmentSummary?.appointmentDetails?.pscLocationDetail?.state));
    }
    return this.dataService.getappointmentData().pipe(map((appointmentData: AppointmentData) => {
      return this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.GenderPreference,
        appointmentData?.data?.state?.toLowerCase());
    }));
  }

  get getSexualOrientation$() {
    const options = this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.SexualOrientation);
    if (options) {
      return of(options);
    }
    else if (this.fromAuthUserEdit && this.modifyAppointmentSummary) {
      return of(this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.SexualOrientation,
        this.modifyAppointmentSummary?.appointmentDetails?.pscLocationDetail?.state));
    }
    return this.dataService.getappointmentData().pipe(map((appointmentData: AppointmentData) => {
      return this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.SexualOrientation,
        appointmentData?.data?.state?.toLowerCase());
    }));
  }

  get getRaceValidation$(): Observable<boolean> {
    return this.dataService.getappointmentData().pipe(map((appointmentData: AppointmentData) => {
      const controls = ['race'];
      const validate = this.genderFieldsService.checkFieldAndDisplayAndRequired(this.genderRaceOptions,
        GenderPrefFieldName.Race, appointmentData?.data?.state?.toLowerCase());
      if (validate) {
        this.addValidation(controls);
        return true;
      }
      this.resetValidation(controls);
      return false;
    }));
  }

  get getEthnicityValidation$(): Observable<boolean> {
    return this.dataService.getappointmentData().pipe(map((appointmentData: AppointmentData) => {
      const controls = ['ethnicity'];
      const validate = this.genderFieldsService.checkFieldAndDisplayAndRequired(this.genderRaceOptions,
        GenderPrefFieldName.Ethnicity, appointmentData?.data?.state?.toLowerCase());
      if (validate) {
        this.addValidation(controls);
        return true;
      }
      this.resetValidation(controls);
      return false;
    }));
  }

  get genderPreferenceValidation$(): Observable<boolean> {
    return this.dataService.getappointmentData().pipe(map((appointmentData: AppointmentData) => {
      const controls = ['genderPreference'];
      const validate = this.genderFieldsService.checkFieldAndDisplayAndRequired(this.genderRaceOptions,
        GenderPrefFieldName.GenderPreference, appointmentData?.data?.state?.toLowerCase());
      if (validate) {
        this.addValidation(controls);
        return true;
      }
      this.resetValidation(controls);
      return false;
    }));
  }

  get sexualOrientationValidation$(): Observable<boolean> {
    return this.dataService.getappointmentData().pipe(map((appointmentData: AppointmentData) => {
      const controls = ['sexualOrientation'];
      const validate = this.genderFieldsService.checkFieldAndDisplayAndRequired(this.genderRaceOptions,
        GenderPrefFieldName.SexualOrientation, appointmentData?.data?.state?.toLowerCase());
      if (validate) {
        this.addValidation(controls);
        return true;
      }
      this.resetValidation(controls);
      return false;
    }));
  }

  openTooltip(e) {
    e.stopPropagation();
  }

  bindGenderFields() {
    if (this.genderFieldsService.selectedValues) {
      for (const prop in this.genderFieldsService.selectedValues) {
        if (this.genderFieldsService.selectedValues[prop]) {
          this.personalInfoForm.patchValue({
            [prop]: this.genderFieldsService.selectedValues[prop]
          });
        }
      }
    }
  }

  get GIandSOEnabled() {
    return this.getGenderPreference$ && this.getSexualOrientation$;
  }

  updateGenderFields() {
    const modifiedObj: GenderMandatoryFields = {
      genderPreference: this.personalInfoForm.get('genderPreference').value,
      race: this.personalInfoForm.get('race').value,
      ethnicity: this.personalInfoForm.get('ethnicity').value,
      sexualOrientation: this.personalInfoForm.get('sexualOrientation').value
    };
    this.genderFieldsService.setMandatoryFields({ ...modifiedObj });
  }

  get getSelectedState$() {
    return this.dataService.getappointmentData().pipe(map((appointmentData: AppointmentData) => {
      return appointmentData?.data?.state?.toLowerCase() === NJ_State;
    }));
  }

  insuranceInfoChange(selectedOption: string) {
    if (this.authInsuranceService.selectedInsuranceType !== selectedOption) {
      this.insuranceDataExist = false;
    }
  }
}
