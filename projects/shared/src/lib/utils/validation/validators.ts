import { Injectable } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
// import { UserService } from 'shared/services/user.service';

export class CustomValidators {
  static match(controlName: string, controlConfirmName: string) {
    return (group: FormGroup) => {
      const control = group.get(controlName);
      const controlConfirm = group.get(controlConfirmName);
      const errors = controlConfirm.errors || {};

      if (control.value !== controlConfirm.value) {
        errors['notEqual'] = true;
        controlConfirm.setErrors(errors);
      } else {
        delete errors['notEqual'];
        controlConfirm.setErrors(Object.keys(errors).length === 0 ? null : errors);
      }
    };
  }

  static isValidMailFormat(control: FormControl) {
    const EMAIL_REGEXP = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,3}(?:\.[a-z]{2})?)$/;
    if (control.value !== '' && !EMAIL_REGEXP.test(control.value)) {
      return { requiresEmail: true };
    }

    return null;
  }

  static passwordMatch(controlName: string, controlConfirmName: string) {
    return (group: FormGroup) => {
      const control = group.get(controlName);
      const controlConfirm = group.get(controlConfirmName);
      const errors = controlConfirm.errors || {};

      if (control.value !== controlConfirm.value) {
        errors['sameAs'] = true;
        controlConfirm.setErrors(errors);
      } else {
        delete errors['sameAs'];
        controlConfirm.setErrors(Object.keys(errors).length === 0 ? null : errors);
      }
    };
  }

  static usernamePasswordMatch(controlName: string, controlConfirmName: string) {
    return (group: FormGroup) => {
      const control = group.get(controlName);
      const controlConfirm = group.get(controlConfirmName);
      const errors = controlConfirm.errors || {};

      if (control.value === controlConfirm.value) {
        errors['differentAs'] = true;
        controlConfirm.setErrors(errors);
      } else {
        delete errors['differentAs'];
        controlConfirm.setErrors(Object.keys(errors).length === 0 ? null : errors);
      }
    };
  }

  static uniqueArray(controlKey: string): ValidatorFn {
    return (formArray: FormArray): { notUnique: boolean } => {
      const checker = {};
      let error = null;
      formArray.controls.forEach(formGroup => {
        const control = formGroup.get(controlKey);
        const controlValue = control.value;
        const controlErrors = control.errors || {};

        delete controlErrors.notUnique;
        control.setErrors(Object.keys(controlErrors).length === 0 ? null : controlErrors);

        if (checker[controlValue]) {
          controlErrors.notUnique = true;
          control.setErrors(controlErrors);
          error = { notUnique: true };
        }
        checker[controlValue] = true;
      });
      return error;
    };
  }

  static atLeastOneChecked(): ValidatorFn {
    return (formGroup: FormGroup) => {
      const atLeastOneChecked = Object.keys(formGroup.controls).some(control => formGroup.controls[control].value);
      if (!atLeastOneChecked) {
        return { noneChecked: !atLeastOneChecked };
      }
      return null;
    };
  }

  static isEncoded(): ValidatorFn {
    return (formControl: FormControl) => {
      return formControl.value ? null : { encodedError: true };
    };
  }

  static hasNumber(): ValidatorFn {
    return (formControl: FormControl) => {
      if (formControl.value) {
        const matches = formControl.value.match(/\d+/g);
        return matches ? null : { requiresNumber: true };
      }
      return null;
    };
  }

  static hasNumberOrSpecialCharacter(): ValidatorFn {
    return (formControl: FormControl) => {
      if (formControl.value) {
        const matches = formControl.value.match(/\d+/g);
        const regex = /^[A-Za-z0-9 ]+$/;
        const containsSpecial = !regex.test(formControl.value);
        return matches || containsSpecial ? null : { requiresNumberOrSpecial: true };
      }
      return null;
    };
  }

  static hasAlpha(): ValidatorFn {
    return (formControl: FormControl) => {
      if (formControl.value) {
        const matches = formControl.value.match(/[a-zA-Z]+/g);
        return matches ? null : { requiresAlpha: true };
      }
      return null;
    };
  }

  static maxFileSize(fileSizeAllowed: number): ValidatorFn {
    return (formControl: FormControl) => {
      const file: File = formControl.value;
      return file.size <= fileSizeAllowed ? null : { fileSizeInBytes: fileSizeAllowed };
    };
  }

  static allowedFileTypes(allowedFileTypes: string[]): ValidatorFn {
    return (formControl: FormControl) => {
      const file: File = formControl.value;
      const ext = file.name
        .split('.')
        .pop()
        .toLowerCase();
      const allowed = allowedFileTypes.map(value => value.toLowerCase()).includes(ext);
      return allowed ? null : { validFileTypes: allowedFileTypes };
    };
  }

  // static invalidUsername(userService: UserService): AsyncValidatorFn {
  //   return (control: AbstractControl) => {
  //     return userService
  //       .usernameAvailable(control.value)
  //       .pipe(map(available => (available ? { invalidUsername: available } : null)));
  //   };
  // }

  // static availableUsername(userService: UserService): AsyncValidatorFn {
  //   return (control: AbstractControl) => {
  //     return userService
  //       .usernameAvailable(control.value)
  //       .pipe(map(available => (available ? null : { nameTaken: true })));
  //   };
  // }


  static coppaMinAge() {
    return this.dobMinimumAge(13, 'coppaMinAge','matDatepickerMax');
  }

  static dobMinimumAge(age: number, errorKey: string = 'dobMinimumAge',errorKey1: string = 'matDatepickerMax'): ValidatorFn {
    return (formControl: FormControl) => {
      const selectedDate = new Date(formControl.value);
      const maxDate: Date = new Date();
      maxDate.setFullYear(new Date().getFullYear() - age);

      if (selectedDate > new Date()) {
        return { [errorKey1]: age };
      }
      if (selectedDate > maxDate) {
        return { [errorKey]: age };
      }
      // return selectedDate < maxDate ? null : { [errorKey]: age };
    };
  }


  static requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let checked = 0;

      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];

        if (control.value === true) {
          checked++;
        }
      });

      if (checked < minRequired) {
        return {
          requireCheckboxesToBeChecked: true,
        };
      }

      return null;
    };
  }
  static daysInMonth(month, year) {
    // m is 0 indexed: 0-11
    switch (month) {
      case 1:
        return (year % 4 === 0 && year % 100) || year % 400 === 0 ? 29 : 28;
      case 8:
      case 3:
      case 5:
      case 10:
        return 30;
      default:
        return 31;
    }
  }

  static isValid(month, day, year) {
    return month >= 0 && month < 12 && day > 0 && day <= this.daysInMonth(month, year);
  }
  static dobMinimumAgeAndValidations(
    age: number,
    minDateValue: any,
    maxDateValue: any,
    errorKey: string = 'dobMinimumAge',
    errorKey1: string = 'matDatepickerMax'
  ): ValidatorFn {
    return (formControl: FormControl) => {
      const letters = /^[0-9/]+$/;
      const selectedMinDate = new Date(minDateValue);
      const maxDateCopAge: Date = new Date();
      let controlValue = formControl.value;

      // checking for characters
      if (!String(controlValue).match(letters)) {
        return { invalidDateNew: true };
      }

      // to handle copy paste text
      if (controlValue.indexOf('/') === -1 && controlValue.length === 8) {
        controlValue = `${controlValue.substr(0, 2)}/${controlValue.substr(2, 2)}/${controlValue.substr(4, 4)}`;
      } else if (controlValue.indexOf('/') === -1 && controlValue.length === 6) {
        controlValue = `0${controlValue.substr(0, 1)}/0${controlValue.substr(1, 1)}/${controlValue.substr(2, 4)}`;
      } else if (controlValue.indexOf('/') === -1 && controlValue.length === 7) {
        controlValue = `0${controlValue.substr(0, 1)}/${controlValue.substr(1, 2)}/${controlValue.substr(3, 4)}`;
      } else if (controlValue.indexOf('/') === -1 && controlValue.length > 3 && controlValue.length <= 5) {
        return { invalidDateNew: true };
      }

      /**invalid year */

      if (controlValue && controlValue.split('/').length === 3 && controlValue.split('/')[2]) {
        if (+controlValue.split('/')[2] < selectedMinDate.getFullYear() || controlValue.split('/')[2].length < 3
        || controlValue.split('/')[2].length > 5) {
          return { invalidYear: true };
        }
      } else {
        return { invalidDateNew: true };
      }

      /** after verifying valid date string converting to date */
      const selectedDate = new Date(controlValue);
      maxDateCopAge.setFullYear(new Date().getFullYear() - age);
      // checking cop age max
      if (selectedDate > new Date()) {
        return { [errorKey1]: maxDateValue };
      }
      if (selectedDate > maxDateCopAge) {
        return { [errorKey]: age };
      }
      // checking min date.
      selectedDate.setHours(0, 0, 0, 0);
      selectedMinDate.setHours(0, 0, 0, 0);
      if (selectedDate < selectedMinDate) {
        return { invalidYear: true };
      }
      if (controlValue && controlValue.length > 0 && controlValue.split('/').length === 3) {
        if (!controlValue.split('/')[0]) {
          return { invalidDateNew: true };
        }
        if (+controlValue.split('/')[0] > 12 || +controlValue.split('/')[0] <= 0) {
          return { invalidMonth: true };
        }
      }
      if (controlValue && controlValue.length > 0 && controlValue.split('/').length === 3) {
        if (!controlValue.split('/')[1]) {
          return { invalidDateNew: true };
        }
        if (!this.isValid(+controlValue.split('/')[0] - 1, +controlValue.split('/')[1], +controlValue.split('/')[2])) {
          return { invalidDay: true };
        }
      }
    };
  }

  static dateValidations(minDate, maxDate) {
    return this.dobMinimumAgeAndValidations(0, minDate, maxDate, 'coppaMinAgeNew', 'maxDate');
  }
  // private static _checkInputAgainstRestrictions(control, restrictions, dateService: DateService) {
  //   if (
  //     restrictions.min <= dateService.getAge(control.value) &&
  //     restrictions.max >= dateService.getAge(control.value)
  //   ) {
  //     return null;
  //   } else {
  //     return { ageExcluded: true };
  //   }
  // }


  static selectSkipReason(): ValidatorFn {
    return (formControl: FormControl) => {
      if (formControl.value) {
        const value = formControl.value;
        if (+value === 0) {
          return { required: true };
        }
      }
      return null;
    };
  }

  static profileNameValidator(profileName): ValidatorFn {
    return (formControl: FormControl) => {
      if (formControl.value) {
        const value = formControl.value;
        if (value.trim().toLowerCase() !== profileName.toLowerCase()) {
          return { invalidSignature: true };
        }
      }
      return null;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class ValidateOnKeypress implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    if (control.value.length === 0 && (!control.touched || !control.dirty)) {
      return false;
    }
    return control && control.invalid && (control.dirty || control.touched);
  }
}
