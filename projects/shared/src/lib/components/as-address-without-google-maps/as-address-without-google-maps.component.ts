import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import {
  DropdownOption
} from 'shared/models';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { LocationService } from 'shared/services/maps/location-service';
import { regex } from 'shared/utils/validation/regex-patterns';
import { default as homeContent } from '../../../../../appointment/assets/content.json';

@Component({
  selector: 'as-address-without-google-maps',
  templateUrl: './as-address-without-google-maps.component.html',
  styleUrls: ['./as-address-without-google-maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsAddressWithoutGoogleMapsComponent implements OnInit, OnDestroy, OnChanges {

  addressForm: FormGroup;
  subscription: Subscription = new Subscription();
  destroy$ = new Subject<any>();
  states = this.i18nConstants.states;
  @Output() formReady = new EventEmitter<FormGroup>();
  stateResult = this.states;
  content = homeContent;
  @Input() detectChange = null;

  constructor(
    private fb: FormBuilder,
    private i18nConstants: I18nConstantsService,
    private locationService: LocationService,
    private cd: ChangeDetectorRef) { }

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
    setTimeout(() => {
      this.formReady.emit(this.addressForm);
    }, 500);
  }

  ngOnChanges(): void {
    this.cd.detectChanges();
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
    this.zipCodeValidationInit();
    this.stateSearchInit();
  }

  zipCodeValidationInit() {
    const subZipcode = this.addressForm
      .get('zipCode')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        filter(zipCode => {
          return zipCode && zipCode.length > 4;
        })
      ).subscribe((zipCode: string) => {
        if (this.addressForm.get('zipCode').invalid) {
          return false;
        }
        const loc = this.locationService.getStateByZip(zipCode.substring(0, 5));
        if (loc?.length > 0) {
          const isInUSA = !!this.states.filter(state => state.value === loc[0].state_id).length;
          if (isInUSA) {
            this.addressForm.get('state').patchValue(loc[0].state_id);
          } else {
            this.addressForm.get('state').patchValue(null);
            this.addressForm.get('zipCode').setErrors({ outsideUsa: true });
          }
        } else {
          this.addressForm.get('zipCode').setErrors(null);
          this.addressForm.get('zipCode').setErrors({ invalidzipCode: true });
          this.cd.detectChanges();
        }
      });
    this.subscription.add(subZipcode);
  }


  updateVal(event) {
    this.addressForm.controls['state'].patchValue(event.target.value.toUpperCase());
  }

  stateSearchInit() {
    this.addressForm.get('state').valueChanges.subscribe(inputValues => {
      if (inputValues && inputValues.length > 0) {
        this.stateResult = this.states.filter((el: DropdownOption) => {
          inputValues = inputValues.toLowerCase();
          if (el.label?.toLowerCase()?.substr(0, inputValues.length) === inputValues) {
            return true;
          } else {
            return false;
          }
        });
      } else {
        this.stateResult = this.states;
      }
      if (inputValues && inputValues.length === 2) {
        this.onStateselection(this.addressForm.get('state'));
      }
    });
  }

  onStateselection(state) {
    const zipCodeFieldControl = this.addressForm.get('zipCode');
    if (zipCodeFieldControl
      && zipCodeFieldControl.value?.substring(0, 5)
      && this.locationService.getCheckZipByState(zipCodeFieldControl.value?.substring(0, 5), state.value)) {
      zipCodeFieldControl.setErrors(null);
      zipCodeFieldControl.markAsTouched({ onlySelf: true });
    } else if (state.value && zipCodeFieldControl.value?.substring(0, 5) && zipCodeFieldControl.valid) {
      zipCodeFieldControl.setErrors({ invalidState: true });
      zipCodeFieldControl.markAsTouched({ onlySelf: true });
    }
  }

}
