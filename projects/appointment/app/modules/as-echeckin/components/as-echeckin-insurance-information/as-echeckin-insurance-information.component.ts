import { Location } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, Subject, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  CustomFormControls,
  DropdownOption,
  GoogleAutocompletePrediction,
  GoogleAutocompleteResponse,
  GoogleCityStateObject,
  GoogleCityStateZipObject,
  UserDemographic
} from 'shared/models';
import { EcheckinPersonalInformation, InsuranceProvider } from 'shared/models/echeckin';
import { DateService } from 'shared/services/date.service';
import { EcheckinDataService } from 'shared/services/echeckin/echeckin-data.service';
import { EcheckinService } from 'shared/services/echeckin/echeckin.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { regex } from 'shared/utils/validation/regex-patterns';
import { CustomValidators } from 'shared/utils/validation/validators';
import { default as homeContent } from '../../../../../assets/content.json';
@Component({
  selector: 'as-echeckin-insurance-information',
  templateUrl: './as-echeckin-insurance-information.component.html',
  styleUrls: ['./as-echeckin-insurance-information.component.scss']
})
export class AsEcheckinInsuranceInformationComponent implements OnInit, OnDestroy {
  content = homeContent;
  appointmentObj: any;
  @ViewChild('as_AddressSearchTxt') searchInput: ElementRef<any>;
  form: FormGroup;
  providerOptions: InsuranceProvider[] = [];
  insuranceProviders: Array<InsuranceProvider> = [];
  destroy$ = new Subject<any>();
  states = this.i18nConstants.states;
  loading = false;
  stateResult = this.states;
  stateResultDiffAddress = this.states;
  controlSub: Subscription;
  addressLoading = false;
  options: google.maps.places.AutocompletePrediction[];
  delayTime: number;
  cityFromAPI: string;
  stateFromAPI: string;
  blnInsuranceHolder: boolean;
  markFieldReadOnly: boolean;
  minDate = new Date();
  maxDate = new Date();
  userdata: UserDemographic = new UserDemographic();
  relationList: any = [{ value: 'Spouse', label: 'Spouse' }, { value: 'Dependent', label: 'Dependent' }];
  demographicsAddressFormControls: CustomFormControls[] = []; // demographics address fields
  error = false;
  noMatchesError = false;
  bringCardError = false;
  invalidId: boolean;
  clickCount = 0;
  letUserGo = false;
  initValue = 'true';
  showLabCardAlert: boolean;
  appState: any;
  previousUrl: string;
  paramObject: any = { guarantor: null, insuranceQR: null };
  personalInfo: EcheckinPersonalInformation;

  constructor(
    private router: Router, private i18nConstants: I18nConstantsService,
    private sanitizer: DomSanitizer, private fb: FormBuilder,
    private location: Location, private googleMapService: GoogleMapsService,
    private echeckinDataService: EcheckinDataService, private echeckinService: EcheckinService,
    private dateservice: DateService) { }

  ngOnInit() {
    this.buildForm();
    this.getPersonalInfo();
    this.getProviderList();
    const currentYear = this.minDate.getFullYear();
    this.minDate.setFullYear(currentYear - 120);
    this.maxDate.setFullYear(currentYear - 13);
    this.addressAutocompleteInit();
    this.zipCodeValidationInit();
    this.enableDisableValidation();
    this.clearValidations(this.demographicsAddressFormControls);
    this.previousUrl = '/echeckin/as-echeckin-personal-information';
  }

  getProviderList() {
    this.echeckinDataService.getEncounterInfo().pipe(
      switchMap((encounterObj: any) => {
        this.appointmentObj = encounterObj ? encounterObj.appointment : null;
        if (this.appointmentObj && this.appointmentObj.siteDetails.appointmentSite) {
          return this.echeckinService.getInsuranceProvider(this.appointmentObj.siteDetails.appointmentSite);
        } else {
          return [];
        }
      })).subscribe((res: InsuranceProvider[]) => {
        this.insuranceProviders = res;
        this.insuranceProviders.sort(this.sortPayors());
        this.providerSearchInit();
      });
    this.stateSearchInit();
  }

  getPersonalInfo() {
    this.echeckinDataService.getPersonalInformation().subscribe(personal => {
      this.personalInfo = personal;
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
    this.echeckinDataService.setInsuranceUpdate(true);
    this.echeckinDataService.setPreviousUrlDemographic(true);
    this.router.navigate(['/echeckin/as-echeckin-personal-information']);
    // this.location.back();
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
          if (value.length < 3) { return of({}); }
          return this.googleMapService.getGoogleAutocomplete(value);
        })
      )
      .subscribe((results: GoogleAutocompleteResponse) => {
        this.addressLoading = false;
        this.options = results.predictions;
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
          const cityControl = this.form.get('PersonalAddress').get('city');
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
            this.form.get('PersonalAddress').get('state').patchValue(response.state);
          } else {
            this.form.get('PersonalAddress').get('state').patchValue(null);
            this.form.get('PersonalAddress').get('zipCode').setErrors({ outsideUsa: true });
          }
        } else {
          this.form.get('PersonalAddress').get('zipCode').setErrors({ invalidzipCode: true });
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
    this.form = this.fb.group({
      provider: ['', [Validators.required]],
      memberId: ['', [Validators.required]],
      groupId: [''],
      primary: [this.initValue, [Validators.required]],
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
          [Validators.minLength(3), Validators.maxLength(30), Validators.required, , CustomValidators.coppaMinAge()]
        ],
        gender: ['', [Validators.required]],
        relationship: ['', [Validators.required]],
        phone: [
          '',
          [Validators.minLength(10), Validators.maxLength(12), Validators.pattern(regex.phoneNumber), Validators.required]
        ],
      }),
    });

  }

  sortPayors() {
    return function(a, b) {
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
    this.form.get('PersonalAddress').get('state').valueChanges.subscribe(inputValues => {
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

  onOptionSelect(option: GoogleAutocompletePrediction) {
    this.googleMapService.getGoogleCityStateZipCode(option.description).subscribe((response: GoogleCityStateZipObject) => {
      this.cityFromAPI = response.city;
      this.stateFromAPI = response.state;
      const address = this.form.get('PersonalAddress').get('address1').value.split(',');
      if (address[0]) {
        this.form.get('PersonalAddress').get('address1').patchValue(address[0]);
      }
      if (response.city) {
        this.form.get('PersonalAddress').get('city').patchValue(response.city);
      }
      if (response.state) {
        const isInUSA = !!this.states.filter(state => state.value === response.state).length;
        if (isInUSA) {
          this.form.get('PersonalAddress').get('state').patchValue(response.state);
        } else {
          this.form.get('PersonalAddress').get('state').patchValue(null);
          this.form.get('PersonalAddress').get('zipCode').setErrors({ outsideUsa: true });
        }
      }
      if (response.zip) {
        this.form.get('PersonalAddress').get('zipCode').patchValue(response.zip);
      }
    });

    // Unfocus the search input after matAutoComplete auto-refocuses on the input.
    // This will hide the keyboard on mobile.
    setTimeout(() => {
      this.searchInput.nativeElement.blur();
    }, 500);
  }


  continueClicked() {
    const formValue = this.form.value;
    this.echeckinDataService.setPreviousUrlDemographic(false);
    if (this.form.get('primary').value === 'false') {
      this.paramObject.guarantor = {
        firstName: this.form.get('PersonalAddress').get('firstName').value,
        lastName: this.form.get('PersonalAddress').get('lastName').value,
        dateOfBirth: this.dateservice.toDate(this.form.get('PersonalAddress').get('dateOfBirth').value) ,
        gender: this.form.get('PersonalAddress').get('gender').value,
        phone: this.form.get('PersonalAddress').get('phone').value.replace(/\-+/g, ''),
        relationship: this.form.get('PersonalAddress').get('relationship').value,
        address: this.form.get('PersonalAddress').get('address1').value,
        city: this.form.get('PersonalAddress').get('city').value,
        state: this.form.get('PersonalAddress').get('state').value,
        zip: this.form.get('PersonalAddress').get('zipCode').value
      };
      this.paramObject.insuranceQR = {
        insuranceName: this.form.value.provider['insuranceCompanyName'] === undefined ? this.form.get('provider').value
          : this.form.value.provider['insuranceCompanyName'],
        insuranceMnemonic: this.form.value.provider.insuranceMnemonic,
        insuranceMemberID: this.form.value.memberId,
        insuranceGroupID: this.form.value.groupId ? this.form.value.groupId : null,
        isPrimary: JSON.parse(this.form.value.primary),
        labCard: false
      };
    } else {
      this.paramObject.insuranceQR = {
        insuranceName: this.form.value.provider['insuranceCompanyName'] === undefined ? this.form.get('provider').value
          : this.form.value.provider['insuranceCompanyName'],
        insuranceMnemonic: this.form.value.provider.insuranceMnemonic,
        insuranceMemberID: this.form.value.memberId,
        insuranceGroupID: this.form.value.groupId ? this.form.value.groupId : null,
        isPrimary: JSON.parse(this.form.value.primary),
        labCard: false
      };
    }
    if (this.bringCardError) {
      this.loading = true;
      this.echeckinService.saveEncounter(this.paramObject).subscribe(res=>{
        this.loading = false;
        this.router.navigate(['/echeckin/as-echeckin-confirmation']);
      });
    } else if ((this.invalidId && this.clickCount > 0) || this.letUserGo) {
      this.loading = true;
      this.echeckinService.saveEncounter(this.paramObject).subscribe(res=>{
        this.loading = false;
        this.router.navigate(['/echeckin/as-echeckin-confirmation']);
      });
    } else if (!this.letUserGo) {
      this.invalidId = true;
      this.clickCount++;
    }
  }

  handleChange(event) {
    /** when someone else radio button chekced then showing demographics section and updating validations */
    if (event === 'false') {
      this.blnInsuranceHolder = true;
      this.updateValidationForFormGroup(this.demographicsAddressFormControls);
    } else {
      this.clearValidations(this.demographicsAddressFormControls);
      // this.insuranceInfo.guarantor = null;
      this.blnInsuranceHolder = false;
    }
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
        this.form.get('PersonalAddress').get('phone').setErrors({ invalidPhoneno: true });
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
    this.demographicsAddressFormControls.push(new CustomFormControls('PersonalAddress.relationship', [Validators.required]));
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
    this.buildDemographicControls();
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
    this.form.get('PersonalAddress').get('state').setValue(event.target.value.toUpperCase());
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
