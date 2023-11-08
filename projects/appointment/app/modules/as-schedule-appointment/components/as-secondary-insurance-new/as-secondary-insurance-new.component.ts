import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import {
  InsuranceProvider,
  InsuranceVerificationRequest,
  InsuranceVerificationResponse,
  PatientAddressInfo,
  PersonalData,
  SecondaryInsurance,
  UserDemographic
} from 'shared/models';
import { ModifyAppointment, ModifyAppointmentResponse } from 'shared/models/create-appointment-data';
import { AppointmentService } from 'shared/services/appointment.service';
import { AuthInsuranceService } from 'shared/services/auth-ins/auth-insurance.service';
import { DataService } from 'shared/services/data.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { InsuranceValidationService } from 'shared/services/insurance-validation.service';
import { InsuranceService } from 'shared/services/insurance.service';
import { PropertiesService } from 'shared/services/properties.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { default as homeContent } from '../../../../../assets/content.json';
import { InsuranceError, InsuranceVerificationResponseVersion2, Pattern, SecondaryInsuranceData } from './../../../../../../shared/src/lib/models/insurance';

@Component({
  selector: 'as-secondary-information-new',
  templateUrl: './as-secondary-insurance-new.component.html',
  styleUrls: ['./as-secondary-insurance-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsSecondaryInsuranceNewComponent implements OnInit, OnDestroy {
  content = homeContent;
  form: FormGroup;
  providerOptions: InsuranceProvider[] = [];
  insuranceProviders: Array<InsuranceProvider> = [];
  destroy$ = new Subject<any>();
  insuranceInfo: InsuranceVerificationRequest;
  SpinnerLoading = false;
  error = false;
  noMatchesError = false;
  bringCardError = false;
  invalidId: boolean;
  insuranceData: SecondaryInsuranceData;
  letUserGo = false;
  userName: string;
  initValue = 'true';
  userName$: Observable<string>;
  subscription: Subscription = new Subscription();
  disableContinueButton = false;
  clickCount = 0;
  gtrSelected = false;
  childComponentSuccess$ = new Subject<any>();
  addressComponentSuccess$ = new Subject<any>();
  modifyAppointmentInfo: ModifyAppointment;
  resetSecInsurance = false;
  addressFields: PatientAddressInfo;
  personalData: PersonalData;
  patientAddressInfo: PatientAddressInfo;
  errorMessageType = null;
  memberIdGroupIdErrorCount = 0;
  insuranceInfo_Cache: InsuranceVerificationRequest;
  insError = InsuranceError;
  validPatterns: Pattern[] = [];
  googlemapsOptimizationF4191$: Observable<boolean>;
  detectChange: any;
  isValidMemberId = false;
  constructor(
    private fb: FormBuilder,
    private insuranceService: InsuranceService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private dataService: DataService,
    private location: Location,
    private secondaryInsuranceService: SecondaryInsuranceService,
    private i18nConstants: I18nConstantsService,
    private googleMapService: GoogleMapsService,
    private appointmentService: AppointmentService,
    private cd: ChangeDetectorRef,
    private insuranceValidationService: InsuranceValidationService,
    private authInsuranceService: AuthInsuranceService,
    private propertiesService: PropertiesService
  ) {
    this.childComponentSuccess$.next(false);
    this.addressComponentSuccess$.next(false);
  }

  ngOnInit() {
    this.googlemapsOptimizationF4191$ = this.propertiesService.getGooglemapsOptimizationF4191();
    this.getPatientAddressfromWhoisVisitingPage();
    this.insuranceProviders = this.insuranceService.insuranceProviderList;
    this.userName$ = this.dataService.getIsQuestAccountCreated().pipe(map((data: UserDemographic) => data.firstName));
    this.buildForm();
    this.bindForm();
  }

  sortPayors() {
    return function (a, b) {
      const insNameA = a.insuranceCompanyName;
      const insNameB = b.insuranceCompanyName;
      if (insNameA < insNameB) { // sort string ascending
        return -1;
      }
      if (insNameA > insNameB) {
        return 1;
      }
    };
  }

  bindForm() {
    this.secondaryInsuranceService.getInsuranceData().subscribe((formData: SecondaryInsuranceData) => {
      const insData: SecondaryInsuranceData = JSON.parse(JSON.stringify(formData));
      this.insuranceData = { ...insData };
      if (insData && insData && insData.isPrimaryInsuranceHolder && insData.isPrimaryInsuranceHolder === 'false') {
        this.handleChange(insData.isPrimaryInsuranceHolder);
        combineLatest([this.childComponentSuccess$, this.addressComponentSuccess$])
          .subscribe(([info, address]) => {
            delete insData.bringCarderror;
            this.form.patchValue(insData, { emitEvent: false });
            this.checkError();
          });
      } else if (insData && insData && insData.isPrimaryInsuranceHolder && insData.isPrimaryInsuranceHolder === 'true') {
        this.handleChange(insData.isPrimaryInsuranceHolder);
        delete insData.bringCarderror;
        if (!insData.hasOwnProperty('sameas')) {
          insData.sameas = false;
        }
        this.form.patchValue(insData, { emitEvent: false });
        this.checkError();
      }
      this.updateFormState();
    });
  }

  goToPrevious() {
    this.location.back();
  }

  displayFn(user: InsuranceProvider) {
    if (user) {
      this.error = false;
      return user.insuranceCompanyName;
    }
  }

  trackByFn(index, item: InsuranceProvider) {
    return item.insuranceMnemonic;
  }

  buildForm() {
    this.form = this.fb.group({
      provider: ['', [Validators.required]],
      memberId: ['', [Validators.required]],
      groupId: [''],
      isPrimaryInsuranceHolder: [this.initValue],
      sameas: [false],
    });
    this.checkError();
    this.providerSearchInit();
  }

  providerSearchInit() {
    const providerSubscription = this.form.get('provider').valueChanges.pipe(
      distinctUntilChanged()).subscribe(inputValues => {
        this.memberIdGroupIdErrorCount = 0;
        this.errorMessageType = null;
        if (inputValues) {
          if (inputValues.length > 0) {
            this.providerOptions = this.insuranceProviders.filter((el: InsuranceProvider) => {
              const insName = el.insuranceCompanyName.toLowerCase();
              inputValues = inputValues.toLowerCase();
              if (insName.includes(inputValues)) {
                return true;
              } else {
                return false;
              }
            }).sort((a, b) => { // sort the filtered items with starts with then ascending order
              const insNameA = a.insuranceCompanyName.toLowerCase();
              const insNameB = b.insuranceCompanyName.toLowerCase();
              if (insNameA.startsWith(inputValues)) { return -1; }
              if (insNameB.startsWith(inputValues)) { return 1; }
              if (insNameA < insNameB) { // sort string ascending
                return -1;
              }
              if (insNameA > insNameB) {
                return 1;
              }
              return 0; // default return value (no sorting)
            });

            if (this.providerOptions.length > 0) {
              this.showError('none');
            } else {
              this.showError('noMatchError');
            }
          } else {
            this.showError('none');
            this.providerOptions.length = 0;
          }
        }
      });
    this.subscription.add(providerSubscription);
  }

  checkError() {
    let inputValue = '';
    const provider = this.insuranceProviders.filter((el: InsuranceProvider) => {
      const insName = el.insuranceCompanyName.toLowerCase();
      inputValue =
        typeof (this.form.get('provider').value) === 'string' ?
          this.form.get('provider').value.toLowerCase() :
          this.form.get('provider').value.insuranceCompanyName.toLowerCase();
      return insName === inputValue;
    });
    if (this.insuranceProviders.length === 0 && typeof this.form.get('provider').value === 'string') {
      inputValue = this.form.get('provider').value.toLowerCase();
    } else if (
      this.insuranceProviders.length === 0 &&
      this.insuranceData &&
      this.insuranceData.provider
    ) {
      inputValue = this.insuranceData.provider.insuranceCompanyName;
    }
    if (inputValue.length > 0 && provider.length === 0) {
      this.noMatchesError = false;
      this.showError('bringCardError');
    } else {
      this.bringCardError = false;
    }
  }

  clearError() {
    if (this.form.get('provider').value && this.form.get('provider').value.length > 0 && this.providerOptions.length === 0) {
      this.error = false;
      this.noMatchesError = false;
      this.bringCardError = false;

    }
  }

  continueError() {
    if (this.invalidId) {
      this.error = false;
      this.invalidId = false;
      this.letUserGo = true;
    }
    const memberIdSubscription = this.form.get('memberId').valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.letUserGo = false;
    });
    this.subscription.add(memberIdSubscription);
  }


  continueClicked() {
    this.SpinnerLoading = true;
    this.checkInsuranceIfnotSelectedFromList();
    const secondaryIns: SecondaryInsurance = {
      insuranceMnemonic: this.form.value.provider.insuranceMnemonic,
      insuranceMemberId: this.form.value.memberId,
      insuranceGroupId: this.form.value.groupId ? this.form.value.groupId : null,
    };
    this.insuranceInfo = { ...secondaryIns };
    this.verifyInsuranceNew(secondaryIns);
  }

  setInsdataInservice(bringCarderror: boolean) {
    const provider = this.form.value.provider;
    if (typeof provider === 'string') {
      this.form.get('provider').patchValue({
        insuranceCompanyName: this.form.value.provider,
        insuranceMnemonic: null
      });
    }
    if (this.resetSecInsurance) {
      this.secondaryInsuranceService.setInsuranceData(null);
    } else {
      this.secondaryInsuranceService.setInsuranceData({ ...this.form.getRawValue(), bringCarderror: bringCarderror,
        isValidMemberId: this.isValidMemberId });
    }
  }

  checkInsuranceIfnotSelectedFromList() {
    if (typeof this.form.value.provider === 'string') {
      const foundIndex = this.insuranceProviders.
        findIndex((ele) => ele.insuranceCompanyName.toLowerCase() === this.form.value.provider.toLowerCase());
      if (foundIndex > -1) {
        const inst = this.insuranceProviders[foundIndex];
        this.form.get('provider').patchValue({
          insuranceCompanyName: inst.insuranceCompanyName,
          insuranceMnemonic: inst.insuranceMnemonic
        });
      }
    }
  }

  navigateToNext() {
    this.router.navigate(['/schedule-appointment/as-review-details']);
  }

  getMnemonic() {
    if (this.form && this.form.value && this.form.value.provider && this.form.value.provider.insuranceMnemonic) {
      return this.form.value.provider.insuranceMnemonic;
    }
    return '';
  }

  getCompanyName() {
    if (this.form && this.form.value && this.form.value.provider && this.form.value.provider.insuranceCompanyName) {
      return this.form.value.provider.insuranceCompanyName;
    }
    return this.form.value.provider;
  }

  handleChange(event) {
    if (event === 'false') {
      this.gtrSelected = true;
    } else {
      this.gtrSelected = false;
      this.form.removeControl('addressInfo');
      this.form.removeControl('userInfo');
      this.form.get('sameas').patchValue(false);
    }
  }

  clearNoMatchError() {
    const providerSubscription = this.form.get('provider').valueChanges.subscribe(value => {
      if (value !== null && value.length < 1) {
        this.bringCardError = false;
        this.error = false;
      }
    });
    this.subscription.add(providerSubscription);
  }

  navigateToSummaryPage(confirmationcode) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        confirmationCode: confirmationcode
      }
    };
    this.router.navigate(['/find-appointment/as-find-appointment-summary'], navigationExtras);
  }

  showError(type) {
    if (type === 'none') {
      this.error = false;
      this.noMatchesError = false;
      this.bringCardError = false;
    } else {
      this.error = true;
      if (type === 'noMatchError') {
        this.noMatchesError = true;
        this.bringCardError = false;
      } if (type === 'bringCardError') {
        this.bringCardError = true;
        this.noMatchesError = false;
      }
    }
  }
  get getNoMatchError() {
    return this.noMatchesError;
  }
  get getBringCardError() {
    return this.bringCardError;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }

  resetInsurance() {
    this.secondaryInsuranceService.setInsuranceData(null);
    if (this.secondaryInsuranceService.modifyAppointmentInfo) {
      this.resetSecInsurance = true;
      this.modifyAppointment();
    } else {
      this.navigateToNext();
    }
  }

  addChildForm(name: string, group: FormGroup) {
    this.form.addControl(name, group);
    this.childComponentSuccess$.next(true);
  }

  modifyAppointment() {
    this.modifyAppointmentInfo = this.secondaryInsuranceService.modifyAppointmentInfo;
    this.prepareSecondaryInsObject();
    this.appointmentService
      .modifyAppointment(this.modifyAppointmentInfo)
      .subscribe((res: ModifyAppointmentResponse) => {
        this.SpinnerLoading = false;
        this.setInsdataInservice(null);
        this.secondaryInsuranceService.modifyAppointmentInfo = null;
        if (res.confirmationCode) {
          this.dataService.setNewapptData(res);
          this.dataService.isInFLow = true;
          if (this.dataService.isModifyCancel) {
            this.dataService.isModifyCancel = true;
          } else {
            this.dataService.isModifyCancel = false;
          }
          this.navigateToSummaryPage(res.confirmationCode);
          this.resetSecInsurance = false;
        } else {
          // show error
        }
      }, () => {
        this.SpinnerLoading = false;
      });
  }

  prepareSecondaryInsObject() {
    if (this.modifyAppointmentInfo && this.modifyAppointmentInfo.preregistration && !this.resetSecInsurance) {
      this.modifyAppointmentInfo.preregistration.secondaryInsOptOut = false;
      this.modifyAppointmentInfo.preregistration.secondaryInsurance =
        this.secondaryInsuranceService.formatSecondaryInsuranceToApiRequest(this.form.getRawValue(), true);
      this.modifyAppointmentInfo.preregistration.secondaryInsurance.isValidMemberId = this.isValidMemberId ? 'Y' : 'N';
    } else if (this.modifyAppointmentInfo && this.modifyAppointmentInfo.preregistration && this.resetSecInsurance) {
      this.modifyAppointmentInfo.preregistration.secondaryInsOptOut = true;
      this.modifyAppointmentInfo.preregistration.secondaryInsurance = null;
    }
  }

  addChildAddressForm(name: string, group: FormGroup) {
    this.form.addControl(name, group);
    this.addressComponentSuccess$.next(true);
    this.bindAddress(this.form.get('sameas').value);
    this.form.updateValueAndValidity();
  }

  updateValidationForDiffAddress(value: any) {
    /** if address is different checked enabling validations else removing validations  */
    this.detectChange = value;
    if (value) {
      this.resetAddress();
    } else {
      this.bindAddress(false);
    }
  }

  bindAddress(value = true) {
    if (value) {
      if (this.insuranceData && this.insuranceData &&
        this.insuranceData.addressInfo && this.insuranceData.addressInfo.address1) {
        value = !this.insuranceData.sameas;
        this.addressFields = this.insuranceData.addressInfo;
      }
    } else if (this.secondaryInsuranceService.patientAddressInfo) {
      this.addressFields = { ...this.secondaryInsuranceService.patientAddressInfo };
      value = true;
    } else if (this.personalData) {
      this.addressFields = { ...this.personalData.patientAddressInfo };
      value = true;
    }
    if (this.addressFields) {
      this.form.get('addressInfo').reset();
      this.form.get('addressInfo').updateValueAndValidity();
      this.form.get('addressInfo').get('address1').patchValue(this.addressFields.address1);
      this.form.get('addressInfo').get('address2').patchValue(this.addressFields.address2);
      this.form.get('addressInfo').get('city').patchValue(this.addressFields.city);
      this.form.get('addressInfo').get('state').patchValue(this.addressFields.state);
      this.form.get('addressInfo').get('zipCode').patchValue(this.addressFields.zipCode);
      if (value) {
        this.form.get('addressInfo').disable();
      }
    }
  }

  resetAddress() {
    this.form.get('addressInfo').updateValueAndValidity();
    this.form.get('addressInfo').reset();
    this.form.get('addressInfo').enable();
  }

  getPatientAddressfromWhoisVisitingPage() {
    this.dataService.getPersonalData().pipe(takeUntil(this.destroy$)).subscribe((personalData: PersonalData) => {
      this.personalData = personalData;
      if (personalData && personalData.patientAddressInfo) {
        this.addressFields = { ...personalData.patientAddressInfo };
      }
    });
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  updateFormState() {
    this.form.statusChanges.pipe(debounceTime(200),
      distinctUntilChanged()).subscribe(status => {
        this.cd.markForCheck();
      });
  }

  verifyInsuranceNew(secondaryIns: SecondaryInsurance) {
    if (typeof this.form.get('provider').value === 'string' || (!this.form.get('provider')?.value?.insuranceMnemonic)) {
      this.updateProviderIfCustom();
      this.setInsdataInservice(true);
      this.SpinnerLoading = false;
      if (this.secondaryInsuranceService.modifyAppointmentInfo) {
        this.SpinnerLoading = true;
        this.modifyAppointment();
      } else {
        this.navigateToNext();
      }
    } else {
      this.insuranceValidationService.verifySecondaryInsuranceV2(secondaryIns)
        .subscribe((res: InsuranceVerificationResponseVersion2) => {
          try {
            this.SpinnerLoading = false;
            this.checkAndValidate();
            if (this.secondaryInsuranceService.modifyAppointmentInfo) {
              this.verifyInsuranceModifyFlow(res);
            } else if (res.valid) {
              this.isValidMemberId = true;
              this.setInsdataInservice(null);
              this.saveValidInsuranceToPrs();
              this.navigateToNext();
            } else if (res.errorType && this.memberIdGroupIdErrorCount === 0) {
              this.errorMessageType = res.errorType;
              if (res.errorType === this.insError.memberIdError) {
                this.validPatterns = [...res?.memberIDvalidPatterns];
              } else if (res.errorType === this.insError.groupIdError) {
                this.validPatterns = [...res?.groupIdvalidPattern];
              }
              if (!res.memberIDValid || !res.gropuIdValid) {
                this.memberIdGroupIdErrorCount += 1;
              }
            } else if (res.errorType && this.memberIdGroupIdErrorCount > 0) {
              this.setInsdataInservice(null);
              this.navigateToNext();
            } else if ((this.invalidId && this.clickCount > 0) || this.letUserGo) {
              this.setInsdataInservice(null);
              this.navigateToNext();
            } else if (!this.letUserGo) {
              this.invalidId = true;
              this.clickCount++;
              window.scroll(0, 0);
            }
            this.insuranceInfo_Cache = { ...this.insuranceInfo };
          } catch (error) {
            this.SpinnerLoading = false;
          }
          this.cd.markForCheck();
        }, (error) => {
          this.SpinnerLoading = false;
        });
    }
  }

  updateProviderIfCustom() {
    const provider = this.form.value.provider;
    if (typeof provider === 'string') {
      this.form.get('provider').patchValue({
        insuranceCompanyName: this.form.value.provider,
        insuranceMnemonic: null
      });
    }
  }

  checkAndValidate() {
    this.errorMessageType = null;
    this.validPatterns = [];
    if (this.insuranceInfo_Cache && this.insuranceInfo) {
      const modifiedMemberId = (this.insuranceInfo_Cache?.insuranceMemberId
        !== this.insuranceInfo?.insuranceMemberId) ? true : false;
      const modifiedGroupId = (this.insuranceInfo_Cache?.insuranceGroupId
        !== this.insuranceInfo?.insuranceGroupId) ? true : false;
      if (modifiedMemberId || modifiedGroupId) {
        this.memberIdGroupIdErrorCount = 0;
      }
    }
  }

  resetError() {
    this.errorMessageType = null;
  }

  verifyInsuranceModifyFlow(res: InsuranceVerificationResponseVersion2) {
    if (res.valid) {
      this.isValidMemberId = true;
      this.SpinnerLoading = true;
      this.setInsdataInservice(null);
      this.modifyAppointment();
      this.saveValidInsuranceToPrs();
    } else if (res.errorType && this.memberIdGroupIdErrorCount === 0) {
      this.errorMessageType = res.errorType;
      if (res.errorType === this.insError.memberIdError) {
        this.validPatterns = [...res?.memberIDvalidPatterns];
      } else if (res.errorType === this.insError.groupIdError) {
        this.validPatterns = [...res?.groupIdvalidPattern];
      }
      if (!res.memberIDValid || !res.gropuIdValid) {
        this.memberIdGroupIdErrorCount += 1;
      }
    } else if (res.errorType && this.memberIdGroupIdErrorCount > 0) {
      this.SpinnerLoading = true;
      this.modifyAppointment();
    } else if (!res.valid && this.clickCount === 0) {
      this.invalidId = true;
      this.clickCount++;
      window.scroll(0, 0);
    } else {
      this.SpinnerLoading = true;
      this.modifyAppointment();
    }
  }

  saveValidInsuranceToPrs() {
    this.authInsuranceService.secondaryInsurance = {
      insurance: this.form.getRawValue(),
      address: this.addressFields
    };
    this.authInsuranceService.saveValidSecondaryInsuranceToPrs();
  }

  get addMargin() {
    return this.errorMessageType?.length > 0;
  }

}
