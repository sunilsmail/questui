import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { combineLatest, BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import {
  InsuranceError,
  InsuranceProvider, InsuranceVerificationResponse,
  InsuranceVerificationResponseVersion2,
  PatientAddressInfo,
  Pattern,
  SecondaryInsurance,
  SecondaryInsuranceData
} from 'shared/models';
import { ModifyAppointment, ModifyAppointmentResponse, SecondaryInsuranceSaveEncounter } from 'shared/models/create-appointment-data';
import { EorderPersonalInformation } from 'shared/models/eorder';
import { AppointmentService } from 'shared/services/appointment.service';
import { AuthInsuranceService } from 'shared/services/auth-ins/auth-insurance.service';
import { DataService } from 'shared/services/data.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { InsuranceValidationService } from 'shared/services/insurance-validation.service';
import { InsuranceService } from 'shared/services/insurance.service';
import { PropertiesService } from 'shared/services/properties.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { UserService } from 'shared/services/user.service';
import { getValueByKeys } from 'shared/utils/util';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-eorder-secondary-insurance-new',
  templateUrl: './as-eorder-secondary-insurance-new.component.html',
  styleUrls: ['./as-eorder-secondary-insurance-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsEorderSecondaryInsuranceNewComponent implements OnInit, OnDestroy {
  content = homeContent;
  form: FormGroup;
  providerOptions: InsuranceProvider[] = [];
  insuranceProviders: Array<InsuranceProvider> = [];
  destroy$ = new Subject<any>();
  spinnerLoading$ = new BehaviorSubject<boolean>(false);
  error = false;
  noMatchesError = false;
  bringCardError = false;
  invalidId: boolean;
  letUserGo = false;
  userName: string;
  initValue = 'true';
  userName$: Observable<string>;
  subscription: Subscription = new Subscription();
  disableContinueButton = false;
  clickCount = 0;
  previousUrl = '/eorder/as-eorder-insurance-information';
  gtrSelected = false;
  childComponentSuccess$ = new Subject<any>();
  secondaryInsData: SecondaryInsuranceData = new SecondaryInsuranceData();
  labCardMnemonic = 'LBCRD';
  resetSecInsurance = false;
  modifyAppointmentInfo: ModifyAppointment;
  easypayFixesf2100 = false;
  errorMessageType = null;
  memberIdGroupIdErrorCount = 0;
  insuranceObj_Cache: SecondaryInsurance;
  insError = InsuranceError;
  validPatterns: Pattern[] = [];
  addressComponentSuccess$ = new Subject<any>();
  addressFields: PatientAddressInfo;
  personalData: EorderPersonalInformation;
  demographicObj: EorderPersonalInformation;
  f4191 = null;
  detectChange: any;
  isValidMemberId = false;
  constructor(
    private fb: FormBuilder,
    private insuranceService: InsuranceService,
    private router: Router,
    private dataService: DataService,
    private location: Location,
    private appointmentService: AppointmentService,
    private secondaryInsuranceService: SecondaryInsuranceService,
    private eorderDataService: EorderDataService,
    private eorderService: EorderService,
    private insuranceValidationService: InsuranceValidationService,
    private propertiesService: PropertiesService,
    private cd: ChangeDetectorRef,
    private userService: UserService,
    private authInsuranceService: AuthInsuranceService,
    private route: ActivatedRoute
  ) {
    this.childComponentSuccess$.next(false);
    this.addressComponentSuccess$.next(false);
    this.propertiesService.getEasypayFixesf2100().subscribe((f2100: boolean) => {
      this.easypayFixesf2100 = f2100;
    });
  }

  ngOnInit() {
    if (this.route.snapshot && this.route.snapshot.data) {
      this.f4191 = this.route.snapshot.data.f4191;
    }
    this.insuranceProviders = this.insuranceService.insuranceProviderList;
    this.userName$ = this.eorderDataService.getPersonalInformation().pipe(map((data: EorderPersonalInformation) => {
      this.demographicObj = data;
      return data.firstName;
    }));
    this.buildForm();
    this.bindForm();
    // this.getSecInsDataFromEncounter();
    this.getSecIns();
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
      sameas: [''],
    });
    this.providerSearchInit();
    this.checkError();
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
    this.checkInsuranceIfnotSelectedFromList();
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
      this.secondaryInsData &&
      this.secondaryInsData.provider
    ) {
      inputValue = this.secondaryInsData.provider.insuranceCompanyName;
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
    this.checkInsuranceIfnotSelectedFromList();
    this.spinnerLoading$.next(true);
    const secondaryIns: SecondaryInsurance = {
      insuranceMnemonic: this.form.value.provider.insuranceMnemonic,
      insuranceMemberId: this.form.value.memberId,
      insuranceGroupId: this.form.value.groupId ? this.form.value.groupId : null,
    };
    if (this.easypayFixesf2100) {
      this.verifyInsuranceNew(secondaryIns);
    } else {
      this.eorderService.mockPriceCall = true;
      this.verifyInsuranceOld(secondaryIns);
    }
  }

  verifyInsuranceNew(secondaryIns: SecondaryInsurance) {
    if (typeof this.form.get('provider').value === 'string' ||
      (!this.form.get('provider')?.value?.insuranceMnemonic)) {
      const provider = this.form.value.provider;
      if (typeof provider === 'string') {
        this.form.get('provider').patchValue({
          insuranceCompanyName: this.form.value.provider,
          insuranceMnemonic: null
        });
      }
      this.spinnerLoading$.next(false);
      this.secondaryInsuranceService.setInsuranceData({ ...this.form.getRawValue(),
        bringCarderror: true, isValidMemberId: false });
      if (this.eorderDataService.isEditFromEorderSummary) {
        this.spinnerLoading$.next(true);
        this.modifyAppointment();
      } else {
        this.navigateToNext();
        this.saveEncounter();
      }
    } else {
      this.insuranceValidationService.verifySecondaryInsuranceV2(secondaryIns)
        .subscribe((res: InsuranceVerificationResponseVersion2) => {
          try {
            this.spinnerLoading$.next(false);
            this.checkAndValidate(secondaryIns);
            if (this.secondaryInsuranceService.modifyAppointmentInfo) {
              this.verifyInsuranceModifyFlow(res);
            }
            else if (res.valid) {
              this.isValidMemberId = true;
              this.saveValidInsuranceToPrs();
              this.secondaryInsuranceService.setInsuranceData({ ...this.form.getRawValue(),
                bringCarderror: null, isValidMemberId: true });
              this.saveEncounter();
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
              this.secondaryInsuranceService.setInsuranceData({ ...this.form.getRawValue(),
                bringCarderror: null, isValidMemberId: false  });
              this.saveEncounter();
              this.navigateToNext();
            } else if ((this.invalidId && this.clickCount > 0) || this.letUserGo) {
              this.secondaryInsuranceService.setInsuranceData({ ...this.form.getRawValue(),
                 bringCarderror: null, isValidMemberId: false  });
              this.saveEncounter();
              this.navigateToNext();
            } else if (!this.letUserGo) {
              this.invalidId = true;
              this.clickCount++;
              window.scroll(0, 0);
            }
            this.insuranceObj_Cache = { ...secondaryIns };
          }
          catch (error) {
            this.spinnerLoading$.next(false);
          }
        }, (error) => {
          this.spinnerLoading$.next(false);
          alert(error);
        });
    }
  }

  verifyInsuranceOld(secondaryIns: SecondaryInsurance) {
    this.eorderService.verifySecondaryInsurance(secondaryIns).
      subscribe((res: InsuranceVerificationResponse) => {
        this.spinnerLoading$.next(false);
        if (this.secondaryInsuranceService.modifyAppointmentInfo) {
          if (!res.valid && this.clickCount === 0) {
            this.invalidId = true;
            this.clickCount++;
            window.scroll(0, 0);
          } else {
            this.spinnerLoading$.next(true);
            this.setInsdataInservice(null);
            this.modifyAppointment();
          }
        }
        else if (res.valid) {
          this.secondaryInsuranceService.setInsuranceData({ ...this.form.getRawValue(), bringCarderror: null });
          this.saveEncounter();
          this.navigateToNext();
        } else if (!res.valid && this.bringCardError) {
          const provider = this.form.value.provider;
          if (typeof provider === 'string') {
            this.form.get('provider').patchValue({
              insuranceCompanyName: this.form.value.provider,
              insuranceMnemonic: null
            });
          }
          this.secondaryInsuranceService.setInsuranceData({ ...this.form.getRawValue(), bringCarderror: true });
          this.saveEncounter();
          this.navigateToNext();
        } else if ((this.invalidId && this.clickCount > 0) || this.letUserGo) {
          this.secondaryInsuranceService.setInsuranceData({ ...this.form.getRawValue(), bringCarderror: null });
          this.saveEncounter();
          this.navigateToNext();
        } else if (!this.letUserGo) {
          this.invalidId = true;
          this.clickCount++;
          window.scroll(0, 0);
        }
      }, (error) => {
        this.spinnerLoading$.next(false);
        alert(error);
      });
  }

  navigateToNext() {
    this.router.navigate(['/eorder/as-eorder-review-details']);
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
      // this.cd.markForCheck();
      // this.childComponentSuccess$.next(true);
    } else {
      this.gtrSelected = false;
      this.form.removeControl('addressInfo');
      this.form.removeControl('userInfo');
      this.form.get('sameas').patchValue(false);
      // this.cd.markForCheck();
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
      const noInsurance = {
        secondaryInsurance: {
          secondaryInsOptOut: true,
        }
      };
      this.eorderService.saveEncounter(noInsurance).subscribe();
      this.navigateToNext();
    }
  }

  goToPrevious() {
    this.location.back();
  }

  addChildForm(name: string, group: FormGroup) {
    this.form.addControl(name, group);
    this.childComponentSuccess$.next(true);
  }

  bindForm() {
    this.secondaryInsuranceService.getInsuranceData().subscribe((formData: SecondaryInsuranceData) => {
      this.secondaryInsData = formData;
      const insData: SecondaryInsuranceData = JSON.parse(JSON.stringify(formData));
      if (insData && insData && insData.isPrimaryInsuranceHolder && insData.isPrimaryInsuranceHolder === 'false') {
        if (!insData.hasOwnProperty('sameas')) {
          insData.sameas = false;
        }
        this.handleChange(insData.isPrimaryInsuranceHolder);
        this.bindFields(insData);
        combineLatest([this.childComponentSuccess$, this.addressComponentSuccess$])
          .subscribe(() => {
            try {
              this.bindFields(insData);
            }
            catch (err) {
              console.log(err, insData);
            }
          });
      } else if (insData && insData && insData.isPrimaryInsuranceHolder && insData.isPrimaryInsuranceHolder === 'true') {
        this.handleChange(insData.isPrimaryInsuranceHolder);
        try {
          delete insData.bringCarderror;
          this.form.patchValue(insData, { emitEvent: false });
        } catch (err) {
          console.log(err, insData);
        }
        this.checkError();
      }
      this.updateFormState();
    });
  }

  bindFields(insData: SecondaryInsuranceData) {
    if (insData && insData.hasOwnProperty('addressInfo') && insData.hasOwnProperty('userInfo')) {
      delete insData.bringCarderror;
      this.form.patchValue(insData, { emitEvent: false });
      this.checkError();
    }
  }

  saveEncounter() {
    const saveEncounterObj: SecondaryInsuranceSaveEncounter = new SecondaryInsuranceSaveEncounter();
    saveEncounterObj.secondaryInsOptOut = false;
    saveEncounterObj.secondaryInsurance = this.secondaryInsuranceService.formatSecondaryInsuranceToApiRequest(this.secondaryInsData, true);
    console.log(JSON.stringify(saveEncounterObj));
    this.eorderService.saveEncounter(saveEncounterObj).subscribe();
  }

  getSecInsDataFromEncounter() {
    this.spinnerLoading$.next(true);
    this.eorderService
      .getEncounterInfoWithoutCahce('secondaryInsurance')
      .pipe(takeUntil(this.destroy$))
      .subscribe((secInsuranceData: any) => {
        this.spinnerLoading$.next(false);
        if (secInsuranceData && secInsuranceData.secondaryInsurance) {
          const insData = this.secondaryInsuranceService.
            formatSecondaryInsuranceForControls(secInsuranceData.secondaryInsurance, true);
          this.secondaryInsuranceService.setInsuranceData(insData);
        }
      });
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
      this.secondaryInsuranceService.setInsuranceData({ ...this.form.getRawValue(), bringCarderror: bringCarderror });
    }
  }

  modifyAppointment() {
    this.modifyAppointmentInfo = this.secondaryInsuranceService.modifyAppointmentInfo;
    this.prepareSecondaryInsObject();
    this.appointmentService
      .modifyAppointment(this.modifyAppointmentInfo)
      .subscribe((res: ModifyAppointmentResponse) => {
        this.spinnerLoading$.next(false);
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
          this.router.navigate(['/eorder/as-eorder-price-estimate']);
          this.resetSecInsurance = false;
        } else {
          // show error
        }
      }, () => {
        this.spinnerLoading$.next(false);
      });
  }

  prepareSecondaryInsObject() {
    if (this.modifyAppointmentInfo && this.modifyAppointmentInfo.preregistration && !this.resetSecInsurance) {
      this.modifyAppointmentInfo.preregistration.secondaryInsOptOut = false;
      this.modifyAppointmentInfo.preregistration.secondaryInsurance =
        this.secondaryInsuranceService.formatSecondaryInsuranceToApiRequest(
          {...this.form.getRawValue(),isValidMemberId: this.isValidMemberId }, true);
    } else if (this.modifyAppointmentInfo && this.modifyAppointmentInfo.preregistration && this.resetSecInsurance) {
      this.modifyAppointmentInfo.preregistration.secondaryInsOptOut = true;
      this.modifyAppointmentInfo.preregistration.secondaryInsurance = null;
    }
  }

  resetGtrFields() {
    this.form.get('sameas').patchValue(false);
    const gtrFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone', 'relationship'];
    gtrFields.forEach((controlName) => {
      this.form.get(controlName).reset();
    });
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

  resetError() {
    this.errorMessageType = null;
  }


  checkAndValidate(secondaryIns: SecondaryInsurance) {
    this.errorMessageType = null;
    this.validPatterns = [];
    if (this.insuranceObj_Cache && secondaryIns) {
      const modifiedMemberId = (this.insuranceObj_Cache?.insuranceMemberId
        !== secondaryIns?.insuranceMemberId) ? true : false;
      const modifiedGroupId = (this.insuranceObj_Cache?.insuranceGroupId
        !== secondaryIns?.insuranceGroupId) ? true : false;
      if (modifiedMemberId || modifiedGroupId) {
        this.memberIdGroupIdErrorCount = 0;
      }
    }
  }

  verifyInsuranceModifyFlow(res: InsuranceVerificationResponseVersion2) {
    if (res.valid) {
      this.eorderService.mockPriceCall = true;
      this.spinnerLoading$.next(true);
      this.modifyAppointment();
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
      this.spinnerLoading$.next(true);
      this.modifyAppointment();
    } else if (!res.valid && this.clickCount === 0) {
      this.invalidId = true;
      this.clickCount++;
      window.scroll(0, 0);
    } else {
      this.spinnerLoading$.next(true);
      this.modifyAppointment();
    }
  }

  addChildAddressForm(name: string, group: FormGroup) {
    this.form.addControl(name, group);
    this.addressComponentSuccess$.next(true);
    this.bindAddress(this.form.get('sameas').value);
    this.form.updateValueAndValidity();
  }

  bindAddress(value = true) {
    if (value) {
      if (getValueByKeys(this.secondaryInsData, ['userInfo', 'firstName'])) {
        this.addressFields = {
          address1: getValueByKeys(this.secondaryInsData, ['addressInfo', 'address1']),
          address2: getValueByKeys(this.secondaryInsData, ['addressInfo', 'address2']),
          city: getValueByKeys(this.secondaryInsData, ['addressInfo', 'city']),
          state: getValueByKeys(this.secondaryInsData, ['addressInfo', 'state']),
          zipCode: getValueByKeys(this.secondaryInsData, ['addressInfo', 'zipCode'])
        };
        value = !this.form.get('sameas').value;
      } else if (this.demographicObj) {
        const demographic = { ...this.demographicObj };
        this.addressFields = {
          address1: demographic.address,
          address2: demographic.address2,
          city: demographic.city,
          state: demographic.state,
          zipCode: demographic.zip
        };
        value = true;
      }
    } else {
      if (this.demographicObj) {
        const demographic = { ...this.demographicObj };
        this.addressFields = {
          address1: demographic.address,
          address2: demographic.address2,
          city: demographic.city,
          state: demographic.state,
          zipCode: demographic.zip
        };
        value = true;
      }
    }

    if (this.addressFields) {
      this.form.get('addressInfo').reset();
      this.form.get('addressInfo').updateValueAndValidity();
      this.form.get('addressInfo').get('address1').patchValue(this.addressFields.address1);
      this.form.get('addressInfo').get('address2').patchValue(this.addressFields.address2);
      this.form.get('addressInfo').get('city').patchValue(this.addressFields.city);
      this.form.get('addressInfo').get('state').patchValue(this.addressFields.state);
      this.form.get('addressInfo').get('zipCode').patchValue(this.addressFields.zipCode);
    }

    if (value) {
      this.form.get('addressInfo').disable();
    }
  }

  resetAddress() {
    this.form.get('addressInfo').updateValueAndValidity();
    this.form.get('addressInfo').reset();
    this.form.get('addressInfo').enable();
  }

  updateFormState() {
    this.form.statusChanges.pipe(debounceTime(200),
      distinctUntilChanged()).subscribe(status => {
        this.cd.markForCheck();
      });
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

  get isFromValid() {
    return this.form.valid && !this.disableContinueButton;
  }

  getSecIns() {
    this.userService.isAuthenticated$.pipe(
      tap((isAuth) => {
        if (isAuth) {
          this.prsGetSecInsData();
        } else {
          this.getSecInsDataFromEncounter();
        }
      })
    ).subscribe();
  }

  prsGetSecInsData() {
    this.spinnerLoading$.next(true);
    this.eorderService.getEncounterInfoWithoutCahce('secondaryInsurance').subscribe((secInsuranceData) => {
      this.authInsuranceService.geteorderPrsSecInsurance().subscribe((prsIns) => {
        this.spinnerLoading$.next(false);
        if (!secInsuranceData?.insurance?.insMnemonic) {
          if (prsIns && prsIns.secondaryInsurance) {
            const insData = this.secondaryInsuranceService.
              formatSecondaryInsuranceForControls(prsIns.secondaryInsurance, true);
            this.secondaryInsuranceService.setInsuranceData(insData);
          }
        } else {
          if (secInsuranceData && secInsuranceData.secondaryInsurance) {
            const insData = this.secondaryInsuranceService.
              formatSecondaryInsuranceForControls(secInsuranceData.secondaryInsurance, true);
            this.secondaryInsuranceService.setInsuranceData(insData);
          }
        }
      }, () => this.spinnerLoading$.next(false));
    }, () => this.spinnerLoading$.next(false));
  }


  saveValidInsuranceToPrs() {
    this.authInsuranceService.secondaryInsurance = {
      insurance: this.form.getRawValue(),
      address: this.addressFields
    };
    this.authInsuranceService.saveValidSecondaryInsuranceToPrs();
  }

}
