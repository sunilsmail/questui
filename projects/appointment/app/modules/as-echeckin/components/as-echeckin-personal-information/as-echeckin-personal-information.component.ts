import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, Subject, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  DropdownOption, GoogleAutocompletePrediction,
  GoogleAutocompleteResponse, GoogleCityStateObject, GoogleCityStateZipObject
} from 'shared/models';
import { EcheckinDataService } from 'shared/services/echeckin/echeckin-data.service';
import { EcheckinService } from 'shared/services/echeckin/echeckin.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { regex } from 'shared/utils/validation/regex-patterns';
import { default as homeContent } from '../../../../../assets/content.json';


@Component({
  selector: 'as-echeckin-personal-information',
  templateUrl: './as-echeckin-personal-information.component.html',
  styleUrls: ['./as-echeckin-personal-information.component.scss']
})
export class AsEcheckinPersonalInformationComponent implements OnInit, OnDestroy {
  @ViewChild('as_Eorder_AddressSearchTxt') searchInput: ElementRef<any>;
  options: google.maps.places.AutocompletePrediction[] = [];
  content = homeContent;
  personalInfoForm: FormGroup;
  addressLoading = false;
  loading = false;
  delayTime: number;
  controlSub: Subscription;
  states = this.i18nConstants.states;
  stateResult = this.states;
  destroy$ = new Subject<any>();
  optionsCache = [];

  constructor(private fb: FormBuilder,
    private router: Router,
    private i18nConstants: I18nConstantsService,
    private googleMapService: GoogleMapsService,
    private echeckinService: EcheckinService,
    private echeckinDataService: EcheckinDataService) { }

  ngOnInit() {
    this.buildForm();
    this.addressAutocompleteInit();
    this.stateSearchInit();
    this.setDemographicsInfo();
    this.echeckinDataService.getPersonalInformation().pipe(takeUntil(this.destroy$)).subscribe((personalData) => {
      if (personalData) {
        this.personalInfoForm.setValue(personalData);
      }
    });
  }

  buildForm() {
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.maxLength(75), Validators.pattern(regex.firstName), Validators.required]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.minLength(3), Validators.maxLength(75), Validators.pattern(regex.address1), Validators.required]],
      address2: ['', [Validators.minLength(1), Validators.maxLength(75), Validators.pattern(regex.address2)]],
      city: ['', [Validators.minLength(3), Validators.maxLength(50), Validators.pattern(regex.city), Validators.required]],
      state: ['', [Validators.pattern(regex.state), Validators.required]],
      zip: ['', [Validators.minLength(5), Validators.maxLength(10), Validators.pattern(regex.zipCode), Validators.required]],
      insuranceCheck: ['', [Validators.required]],
    });
  }

  setDemographicsInfo() {
    this.echeckinDataService.getEncounterInfo().pipe(takeUntil(this.destroy$)).subscribe((encounter: any) => {
      const demographics = encounter.demographics;
      if (demographics) {
        this.personalInfoForm.patchValue({
          firstName: demographics.firstName,
          gender: demographics.gender ? demographics.gender : '',
          address: demographics.address ? demographics.address : '',
          address2: demographics.address2 ? demographics.address2 : '',
          state: demographics.state ? demographics.state : '',
          city: demographics.city ? demographics.city : '',
          zip: demographics.zip ? demographics.zip : '',
          insuranceOptOut: demographics.insuranceCheck ? demographics.insuranceCheck : ''
        });
      }
    });
  }

  addressAutocompleteInit() {
    this.controlSub = this.personalInfoForm
      .get('address')
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
          this.addressLoading = false;
          if (!value || (value && value.length < 3)) {
            return of([]);
          }
          else {
            this.optionsCache = [];
            return this.googleMapService.getGoogleAutocomplete(value, ['(regions)', 'address']);
          }
        })
      )
      .subscribe((results: GoogleAutocompleteResponse) => {
        this.addressLoading = false;
        if (results?.predictions?.length > 0) {
          this.optionsCache = [...this.optionsCache, ...results.predictions];
        }
        this.options = [...this.optionsCache];
      });
  }
  stateSearchInit() {
    this.personalInfoForm.get('state').valueChanges.subscribe((inputValues: string) => {
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

  zipCodeValidationInit() {
    this.personalInfoForm
      .get('zip')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        filter(zipCode => {
          return zipCode.length > 4;
        }),
        switchMap(zipCode => this.googleMapService.getGoogleCityState(zipCode))
      )
      .subscribe((response: GoogleCityStateObject) => {
        if (response && response.city && response.state) {
          this.personalInfoForm.get('city').patchValue(response.city);
          const isInUSA = !!this.states.filter(state => state.value === response.state).length;
          if (isInUSA) {
            this.personalInfoForm.get('state').patchValue(response.state);
          } else {
            this.personalInfoForm.get('state').patchValue(null);
            this.personalInfoForm.get('zip').setErrors({ outsideUsa: true });
          }
        } else {
          this.personalInfoForm.get('zip').setErrors({ invalidzipCode: true });
        }
      });
  }

  onOptionSelect(option: GoogleAutocompletePrediction) {
    this.googleMapService
      .getGoogleCityStateZipCode(option.description)
      .subscribe((response: GoogleCityStateZipObject) => {
        const address = this.personalInfoForm.get('address').value.split(',');
        if (address[0]) {
          this.personalInfoForm.get('address').patchValue(address[0]);
        }
        if (response.city) {
          this.personalInfoForm.get('city').patchValue(response.city);
        }
        if (response.state) {
          const isInUSA = !!this.states.filter(state => state.value === response.state).length;
          if (isInUSA) {
            this.personalInfoForm.get('state').patchValue(response.state);
          } else {
            this.personalInfoForm.get('state').patchValue(null);
            this.personalInfoForm.get('zip').setErrors({ outsideUsa: true });
          }
        }
        if (response.zip) {
          this.personalInfoForm.get('zip').patchValue(response.zip);
        }
      });

    // Unfocus the search input after matAutoComplete auto-refocuses on the input.
    // This will hide the keyboard on mobile.
    setTimeout(() => {
      this.searchInput.nativeElement.blur();
    }, 500);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToNext() {
    // Save personalInformation and navigate to insurance page if yes else success page
    this.loading = true;
    const provideInsurance = this.personalInfoForm.get('insuranceCheck').value;
    const formValue = this.personalInfoForm.value;
    this.echeckinDataService.setPersonalInformation(formValue);
    const paramas = {
      demographics: {
        firstName: this.personalInfoForm.get('firstName').value,
        gender: this.personalInfoForm.get('gender').value,
        address: this.personalInfoForm.get('address').value,
        address2: this.personalInfoForm.get('address2').value,
        city: this.personalInfoForm.get('city').value,
        state: this.personalInfoForm.get('state').value,
        zip: this.personalInfoForm.get('zip').value,
      },
      insuranceQR: {
        insuranceOptOut: true ? provideInsurance === 'false' : false
      }
    };
    this.echeckinService.saveEncounter(paramas).subscribe(res => {
      this.loading = false;
      const result = res;
      if (provideInsurance === 'true') {
        this.router.navigate(['/echeckin/as-echeckin-insurance-information']);
      } else if (provideInsurance === 'false') {
        this.router.navigate(['/echeckin/as-echeckin-confirmation']);
      }
    },
      error => { }
    );
  }
}
