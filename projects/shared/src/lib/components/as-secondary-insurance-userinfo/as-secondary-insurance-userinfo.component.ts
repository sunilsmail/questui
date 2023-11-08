import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { regex } from 'shared/utils/validation/regex-patterns';
import { CustomValidators } from 'shared/utils/validation/validators';
import { default as homeContent } from '../../../../../appointment/assets/content.json';

@Component({
  selector: 'as-secondary-insurance-userinfo',
  templateUrl: './as-secondary-insurance-userinfo.component.html',
  styleUrls: ['./as-secondary-insurance-userinfo.component.scss']
})
export class AsSecondaryInsuranceUserInfoComponent implements OnInit, OnDestroy {

  @Output() formReady = new EventEmitter<FormGroup>();
  content = homeContent;
  Subscription: Subscription = new Subscription();
  relationList: any = [{ value: 'Spouse', label: 'Spouse' }, { value: 'Dependent', label: 'Dependent' }];
  form: FormGroup;
  minDate = new Date();
  maxDate = new Date();
  constructor(private fb: FormBuilder) {
  }

  buildForm() {

    const currentYear = this.minDate.getFullYear();
    this.minDate.setFullYear(currentYear - 120);
    // this.maxDate.setFullYear(currentYear - 13);

    this.form = this.fb.group({
      firstName: ['', [Validators.maxLength(75), Validators.pattern(regex.firstName), Validators.required]],
      lastName: ['', [Validators.maxLength(75), Validators.pattern(regex.lastName), Validators.required]],
      dateOfBirth: ['', [Validators.required, CustomValidators.dateValidations(this.minDate, this.maxDate)]],
      gender: ['', [Validators.required]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(12), Validators.pattern(regex.phoneNumber), Validators.required]],
      relationship: ['', [Validators.required]],
    });
  }

  ngOnDestroy() {
    if (this.Subscription) {
      this.Subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.buildForm();
    this.formReady.emit(this.form);
  }

  onkeypressphone(event: KeyboardEvent, phoneElement: HTMLInputElement) {
    const currentValue = phoneElement.value;
    if (event['keyCode'] === 8) {
      return false;
    }
    // checking phone number length
    if (currentValue) {
      const phone = currentValue.replace(/\-+/g, '');
      if (phone.length > 10) {
        this.form.get('phone').setErrors({ invalidPhoneno: true });
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
    this.form.get('dateOfBirth').patchValue(dateElement.value);
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
