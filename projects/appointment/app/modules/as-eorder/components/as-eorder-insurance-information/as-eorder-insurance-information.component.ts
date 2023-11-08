import { Location } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  CustomFormControls,
  DropdownOption,
  GoogleAutocompletePrediction,
  GoogleAutocompleteResponse,
  GoogleCityStateObject,
  GoogleCityStateZipObject,
  InsuranceError,
  InsuranceVerificationResponseVersion2,
  Pattern,
  UserDemographic
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
import { regex } from 'shared/utils/validation/regex-patterns';
import { CustomValidators } from 'shared/utils/validation/validators';
import { default as homeContent } from '../../../../../assets/content.json';
@Component({
  selector: 'as-eorder-insurance-information',
  templateUrl: './as-eorder-insurance-information.component.html',
  styleUrls: ['./as-eorder-insurance-information.component.scss']
})
export class AsEorderInsuranceInformationComponent implements OnInit, OnDestroy {
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
  diffAddressFormControls: CustomFormControls[] = []; // different address fields
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
  easypayFixesf2100 = false;
  errorMessageType = null;
  memberIdGroupIdErrorCount = 0;
  insuranceObj_Cache: InsuranceVerificationRequest;
  insError = InsuranceError;
  validPatterns: Pattern[] = [];

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
  ) {
    this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/ds-images/ds-icon-error-24.svg`);
    this.propertiesService.getEasypayFixesf2100().subscribe((f2100: boolean) => {
      this.easypayFixesf2100 = f2100;
    });
  }

  ngOnInit() {
    this.buildForm();
    this.getAlternateFlowStatus();
    this.getDemographicsInfo();
    this.getProviderList();
    this.stateSearchDiffAddressInit();
    this.addressAutocompleteInit();
    this.zipCodeValidationInit();
    this.differentAddressAutocompleteInit();
    this.zipCodeValidationDiffAddressInit();
    this.enableDisableValidation();
    this.clearValidations(this.demographicsAddressFormControls);
    this.clearValidations(this.diffAddressFormControls);
    this.previousUrl = '/eorder/as-eorder-appt-scheduler';
    // todo remove below method after save functionality is completed
    this.getSecondaryInsurance();
    if (this.eorderDataService.isEditFromEorderSummary) {
      this.getInsuranceForedit();
    }
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
    this.stateSearchInit();
  }

  getAlternateFlowStatus() {
    this.eorderDataService.getAlternateFlow().subscribe(res => {
      this.isAlternateFlow = res;
    });
  }

  getInsuranceInfo() {
    this.SpinnerLoading = true;
    this.eorderService
      .getEncounterInfoWithoutCahce('insurance')
      .pipe(takeUntil(this.destroy$))
      .subscribe((insuranceData: any) => {
        this.SpinnerLoading = false;
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
          this.form.get('provider').patchValue({
            insuranceCompanyName: insuranceData.insurance.insuranceName,
            insuranceMnemonic: insuranceData.insurance.insMnemonic
          });
          this.form.get('memberId').patchValue(insuranceData.insurance.insMemberId);
          this.form.get('groupId').patchValue(insuranceData?.insurance?.insuranceGroupId);
          this.clearNoMatchError();
          if (
            insuranceData.insurance.labCard === true ||
            insuranceData.insurance.insMnemonic === this.labCardMnemonic
          ) {
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
        this.eorderDataService.setInsuranceInformation({
          insuranceData: this.form.getRawValue(),
          bringCarderror: this.bringCardError
        });
      });
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

  addressAutocompleteInit() {
    this.controlSub = this.form
      .get('PersonalAddress')
      .get('address1')
      .valueChanges.pipe(
        filter(() => !this.addressLoading),
        tap(() => {
          this.options = [];
        }),
        debounceTime(this.delayTime ? this.delayTime : 500),
        tap(() => {
          this.addressLoading = true;
        }),
        switchMap(value => {
          if (value.length < 3) {
            return of({});
          }
          return this.googleMapService.getGoogleAutocomplete(value);
        })
      )
      .subscribe((results: GoogleAutocompleteResponse) => {
        this.addressLoading = false;
        this.options = results.predictions;
      });
  }

  differentAddressAutocompleteInit() {
    this.controlSub = this.form
      .get('differentPersonalAddress')
      .get('address1')
      .valueChanges.pipe(
        filter(value => value.length > 0),
        filter(() => !this.diffAddressLoading),
        tap(() => {
          this.optionsDiffAddress = [];
        }),
        debounceTime(this.delayTime ? this.delayTime : 500),
        tap(() => {
          this.diffAddressLoading = true;
        }),
        switchMap(value => {
          if (value.length < 3) {
            return of({});
          }
          return this.googleMapService.getGoogleAutocomplete(value);
        })
      )
      .subscribe((results: GoogleAutocompleteResponse) => {
        this.diffAddressLoading = false;
        this.optionsDiffAddress = results.predictions;
      });
  }

  zipCodeValidationInit() {
    this.form
      .get('PersonalAddress')
      .get('zipCode')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        filter(zipCode => {
          return zipCode && zipCode.length > 4;
        }),
        switchMap(zipCode => this.googleMapService.getGoogleCityState(zipCode))
      )
      .subscribe((response: GoogleCityStateObject) => {
        // response = this.googleMapService.getCityStateFromAddressResponse(response);
        if (response && response.city && response.state) {
          this.cityFromAPI = response.city;
          this.stateFromAPI = response.state;

          // region start multi cities with same zipcode checking
          const cityControl = this.form.get('PersonalAddress').get('city');
          if (
            cityControl.value &&
            cityControl.value.length > 0 &&
            response.multiCity &&
            response.multiCity.length > 0
          ) {
            if (response.multiCity.findIndex(item => cityControl.value.toLowerCase() === item.toLowerCase()) === -1) {
              cityControl.patchValue(response.city);
            }
          } else {
            cityControl.patchValue(response.city);
          }
          // region end multi cities with same zipcode checking

          const isInUSA = !!this.states.filter(state => state.value === response.state).length;

          if (isInUSA) {
            this.form
              .get('PersonalAddress')
              .get('state')
              .patchValue(response.state);
          } else {
            this.form
              .get('PersonalAddress')
              .get('state')
              .patchValue(null);
            this.form
              .get('PersonalAddress')
              .get('zipCode')
              .setErrors({ outsideUsa: true });
          }
        } else {
          this.form
            .get('PersonalAddress')
            .get('zipCode')
            .setErrors({ invalidzipCode: true });
        }
      });
  }

  zipCodeValidationDiffAddressInit() {
    this.form
      .get('differentPersonalAddress')
      .get('zipCode')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        filter(zipCode => {
          return zipCode && zipCode.length > 4;
        }),
        switchMap(zipCode => this.googleMapService.getGoogleCityState(zipCode))
      )
      .subscribe((response: GoogleCityStateObject) => {
        // response = this.googleMapService.getCityStateFromAddressResponse(response);
        if (response && response.city && response.state) {
          this.cityFromAPI = response.city;
          this.stateFromAPI = response.state;

          // region start multi cities with same zipcode checking
          const cityControl = this.form.get('differentPersonalAddress').get('city');
          if (
            cityControl.value &&
            cityControl.value.length > 0 &&
            response.multiCity &&
            response.multiCity.length > 0
          ) {
            if (response.multiCity.findIndex(item => cityControl.value.toLowerCase() === item.toLowerCase()) === -1) {
              cityControl.patchValue(response.city);
            }
          } else {
            cityControl.patchValue(response.city);
          }
          // region end multi cities with same zipcode checking

          const isInUSA = !!this.states.filter(state => state.value === response.state).length;

          if (isInUSA) {
            this.form
              .get('differentPersonalAddress')
              .get('state')
              .patchValue(response.state);
          } else {
            this.form
              .get('differentPersonalAddress')
              .get('state')
              .patchValue(null);
            this.form
              .get('differentPersonalAddress')
              .get('zipCode')
              .setErrors({ outsideUsa: true });
          }
        } else {
          this.form
            .get('differentPersonalAddress')
            .get('zipCode')
            .setErrors({ invalidzipCode: true });
        }
      });
  }

  // this will help to get the user.insuranceMnemonic
  // when user.insuranceCompanyName is selected. though
  // we will get the whole object as a formControl (provider) Value

  displayFn(user: InsuranceProvider) {
    if (user) {
      this.error = false;
      return user.insuranceCompanyName;
    }
  }

  buildForm() {

    const currentYear = this.minDate.getFullYear();
    this.minDate.setFullYear(currentYear - 120);
    this.maxDate.setFullYear(currentYear - 13);

    this.form = this.fb.group({
      secondaryInsurance: ['false'],
      sameas: [''],
      provider: ['', [Validators.required]],
      memberId: ['', [Validators.required]],
      groupId: [''],
      primary: [this.initValue, [Validators.required]],
      labCard: ['', [Validators.required]],
      PersonalAddress: this.fb.group({
        address1: [
          '',
          [Validators.minLength(3), Validators.maxLength(75), Validators.pattern(regex.address1), Validators.required]
        ],
        address2: ['', [Validators.minLength(1), Validators.maxLength(75), Validators.pattern(regex.address1)]],
        city: [
          '',
          [Validators.minLength(3), Validators.maxLength(30), Validators.pattern(regex.city), Validators.required]
        ],
        state: ['', [Validators.required, Validators.pattern(regex.state)]],
        zipCode: [
          '',
          [Validators.minLength(5), Validators.maxLength(10), Validators.pattern(regex.zipCode), Validators.required]
        ],
        firstName: ['', [Validators.maxLength(75), Validators.pattern(regex.firstName), Validators.required]],
        lastName: ['', [Validators.maxLength(75), Validators.pattern(regex.lastName), Validators.required]],
        dateOfBirth: [
          '',
          [Validators.required, CustomValidators.dateValidations(this.minDate, this.maxDate)]
        ],
        gender: ['', [Validators.required]],
        relationship: ['', [Validators.required]],
        phone: [
          '',
          [
            Validators.minLength(10),
            Validators.maxLength(12),
            Validators.pattern(regex.phoneNumber),
            Validators.required
          ]
        ]
      }),
      differentPersonalAddress: this.fb.group({
        address1: [
          '',
          [Validators.minLength(3), Validators.maxLength(75), Validators.pattern(regex.address1), Validators.required]
        ],
        address2: ['', [Validators.minLength(1), Validators.maxLength(75), Validators.pattern(regex.address1)]],
        city: [
          '',
          [Validators.minLength(3), Validators.maxLength(30), Validators.pattern(regex.city), Validators.required]
        ],
        state: ['', [Validators.required, Validators.pattern(regex.state)]],
        zipCode: [
          '',
          [Validators.minLength(5), Validators.maxLength(10), Validators.pattern(regex.zipCode), Validators.required]
        ]
      })
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
      if (inputValues) {
        this.memberIdGroupIdErrorCount = 0;
        this.errorMessageType = null;
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
            : this.form.get('provider').value.insuranceCompanyName.toLowerCase();
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
      if (inputValue.length > 0 && provider.length === 0) {
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

  stateSearchInit() {
    this.form
      .get('PersonalAddress')
      .get('state')
      .valueChanges.subscribe(inputValues => {
        if (inputValues && inputValues.length > 0) {
          this.stateResult = this.states.filter((el: DropdownOption) => {
            const insName = el.label.toLowerCase();
            inputValues = inputValues.toLowerCase();
            if (insName.substr(0, inputValues.length) === inputValues) {
              return true;
            } else {
              return false;
            }
          });
        } else {
          this.stateResult = this.states;
        }
      });
  }

  stateSearchDiffAddressInit() {
    this.form
      .get('differentPersonalAddress')
      .get('state')
      .valueChanges.subscribe(inputValues => {
        if (inputValues && inputValues.length > 0) {
          this.stateResultDiffAddress = this.states.filter((el: DropdownOption) => {
            const insName = el.label.toLowerCase();
            inputValues = inputValues.toLowerCase();
            if (insName.substr(0, inputValues.length) === inputValues) {
              return true;
            } else {
              return false;
            }
          });
        } else {
          this.stateResultDiffAddress = this.states;
        }
      });
  }

  onOptionSelect(option: GoogleAutocompletePrediction) {
    this.googleMapService
      .getGoogleCityStateZipCode(option.description)
      .subscribe((response: GoogleCityStateZipObject) => {
        this.cityFromAPI = response.city;
        this.stateFromAPI = response.state;
        const address = this.form
          .get('PersonalAddress')
          .get('address1')
          .value.split(',');
        if (address[0]) {
          this.form
            .get('PersonalAddress')
            .get('address1')
            .patchValue(address[0]);
        }
        if (response.city) {
          this.form
            .get('PersonalAddress')
            .get('city')
            .patchValue(response.city);
        }
        if (response.state) {
          const isInUSA = !!this.states.filter(state => state.value === response.state).length;
          if (isInUSA) {
            this.form
              .get('PersonalAddress')
              .get('state')
              .patchValue(response.state);
          } else {
            this.form
              .get('PersonalAddress')
              .get('state')
              .patchValue(null);
            this.form
              .get('PersonalAddress')
              .get('zipCode')
              .setErrors({ outsideUsa: true });
          }
        }
        if (response.zip) {
          this.form
            .get('PersonalAddress')
            .get('zipCode')
            .patchValue(response.zip);
        }
      });

    // Unfocus the search input after matAutoComplete auto-refocuses on the input.
    // This will hide the keyboard on mobile.
    setTimeout(() => {
      this.searchInput.nativeElement.blur();
    }, 500);
  }

  onOptionSelectDiffAddress(option: GoogleAutocompletePrediction) {
    this.googleMapService
      .getGoogleCityStateZipCode(option.description)
      .subscribe((response: GoogleCityStateZipObject) => {
        this.cityFromAPI = response.city;
        this.stateFromAPI = response.state;
        const diffaddressForm = this.form.get('differentPersonalAddress');
        const address = diffaddressForm.get('address1').value.split(',');
        if (address[0]) {
          diffaddressForm.get('address1').patchValue(address[0]);
        }
        if (response.city) {
          diffaddressForm.get('city').patchValue(response.city);
        }
        if (response.state) {
          const isInUSA = !!this.states.filter(state => state.value === response.state).length;
          if (isInUSA) {
            diffaddressForm.get('state').patchValue(response.state);
          } else {
            diffaddressForm.get('state').patchValue(null);
            diffaddressForm.get('zipCode').setErrors({ outsideUsa: true });
          }
        }
        if (response.zip) {
          diffaddressForm.get('zipCode').patchValue(response.zip);
        }
      });

    // Unfocus the search input after matAutoComplete auto-refocuses on the input.
    // This will hide the keyboard on mobile.
    setTimeout(() => {
      this.searchDiffAddressInput.nativeElement.blur();
    }, 500);
  }

  // continue button override
  continueClicked() {
    this.checkInsuranceIfnotSelectedFromList();
    if (this.form.get('primary').value === 'true') {
      this.resetGtrFields();
    }
    const formValue = this.form.value;
    this.eorderDataService.setPreviousUrlDemographic(false);
    this.eorderDataService.setInsuranceInformation({ insuranceData: formValue, bringCarderror: true });
    // todo remove below line of code after save functionality
    this.insuranceEorderAddressService.setSecondaryInsuranceSelection(this.form.get('secondaryInsurance').value);
    if (this.form.get('primary').value === 'false') {
      this.paramObject.guarantor = {
        firstName: this.form.get('PersonalAddress').get('firstName').value,
        lastName: this.form.get('PersonalAddress').get('lastName').value,
        dateOfBirth: this.form.get('PersonalAddress').get('dateOfBirth').value,
        gender: this.form.get('PersonalAddress').get('gender').value,
        phone: this.form
          .get('PersonalAddress')
          .get('phone')
          .value.replace(/\-+/g, ''),
        relationship: this.form.get('PersonalAddress').get('relationship').value
      };
    }
    if (this.form.get('sameas').value) {
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
    } else {
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
    }
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
      this.eorderDataService.setInsuranceInformation({ insuranceData: this.form.getRawValue(), bringCarderror: true });
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
    }  else {
      this.insuranceValidationService.verifyInsuranceV2(this.insuranceObj)
        .subscribe((res: InsuranceVerificationResponseVersion2) => {
          try {
            this.eorderService.mockPriceCall = false;
            this.SpinnerLoading = false;
            this.checkAndValidate();
            this.updateGroupId(res);
            if (this.eorderDataService.isEditFromEorderSummary) {
              this.verifyInsuranceModifyFlow(res);
            } else if (res.valid) {
              this.eorderService.mockPriceCall = true;
              this.eorderDataService.setInsuranceInformation({ insuranceData: this.form.getRawValue(), bringCarderror: null });
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
              this.eorderDataService.setInsuranceInformation({ insuranceData: this.form.getRawValue(), bringCarderror: null });
              this.preparePreregObject();
              this.eorderService.saveEncounter(this.paramObject).subscribe();
              this.navigateToNext();
            } else if ((this.invalidId && this.clickCount > 0) || this.letUserGo) {
              this.eorderDataService.setInsuranceInformation({ insuranceData: this.form.getRawValue(), bringCarderror: null });
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
        insuranceData: this.form.value,
        bringCarderror: null
      },
        this.demographicObj)
    };
  }
  updateAddress() {
    if (this.form.get('sameas').value) {
      this.paramObject.guarantor = {
        ...this.paramObject.guarantor,
        address: this.form.get('differentPersonalAddress').get('address1').value,
        address2: this.form.get('differentPersonalAddress').get('address2').value,
        city: this.form.get('differentPersonalAddress').get('city').value,
        state: this.form.get('differentPersonalAddress').get('state').value,
        zip: this.form.get('differentPersonalAddress').get('zipCode').value
      };
      this.paramObject.insuranceQR = {
        ...this.paramObject.insuranceQR,
        insuranceAddress: this.form.get('PersonalAddress').get('address1').value,
        insuranceAddress2: this.form.get('PersonalAddress').get('address2').value,
        insuranceCity: this.form.get('PersonalAddress').get('city').value,
        insuranceZip: this.form.get('PersonalAddress').get('zipCode').value,
        insuranceState: this.form.get('PersonalAddress').get('state').value
      };
    } else {
      this.paramObject.insuranceQR = {
        ...this.paramObject.insuranceQR,
        insuranceAddress: this.form.get('PersonalAddress').get('address1').value,
        insuranceAddress2: this.form.get('PersonalAddress').get('address2').value,
        insuranceCity: this.form.get('PersonalAddress').get('city').value,
        insuranceZip: this.form.get('PersonalAddress').get('zipCode').value,
        insuranceState: this.form.get('PersonalAddress').get('state').value
      };
    }
  }

  handleChange(event) {
    /** when someone else radio button chekced then showing demographics section and updating validations */
    if (event === 'false') {
      this.blnInsuranceHolder = true;
      this.clearValidations(this.diffAddressFormControls);
      this.updateValidationForFormGroup(this.demographicsAddressFormControls);
      const phone = this.formatPhone(this.insuranceInfo.guarantor.phone);
      this.form
        .get('PersonalAddress')
        .get('firstName')
        .patchValue(this.insuranceInfo.guarantor.firstName);
      this.form
        .get('PersonalAddress')
        .get('lastName')
        .patchValue(this.insuranceInfo.guarantor.lastName);
      this.form
        .get('PersonalAddress')
        .get('dateOfBirth')
        .patchValue(this.insuranceInfo.guarantor.dateOfBirth);
      this.form
        .get('PersonalAddress')
        .get('gender')
        .patchValue(this.insuranceInfo.guarantor.gender);
      this.form
        .get('PersonalAddress')
        .get('phone')
        .patchValue(phone);
      this.form
        .get('PersonalAddress')
        .get('relationship')
        .patchValue(this.insuranceInfo.guarantor.relationship);
      this.form
        .get('PersonalAddress')
        .get('address1')
        .patchValue(
          this.insuranceInfo.insurance.insuranceAddress == null ? '' : this.insuranceInfo.insurance.insuranceAddress
        );
      this.form
        .get('PersonalAddress')
        .get('city')
        .patchValue(this.insuranceInfo.insurance.insuranceCity);
      this.form
        .get('PersonalAddress')
        .get('state')
        .patchValue(this.insuranceInfo.insurance.insuranceState);
      this.form
        .get('PersonalAddress')
        .get('zipCode')
        .patchValue(this.insuranceInfo.insurance.insuranceZip);
    } else {
      this.clearValidations(this.demographicsAddressFormControls);
      this.clearValidations(this.diffAddressFormControls);
      // this.insuranceInfo.guarantor = null;
      this.blnInsuranceHolder = false;
      this.resetGtrFields();
    }
  }
  formatPhone(phone){
    if(phone && phone.length === 10){
      return phone.slice(0,3)+'-'+phone.slice(3,6)+'-'+phone.slice(6);
    }
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
    if (event['keyCode'] === 8) {
      return false;
    }
    // checking phone number lengt
    if (currentValue) {
      const phone = currentValue.replace(/\-+/g, '');
      if (phone.length > 10) {
        this.form
          .get('PersonalAddress')
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

  updateValidationForDiffAddress(value: any) {
    /** if address is different checked enabling validations else removing validations  */
    if (value) {
      this.updateValidationForFormGroup(this.diffAddressFormControls);
      this.form
        .get('differentPersonalAddress')
        .get('address1')
        .patchValue(this.insuranceInfo.guarantor.address == null ? '' : this.insuranceInfo.guarantor.address);
      this.form
        .get('differentPersonalAddress')
        .get('city')
        .patchValue(this.insuranceInfo.guarantor.city);
      this.form
        .get('differentPersonalAddress')
        .get('state')
        .patchValue(this.insuranceInfo.guarantor.state);
      this.form
        .get('differentPersonalAddress')
        .get('zipCode')
        .patchValue(this.insuranceInfo.guarantor.zip);
    } else {
      this.clearValidations(this.diffAddressFormControls);
    }
  }

  buildDiffAddressControls() {
    this.diffAddressFormControls = [];
    this.diffAddressFormControls.push(
      new CustomFormControls('differentPersonalAddress.address1', [
        Validators.minLength(3),
        Validators.maxLength(75),
        Validators.pattern(regex.address1),
        Validators.required
      ])
    );
    this.diffAddressFormControls.push(
      new CustomFormControls('differentPersonalAddress.address2', [
        Validators.minLength(1),
        Validators.maxLength(75),
        Validators.pattern(regex.address1)
      ])
    );
    this.diffAddressFormControls.push(
      new CustomFormControls('differentPersonalAddress.city', [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(regex.city),
        Validators.required
      ])
    );
    this.diffAddressFormControls.push(
      new CustomFormControls('differentPersonalAddress.state', [Validators.required, Validators.pattern(regex.state)])
    );
    this.diffAddressFormControls.push(
      new CustomFormControls('differentPersonalAddress.zipCode', [
        Validators.minLength(5),
        Validators.maxLength(10),
        Validators.pattern(regex.zipCode),
        Validators.required
      ])
    );
  }

  buildDemographicControls() {
    this.demographicsAddressFormControls = [];
    this.demographicsAddressFormControls.push(
      new CustomFormControls('PersonalAddress.firstName', [
        Validators.maxLength(75),
        Validators.pattern(regex.firstName),
        Validators.required
      ])
    );
    this.demographicsAddressFormControls.push(
      new CustomFormControls('PersonalAddress.lastName', [
        Validators.maxLength(75),
        Validators.pattern(regex.lastName),
        Validators.required
      ])
    );
    this.demographicsAddressFormControls.push(
      new CustomFormControls('PersonalAddress.dateOfBirth', [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required,
        CustomValidators.coppaMinAge()
      ])
    );
    this.demographicsAddressFormControls.push(new CustomFormControls('PersonalAddress.gender', [Validators.required]));
    this.demographicsAddressFormControls.push(
      new CustomFormControls('PersonalAddress.relationship', [Validators.required])
    );
    this.demographicsAddressFormControls.push(
      new CustomFormControls('PersonalAddress.phone', [
        Validators.minLength(10),
        Validators.maxLength(12),
        Validators.pattern(regex.phoneNumber),
        Validators.required
      ])
    );
    this.demographicsAddressFormControls.push(
      new CustomFormControls('PersonalAddress.address1', [
        Validators.minLength(3),
        Validators.maxLength(75),
        Validators.pattern(regex.address1),
        Validators.required
      ])
    );
    this.demographicsAddressFormControls.push(
      new CustomFormControls('PersonalAddress.address2', [
        Validators.minLength(1),
        Validators.maxLength(75),
        Validators.pattern(regex.address1)
      ])
    );
    this.demographicsAddressFormControls.push(
      new CustomFormControls('PersonalAddress.city', [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(regex.city),
        Validators.required
      ])
    );
    this.demographicsAddressFormControls.push(
      new CustomFormControls('PersonalAddress.state', [Validators.required, Validators.pattern(regex.state)])
    );
    this.demographicsAddressFormControls.push(
      new CustomFormControls('PersonalAddress.zipCode', [
        Validators.minLength(5),
        Validators.maxLength(10),
        Validators.pattern(regex.zipCode),
        Validators.required
      ])
    );
  }

  enableDisableValidation() {
    /** registering control name and validations through custom form controls class */
    this.buildDiffAddressControls();
    this.buildDemographicControls();
  }

  showError(type) {
    if (type === 'none') {
      this.error = false;
    } else {
      this.error = true;
      if (type === 'noMatchError') {
        this.noMatchesError = true;
      }
      if (type === 'bringCardError') {
        this.bringCardError = true;
      }
    }
  }
  updateVal(event) {
    this.form
      .get('PersonalAddress')
      .get('state')
      .setValue(event.target.value.toUpperCase());
  }
  updateStateVal(event) {
    this.form
      .get('differentPersonalAddress')
      .get('state')
      .setValue(event.target.value.toUpperCase());
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  clearNoMatchError() {
    this.form.get('provider').valueChanges.subscribe(value => {
      if (value && value.length === 0) {
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
    });
  }
  modifyAppointment(payload = null) {
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
        insuranceMemberId: this.form.value.memberId,
        insuranceGroupNumber: null,
        insuranceCompanyName: this.getCompanyName(),
        insuranceMnemonic: this.getMnemonic(),
        insuranceOptOut: false,
        // address: this.form.get('PersonalAddress').get('address1')?this.form.get('PersonalAddress').get('address1').value:null,
        // address2: this.form.get('PersonalAddress').get('address2').value?this.form.get('PersonalAddress').get('address2').value:null,
        // city: this.form.get('PersonalAddress').get('city').value?this.form.get('PersonalAddress').get('city').value:null,
        // state: this.form.get('PersonalAddress').get('state').value?this.form.get('PersonalAddress').get('state').value:null,
        // zip: this.form.get('PersonalAddress').get('zipCode').value?this.form.get('PersonalAddress').get('zipCode').value:null,
        guarantorFirstName: this.form.get('PersonalAddress').get('firstName').value,
        guarantorLastName: this.form.get('PersonalAddress').get('lastName').value,
        guarantorDateOfBirth: this.form.get('PersonalAddress').get('dateOfBirth').value,
        guarantorGender: this.form.get('PersonalAddress').get('gender').value,
        // guarantorAddress: this.form.get('differentPersonalAddress').get('address1').value,
        // guarantorAddress2: this.form.get('differentPersonalAddress').get('address2').value,
        // guarantorCity: this.form.get('differentPersonalAddress').get('city').value,
        // guarantorState:  this.form.get('differentPersonalAddress').get('state').value,
        // guarantorZip:  this.form.get('differentPersonalAddress').get('zipCode').value,
        guarantorPhone: this.form
          .get('PersonalAddress')
          .get('phone')
          .value?.replace(/\-+/g, ''),
        guarantorRelationship: this.form.get('PersonalAddress').get('relationship').value,
        guarantorOptOut: this.form.value.guarantorOptOut,
        primaryInsuranceHolder: this.form.get('primary').value,
        ...this.insuranceEorderAddressService.geteOrderAddressFields({ insuranceData: this.form.value, bringCarderror: null }
          , this.demographicObj),
      }
    };
    if (!this.isSecondaryNotSelected) {
      const userAccount = new UserDemographic();
      this.secondaryInsuranceService.modifyAppointmentInfo = this.modifyAppointmentInfo;
      this.SpinnerLoading = false;
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
      this.eorderDataService.setInsuranceInformation({ insuranceData: null, bringCarderror: null });
      // this.router.navigate(['/eorder/as-eorder-price-estimate']);
    } else {
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
    }
  }

  bindSecondaryInsurance(value: boolean) {
    const secIns = (!value).toString();
    this.secondaryInsuranceChange(secIns);
    this.insuranceEorderAddressService.setSecondaryInsuranceSelection(secIns);
  }

  resetGtrFields() {
    const gtrFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone', 'relationship'];
    gtrFields.forEach((controlName) => {
      this.form.get('PersonalAddress').get(controlName).reset();
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
  }

  focusOut(event) {
    /** when fousing out from DOB field and checking month and day are prefixed with zero when single digit. */
    const controlValue = event.target.value;
    const arrDOB = controlValue.split('/');
    if (arrDOB.length === 3 && arrDOB[2].length === 4) {
      event.target.value = this.prefixZeroForDate(arrDOB);
    } else {
      if (controlValue.length > 0) {
        this.form.get('PersonalAddress').get('dateOfBirth').setErrors({ invalidDateNew: true });
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

}
