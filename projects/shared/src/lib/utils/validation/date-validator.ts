import { FormControl, ValidatorFn } from '@angular/forms';
import { DateService } from 'shared/services/date.service';

export class CustomDateValidators {
  private static _checkInputAgainstRestrictions(control, restrictions, dateService: DateService) {
    return this.triggerValidations(control, restrictions, dateService);
  }

  static generalValidations(): ValidatorFn {
    return (control: FormControl) => {
      return this.triggerValidations(control, null, null, false);
    };
  }

  static triggerValidations(control, restrictions, dateService: DateService, includeAgeRestrictions: boolean = true) {
    let controlValue: string = control.value;

    if (controlValue && controlValue.indexOf('/') === -1 && controlValue.length === 8) {
      // 01012000
      controlValue = `${controlValue.substr(0, 2)}/${controlValue.substr(2, 2)}/${controlValue.substr(4, 4)}`;
    }

    if (this.checkingDateFormat(controlValue)) {
      return { invalidDateNew: true };
    } else if (this.checkInvalidMonth(controlValue)) {
      return this.checkInvalidMonth(controlValue);
    } else if (this.checkInvalidDay(controlValue)) {
      return this.checkInvalidDay(controlValue);
    } else if (this.checkInvalidYear(controlValue)) {
      return this.checkInvalidYear(controlValue);
    } else if (this.checkMinMaxYearDay(controlValue)) {
      return this.checkMinMaxYearDay(controlValue);
    } else if (
      includeAgeRestrictions &&
      this.checkCartProductMinMaxValidation(controlValue, restrictions, dateService)
    ) {
      return this.checkCartProductMinMaxValidation(controlValue, restrictions, dateService);
    }
  }

  static checkingDateFormat(controlValue: string) {
    const letters = /^[0-9/]+$/;
    return !String(controlValue).match(letters);
  }

  static checkInvalidYear(controlValue: string) {
    const minDate = new Date();
    const currentYear = minDate.getFullYear();
    minDate.setFullYear(currentYear - 120);
    if (
      controlValue.split('/').length === 3 &&
      (+controlValue.split('/')[2] < minDate.getFullYear() || controlValue.split('/')[2].length < 3)
    ) {
      return { invalidYear: true };
    }
  }

  static checkInvalidMonth(controlValue: string, isMMDD: boolean = false) {
    if (+controlValue.split('/')[0] > 12 || +controlValue.split('/')[0] <= 0) {
      if (isMMDD) {
        return { invalidDateMonth: true };
      } else {
        return { invalidMonth: true };
      }
    }
  }

  static checkInvalidDay(controlValue: string, isMMDD: boolean = false) {
    if (!isMMDD) {
      if (!this.isValid(+controlValue.split('/')[0] - 1, +controlValue.split('/')[1], +controlValue.split('/')[2])) {
        return { invalidDay: true };
      }
    } else {
      if (!this.isValid(+controlValue.split('/')[0] - 1, +controlValue.split('/')[1], + new Date().getFullYear())) {
        return { invalidDateMonth: true };
      }
    }
  }

  static checkMinMaxYearDay(controlValue: string) {
    const selectedDate = new Date(controlValue);
    const minDate = new Date();
    const currentYear = minDate.getFullYear();
    minDate.setFullYear(currentYear - 120);
    if (selectedDate > new Date()) {
      return { maxDate: new Date() };
    }
    if (selectedDate < minDate) {
      return { minDate: minDate };
    }
  }

  static checkCartProductMinMaxValidation(controlValue, restrictions, dateService: DateService) {
    if (restrictions.min <= dateService.getAge(controlValue) && restrictions.max >= dateService.getAge(controlValue)) {
      return null;
    } else {
      return { ageExcluded: true };
    }
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
  static generalDDMMValidations(): ValidatorFn {
    return (control: FormControl) => {
      return this.triggerDDMMValidations(control, null, null, false);
    };
  }

  static triggerDDMMValidations(control, restrictions, dateService: DateService, includeAgeRestrictions: boolean = true) {
    let controlValue: string = control.value;

    if (controlValue && controlValue.indexOf('/') === -1 && controlValue.length === 4) {
      // 01012000
      controlValue = `${controlValue.substr(0, 2)}/${controlValue.substr(2, 2)}`;
    }

    if (this.checkingDateFormat(controlValue)) {
      return { invalidDateMonth: true };
    } else if (this.checkInvalidMonth(controlValue,true)) {
      return this.checkInvalidMonth(controlValue,true);
    } else if (this.checkInvalidDay(controlValue,true)) {
      return this.checkInvalidDay(controlValue,true);
    }
  }

}
