import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { concatMap, map, takeUntil } from 'rxjs/operators';
import { ModifyAppointment, ModifyAppointmentResponse } from 'shared/models/create-appointment-data';
import { EorderAppointmentData, EorderModifyAppointmentData, EorderPersonalInformation } from 'shared/models/eorder';
import { GenderMandatoryFields, GenderPrefFieldName, GenderRaceOptions } from 'shared/models/gender-race-options';
import { ReasonEditState } from 'shared/models/reason-category';
import { AppointmentService } from 'shared/services/appointment.service';
import { DateService } from 'shared/services/date.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { PropertiesService } from 'shared/services/properties.service';
import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
import { formatPhone, NJ_State } from 'shared/utils/util';
import { regex } from 'shared/utils/validation/regex-patterns';
import { CustomValidators } from 'shared/utils/validation/validators';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-eorder-personal-information',
  templateUrl: './as-eorder-personal-information.component.html',
  styleUrls: ['./as-eorder-personal-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsEorderPersonalInformationComponent implements OnInit, OnDestroy {
  @ViewChild('as_Eorder_AddressSearchTxt') searchInput: ElementRef<any>;
  options: google.maps.places.AutocompletePrediction[] = [];
  controlSub: Subscription;
  addressLoading = false;
  delayTime: number;
  personalInfoForm: FormGroup;
  content = homeContent;
  states = this.i18nConstants.states;
  stateResult = this.states;
  previousUrl: string;
  facilityServiceId: any;
  destroy$ = new Subject<any>();
  personalInfoDataModal: EorderPersonalInformation;
  minDate = new Date();
  maxDate = new Date();
  isAlternateFlow: boolean;
  loading = false;
  isReview = false;
  destination: string;
  eorderAppointmentSummary: EorderModifyAppointmentData;
  modifyAppointmentInfo: ModifyAppointment;
  SMSConsentLanguage$: Observable<string>;
  genderRaceOptions: GenderRaceOptions[] = [];
  disableMobilePreference = false;
  eorderPersonalInfoFields: EorderPersonalInformation;
  contentFromApi$ = new Observable<string>();
  f4191 = null;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private i18nConstants: I18nConstantsService,
    private eorderDataService: EorderDataService,
    private eorderService: EorderService,
    private dateService: DateService,
    private appointmentService: AppointmentService,
    private propertiesService: PropertiesService,
    private route: ActivatedRoute,
    private genderFieldsService: GenderFieldsService,
  ) { }

  ngOnInit() {
    if (this.route.snapshot && this.route.snapshot.data) {
      this.f4191 = this.route.snapshot.data.f4191;
    }
    this.contentFromApi$ = this.propertiesService.getTransgenderContent();
    this.getGenderFieldsFromApi();
    this.SMSConsentLanguage$ = this.propertiesService.getSMSConsentLanguage();
    const currentYear = this.minDate.getFullYear();
    this.minDate.setFullYear(currentYear - 120);
    this.getblnEditReasonData();
    this.buildForm();
    this.getDemographicsInfo();
    this.getAlternateFlowStatus();
    this.getAppointmentData();
    this.isPhoneTypeCheckInit();
    if (!this.eorderDataService.isEditFromEorderSummary) {
      this.eorderDataService.getPersonalInformation().pipe(
        takeUntil(this.destroy$)
      ).subscribe((personalData) => {
        if (personalData) {
          personalData.phone = formatPhone(personalData.phone, this.personalInfoForm.get('phone'));
          this.personalInfoForm.patchValue(personalData);
          this.bindGenderFields();
          this.eorderPersonalInfoFields = personalData;
        }
      });
    } else {
      this.eorderDataService.getappointmentDataForEdit().pipe(takeUntil(this.destroy$)).subscribe(
        (modifyAppointmentData: EorderModifyAppointmentData) => {
          this.eorderAppointmentSummary = modifyAppointmentData;
          const data = {
            preferences: {
              preference_email: this.eorderAppointmentSummary?.demographics?.emailNotify,
              preference_mobile: this.eorderAppointmentSummary?.demographics?.smsNotify
            },
            ...this.eorderAppointmentSummary.demographics.demographics
          };
          this.personalInfoForm.patchValue(data);
          this.bindGenderFields();
          this.eorderPersonalInfoFields = (data as any);
        });
    }
  }

  getAlternateFlowStatus() {
    this.eorderDataService.getAlternateFlow().subscribe(res => {
      if (res) {
        this.isAlternateFlow = res;
      }
    });
  }

  getAppointmentData() {
    if (!this.eorderDataService.isEditFromEorderSummary) {
      this.loading = true;
      this.eorderService.getBasicEncounterInfo('appointment').subscribe((encounter: any) => {
        this.loading = false;
        if (encounter?.appointment?.facilityServiceId) {
          this.facilityServiceId = encounter.appointment.facilityServiceId;
          // set the alternate flow if it has ordercode
          if (!this.isAlternateFlow) {
            this.isAlternateFlow = false;
            this.eorderDataService.setAlternateFlow(false);
          }
          this.eorderDataService.setFacilityServiceId(this.facilityServiceId);
        } else {
          this.isAlternateFlow = true;
          this.eorderDataService.setAlternateFlow(true);
        }
      });
    }
  }

  getDemographicsInfo() {
    if (!this.eorderDataService.ispreviousUrlForDemographics && !this.eorderDataService.isEditFromEorderSummary) {
      this.eorderDataService.getVerifyIdentityData().pipe(
        concatMap((data) => {
          if (data.status === 'F') { // when user is not authenticated
            this.personalInfoForm.patchValue({
              dob: data.dob,
              lastName: data.lastName
            });
            return;
          }
          return this.eorderService.getBasicEncounterInfo('demographics');
        }),
        map((personalInfo) => {
          const addressInfo = {
            address1: personalInfo?.demographics?.address,
            address2: personalInfo?.demographics?.address2,
            city: personalInfo?.demographics?.city,
            state: personalInfo?.demographics?.state,
            zipCode: personalInfo?.demographics?.zip
          };
          return {
            ...personalInfo,
            demographics: {
              ...personalInfo?.demographics,
              addressInfo
            }
          };
        }),
      ).subscribe((res) => {
        if (res) {
          this.personalInfoDataModal = res.demographics;
          res.demographics.phone = formatPhone(res.demographics.phone, this.personalInfoForm.get('phone'));
          this.personalInfoForm.patchValue(res.demographics, { onlySelf: true, emitEvent: true });
          this.personalInfoForm.get('dob').markAsTouched();
          this.bindGenderFields();
          this.eorderPersonalInfoFields = res.demographics;
          this.eorderDataService.setlabCardLocationSearch(this.personalInfoDataModal.labCardStatus);
        }
      });
    }
  }
  buildForm() {
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.maxLength(75), Validators.pattern(regex.firstName), Validators.required]],
      lastName: ['', [Validators.maxLength(75), Validators.pattern(regex.lastName), Validators.required]],
      dob: ['', [Validators.required, CustomValidators.dateValidations(this.minDate, this.maxDate)]],
      gender: ['', [Validators.required]],
      emailAddress: ['', [Validators.maxLength(60), Validators.pattern(regex.email), Validators.required]],
      phone: [
        '',
        [Validators.minLength(10), Validators.maxLength(12), Validators.pattern(regex.phoneNumber), Validators.required]
      ],
      phoneType: ['', [Validators.required]],
      preferences: new FormGroup(
        {
          preference_email: new FormControl(true),
          preference_mobile: new FormControl(false)
        },
        CustomValidators.requireCheckboxesToBeCheckedValidator()
      ),
      genderPreference: [''],
      race: [''],
      ethnicity: [''],
      sexualOrientation: ['']
    });
  }
  isPhoneTypeCheckInit() {
    this.personalInfoForm.get('phoneType').valueChanges.subscribe((selected: string) => {
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  continueClicked() {
    this.updateGenderFields();
    // Save personalinformation and redirect
    const formValue = {
      ...this.personalInfoForm.value,
      ...this.getFormattedAddressFields()
    };
    delete formValue.addressInfo;
    this.eorderDataService.setPreviousUrlDemographic(false);
    this.eorderDataService.setPersonalInformation(formValue);
    this.genderFieldsService.userPersonalData = { ...formValue };
    this.eorderDataService.setAppointmentNavigation(false);
    if (this.eorderDataService.isEditFromEorderSummary) {
      this.loading = true;
      this.modifyAppointment(this.eorderAppointmentSummary);
    } else {
      const paramas = {
        demographics: {
          firstName: this.personalInfoForm.get('firstName').value,
          lastName: this.personalInfoForm.get('lastName').value,
          dateOfBirth: this.dateService.toDate(this.personalInfoForm.get('dob').value),
          gender: this.personalInfoForm.get('gender').value,
          phone: this.personalInfoForm.get('phone').value?.replace(/\-+/g, ''),
          phoneType: this.personalInfoForm.get('phoneType').value,
          email: this.personalInfoForm.get('emailAddress').value,
          genderPreference: this.personalInfoForm.get('genderPreference').value,
          race: this.personalInfoForm.get('race').value,
          ethnicity: this.personalInfoForm.get('ethnicity').value,
          sexualOrientation: this.personalInfoForm.get('sexualOrientation').value,
          ...this.getFormattedAddressFields()
        },
        emailNotify: this.personalInfoForm.get('preferences').get('preference_email').value,
        smsNotify: this.personalInfoForm.get('preferences').get('preference_mobile').value
      };
      this.eorderService.saveEncounter(paramas).subscribe(
        res => {
        },
        error => { }
      );
      this.previousUrl = '/eorder/as-eorder-personal-information';
      if (this.isReview) {
        this.router.navigate([this.destination]);
        this.eorderDataService.setblnEditReasonData(false);
      }
      else if (this.isAlternateFlow) {
        this.router.navigate(['/eorder/as-eorder-reason-for-visit']);
      }
      else {
        this.router.navigate(['/eorder/as-eorder-appt-scheduler']);
      }
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
    if (
      event.code !== 'Backspace' &&
      (currentValue.match(/^\d{3}$/) !== null || currentValue.match(/^\d{3}\/\/$/) !== null)
    ) {
      phoneElement.value = currentValue.substring(0, 3) + '-';
    } else if (
      event.code !== 'Backspace' &&
      (currentValue.match(/^\d{3}\-\d{3}$/) !== null || currentValue.match(/^\d{3}\-\d{3}\/\/$/) !== null)
    ) {
      phoneElement.value = currentValue.substring(0, 7) + '-';
    }
  }

  onkeypressdate(event, dateElement) {
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
    this.personalInfoForm.get('dob').patchValue(dateElement.value);
  }

  getblnEditReasonData() {
    this.eorderDataService.getblnEditReasonData().pipe(takeUntil(this.destroy$)).subscribe((blnEdit: ReasonEditState) => {
      this.isReview = blnEdit.blnedit;
      this.destination = blnEdit.route === this.router.url ? '/eorder/as-eorder-review-details' : blnEdit.route;
    });
  }
  modifyAppointment(data) {
    this.modifyAppointmentInfo = {
      channel: 'AS Web',
      labCard: false,
      authentication: {
        'confirmationCode': data.confirmationCode,
        'phone': data.demographics.demographics.phone
      },
      slot: {
        'siteCode': data.appointmentDetails.siteCode,
        'facilityServiceId': data.appointmentDetails.facilityServiceId,
        'appointmentDate': data.appointmentDetails.appointmentDate,
        'appointmentTime': data.appointmentDetails.appointmentTime,
      },
      notificationPreferences: {
        'pushNotificationOptIn': null,
        'emailOptIn': this.personalInfoForm.get('preferences').get('preference_email').value,
        'textMessageOptIn': this.personalInfoForm.get('preferences').get('preference_mobile').value
      },
      demographics: {
        'firstName': this.personalInfoForm.get('firstName').value,
        'lastName': this.personalInfoForm.get('lastName').value,
        'dateOfBirth': this.dateService.toDate(this.personalInfoForm.get('dob').value),
        'gender': this.personalInfoForm.get('gender').value,
        'phone': this.personalInfoForm.get('phone').value.replace(/\-+/g, ''),
        'phoneType': this.personalInfoForm.get('phoneType').value,
        'email': this.personalInfoForm.get('emailAddress').value,
        genderPreference: this.personalInfoForm.get('genderPreference').value,
        race: this.personalInfoForm.get('race').value,
        ethnicity: this.personalInfoForm.get('ethnicity').value,
        sexualOrientation: this.personalInfoForm.get('sexualOrientation').value,
        ...this.getFormattedAddressFields()
      },

    };
    this.appointmentService.modifyAppointment(this.modifyAppointmentInfo).subscribe((res: ModifyAppointmentResponse) => {
      this.loading = false;
      if (res.confirmationCode) {
        this.router.navigate(['/eorder/as-eorder-price-estimate']);
      } else {
        // show error
      }
    }, () => {
      this.loading = false;
    });
  }

  focusOut(event) {
    /** when fousing out from DOB field and checking month and day are prefixed with zero when single digit. */
    const controlValue = event.target.value;
    const arrDOB = controlValue.split('/');
    if (arrDOB.length === 3 && arrDOB[2].length === 4) {
      event.target.value = this.prefixZeroForDate(arrDOB);
    } else {
      if (controlValue.length > 0) {
        this.personalInfoForm.get('dob').setErrors({ invalidDateNew: true });
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

  getGenderFieldsFromApi() {
    if (this.route.snapshot && this.route.snapshot.data) {
      this.genderRaceOptions = this.route.snapshot.data.fields;
    }
  }

  get getRace$() {
    const options = this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.Race);
    if (options) {
      return of(options);
    }
    return this.eorderDataService.getappointmentData().pipe(map((appointmentData: EorderAppointmentData) => {
      return this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.Race,
        appointmentData?.data?.state?.toLowerCase());
    }));
  }

  get getEthnicity$() {
    const options = this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.Ethnicity);
    if (options) {
      return of(options);
    }
    return this.eorderDataService.getappointmentData().pipe(map((appointmentData: EorderAppointmentData) => {
      return this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.Ethnicity,
        appointmentData?.data?.state?.toLowerCase());
    }));
  }

  get getGenderPreference$() {
    const options = this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.GenderPreference);
    if (options) {
      return of(options);
    }
    return this.eorderDataService.getappointmentData().pipe(map((appointmentData: EorderAppointmentData) => {
      return this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.GenderPreference,
        appointmentData?.data?.state?.toLowerCase());
    }));
  }

  get getSexualOrientation$() {
    const options = this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.SexualOrientation);
    if (options) {
      return of(options);
    }
    return this.eorderDataService.getappointmentData().pipe(map((appointmentData: EorderAppointmentData) => {
      return this.genderFieldsService.checkFieldAndDisplay(this.genderRaceOptions, GenderPrefFieldName.SexualOrientation,
        appointmentData?.data?.state?.toLowerCase());
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

  addChildForm(name: string, group: FormGroup) {
    this.personalInfoForm.addControl(name, group);
    if (this.eorderPersonalInfoFields) {
      const addressInfo = {
        address1: this.eorderPersonalInfoFields?.address,
        address2: this.eorderPersonalInfoFields?.address2,
        city: this.eorderPersonalInfoFields?.city,
        state: this.eorderPersonalInfoFields?.state,
        zipCode: this.eorderPersonalInfoFields?.zip
      };
      this.personalInfoForm.get('addressInfo').patchValue(addressInfo);
    }
  }

  getFormattedAddressFields() {
    try {
      return {
        address: this.getAddressForm?.get('address1')?.value,
        address2: this.getAddressForm?.get('address2')?.value,
        city: this.getAddressForm?.get('city')?.value,
        state: this.getAddressForm?.get('state')?.value,
        zip: this.getAddressForm?.get('zipCode')?.value,
      };
    } catch (ex) {
      return {
        address: null,
        address2: null,
        city: null,
        state: null,
        zip: null,
      };
    }
  }

  get getAddressForm() {
    return this.personalInfoForm.get('addressInfo');
  }

  get getSelectedState$() {
    return this.eorderDataService.getappointmentData().pipe(map((appointmentData: EorderAppointmentData) => {
      return appointmentData?.data?.state?.toLowerCase() === NJ_State;
    }));
  }

  get getRaceValidation$(): Observable<boolean> {
    return this.eorderDataService.getappointmentData().pipe(map((appointmentData: EorderAppointmentData) => {
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
    return this.eorderDataService.getappointmentData().pipe(map((appointmentData: EorderAppointmentData) => {
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
    return this.eorderDataService.getappointmentData().pipe(map((appointmentData: EorderAppointmentData) => {
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
    return this.eorderDataService.getappointmentData().pipe(map((appointmentData: EorderAppointmentData) => {
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

}
