import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, Observable, Subject, Subscription } from 'rxjs';
import {
  catchError, debounceTime, distinctUntilChanged, filter, map,
  mergeMap, startWith, switchMap, takeUntil, tap
} from 'rxjs/operators';
import {
  DropdownOption, GoogleAutocompletePrediction, GoogleAutocompleteResponse,
  GoogleCityStateObject, GoogleCityStateZipObject
} from 'shared/models';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { PR_State } from 'shared/utils/util';
import { regex } from 'shared/utils/validation/regex-patterns';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-eorder-address',
  templateUrl: './as-eorder-address.component.html',
  styleUrls: ['./as-eorder-address.component.scss'],
})
export class AsEorderAddressComponent implements OnInit, OnDestroy {

  options: google.maps.places.AutocompletePrediction[];
  optionsAsync$ = new Observable<google.maps.places.AutocompletePrediction[]>();
  addressForm: FormGroup;
  subscription: Subscription = new Subscription();
  delayTime: number;
  addressLoading = false;
  cityFromAPI: string;
  stateFromAPI: string;
  destroy$ = new Subject<any>();
  states = this.i18nConstants.states;
  @ViewChild('as_AddressSearchTxt') searchInput: ElementRef<any>;
  @Output() formReady = new EventEmitter<FormGroup>();
  stateResult = this.states;
  disableCityAutoComplete = true;
  content = homeContent;
  optionsCache = [];

  constructor(
    private fb: FormBuilder,
    private googleMapService: GoogleMapsService,
    private i18nConstants: I18nConstantsService,) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }

  init() {
    this.buildForm();
    this.addressAutocompleteInit();
    this.zipCodeValidationInit();
    this.stateSearchInit();
    this.formReady.emit(this.addressForm);
  }

  buildForm() {
    this.addressForm = this.fb.group({
      address1: [
        '',
        {
          validators: [Validators.required, Validators.minLength(3), Validators.maxLength(75), Validators.pattern(regex.address1)],
          updateOn: 'change'
        }
      ],
      address2: ['',
        {
          validators: [Validators.minLength(1), Validators.maxLength(75), Validators.pattern(regex.address1)],
          updateOn: 'change'
        }
      ],
      city: [
        '',
        {
          validators: [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(regex.city)],
          updateOn: 'change'
        }
      ],
      state: ['',
        {
          validators: [Validators.required, Validators.pattern(regex.state)],
          updateOn: 'change'
        }
      ],
      zipCode: [
        '',
        {
          validators: [Validators.required, Validators.minLength(5), Validators.maxLength(10), Validators.pattern(regex.zipCode)],
          updateOn: 'change'
        }
      ]
    });
  }

  addressAutocompleteInit() {
    this.optionsAsync$ = this.addressForm
      .get('address1')
      .valueChanges.pipe(
        startWith(''),
        distinctUntilChanged(),
        filter(() => !this.addressLoading),
        debounceTime(500),
        tap(() => {
          this.addressLoading = true;
        }),
        switchMap(value => {
          this.addressLoading = false;
          console.log(value);
          if (!value || (value && value.length < 3)) {
            return of([]);
          }
          else {
            this.optionsCache = [];
            return this.getFilterResult(value);
          }
        })
      );
  }

  getFilterResult(value: any) {
    return this.googleMapService.getGoogleAutocomplete(value, ['(regions)', 'address']).pipe(
      tap(() => {
        this.addressLoading = false;
      }),
      map((results: GoogleAutocompleteResponse) => {
        if (results?.predictions?.length > 0) {
          this.optionsCache = [...this.optionsCache, ...results.predictions];
        }
        return this.optionsCache;
      }),
      catchError(() => {
        this.addressLoading = false;
        return of([]);
      })
    );
  }

  zipCodeValidationInit() {
    let zip = null;
    const subZipcode = this.addressForm
      .get('zipCode')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        filter(zipCode => {
          return zipCode && zipCode?.length > 4;
        }),
        switchMap(zipCode => {
          zip = zipCode;
          if (this.addressForm.get('state').value === PR_State) {
            return this.googleMapService.getGoogleCityState(zipCode, this.addressForm.get('state').value);
          }
          return this.googleMapService.getGoogleCityState(zipCode);
        }),
        mergeMap((res) => {
          if (res && res.state) {
            return of(res);
          }
          return this.googleMapService.getGoogleCityState(zip, PR_State);
        })
      )
      .subscribe((response: GoogleCityStateObject) => {

        if (response?.state) {
          this.stateFromAPI = response.state;
        }
        if (response && response.city && response.state) {
          this.cityFromAPI = response.city;
          this.stateFromAPI = response.state;

          // region start multi cities with same zipcode checking
          if (!this.disableCityAutoComplete) {
            const cityControl = this.addressForm.get('city');
            if (cityControl.value && cityControl.value.length > 0 && response.multiCity && response.multiCity.length > 0) {
              if (response.multiCity.findIndex(item => cityControl.value.toLowerCase() === item.toLowerCase()) === -1) {
                cityControl.patchValue(response.city);
              }
            } else {
              cityControl.patchValue(response.city);
            }
          }
          // region end multi cities with same zipcode checking
          this.checkStateZipValidation(response);
        } else {
          this.addressForm.get('zipCode').setErrors({ invalidzipCode: true });
        }
      });
    this.subscription.add(subZipcode);
  }


  checkStateZipValidation(response: GoogleCityStateObject) {
    const isInUSA = !!this.states.filter(state => state.value === response?.state).length;
    if (isInUSA) {
      this.addressForm.get('state').patchValue(response.state);
    } else {
      this.addressForm.get('state').patchValue(null);
      this.addressForm.get('zipCode').setErrors({ outsideUsa: true });
    }
  }

  onOptionSelect(option: GoogleAutocompletePrediction) {
    this.googleMapService.getGoogleCityStateZipCode(option.description).subscribe((response: GoogleCityStateZipObject) => {
      this.cityFromAPI = response.city;
      this.stateFromAPI = response.state;
      const address = this.addressForm.get('address1').value.split(',');
      if (address[0]) {
        this.addressForm.get('address1').patchValue(address[0]);
      }
      if (response.city) {
        this.addressForm.get('city').patchValue(response.city);
      }
      if (response.state) {
        const isInUSA = !!this.states.filter(state => state.value === response.state).length;
        if (isInUSA) {
          this.addressForm.get('state').patchValue(response.state);
        } else {
          this.addressForm.get('state').patchValue(null);
          this.addressForm.get('zipCode').setErrors({ outsideUsa: true });
        }
      }
      if (response.zip) {
        this.addressForm.get('zipCode').patchValue(response.zip);
      }
    });

    // Unfocus the search input after matAutoComplete auto-refocuses on the input.
    // This will hide the keyboard on mobile.
    setTimeout(() => {
      this.searchInput.nativeElement.blur();
    }, 500);
  }

  updateVal(event) {
    this.addressForm.controls['state'].patchValue(event.target.value.toUpperCase());
  }

  stateSearchInit() {
    this.addressForm.get('state').valueChanges.subscribe(inputValues => {
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

  onStateselection(state) {
    const zipCodeFieldControl = this.addressForm.get('zipCode');
    if (zipCodeFieldControl && zipCodeFieldControl.value && this.stateFromAPI === state.value) {
      zipCodeFieldControl.setErrors(null);
      zipCodeFieldControl.markAsTouched({ onlySelf: true });
    } else if (state.value) {
      zipCodeFieldControl.setErrors({ invalidState: true });
      zipCodeFieldControl.markAsTouched({ onlySelf: true });
    }
  }

  onKeyup() {
    this.disableCityAutoComplete = false;
  }

}
