import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { combineLatest, ReplaySubject, Subject, Subscription } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  AddressInfo,
  CustomFormControls, InsuranceError, InsuranceVerificationResponseVersion2, Pattern, UserDemographic
} from 'shared/models';
import { ModifyAppointment, ModifyAppointmentResponse } from 'shared/models/create-appointment-data';
import {
  EorderAppointment,
  EorderAppointmentData,
  EorderInsuranceInformation,
  EorderModifyAppointmentData,
  EorderPersonalInformation,
  InsuranceProvider,
  InsuranceVerificationRequest,
  InsuranceVerificationResponse
} from 'shared/models/eorder';
import { AppointmentService } from 'shared/services/appointment.service';
import { AuthInsuranceService } from 'shared/services/auth-ins/auth-insurance.service';
import { DateService } from 'shared/services/date.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { InsuranceEorderAddressService } from 'shared/services/insurance-eorder-address.service';
import { InsuranceValidationService } from 'shared/services/insurance-validation.service';
import { InsuranceService } from 'shared/services/insurance.service';
import { PropertiesService } from 'shared/services/properties.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { UserService } from 'shared/services/user.service';
import { getValueByKeys } from 'shared/utils/util';
import { regex } from 'shared/utils/validation/regex-patterns';
import { CustomValidators } from 'shared/utils/validation/validators';
import { default as homeContent } from '../../../../../assets/content.json';
@Component({
  selector: 'as-eorder-insurance-information-new',
  templateUrl: './as-eorder-insurance-information-new.component.html',
  styleUrls: ['./as-eorder-insurance-information-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsEorderInsuranceInformationNewComponent implements OnInit, OnDestroy {
  @Input() step: Number;
  content = homeContent;
  appointmentData: EorderAppointment;
  formatedDate: string;
  @ViewChild('as_AddressSearchTxt') searchInput: ElementRef<any>;
  @ViewChild('as_AddressSearchTxtDiff') searchDiffAddressInput: ElementRef<any>;
  form: FormGroup;
  providerOptions: InsuranceProvider[] = [];
  insuranceProviders: Array<InsuranceProvider> = [];
  destroy$ = new Subject<any>();
  states = this.i18nConstants.states;
  SpinnerLoading = false;
  stateResult = this.states;
  stateResultDiffAddress = this.states;
  controlSub: Subscription;
  addressLoading = false;
  diffAddressLoading = false;
  options: google.maps.places.AutocompletePrediction[];
  optionsDiffAddress: google.maps.places.AutocompletePrediction[];
  delayTime: number;
  cityFromAPI: string;
  stateFromAPI: string;
  blnInsuranceHolder: boolean;
  minDate = new Date();
  maxDate = new Date();
  userdata: UserDemographic = new UserDemographic();
  relationList: any = [{ value: 'Spouse', label: 'Spouse' }, { value: 'Dependent', label: 'Dependent' }];
  demographicsAddressFormControls: CustomFormControls[] = []; // demographics address fields
  personalData: any;
  error = false;
  noMatchesError = false;
  bringCardError = false;
  invalidId: boolean;
  clickCount = 0;
  letUserGo = false;
  initValue = 'true';
  imageSrc: SafeResourceUrl;
  showLabCardAlert: boolean;
  markFieldReadOnly: boolean;
  appState: any;
  previousUrl: string;
  insuranceData: EorderInsuranceInformation;
  insuranceInfo: any;
  demographicObj: EorderPersonalInformation;
  paramObject: any = { guarantor: null, insuranceQR: null, preRegDemographics: null };
  disableContinueButton = false;
  labCardValue: string;
  insuranceObj: InsuranceVerificationRequest;
  isAlternateFlow: boolean;
  labCardMnemonic = 'LBCRD';
  facilityServiceId: any[];
  firstName: string;
  modifyAppointmentInfo: ModifyAppointment;
  phone: string;
  confirmationCode: string;
  isSecondaryNotSelected = true;
  addressFields: AddressInfo;
  childComponentSuccess$ = new ReplaySubject<boolean>(1);
  easypayFixesf2100 = false;
  errorMessageType = null;
  memberIdGroupIdErrorCount = 0;
  insuranceObj_Cache: InsuranceVerificationRequest;
  insError = InsuranceError;
  validPatterns: Pattern[] = [];
  cancelBind = false;
  f4191 = null;
  detectChange: any;
  isValidMemberId = false;
  constructor(
    private dateService: DateService,
    private router: Router,
    private i18nConstants: I18nConstantsService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private location: Location,
    private googleMapService: GoogleMapsService,
    private eorderDataService: EorderDataService,
    private eorderService: EorderService,
    private insuranceService: InsuranceService,
    private appointmentService: AppointmentService,
    private insuranceEorderAddressService: InsuranceEorderAddressService,
    private propertiesService: PropertiesService,
    private secondaryInsuranceService: SecondaryInsuranceService,
    private insuranceValidationService: InsuranceValidationService,
    private cd: ChangeDetectorRef,
    private authInsuranceService: AuthInsuranceService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/ds-images/ds-icon-error-24.svg`);
    this.propertiesService.getEasypayFixesf2100().subscribe((f2100: boolean) => {
      this.easypayFixesf2100 = f2100;
    });

  }

  ngOnInit() {
    if (this.route.snapshot && this.route.snapshot.data) {
      this.f4191 = this.route.snapshot.data.f4191;
    }
    this.buildForm();
    this.getAlternateFlowStatus();
    this.getDemographicsInfo();
    this.getProviderList();
    const currentYear = this.minDate.getFullYear();
    this.minDate.setFullYear(currentYear - 120);
    // this.maxDate.setFullYear(currentYear - 13);
    this.enableDisableValidation();
    this.clearValidations(this.demographicsAddressFormControls);
    this.previousUrl = '/eorder/as-eorder-appt-scheduler';
    // todo remove below method after save functionality is completed
    this.getSecondaryInsurance();
    if (this.eorderDataService.isEditFromEorderSummary) {
      this.getInsuranceForedit();
    }
    this.getIns();
  }

  getSecondaryInsurance() {
    this.insuranceEorderAddressService.getSecondaryInsuranceSelection().subscribe((secondaryInsurance) => {
      this.form.get('secondaryInsurance').patchValue(secondaryInsurance);
    });
  }

  getProviderList() {
    this.eorderDataService
      .getappointmentData()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((appointmentData: EorderAppointmentData) => {
          this.appointmentData = appointmentData ? appointmentData.data : null;
          if (this.appointmentData && this.appointmentData.siteCode) {
            return this.eorderService.getInsuranceProvider(this.appointmentData.siteCode);
          } else {
            return [];
          }
        })
      )
      .subscribe((res: InsuranceProvider[]) => {
        // not calling encounter in edit scenario's
        if (!this.eorderDataService.isEditFromEorderSummary) {
          this.getInsuranceInfo();
        }
        this.insuranceProviders = res;
        this.insuranceService.insuranceProviderList = this.insuranceProviders.sort(this.sortPayors());
      });
  }

  getAlternateFlowStatus() {
    this.eorderDataService.getAlternateFlow().subscribe(res => {
      this.isAlternateFlow = res;
    });
  }

  getIns() {
    combineLatest([this.userService.isAuthenticated$, this.authInsuranceService.getOpenEorder()]).pipe(
      tap(([isAuth, isOpenEorder]) => {
        if (isAuth && isOpenEorder) {
          this.prsInsuranceFetch();
        } else {
          this.getInsuranceInfo();
        }
      })
    ).subscribe();
  }

  prsInsuranceFetch() {
    this.SpinnerLoading = true;
    this.authInsuranceService.geteorderPrsPrimaryInsurance().pipe(takeUntil(this.destroy$)).subscribe((prsIns) => {
      this.eorderService.getEncounterInfoWithoutCahce('insurance').pipe(takeUntil(this.destroy$)).subscribe((encounterIns) => {
        if (!encounterIns?.insurance?.insMnemonic) {
          this.SpinnerLoading = false;
          this.cancelBind = true;
          this.bindData(prsIns);
        } else {
          this.bindData(encounterIns);
        }
      });
    });
  }

  getInsuranceInfo() {
    this.SpinnerLoading = true;
    this.eorderService
      .getEncounterInfoWithoutCahce('insurance')
      .pipe(takeUntil(this.destroy$))
      .subscribe((insuranceData: any) => {
        try {
          this.SpinnerLoading = false;
          if (!this.cancelBind) {
            this.bindData(insuranceData);
          }
        } catch (error) {
          this.SpinnerLoading = false;
        }
      });
  }

  bindData(insuranceData: any) {

    this.insuranceInfo = insuranceData;
    // this.eorderDataService.setInsuranceInformation(insuranceData);
    if (insuranceData && insuranceData.insurance) {
      this.bindSecondaryInsurance(insuranceData.secondaryInsOptOut);
      if (insuranceData.insurance.primary === false && insuranceData.guarantor.firstName != null) {
        this.initValue = 'false';
      } else {
        this.initValue = 'true';
      }
      this.handleChange(this.initValue);
      this.form.get('primary').patchValue(this.initValue);
      if (insuranceData?.insurance?.insMnemonic || insuranceData?.insurance?.insuranceName) {
        this.form.get('provider').patchValue({
          insuranceCompanyName: insuranceData.insurance.insuranceName,
          insuranceMnemonic: insuranceData.insurance.insMnemonic
        });
      } else {
        this.form.get('provider').patchValue(null);
      }
      this.form.get('memberId').patchValue(insuranceData.insurance.insMemberId);
      this.form.get('groupId').patchValue(insuranceData?.insurance?.insuranceGroupId);
      this.clearNoMatchError();
      if (insuranceData.insurance.labCard === true ||
        insuranceData.insurance.insMnemonic === this.labCardMnemonic) {
        this.labCardValue = 'true';
      } else {
        this.labCardValue = 'false';
      }
      this.form.get('labCard').patchValue(this.labCardValue);

      this.providerSearchInit();
      this.checkError();
      this.eorderDataService
        .getlabCardLocationSearch()
        .pipe(takeUntil(this.destroy$))
        .subscribe((labCardData: any) => {
          if (labCardData && labCardData.labCard) {
            this.form.get('labCard').patchValue(labCardData.labCard);
            this.form.get('provider').patchValue(labCardData.provider);
            if (labCardData.labCard === 'false') {
              this.form.get('memberId').patchValue(insuranceData.insurance.insMemberId);
            } else {
              this.form.controls.memberId.reset();
            }
          }
          this.eorderDataService.setInsuranceInformation({
            insuranceData: this.form.getRawValue(),
            bringCarderror: this.bringCardError
          });
        });
      this.eorderDataService.setInsuranceInformation({
        insuranceData: this.form.getRawValue(),
        bringCarderror: this.bringCardError
      });
    }
    this.cd.markForCheck();
    this.SpinnerLoading = false;
  }

  getDemographicsInfo() {
    this.eorderDataService.getPersonalInformation().subscribe(demographic => {
      this.demographicObj = demographic;
      this.firstName = this.demographicObj.firstName;
    });
  }

  goToPrevious() {
    this.eorderDataService.setAppointmentNavigation(true);
    this.eorderDataService.setPreviousUrlDemographic(true);
    this.eorderDataService.setblnEditReasonData(true, this.router.url);
    // this.router.navigate(['/eorder/as-eorder-appt-scheduler']);
    this.location.back();
  }

  displayFn(user: InsuranceProvider) {
    if (user) {
      this.error = false;
      return user.insuranceCompanyName;
    }
  }

  buildForm() {
    this.form = this.fb.group({
      secondaryInsurance: ['false'],
      sameas: [''],
      provider: ['', [Validators.required]],
      memberId: ['', [Validators.required]],
      groupId: [''],
      primary: [this.initValue, [Validators.required]],
      labCard: ['', [Validators.required]],
      firstName: ['', [Validators.maxLength(75), Validators.pattern(regex.firstName), Validators.required]],
      lastName: ['', [Validators.maxLength(75), Validators.pattern(regex.lastName), Validators.required]],
      dateOfBirth: ['', [Validators.required, CustomValidators.dateValidations(this.minDate, this.maxDate)]],
      gender: ['', [Validators.required]],
      relationship: ['', [Validators.required]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(12), Validators.pattern(regex.phoneNumber), Validators.required]]
    });
  }

  sortPayors() {
    return function (a, b) {
      const insNameA = a.insuranceCompanyName;
      const insNameB = b.insuranceCompanyName;
      if (insNameA > insNameB) {
        // sort string ascending
        return -1;
      }
      if (insNameA < insNameB) {
        return 1;
      }
    };
  }

  providerSearchInit() {
    this.form.get('provider').valueChanges.subscribe(inputValues => {
      this.memberIdGroupIdErrorCount = 0;
      this.errorMessageType = null;
      if (inputValues) {
        if (inputValues.length > 0) {
          this.providerOptions = this.insuranceProviders
            .filter((el: InsuranceProvider) => {
              const insName = el.insuranceCompanyName.toLowerCase();
              inputValues = inputValues.toLowerCase();
              if (insName.includes(inputValues)) {
                return true;
              } else {
                return false;
              }
            })
            .sort((a, b) => {
              // sort the filtered items with starts with then ascending order
              const insNameA = a.insuranceCompanyName.toLowerCase();
              const insNameB = b.insuranceCompanyName.toLowerCase();
              if (insNameA.startsWith(inputValues)) {
                return -1;
              }
              if (insNameB.startsWith(inputValues)) {
                return 1;
              }
              if (insNameA < insNameB) {
                // sort string ascending
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
  }

  labCardChange(labCard) {
    let labcardFound;
    if (this.insuranceProviders.length > 0) {
      labcardFound = this.insuranceProviders.filter(
        ins => ins.insuranceMnemonic.toUpperCase() === this.labCardMnemonic
      ).length > 0 ? true : false;
    }
    let labCardInsurance = {
      provider: { ...this.getLabCardInsurance() },
      labCard: 'true'
    };
    this.disableContinueButton = false;
    // if (labCard === 'true' && !this.appointmentData.labCard) {
    // if (labCard === 'true' && !labcardFound) {
    if (labCard === 'true' && (!this.appointmentData.labCard || !labcardFound)) {
      this.showLabCardAlert = true;
      this.eorderDataService.setlabCardLocationSearch(labCardInsurance);
      this.form.controls.provider.patchValue(labCardInsurance.provider);
      // this.form.controls.provider.reset();
      this.disableContinueButton = true;
    } else if (labCard === 'true') {
      labCardInsurance.labCard = 'true';
      this.eorderDataService.setlabCardLocationSearch(labCardInsurance);
      this.markFieldReadOnly = true;
      this.form.controls.provider.patchValue(labCardInsurance.provider);
      this.form.controls.memberId.reset();
    } else if (labCard === 'false') {
      labCardInsurance = {
        provider: {
          insuranceCompanyName: this.insuranceInfo.insurance.insuranceName,
          insuranceMnemonic: this.insuranceInfo.insurance.insMnemonic
        },
        labCard: 'false'
      };
      this.eorderDataService.setlabCardLocationSearch(labCardInsurance);
      this.form.controls.memberId.patchValue(this.insuranceInfo.insurance.insMemberId);
      this.showLabCardAlert = false;
      this.markFieldReadOnly = false;
    }
  }

  showLabCardLocation() {
    const labCardInsurance = {
      provider: { ...this.getLabCardInsurance() },
      labCard: 'true'
    };
    this.eorderDataService.setlabCardLocationSearch(labCardInsurance);
    this.router.navigate(['/eorder/as-eorder-appt-scheduler']);
  }

  checkError() {
    let inputValue = '';
    if (this.form.get('provider').value) {
      this.checkInsuranceIfnotSelectedFromList();
      const provider = this.insuranceProviders.filter((el: InsuranceProvider) => {
        const insName = el.insuranceCompanyName.toLowerCase();
        inputValue =
          typeof this.form.get('provider').value === 'string'
            ? this.form.get('provider').value.toLowerCase()
            : (this.form.get('provider').value.insuranceCompanyName ?
              this.form.get('provider').value.insuranceCompanyName.toLowerCase() : null);
        return insName === inputValue;
      });
      if (this.insuranceProviders.length === 0 && typeof this.form.get('provider').value === 'string') {
        inputValue = this.form.get('provider').value.toLowerCase();
      } else if (
        this.insuranceProviders.length === 0 &&
        this.insuranceData &&
        this.insuranceData.insuranceData.provider
      ) {
        inputValue = this.insuranceData.insuranceData.provider.insuranceCompanyName;
      }
      if (inputValue && inputValue.length > 0 && provider.length === 0) {
        this.noMatchesError = false;
        this.showError('bringCardError');
      } else {
        this.bringCardError = false;
      }
    }
  }

  clearError() {
    if (
      this.form.get('provider').value &&
      this.form.get('provider').value.length > 0 &&
      this.providerOptions.length === 0
    ) {
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
    this.form
      .get('memberId')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.letUserGo = false;
      });
  }

  // continue button override
  continueClicked() {
    this.checkInsuranceIfnotSelectedFromList();
    if (this.form.get('primary').value === 'true') {
      this.resetGtrFields();
    }
    const formValue = this.form.getRawValue();
    this.eorderDataService.setPreviousUrlDemographic(false);
    this.eorderDataService.setInsuranceInformation({ insuranceData: formValue, bringCarderror: true });
    // todo remove below line of code after save functionality
    this.insuranceEorderAddressService.setSecondaryInsuranceSelection(this.form.get('secondaryInsurance').value);
    if (this.form.get('primary').value === 'false') {
      this.paramObject.guarantor = {
        firstName: this.form.get('firstName').value,
        lastName: this.form.get('lastName').value,
        dateOfBirth: this.dateService.toDate(this.form.get('dateOfBirth').value),
        gender: this.form.get('gender').value,
        phone: this.form
          .get('phone')
          .value.replace(/\-+/g, ''),
        relationship: this.form.get('relationship').value
      };
    }
    this.paramObject.insuranceQR = {
      insuranceName:
        this.form.value.provider['insuranceCompanyName'] === undefined
          ? this.form.get('provider').value
          : this.form.value.provider['insuranceCompanyName'],
      insuranceMnemonic: this.form.value.provider.insuranceMnemonic,
      insuranceMemberID: this.form.value.memberId,
      insuranceGroupID: this.form.value.groupId ? this.form.value.groupId : null,
      isPrimary: JSON.parse(this.form.value.primary)
    };
    this.insuranceObj = {
      siteCode: this.appointmentData.siteCode,
      insuranceMnemonic: this.form.value.provider.insuranceMnemonic,
      insuranceMemberId: this.form.value.memberId,
      insuranceGroupId: this.form.value.groupId ? this.form.value.groupId : null,
      patientDOB: this.dateService.toDate(this.demographicObj.dob),
      patientFirstName: this.demographicObj.firstName,
      patientLastName: this.demographicObj.lastName,
      serviceDate: this.appointmentData.appointmentDate
    };
    this.SpinnerLoading = true;
    if (this.form.get('primary').value === 'false') {
      this.updateAddress();
    }

    if (this.easypayFixesf2100) {
      this.verifyInsuranceNew();
    } else {
      this.eorderService.mockPriceCall = true;
      this.verifyInsuranceOld(formValue);
    }
  }

  verifyInsuranceNew() {
    if (typeof this.form.get('provider').value === 'string' ||
      (!this.form.get('provider')?.value?.insuranceMnemonic)) {
        this.isValidMemberId = false;
      this.eorderDataService.setInsuranceInformation(
        { insuranceData: this.form.getRawValue(), bringCarderror: true, isValidMemberId: null});
      this.preparePreregObject();
      this.SpinnerLoading = false;
      this.eorderService.mockPriceCall = false;
      if (this.eorderDataService.isEditFromEorderSummary) {
        this.SpinnerLoading = true;
        this.modifyAppointment();
      } else {
        this.eorderService.saveEncounter(this.paramObject).subscribe();
        this.navigateToNext();
      }
    } else {
      this.insuranceValidationService.verifyInsuranceV2(this.insuranceObj)
        .subscribe((res: InsuranceVerificationResponseVersion2) => {
          try {
            this.isValidMemberId = false;
            this.eorderService.mockPriceCall = false;
            this.SpinnerLoading = false;
            this.checkAndValidate();
            this.updateGroupId(res);
            if (this.eorderDataService.isEditFromEorderSummary) {
              this.verifyInsuranceModifyFlow(res);
            } else if (res.valid) {
              this.isValidMemberId = true;
              this.saveValidInsuranceToPrs();
              this.eorderService.mockPriceCall = true;
              this.eorderDataService.setInsuranceInformation(
              { insuranceData: this.form.getRawValue(), bringCarderror: null, isValidMemberId: true });
              this.preparePreregObject();
              this.eorderService.saveEncounter(this.paramObject).subscribe();
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
              this.eorderDataService.setInsuranceInformation({
                 insuranceData: this.form.getRawValue(), bringCarderror: null, isValidMemberId: false  });
              this.preparePreregObject();
              this.eorderService.saveEncounter(this.paramObject).subscribe();
              this.navigateToNext();
            } else if ((this.invalidId && this.clickCount > 0) || this.letUserGo) {
              this.eorderDataService.setInsuranceInformation({
                insuranceData: this.form.getRawValue(), bringCarderror: null, isValidMemberId: false  });
              this.preparePreregObject();
              this.eorderService.saveEncounter(this.paramObject).subscribe();
              this.navigateToNext();
            } else if (!this.letUserGo) {
              this.invalidId = true;
              this.clickCount++;
              window.scroll(0, 0);
            }
            this.insuranceObj_Cache = { ...this.insuranceObj };
          } catch (error) {
            this.SpinnerLoading = false;
          }
          this.cd.markForCheck();
        }, (error) => {
          this.SpinnerLoading = false;
        });
    }

  }

  checkAndValidate() {
    this.errorMessageType = null;
    this.validPatterns = [];
    if (this.insuranceObj_Cache && this.insuranceObj) {
      const modifiedMemberId = (this.insuranceObj_Cache?.insuranceMemberId
        !== this.insuranceObj?.insuranceMemberId) ? true : false;
      const modifiedGroupId = (this.insuranceObj_Cache?.insuranceGroupId
        !== this.insuranceObj?.insuranceGroupId) ? true : false;
      if (modifiedMemberId || modifiedGroupId) {
        this.memberIdGroupIdErrorCount = 0;
      }
    }
  }

  resetError() {
    this.errorMessageType = null;
  }

  verifyInsuranceOld(formValue: any) {
    this.eorderService.verifyInsurance(this.insuranceObj).subscribe(
      (res: InsuranceVerificationResponse) => {
        this.SpinnerLoading = false;
        if (this.eorderDataService.isEditFromEorderSummary) {
          if (!res.valid && this.clickCount === 0) {
            this.invalidId = true;
            this.clickCount++;
            window.scroll(0, 0);
          } else {
            this.SpinnerLoading = true;
            this.modifyAppointment();
          }
        } else if (res.valid) {
          this.eorderDataService.setInsuranceInformation({ insuranceData: formValue, bringCarderror: null });
          this.preparePreregObject();
          this.eorderService.saveEncounter(this.paramObject).subscribe();
          // this.router.navigate(['/eorder/as-eorder-review-details']);
          this.navigateToNext();
        } else if (!res.valid && this.bringCardError) {
          this.eorderDataService.setInsuranceInformation({ insuranceData: formValue, bringCarderror: true });
          this.preparePreregObject();
          this.eorderService.saveEncounter(this.paramObject).subscribe();
          // this.router.navigate(['/eorder/as-eorder-review-details']);
          this.navigateToNext();
        } else if ((this.invalidId && this.clickCount > 0) || this.letUserGo) {
          this.eorderDataService.setInsuranceInformation({ insuranceData: formValue, bringCarderror: null });
          this.preparePreregObject();
          this.eorderService.saveEncounter(this.paramObject).subscribe();
          // this.router.navigate(['/eorder/as-eorder-review-details']);
          this.navigateToNext();
        } else if (!this.letUserGo) {
          this.invalidId = true;
          this.clickCount++;
          window.scroll(0, 0);
        }
        this.cd.markForCheck();
      },
      error => {
        this.SpinnerLoading = false;
      }
    );
  }

  preparePreregObject() {
    this.paramObject = {
      ...this.paramObject,
      secondaryInsOptOut: this.isSecondaryNotSelected,
      preRegDemographics: this.insuranceEorderAddressService.getSaveEncounterEorderAddressFields({
        insuranceData: this.form.getRawValue(),
        bringCarderror: null
      },
        this.demographicObj, true)
    };
  }

  updateAddress() {
    this.paramObject.guarantor = {
      ...this.paramObject.guarantor,
      address: this.form.get('addressInfo').get('address1').value,
      address2: this.form.get('addressInfo').get('address2').value,
      city: this.form.get('addressInfo').get('city').value,
      state: this.form.get('addressInfo').get('state').value,
      zip: this.form.get('addressInfo').get('zipCode').value
    };
  }

  handleChange(event) {

    /** when someone else radio button chekced then showing demographics section and updating validations */
    if (event === 'false') {
      this.blnInsuranceHolder = true;
      this.updateValidationForFormGroup(this.demographicsAddressFormControls);
      const phone = this.formatPhone(this.insuranceInfo.guarantor.phone);
      this.form
        .get('firstName')
        .patchValue(this.insuranceInfo.guarantor.firstName);
      this.form
        .get('lastName')
        .patchValue(this.insuranceInfo.guarantor.lastName);
      this.form
        .get('dateOfBirth')
        .patchValue(this.dateService.toDateMMDDYYYY(this.insuranceInfo.guarantor.dateOfBirth));
      this.form
        .get('gender')
        .patchValue(this.insuranceInfo.guarantor.gender);
      this.form
        .get('phone')
        .patchValue(phone);
      this.form
        .get('relationship')
        .patchValue(this.insuranceInfo.guarantor.relationship);
      this.form.get('sameas').patchValue(this.isSameAs());
    } else {
      this.clearValidations(this.demographicsAddressFormControls);
      // this.insuranceInfo.guarantor = null;
      this.blnInsuranceHolder = false;
      this.form.removeControl('addressInfo');
      this.form.get('sameas').patchValue(false);
      this.resetGtrFields();
    }
  }
  formatPhone(phone) {
    if (phone && phone.length === 10) {
      return phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
    }
  }

  isSameAs() {
    return (this.insuranceInfo.guarantor.firstName && !this.insuranceInfo.guarantor.primaryInsAddressSame);
  }

  onkeypressdate(event: KeyboardEvent, dateElement: HTMLInputElement) {
    const currentValue = dateElement.value;
    if (
      event.code !== 'Backspace' &&
      (currentValue.match(/^\d{2}$/) !== null || currentValue.match(/^\d{2}\/\/$/) !== null)
    ) {
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
    // checking phone number lengt
    if (currentValue) {
      const phone = currentValue.replace(/\-+/g, '');
      if (phone.length > 10) {
        this.form
          .get('phone')
          .setErrors({ invalidPhoneno: true });
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
  clearValidations(controls: CustomFormControls[]) {
    /** removing validations for form controls and form group controls */
    controls.forEach(control => {
      if (control.name.indexOf('.') > 0) {
        this.form
          .get(control.name.split('.')[0])
          .get(control.name.split('.')[1])
          .setValidators(null);
        this.form
          .get(control.name.split('.')[0])
          .get(control.name.split('.')[1])
          .updateValueAndValidity();
      } else {
        this.form.get(control.name).setValidators(null);
        this.form.get(control.name).updateValueAndValidity();
      }
    });
  }

  updateValidationForFormGroup(controls: CustomFormControls[]) {
    /** adding validations for form controls and form group controls */
    controls.forEach(control => {
      if (control.name.indexOf('.') > 0) {
        this.form
          .get(control.name.split('.')[0])
          .get(control.name.split('.')[1])
          .setValidators(control.validations);
        this.form
          .get(control.name.split('.')[0])
          .get(control.name.split('.')[1])
          .updateValueAndValidity();
      } else {
        this.form.get(control.name).setValidators(control.validations);
        this.form.get(control.name).updateValueAndValidity();
      }
    });
  }


  buildDemographicControls() {
    this.demographicsAddressFormControls = [];
    this.demographicsAddressFormControls.push(
      new CustomFormControls('firstName', [
        Validators.maxLength(75),
        Validators.pattern(regex.firstName),
        Validators.required
      ])
    );
    this.demographicsAddressFormControls.push(
      new CustomFormControls('lastName', [
        Validators.maxLength(75),
        Validators.pattern(regex.lastName),
        Validators.required
      ])
    );
    this.demographicsAddressFormControls.push(
      new CustomFormControls('dateOfBirth', [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required,
        CustomValidators.dateValidations(this.minDate, this.maxDate)
      ])
    );
    this.demographicsAddressFormControls.push(new CustomFormControls('gender', [Validators.required]));
    this.demographicsAddressFormControls.push(
      new CustomFormControls('relationship', [Validators.required])
    );
    this.demographicsAddressFormControls.push(
      new CustomFormControls('phone', [
        Validators.minLength(10),
        Validators.maxLength(12),
        Validators.pattern(regex.phoneNumber),
        Validators.required
      ])
    );
  }

  enableDisableValidation() {
    /** registering control name and validations through custom form controls class */
    this.buildDemographicControls();
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
  }
  clearNoMatchError() {
    this.form.get('provider').valueChanges.subscribe(value => {
      if (value && value.length < 1) {
        this.bringCardError = false;
        this.error = false;
      }
    });
  }

  getLabCardInsurance(): InsuranceProvider {
    const insurance = this.insuranceProviders.filter(
      ins => ins.insuranceMnemonic.toUpperCase() === this.labCardMnemonic
    );
    if (insurance && insurance.length > 0) {
      return insurance[0];
    } else {
      return {
        insuranceCompanyName: 'LAB CARD',
        insuranceMnemonic: this.labCardMnemonic
      };
    }
  }

  getInsuranceForedit() {
    this.eorderDataService.getappointmentDataForEdit().subscribe((response: EorderModifyAppointmentData) => {
      this.insuranceInfo = response.insuranceData;
      this.firstName = response.demographics.demographics.firstName;
      this.confirmationCode = response.confirmationCode;
      this.phone = response.demographics.demographics.phone.replace(/-/g, '');
      this.appointmentData = new EorderAppointment();
      this.appointmentData.siteCode = response.appointmentDetails.siteCode;
      this.appointmentData.appointmentDate = response.appointmentDetails.appointmentDate;
      this.facilityServiceId = response.appointmentDetails.facilityServiceId;
      this.appointmentData.appointmentTime = response.appointmentDetails.appointmentTime;
      this.demographicObj.dob = response.demographics.demographics.dob;
      if (this.insuranceInfo && this.insuranceInfo.insurance) {
        if (this.insuranceInfo.insurance.primary === false && this.insuranceInfo.guarantor.firstName != null) {
          this.initValue = 'false';
        } else {
          this.initValue = 'true';
        }
        this.handleChange(this.initValue);
        this.bindSecondaryInsurance(this.insuranceInfo.secondaryInsOptOut);
        this.form.get('primary').patchValue(this.initValue);
        this.form.get('provider').patchValue({
          insuranceCompanyName: this.insuranceInfo.insurance.insuranceName,
          insuranceMnemonic: this.insuranceInfo.insurance.insMnemonic
        });
        this.form.get('memberId').patchValue(this.insuranceInfo.insurance.insMemberId);
        this.form.get('groupId').patchValue(this.insuranceInfo?.insurance?.insuranceGroupId);
        if (
          this.insuranceInfo.insurance.labCard === true ||
          this.insuranceInfo.insurance.insMnemonic === this.labCardMnemonic
        ) {
          this.labCardValue = 'true';
        } else {
          this.labCardValue = 'false';
        }
        this.form.get('labCard').patchValue(this.labCardValue);
        this.insuranceService.getInsuranceProvider(this.appointmentData.siteCode).subscribe(
          (res: InsuranceProvider[]) => {
            this.insuranceProviders = res;
            if (response && response.pscDetails) {
              this.appointmentData.labCard = response.pscDetails.labCard;
            }
            if (this.insuranceProviders.length > 0 && response.insuranceData.insurance.labCard === true) {
              this.labCardChange('true');
            }
            this.insuranceProviders.sort(this.sortPayors());
            this.providerSearchInit();
            this.checkError();
          });
        this.eorderDataService
          .getlabCardLocationSearch()
          .pipe(takeUntil(this.destroy$))
          .subscribe((labCardData: any) => {
            if (labCardData && labCardData.labCard) {
              this.form.get('labCard').patchValue(labCardData.labCard);
              this.form.get('provider').patchValue(labCardData.provider);
              if (labCardData.labCard === 'false') {
                this.form.get('memberId').patchValue(this.insuranceInfo.insurance.insMemberId);
              } else {
                this.form.controls.memberId.reset();
              }
            }
          });
      }
      this.cd.markForCheck();
    });
  }
  modifyAppointment(payload = null) {
    try {
      this.modifyAppointmentInfo = {
        channel: 'AS Web',
        labCard: this.form.value.labCard,
        authentication: {
          confirmationCode: this.confirmationCode,
          phone: this.phone
        },
        slot: {
          siteCode: this.appointmentData.siteCode,
          facilityServiceId: this.facilityServiceId,
          appointmentDate: this.dateService.toDate(this.appointmentData.appointmentDate),
          appointmentTime: this.appointmentData.appointmentTime
        },
        notificationPreferences: {
          pushNotificationOptIn: null
        },
        preregistration: {
          isValidMemberId: this.isValidMemberId ? 'Y': 'N',
          insuranceMemberId: this.form.value.memberId,
          insuranceGroupNumber: this.form.value.groupId,
          insuranceCompanyName: this.getCompanyName(),
          insuranceMnemonic: this.getMnemonic(),
          insuranceOptOut: false,
          guarantorFirstName: this.form.get('firstName').value,
          guarantorLastName: this.form.get('lastName').value,
          guarantorDateOfBirth: this.dateService.toDate(this.form.get('dateOfBirth').value),
          guarantorGender: this.form.get('gender').value,
          guarantorPhone: this.form
            .get('phone')
            .value?.replace(/\-+/g, ''),
          guarantorRelationship: this.form.get('relationship').value,
          guarantorOptOut: this.form.value.guarantorOptOut,
          primaryInsuranceHolder: this.form.get('primary').value,
          ...this.insuranceEorderAddressService.geteOrderAddressFields({ insuranceData: this.form.getRawValue(), bringCarderror: null }
            , this.demographicObj, true),
        }
      };
    } catch (ex) {
      console.log(ex);
    }

    if (!this.isSecondaryNotSelected) {
      const userAccount = new UserDemographic();
      this.secondaryInsuranceService.modifyAppointmentInfo = this.modifyAppointmentInfo;
      this.SpinnerLoading = false;
      this.eorderService.saveEncounter(this.paramObject).subscribe();
      this.navigateToNext();
    } else {
      this.secondaryInsuranceService.setInsuranceData(null);
      this.modifyAppointmentInfo.preregistration.secondaryInsOptOut = true;
      this.appointmentService
        .modifyAppointment(payload ? payload : this.modifyAppointmentInfo)
        .subscribe((res: ModifyAppointmentResponse) => {
          this.SpinnerLoading = false;
          if (res.confirmationCode) {
            const navigationExtras: NavigationExtras = {
              queryParams: {
                confirmationCode: res.confirmationCode
              }
            };
            this.router.navigate(['/eorder/as-eorder-price-estimate']);
          } else {
            // show error
          }
        }, () => {
          this.SpinnerLoading = false;
        });
    }

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
  provideLater() {
    if (this.eorderDataService.isEditFromEorderSummary) {
      const payload = {
        channel: 'AS Web',
        labCard: this.form.value.labCard,
        authentication: {
          confirmationCode: this.confirmationCode,
          phone: this.phone
        },
        slot: {
          siteCode: this.appointmentData.siteCode,
          facilityServiceId: this.facilityServiceId,
          appointmentDate: this.dateService.toDate(this.appointmentData.appointmentDate),
          appointmentTime: this.appointmentData.appointmentTime
        },
        notificationPreferences: {
          pushNotificationOptIn: null
        },
        preregistration: {
          insuranceMemberId: '',
          insuranceGroupNumber: null,
          insuranceCompanyName: '',
          insuranceMnemonic: '',
          insuranceOptOut: true,
          address: null,
          address2: null,
          city: null,
          state: null,
          zip: null,
          guarantorFirstName: null,
          guarantorLastName: null,
          guarantorDateOfBirth: null,
          guarantorGender: null,
          guarantorAddress: null,
          guarantorAddress2: null,
          guarantorCity: null,
          guarantorState: null,
          guarantorZip: null,
          guarantorPhone: null,
          guarantorRelationship: null,
          guarantorOptOut: null,
          primaryInsuranceHolder: null,
          secondaryInsOptOut: true
        }
      };
      this.resetSecondaryIns();
      this.modifyAppointment(payload);
      this.eorderDataService.setInsuranceInformation(
        { insuranceData: null, bringCarderror: null, isValidMemberId: null  });
      // this.router.navigate(['/eorder/as-eorder-price-estimate']);
    } else {
      this.eorderDataService.setInsuranceInformation(
        { insuranceData: null, bringCarderror: null, isValidMemberId: null  });
      this.secondaryInsuranceService.setInsuranceData(null);
      const noIns = {
        insuranceQR: {
          insuranceName: null,
          insuranceMnemonic: null,
          insuranceMemberID: null,
          insuranceGroupID: null,
          isPrimary: false,
          insuranceOptOut: true,
          secondaryInsOptOut: true
        }
      };
      this.eorderService.saveEncounter(noIns).subscribe();
      this.resetSecondaryIns();
      this.router.navigate(['/eorder/as-eorder-review-details']);
    }
  }

  private resetSecondaryIns() {
    this.isSecondaryNotSelected = true;
    this.secondaryInsuranceService.setInsuranceData(null);
  }

  navigateToNext() {
    if (this.isSecondaryNotSelected) {
      this.router.navigate(['/eorder/as-eorder-review-details']);
    } else {
      this.router.navigate(['/eorder/as-eorder-secondary-insurance']);
    }
  }

  secondaryInsuranceChange(optSecondaryIns: string) {
    if (JSON.parse(optSecondaryIns)) {
      this.isSecondaryNotSelected = false;
    } else {
      this.isSecondaryNotSelected = true;
      this.secondaryInsuranceService.setInsuranceData(null);
    }
  }

  bindSecondaryInsurance(value: boolean) {
    const secIns = (!value).toString();
    this.secondaryInsuranceChange(secIns);
    this.insuranceEorderAddressService.setSecondaryInsuranceSelection(secIns);
  }

  addChildForm(name: string, group: FormGroup) {
    this.form.addControl(name, group);
    this.childComponentSuccess$.next(true);
    this.bindAddress(this.form.get('sameas').value);
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
      if (getValueByKeys(this.insuranceInfo, ['guarantor', 'firstName'])) {
        this.addressFields = {
          address1: getValueByKeys(this.insuranceInfo, ['guarantor', 'address']),
          address2: getValueByKeys(this.insuranceInfo, ['guarantor', 'address2']),
          city: getValueByKeys(this.insuranceInfo, ['guarantor', 'city']),
          state: getValueByKeys(this.insuranceInfo, ['guarantor', 'state']),
          zipCode: getValueByKeys(this.insuranceInfo, ['guarantor', 'zip'])
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

  get isFormValid() {
    // this.cd.markForCheck();
    return this.form.valid && !this.disableContinueButton;
  }

  updateGroupId(res: InsuranceVerificationResponseVersion2) {
    if (res.groupIdRequired) {
      this.eorderService.groupId = this.insuranceObj.insuranceGroupId;
    } else {
      if (this.paramObject && this.paramObject.insuranceQR) {
        this.paramObject.insuranceQR.insuranceGroupID = null;
      }
    }
  }

  verifyInsuranceModifyFlow(res: InsuranceVerificationResponseVersion2) {
    if (res.valid) {
      this.isValidMemberId = true;
      this.eorderService.mockPriceCall = true;
      this.SpinnerLoading = true;
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

  focusOut(event) {
    /** when fousing out from DOB field and checking month and day are prefixed with zero when single digit. */
    const controlValue = event.target.value;
    const arrDOB = controlValue.split('/');
    if (arrDOB.length === 3 && arrDOB[2].length === 4) {
      event.target.value = this.prefixZeroForDate(arrDOB);
    } else {
      if (controlValue.length > 0) {
        this.form.get('dateOfBirth').setErrors({ invalidDateNew: true });
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

  saveValidInsuranceToPrs() {
    this.authInsuranceService.primaryInsurance = {
      insurance: this.form.getRawValue(),
      address: this.addressFields ? this.addressFields : this.demographicObj
    };
    this.authInsuranceService.saveValidPrimaryInsuranceToPrs();
  }

}
