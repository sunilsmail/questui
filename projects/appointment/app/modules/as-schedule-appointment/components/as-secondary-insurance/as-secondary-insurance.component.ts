import { Location } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  DropdownOption,
  GoogleAutocompletePrediction,
  GoogleAutocompleteResponse,
  GoogleCityStateObject,
  GoogleCityStateZipObject,
  InsuranceData,
  InsuranceProvider,
  InsuranceVerificationRequest,
  InsuranceVerificationResponse,
  SecondaryInsurance,
  UserDemographic
} from 'shared/models';
import { ModifyAppointment, ModifyAppointmentResponse } from 'shared/models/create-appointment-data';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { InsuranceService } from 'shared/services/insurance.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { default as homeContent } from '../../../../../assets/content.json';
import { SecondaryInsuranceData } from './../../../../../../shared/src/lib/models/insurance';

@Component({
  selector: 'as-secondary-information',
  templateUrl: './as-secondary-insurance.component.html',
  styleUrls: ['./as-secondary-insurance.component.scss']
})
export class AsSecondaryInsuranceComponent implements OnInit, OnDestroy {
  content = homeContent;
  form: FormGroup;
  providerOptions: InsuranceProvider[] = [];
  insuranceProviders: Array<InsuranceProvider> = [];
  destroy$ = new Subject<any>();
  insuranceInfo: InsuranceVerificationRequest;
  SpinnerLoading = false;
  imageSrc: SafeResourceUrl;
  error = false;
  noMatchesError = false;
  bringCardError = false;
  invalidId: boolean;
  insuranceData: InsuranceData;
  letUserGo = false;
  userName: string;
  initValue = 'true';
  userName$: Observable<string>;
  subscription: Subscription = new Subscription();
  disableContinueButton = false;
  clickCount = 0;
  options: google.maps.places.AutocompletePrediction[];
  delayTime: number;
  addressLoading = false;
  cityFromAPI: string;
  stateFromAPI: string;
  states = this.i18nConstants.states;
  @ViewChild('as_AddressSearchTxt') searchInput: ElementRef<any>;
  gtrSelected = false;
  childComponentSuccess$ = new Subject<any>();
  modifyAppointmentInfo: ModifyAppointment;
  resetSecInsurance = false;
  stateResult = this.states;

  //
  // private optionsmain: string[] = [];
  // public control = new FormControl();
  // public filteredOptions: Array<InsuranceProvider> = [];
  // public height: string;
  //
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
  ) {
    this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/ds-images/ds-icon-error-24.svg`);
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
  ngOnInit() {
    this.insuranceProviders = this.insuranceService.insuranceProviderList;
    this.userName$ = this.dataService.getIsQuestAccountCreated().pipe(map((data: UserDemographic) => data.firstName));
    this.buildForm();

    // Listen for changes to the input
    // this.control.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map((value) => {
    //       // Filter the options
    //       this.filteredOptions = this.insuranceProviders.sort(this.sortPayors()).filter((option) =>
    //        option.insuranceCompanyName.toLowerCase().startsWith(value.toLowerCase())
    //       );
    //       console.log(this.filteredOptions);

    //       // Recompute how big the viewport should be.
    //       if (this.filteredOptions.length < 4) {
    //         this.height = this.filteredOptions.length * 50 + 'px';
    //       } else {
    //         this.height = '200px';
    //       }
    //     })
    //   )
    //   .subscribe();
    this.bindForm();
  }
  bindForm() {
    this.secondaryInsuranceService.getInsuranceData().subscribe((formData: SecondaryInsuranceData) => {
      const insData: SecondaryInsuranceData = JSON.parse(JSON.stringify(formData));
      if (insData && insData && insData.isPrimaryInsuranceHolder && insData.isPrimaryInsuranceHolder === 'false') {
        this.handleChange(insData.isPrimaryInsuranceHolder);
        this.childComponentSuccess$.subscribe(() => {
          delete insData.bringCarderror;
          this.form.patchValue(insData, { emitEvent: false });
        });
      } else if (insData && insData && insData.isPrimaryInsuranceHolder && insData.isPrimaryInsuranceHolder === 'true') {
        this.handleChange(insData.isPrimaryInsuranceHolder);
        delete insData.bringCarderror;
        this.form.patchValue(insData, { emitEvent: false });
      }
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
    });
    this.checkError();
    this.providerSearchInit();
  }

  providerSearchInit() {
    const providerSubscription = this.form.get('provider').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100)).subscribe(inputValues => {
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
    const insuranceVerifySubscription = this.insuranceService.verifySecondaryInsurance(secondaryIns).
      subscribe((res: InsuranceVerificationResponse) => {
        this.SpinnerLoading = false;
        if (this.secondaryInsuranceService.modifyAppointmentInfo) {
          if (!res.valid && this.clickCount === 0) {
            this.invalidId = true;
            this.clickCount++;
            window.scroll(0, 0);
          } else {
            this.SpinnerLoading = true;
            this.setInsdataInservice(null);
            this.modifyAppointment();
          }
        }
        else if (res.valid) {
          this.setInsdataInservice(null);
          this.navigateToNext();
        } else if (!res.valid && this.bringCardError) {
          this.setInsdataInservice(true);
          this.navigateToNext();
        } else if ((this.invalidId && this.clickCount > 0) || this.letUserGo) {
          this.setInsdataInservice(null);
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
      this.secondaryInsuranceService.setInsuranceData({ ...this.form.value, bringCarderror: bringCarderror });
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
      this.secondaryInsuranceService.addGtrControls(this.form);
      this.addressAutocompleteInit();
      this.zipCodeValidationInit();
      this.stateSearchInit();
    } else {
      this.gtrSelected = false;
      this.secondaryInsuranceService.removeGtrControls(this.form);
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
    } else {
      this.error = true;
      if (type === 'noMatchError') {
        this.noMatchesError = true;
      } if (type === 'bringCardError') {
        this.bringCardError = true;
      }
    }
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

  insuranceCheck() {

  }

  addChildForm(name: string, group: FormGroup) {
    this.form.addControl(name, group);
    this.childComponentSuccess$.next(true);
  }



  addressAutocompleteInit() {

    this.form
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
        switchMap((value: string) => {
          if (value.length < 3) {
            return of({});
          }
          return this.googleMapService.getGoogleAutocomplete(value);
        })
      )
      .subscribe((results: GoogleAutocompleteResponse) => {
        this.addressLoading = false;
        this.options = results.predictions;
        // this.triggerpanel.openPanel();
      });
  }

  zipCodeValidationInit() {
    const subZipcode = this.form
      .get('zipCode')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(100),
        distinctUntilChanged(),
        filter(zipCode => {
          return zipCode.length > 4;
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
    this.subscription.add(subZipcode);
  }


  onOptionSelect(option: GoogleAutocompletePrediction) {
    const subonOptionSelect = this.googleMapService.getGoogleCityStateZipCode(option.description)
      .subscribe((response: GoogleCityStateZipObject) => {
        this.options = [];
        this.addressLoading = false;
        this.cityFromAPI = response.city;
        this.stateFromAPI = response.state;
        // this.triggerpanel.closePanel();
        const address = this.form.get('address1').value.split(',');
        if (address[0]) {
          this.form.get('address1').patchValue(address[0], { emitEvent: false });
        }
        if (response.city) {
          this.form.get('city').patchValue(response.city, { emitEvent: false });
        }
        if (response.state) {
          const isInUSA = !!this.states.filter(state => state.value === response.state).length;
          if (isInUSA) {
            this.form.get('state').patchValue(response.state, { emitEvent: false });
          } else {
            this.form.get('state').patchValue(null);
            this.form.get('zipCode').setErrors({ outsideUsa: true });
          }
        }
        if (response.zip) {
          this.form.get('zipCode').patchValue(response.zip, { emitEvent: false });
        }
        // this.triggerpanel.closePanel();
        // this.triggerpanel._handleFocus();
      });
    this.subscription.add(subonOptionSelect);
    // Unfocus the search input after matAutoComplete auto-refocuses on the input.
    // This will hide the keyboard on mobile.
    setTimeout(() => {
      this.searchInput.nativeElement.blur();
    }, 500);
  }

  updateVal(event) {
    this.form.controls['state'].patchValue(event.target.value.toUpperCase());
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
      this.secondaryInsuranceService.formatSecondaryInsuranceToApiRequest(this.form.value);
    } else if(this.modifyAppointmentInfo && this.modifyAppointmentInfo.preregistration && this.resetSecInsurance){
      this.modifyAppointmentInfo.preregistration.secondaryInsOptOut = true;
      this.modifyAppointmentInfo.preregistration.secondaryInsurance = null;
    }
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
}
