import { Location } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';
import { combineLatest, of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  CustomFormControls,
  DropdownOption,
  GoogleAutocompletePrediction,
  GoogleAutocompleteResponse,
  GoogleCityStateObject,
  GoogleCityStateZipObject,
  InsuranceData,
  InsuranceProvider,
  InsuranceVerificationRequest,
  InsuranceVerificationResponse,
  UserDemographic
} from 'shared/models';
import { Appointment, AppointmentData, ModifyAppointmentData, ModifyCancelAppointmentData } from 'shared/models/appointment';
import { ModifyAppointment, ModifyAppointmentResponse } from 'shared/models/create-appointment-data';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { InsuranceAddressService } from 'shared/services/insurance-address.service';
import { InsuranceService } from 'shared/services/insurance.service';
import { PropertiesService } from 'shared/services/properties.service';
import { RouteService } from 'shared/services/route.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { UserService } from 'shared/services/user.service';
import { regex } from 'shared/utils/validation/regex-patterns';
import { CustomValidators } from 'shared/utils/validation/validators';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-insurance-information',
  templateUrl: './as-insurance-information.component.html',
  styleUrls: ['./as-insurance-information.component.scss']
})
export class AsInsuranceInformationComponent implements OnInit, OnDestroy {
  @ViewChild('as_AddressSearchTxt') searchInput: ElementRef<any>;
  @ViewChild('as_AddressSearchTxtDiff') searchDiffAddressInput: ElementRef<any>;
  content = homeContent;
  form: FormGroup;
  providerOptions: InsuranceProvider[] = [];
  insuranceProviders: Array<InsuranceProvider> = [];
  destroy$ = new Subject<any>();
  insuranceInfo: InsuranceVerificationRequest;
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
  addressFormControls: CustomFormControls[] = []; // main address fields
  appointmentData: Appointment;
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
  disableContinueButton = false;
  appState: any;
  labCardMnemonic = 'LBCRD';
  facilityServiceId: any[];
  phone: string;
  confirmationCode: string;
  modifyAppointmentInfo: ModifyAppointment;
  isEditFromSummaryPage = false;
  isAuthenticated$: Observable<boolean>;
  insuranceData: InsuranceData;
  modifyData: ModifyAppointmentData;
  isSecondaryNotSelected = true;
  previousUrl = 'schedule-appointment/as-personal-information';
  constructor(
    private fb: FormBuilder,
    private insuranceService: InsuranceService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private i18nConstants: I18nConstantsService,
    private googleMapService: GoogleMapsService,
    private dataService: DataService,
    private dateService: DateService,
    private location: Location,
    private userService: UserService,
    private appointmentService: AppointmentService,
    private insurnaceAddressService: InsuranceAddressService,
    private propertiesService: PropertiesService,
    private secondaryInsuranceService: SecondaryInsuranceService,
    private routeService: RouteService,
  ) {
    this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/ds-images/ds-icon-error-24.svg`);
  }

  ngOnInit() {
    this.buildForm();
    this.stateSearchDiffAddressInit();
    this.addressAutocompleteInit();
    this.zipCodeValidationInit();
    this.differentAddressAutocompleteInit();
    this.zipCodeValidationDiffAddressInit();
    this.enableDisableValidation();
    /** clearing validations for different address fields and demographic fields ext install go-to-method*/
    this.clearValidations(this.diffAddressFormControls);
    this.clearValidations(this.demographicsAddressFormControls);
    this.dataService.getAppState().subscribe((state: any) => {
      this.appState = state.isReviewed;
    });
    this.dataService.getIsQuestAccountCreated().pipe(takeUntil(this.destroy$)).subscribe((data: UserDemographic) => {
      if (data) {
        this.userdata = { ...data };
        if (this.userdata.isQuestUser) {
          // remove validations for the address controls if user is having quest account
          this.clearValidations(this.addressFormControls);
        }
      }
    });
    if (!this.dataService.isModifyCancel) {
      this.dataService.getInsuranceData().pipe(takeUntil(this.destroy$)).subscribe((insuranceData: InsuranceData) => {
        this.insuranceData = insuranceData;
        if (insuranceData && insuranceData.data) {
          if (insuranceData.data.isPrimaryInsuranceHolder === 'false') {
            this.initValue = 'false';
          }
          else {
            this.initValue = 'true';
          }
          this.handleChange(this.initValue);
          if(!insuranceData.data.secondaryInsurance){
            insuranceData.data.secondaryInsurance = 'false';
          }
          this.secondaryInsuranceChange(insuranceData.data.secondaryInsurance);
          this.form.patchValue(insuranceData.data);
          this.clearNoMatchError();
        }
      });
    }
    this.dataService.getlabCardLocationSearch().pipe(takeUntil(this.destroy$)).subscribe((labCardData: any) => {

      if (labCardData && labCardData?.labCard === 'true') {
        this.form.get('labCard').patchValue(labCardData.labCard);
        this.form.get('provider').patchValue(labCardData.provider);
      }
    });
    this.dataService.getPersonalData().pipe(takeUntil(this.destroy$)).subscribe((personalData: any) => {
      this.personalData = personalData;
    });
    this.getProviderList();
    this.stateSearchInit();
    this.getInsuranceForedit();
    this.getVerificationInfo();
    this.setPreviousUrlForEdit();
  }
  getProviderList() {
    this.dataService.getappointmentData().pipe(
      switchMap((appointmentData: AppointmentData) => {
        this.appointmentData = appointmentData ? appointmentData.data : null;
        if (this.appointmentData && this.appointmentData.siteCode) {
          return this.insuranceService.getInsuranceProvider(this.appointmentData.siteCode);
        } else {
          return [];
        }
      })).subscribe((res: InsuranceProvider[]) => {
        this.providerSorting(res);
      });
  }
  private providerSorting(res: InsuranceProvider[]) {
    this.insuranceProviders = res;
    if (this.insuranceProviders) {
      if (this.form.get('labCard').value === 'true') {
        this.labCardChange('true');
      }
    }
    this.insuranceService.insuranceProviderList = this.insuranceProviders.sort(this.sortPayors());
    this.getLabcardValueFromDeepLink();
    this.providerSearchInit();
    this.checkError();
  }

  getLabcardValueFromDeepLink() {
    this.dataService.getdeepLinkLabcardFlag().pipe(takeUntil(this.destroy$)).subscribe((flag: any) => {
      if (flag) {
        if (this.dataService.isDeepLinkHasLabCard) {
          this.form.get('labCard').patchValue(this.dataService.isDeepLinkHasLabCard);
          this.labCardChange('true');
        }
        else {
          this.form.get('labCard').patchValue('false');
        }
      }
      else {
        this.dataService.isDeepLinkHasLabCard = false;
        this.form.get('labCard').patchValue('false');
      }
    });
  }
  goToPrevious() {
    const labCard = {
      provider: {
        insuranceCompanyName: '',
        insuranceMnemonic: ''
      },
      labCard: 'false'
    };
    if (!this.appState && !this.isEditFromSummaryPage && !this.dataService.isModifyCancel) {
      this.dataService.setlabCardLocationSearch(labCard);
      this.dataService.setInsuranceData(null);
    }
    this.location.back();
  }

  /*public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
} */

  addressAutocompleteInit() {
    this.controlSub = this.form
      .get('address1')
      .valueChanges.pipe(
        filter(() => !this.addressLoading),
        tap(() => {
          this.options = [];
        }),
        debounceTime(this.delayTime ? this.delayTime : 500),
        tap((value) => {
          if(value && value.length > 0){
            this.addressLoading = true;
          }
        }),
        switchMap(value => {
          if (value && value.length < 3) { return of({}); }
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
        filter(value => {
          return value && value.length > 0;
        }),
        filter(() => !this.diffAddressLoading),
        tap(() => {
          this.optionsDiffAddress = [];
        }),
        debounceTime(this.delayTime ? this.delayTime : 500),
        tap(() => {
          this.diffAddressLoading = true;
        }),
        switchMap(value => {
          if (value && value.length < 3) { return of({}); }
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
          const cityControl = this.form.get('city');
          if (cityControl.value && cityControl.value.length > 0 && response.multiCity && response.multiCity.length > 0) {
            if (response.multiCity.findIndex(item => cityControl.value.toLowerCase() === item.toLowerCase()) === -1) {
              cityControl.patchValue(response.city);
            }
          } else {
            cityControl.patchValue(response.city);
          }
          // region end multi cities with same zipcode checking

          const isInUSA = !!this.states.filter(state => state.value === response.state).length;

          if (isInUSA) {
            this.form.get('state').patchValue(response.state);
          } else {
            this.form.get('state').patchValue(null);
            this.form.get('zipCode').setErrors({ outsideUsa: true });
          }
        } else {
          this.form.get('zipCode').setErrors({ invalidzipCode: true });
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
          if (cityControl.value && cityControl.value.length > 0 && response.multiCity && response.multiCity.length > 0) {
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
      sameas: [],
      provider: ['', [Validators.required]],
      memberId: ['', [Validators.required]],
      groupId: [''],
      relationship: ['', [Validators.required]],
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
      isPrimaryInsuranceHolder: [this.initValue, [Validators.required]],
      labCard: ['false', [Validators.required]],
      firstName: ['', [Validators.maxLength(75), Validators.pattern(regex.firstName), Validators.required]],
      lastName: ['', [Validators.maxLength(75), Validators.pattern(regex.lastName), Validators.required]],
      dateOfBirth: [
        '',
        [Validators.required, CustomValidators.dateValidations(this.minDate, this.maxDate)]
      ],
      gender: ['', [Validators.required]],
      phone: [
        '',
        [Validators.minLength(10), Validators.maxLength(12), Validators.pattern(regex.phoneNumber), Validators.required]
      ],
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
      }),
      secondaryInsurance:['false'],
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
    //  if (labCard === 'true' && !labcardFound && !this.appointmentData.labCard) {
   if (labCard === 'true' && (!this.appointmentData.labCard || !labcardFound)) {
      this.showLabCardAlert = true;
      this.dataService.setlabCardLocationSearch(labCardInsurance);
      this.disableContinueButton = true;
    } else if (labCard === 'true') {
      labCardInsurance.labCard = 'true';
      this.dataService.setlabCardLocationSearch(labCardInsurance);
      this.showLabCardAlert = false;
      this.markFieldReadOnly = true;
      this.form.controls.provider.patchValue(labCardInsurance.provider);

    } else if (labCard === 'false') {
      labCardInsurance = {
        provider: {
          insuranceCompanyName: this.form.value.provider.insuranceCompanyName,
          insuranceMnemonic: this.form.value.provider.insuranceMnemonic
        },
        labCard: 'false'
      };
      this.dataService.setlabCardLocationSearch(labCardInsurance);
      this.showLabCardAlert = false;
      this.form.controls.memberId.reset();
      this.form.controls.provider.reset();
      this.markFieldReadOnly = false;
    }

  }

  showLabCardLocation() {
    this.routeService.labcardRoute = this.router.url;
    this.dataService.setInsuranceData({ data: this.form.value, bringCarderror: true });
    this.dataService.editScreenName = 'editLocation';
    this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
  }

  sortPayors() {
    return function (a, b) {
      const insNameA = a.insuranceCompanyName;
      const insNameB = b.insuranceCompanyName;
      if (insNameA > insNameB) { // sort string ascending
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
      this.insuranceData.data.provider
    ) {
      inputValue = this.insuranceData.data.provider.insuranceCompanyName;
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
    this.form.get('memberId').valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.letUserGo = false;
    });
  }

  stateSearchInit() {
    this.form.get('state').valueChanges.subscribe(inputValues => {
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
    this.form.get('differentPersonalAddress').get('state').valueChanges.subscribe(inputValues => {
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
    this.googleMapService.getGoogleCityStateZipCode(option.description).subscribe((response: GoogleCityStateZipObject) => {
      this.cityFromAPI = response.city;
      this.stateFromAPI = response.state;
      const address = this.form.get('address1').value.split(',');
      if (address[0]) {
        this.form.get('address1').patchValue(address[0]);
      }
      if (response.city) {
        this.form.get('city').patchValue(response.city);
      }
      if (response.state) {
        const isInUSA = !!this.states.filter(state => state.value === response.state).length;
        if (isInUSA) {
          this.form.get('state').patchValue(response.state);
        } else {
          this.form.get('state').patchValue(null);
          this.form.get('zipCode').setErrors({ outsideUsa: true });
        }
      }
      if (response.zip) {
        this.form.get('zipCode').patchValue(response.zip);
      }
    });

    // Unfocus the search input after matAutoComplete auto-refocuses on the input.
    // This will hide the keyboard on mobile.
    setTimeout(() => {
      this.searchInput.nativeElement.blur();
    }, 500);
  }

  onOptionSelectDiffAddress(option: GoogleAutocompletePrediction) {
    this.googleMapService.getGoogleCityStateZipCode(option.description).subscribe((response: GoogleCityStateZipObject) => {
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
    if (this.isEditFromSummaryPage) {
      this.insuranceInfo = {
        siteCode: this.appointmentData.siteCode,
        insuranceMnemonic: this.form.value.provider.insuranceMnemonic,
        insuranceMemberId: this.form.value.memberId,
        insuranceGroupId: this.form.value.groupId ? this.form.value.groupId : null,
        patientFirstName: this.personalData.firstName,
        patientLastName: this.personalData.lastName,
        serviceDate: this.appointmentData.appointmentDate
      };
    } else {
      this.insuranceInfo = {
        siteCode: this.appointmentData.siteCode,
        insuranceMnemonic: this.form.value.provider.insuranceMnemonic,
        insuranceMemberId: this.form.value.memberId,
        insuranceGroupId: this.form.value.groupId ? this.form.value.groupId : null,
        patientDOB: this.dateService.toDate(this.personalData.dateOfBirth),
        patientFirstName: this.personalData.firstName,
        patientLastName: this.personalData.lastName,
        serviceDate: this.appointmentData.appointmentDate
      };
    }
    /** removing Guarantor fields from the form if user is primary account holder */
    this.removeGuarantorFieldsIfNotSomeone();
    this.SpinnerLoading = true;
    this.insuranceService.verifyInsurance(this.insuranceInfo).subscribe((res: InsuranceVerificationResponse) => {
      this.SpinnerLoading = false;
      if (this.isEditFromSummaryPage && !this.dataService.isModifyCancel) {
        if (!res.valid && this.clickCount === 0) {
          this.invalidId = true;
          this.clickCount++;
          window.scroll(0, 0);
        } else {
          this.SpinnerLoading = true;
          this.modifyAppointment();
        }
      } else if (this.dataService.isModifyCancel && !this.isEditFromSummaryPage) {
        if (!res.valid && this.clickCount === 0) {
          this.invalidId = true;
          this.clickCount++;
          window.scroll(0, 0);
        } else if (res.valid) {
          this.dataService.setInsuranceData({ data: this.form.value, bringCarderror: null });
          this.SpinnerLoading = true;
          this.modifyAppointment();
        } else if (!res.valid && this.bringCardError) {
          const provider = this.form.value.provider;
          if (typeof provider === 'string') {
            this.form.get('provider').patchValue({
              insuranceCompanyName: this.form.value.provider,
              insuranceMnemonic: null
            });
          }
          this.dataService.setInsuranceData({ data: this.form.value, bringCarderror: true });
          this.SpinnerLoading = true;
          this.modifyAppointment();
        } else if ((this.invalidId && this.clickCount > 0) || this.letUserGo) {
          this.dataService.setInsuranceData({ data: this.form.value, bringCarderror: null });
          this.SpinnerLoading = true;
          this.modifyAppointment();
        } else {
          this.SpinnerLoading = true;
          this.modifyAppointment();
        }
      } else if (res.valid) {
        this.dataService.setInsuranceData({ data: this.form.value, bringCarderror: null });
        // this.router.navigate(['/schedule-appointment/as-review-details']);
        this.navigateToNext();
      } else if (!res.valid && this.bringCardError) {
        const provider = this.form.value.provider;
        if (typeof provider === 'string') {
          this.form.get('provider').patchValue({
            insuranceCompanyName: this.form.value.provider,
            insuranceMnemonic: null
          });
        }
        this.dataService.setInsuranceData({ data: this.form.value, bringCarderror: true });
        // this.router.navigate(['/schedule-appointment/as-review-details']);
        this.navigateToNext();
      } else if ((this.invalidId && this.clickCount > 0) || this.letUserGo) {
        this.dataService.setInsuranceData({ data: this.form.value, bringCarderror: null });
        // this.router.navigate(['/schedule-appointment/as-review-details']);
        this.navigateToNext();
      } else if (!this.letUserGo) {
        this.invalidId = true;
        this.clickCount++;
        window.scroll(0, 0);
      }
    }, (error) => {
      this.SpinnerLoading = false;
      // alert(error);
    });
  }

  getVerificationInfo() {
    if (!this.dataService.isModifyCancel) {
      if (this.modifyData && this.modifyData.appointmentDetails) {
        if (!this.modifyData.appointmentDetails.skipVerifyIdentity) {
          this.dataService
            .getVerificationInfo()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
              this.phone = data.phone;
              this.confirmationCode = data.confirmationCode;
            });
        }
      }
    }
  }
  modifyAppointment(insuranceOptOut = null) {
    this.modifyAppointmentInfo = {
      channel: 'AS Web',
      labCard: JSON.parse(this.form.value.labCard),
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
        insuranceOptOut: insuranceOptOut,
        // address: this.form.value.address1,
        // address2: this.form.value.address2,
        // city: this.form.value.city,
        // state: this.form.value.state,
        // zip: this.form.value.zipCode,
        guarantorFirstName: this.form.value.firstName ? this.form.value.firstName : null,
        guarantorLastName: this.form.value.lastName ? this.form.value.lastName : null,
        guarantorDateOfBirth: this.dateService.toDate(this.form.value.dateOfBirth) ?
          this.dateService.toDate(this.form.value.dateOfBirth) : null,
        guarantorGender: this.form.value.gender ? this.form.value.gender : null,
        // guarantorAddress: this.form.get('differentPersonalAddress').value.address1 ?
        //   this.form.get('differentPersonalAddress').value.address1 : null,
        // guarantorAddress2: this.form.get('differentPersonalAddress').value.address2 ?
        //   this.form.get('differentPersonalAddress').value.address2 : null,
        // guarantorCity: this.form.get('differentPersonalAddress').value.city ?
        //   this.form.get('differentPersonalAddress').value.city : null,
        // guarantorState: this.form.get('differentPersonalAddress').value.state ?
        //   this.form.get('differentPersonalAddress').value.state : null,
        // guarantorZip: this.form.get('differentPersonalAddress').value.zipCode ?
        //   this.form.get('differentPersonalAddress').value.zipCode : null,
        guarantorPhone: this.form.value.phone ? this.form.value.phone.replace(/-/g, '') : null,
        guarantorRelationship: this.form.value.relationship ? this.form.value.relationship : null,
        guarantorOptOut: this.form.value.guarantorOptOut,
        primaryInsuranceHolder: this.form.value.isPrimaryInsuranceHolder ? this.form.value.isPrimaryInsuranceHolder : null,
        ...this.insurnaceAddressService.getAddressFields({ data: this.form.value, bringCarderror: null })
      }
    };
    if (!this.isSecondaryNotSelected) {
      const userAccount = new UserDemographic();
      userAccount.firstName = this.personalData.firstName;
      this.dataService.setIsQuestAccountCreated(userAccount);
      this.secondaryInsuranceService.modifyAppointmentInfo = this.modifyAppointmentInfo;
      this.SpinnerLoading = false;
      this.navigateToNext();
    } else {
      this.secondaryInsuranceService.setInsuranceData(null);
      this.modifyAppointmentInfo.preregistration.secondaryInsOptOut = true;
      this.appointmentService
        .modifyAppointment(this.modifyAppointmentInfo)
        .subscribe((res: ModifyAppointmentResponse) => {
          this.SpinnerLoading = false;
          if (res.confirmationCode) {
            this.dataService.setNewapptData(res);
            this.dataService.isInFLow = true;
            if (this.dataService.isModifyCancel) {
              this.dataService.isModifyCancel = true;
            } else {
              this.dataService.isModifyCancel = false;
            }
            this.navigateToSummaryPage(res.confirmationCode);

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

  removeGuarantorFieldsIfNotSomeone() {
    if (!(this.form.value.isPrimaryInsuranceHolder === 'false')) {
      this.form.value.firstName = null;
      this.form.value.lastName = null;
      this.form.value.dateOfBirth = null;
      this.form.value.gender = null;
      this.form.value.phone = null;
      this.form.value.relationship = null;
    }
  }

  handleChange(event) {
  //  this.reset();
    /** when someone else radio button chekced then showing demographics section and updating validations */
    if (event === 'false') {
      this.blnInsuranceHolder = true;
      this.updateValidationForFormGroup(this.demographicsAddressFormControls);
      if (this.userdata && this.userdata.isQuestUser) {
        this.updateValidationForFormGroup(this.addressFormControls);
        this.clearValidations(this.diffAddressFormControls);
      }
    } else {
      this.clearValidations(this.demographicsAddressFormControls);
      this.clearValidations(this.diffAddressFormControls);
      if (this.userdata.isQuestUser) {
        // remove validations for the address controls if user is having quest account
        this.clearValidations(this.addressFormControls);
      }
      this.blnInsuranceHolder = false;
    }
  }
  reset() {
    this.resetFields(this.addressFormControls);
    this.resetFields(this.diffAddressFormControls);
    // this.form.get('relationship').reset();
  }

  resetFields(addressFormControls: CustomFormControls[]) {
    addressFormControls.forEach(control => {
      if (control.name.indexOf('.') > 0) {
        this.form
          .get(control.name.split('.')[0])
          .get(control.name.split('.')[1])
          .reset();
        this.form
          .get(control.name.split('.')[0])
          .get(control.name.split('.')[1])
          .updateValueAndValidity();
      } else {
        this.form.get(control.name).reset();
        this.form.get(control.name).updateValueAndValidity();
      }
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
    if (event['keyCode'] === 8) {
      return false;
    }
    // checking phone number lengt
    if (currentValue) {
      const phone = currentValue.replace(/\-+/g, '');
      if (phone.length > 10) {
        this.form.get('phone').setErrors({ invalidPhoneno: true });
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
        CustomValidators.coppaMinAge()
      ])
    );
    this.demographicsAddressFormControls.push(new CustomFormControls('gender', [Validators.required]));
    this.demographicsAddressFormControls.push(new CustomFormControls('relationship', [Validators.required]));
    this.demographicsAddressFormControls.push(
      new CustomFormControls('phone', [
        Validators.minLength(10),
        Validators.maxLength(12),
        Validators.pattern(regex.phoneNumber),
        Validators.required
      ])
    );
  }

  buildAddressControls() {
    this.addressFormControls = [];
    this.addressFormControls.push(
      new CustomFormControls('address1', [
        Validators.minLength(3),
        Validators.maxLength(75),
        Validators.pattern(regex.address1),
        Validators.required
      ])
    );
    this.addressFormControls.push(
      new CustomFormControls('address2', [
        Validators.minLength(1),
        Validators.maxLength(75),
        Validators.pattern(regex.address1)
      ])
    );
    this.addressFormControls.push(
      new CustomFormControls('city', [
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(regex.city),
        Validators.required
      ])
    );
    this.addressFormControls.push(
      new CustomFormControls('state', [Validators.required, Validators.pattern(regex.state)])
    );
    this.addressFormControls.push(
      new CustomFormControls('zipCode', [
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
    this.buildAddressControls();
  }

  showError(type) {
    if (type === 'none') {
      this.error = false;
    } else {
      this.error = true;
      if (type === 'noMatchError') {
        this.noMatchesError = true;
      } if (type === 'bringCardError') {
        this.bringCardError = true;
      }
    }

  }
  updateVal(event) {
    this.form.controls['state'].patchValue(event.target.value.toUpperCase());
  }
  updateStateVal(event) {
    this.form.get('differentPersonalAddress').get('state').patchValue(event.target.value.toUpperCase());
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  clearNoMatchError() {
    this.form.get('provider').valueChanges.subscribe(value => {
      if (value !== null && value.length < 1) {
        this.bringCardError = false;
        this.error = false;
      }
    });
  }
  resetInsurance() {
    this.dataService.setInsuranceData(null);
    this.secondaryInsuranceService.setInsuranceData(null);
    this.userService.isAuthenticated$.subscribe(
      (isAuth: boolean) => {
        if (isAuth && this.isEditFromSummaryPage || this.dataService.isModifyCancel) {
          // this.navigateToSummaryPage(this.confirmationCode);
          this.isSecondaryNotSelected = true;
          this.modifyAppointment(true);
        }
        else {
          this.isSecondaryNotSelected = true;
          // this.router.navigate(['/schedule-appointment/as-review-details']);
          this.navigateToNext();
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
    if (!this.dataService.isModifyCancel) {
      this.dataService.getappointmentDataForEdit().pipe(
        switchMap((response: ModifyAppointmentData) => {
          this.modifyData = response;
          this.isEditFromSummaryPage = true;
           this.confirmationCode = response.confirmationCode;
           this.phone = response.demographicDetails.phone;
          this.appointmentData = new Appointment();
          this.personalData = {};
          this.appointmentData.siteCode = response.appointmentDetails.siteCode;
          this.appointmentData.appointmentDate = response.appointmentDetails.appointmentDate;
          this.personalData.firstName = response.demographicDetails.firstName;
          this.personalData.dateOfBirth = response.demographicDetails.dob;
          this.personalData.lastName = response.demographicDetails.lastName;
          this.facilityServiceId = response.appointmentDetails.facilityServiceId;
          this.appointmentData.appointmentTime = response.appointmentDetails.appointmentTime;
          this.userdata.firstName = response.demographicDetails.firstName;
          return this.insuranceService.getInsuranceProvider(this.appointmentData.siteCode);
        })).subscribe((res: InsuranceProvider[]) => {
          this.providerSorting(res);
        });
    } else {
      this.dataService.getmodifyAppointmentDataForEdit().pipe(
        switchMap((response: ModifyCancelAppointmentData) => {
          this.isEditFromSummaryPage = false;
          this.confirmationCode = response.confirmationCode;
          this.phone = response.demographicData.phone.replace(/-/g, '');
          this.appointmentData = new Appointment();
          this.personalData = {};
          this.appointmentData.siteCode = response.appointmentDetails.siteCode;
          this.appointmentData.appointmentDate = response.appointmentDetails.appointmentDate;
          this.personalData.firstName = response.demographicData.firstName;
          this.personalData.dateOfBirth = response.demographicData.dateOfBirth;
          this.personalData.lastName = response.demographicData.lastName;
          this.facilityServiceId = response.appointmentDetails.facilityServiceId;
          this.appointmentData.appointmentTime = response.appointmentDetails.appointmentTime;
          this.userdata.firstName = response.demographicData.firstName;
          if (response.insuranceData) {
            this.insuranceData = response.insuranceData;
            if (this.insuranceData && this.insuranceData.data) {
              if (this.insuranceData.data.isPrimaryInsuranceHolder === 'false') {
                this.initValue = 'false';
              }
              else {
                this.initValue = 'true';
              }
              this.handleChange(this.initValue);
              this.secondaryInsuranceChange(this.insuranceData.data.secondaryInsurance);
              this.form.patchValue(this.insuranceData.data);
            }
          }
          return this.insuranceService.getInsuranceProvider(this.appointmentData.siteCode);
        })).subscribe((res: InsuranceProvider[]) => {
          this.providerSorting(res);
        });
    }
  }
  private navigateToSummaryPage(confirmationcode) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        confirmationCode: confirmationcode
      }
    };
    this.router.navigate(['/find-appointment/as-find-appointment-summary'], navigationExtras);
  }

  secondaryInsuranceChange(optSecondaryIns: string){
    if(JSON.parse(optSecondaryIns)){
      this.isSecondaryNotSelected = false;
    }else{
      this.isSecondaryNotSelected = true;
    }
  }

  navigateToNext() {
    if (this.isSecondaryNotSelected) {
      this.router.navigate(['/schedule-appointment/as-review-details']);
    } else {
      this.router.navigate(['/schedule-appointment/as-secondary-insurance']);
    }
  }

  setPreviousUrlForEdit() {
    if (this.isEditFromSummaryPage || this.dataService.isModifyCancel) {
      this.previousUrl = this.routeService.getSummaryUrl();
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
}
