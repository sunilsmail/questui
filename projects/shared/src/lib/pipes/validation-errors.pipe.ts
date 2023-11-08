import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { regex } from 'shared/utils/validation/regex-patterns';

const BYTES_IN_MEGABYTE = 1000000;

@Pipe({ name: 'validationError', pure: false })
export class ValidationErrorPipe implements PipeTransform {
  private cachedMessages: any = {};
  private cachedErrors: ValidationErrors = {};
  private errorControlName = null;
  private patternMessages = {
    [regex.name]: this.i18n(`Valid characters are letters, spaces, and symbols: ,.'-`),
    [regex.questionAnswer]: this.i18n(`Valid characters are letters, numbers, spaces, and symbols: !@$^&*()_~?.`),
    [regex.zipCode]: this.i18n('Valid zip code format is 55555 or 55555-4444'),
    [regex.firstName]: this.i18n(
      'Valid characters are letters and spaces, and a hyphen (remove spaces at both start and end of name).'
    ),
    [regex.lastName]: this.i18n(
      'Valid characters include letters, spaces, and a hyphen (remove spaces at both start and end of name).​​​​​​​'
    ),
    [regex.messageText]: this.i18n(`Remove spaces and symbols at start of the message`),
    [regex.address1]: this.i18n('Valid characters are letters, numbers, spaces, and symbols: -,.#'),
    [regex.address2]: this.i18n('Valid characters are letters, numbers, spaces, and symbols: -,.#'),
    [regex.city]: this.i18n('Valid characters are letters, and symbols: -./'),
    [regex.noRandomCharacters1]: this.i18n(`Can not use the symbols: <>"'`),
    [regex.noRandomCharacters2]: this.i18n(`Can not use the symbols: ~&^_|\\`),
    [regex.alphaNumericWithRandomCharacters]: this.i18n(
      `Valid characters are letters, numbers, spaces, and symbols: -./'`
    ),
    [regex.alphaWithRandomCharacters]: this.i18n(`Valid characters are letters, spaces, and symbols: -./'`),
    [regex.phoneNumber]: this.i18n('Invalid phone number. Please re-enter'),
    [regex.ssn]: this.i18n('Must be 4 digits'),
    [regex.username]: this.i18n(`Valid characters are letters, numbers, spaces, and symbols: !@$^&*()_~?
    (remove spaces start and end)`),
    [regex.password]: this.i18n(`Valid characters are letters, numbers, spaces, and symbols: !@#$%^&*()_+<>~?`),
    [regex.directEmailAddress]: this.i18n('Valid characters are letters, numbers, and symbols: -.'),
    [regex.directEmailAddress2]: this.i18n('Can not start or end with a period or hyphen.'),
    [regex.physicianName]: this.i18n(
      'Valid characters are letters and spaces (remove spaces at both start and end of name).'
    )
  };

  constructor(private i18n: I18n, private datePipe: DatePipe) { }

  validChars(errors: AbstractControl['errors'], fieldName = 'This field'): string {
    if (!('pattern' in errors)) { return ''; }

    if (errors.pattern.requiredPattern in this.patternMessages) {
      return this.patternMessages[errors.pattern.requiredPattern];
    }

    return this.i18n(`${fieldName} contains invalid characters`);
  }

  transform(errors: ValidationErrors, fieldName?: string) {
    if (!fieldName) {
      this.errorControlName = 'This field';
    } else {
      this.errorControlName = fieldName;
    }
    if (errors !== this.cachedErrors) {
      this.cachedErrors = errors || {};

      // matDatepickerParse detects the Invalid Date.
      if (this.cachedErrors.matDatepickerParse) {
        delete this.cachedErrors.required;
        delete this.cachedErrors.matDatepickerParse;
        this.cachedErrors.invalidDate = true;
      }


      this.cachedMessages = {
        required: this.i18n(`${this.errorControlName} is required`),
        email: this.i18n(`E-Mail must be a valid email address (username@domain)`),
        maxlength: this.i18n(`The maximum length for ${this.errorControlName?.toLowerCase()} is {{maxLength}}`, {
          maxLength: 'maxlength' in this.cachedErrors ? this.cachedErrors.maxlength.requiredLength : 0
        }),
        minlength: this.i18n(`The minimum length for ${this.errorControlName?.toLowerCase()} is {{minLength}}`, {
          minLength: 'minlength' in this.cachedErrors ? this.cachedErrors.minlength.requiredLength : 0
        }),
        notEqual: this.i18n(`This field does not match`),
        pattern: this.validChars(this.cachedErrors, this.errorControlName),
        notUnique: this.i18n('Value must be unique'),
        noneChecked: this.i18n('At least one must be selected'),
        encodedError: this.i18n('There was an error reading your file, please add a new file.'),
        fileSizeInBytes: this.i18n('Max file size allowed is {{fileSize}}MB', {
          fileSize: this.cachedErrors.fileSizeInBytes ? this.cachedErrors.fileSizeInBytes / BYTES_IN_MEGABYTE : null
        }),
        validFileTypes: this.i18n('Valid file types are: {{fileTypes}}', {
          fileTypes: this.cachedErrors.validFileTypes ? this.cachedErrors.validFileTypes.join(', ') : null
        }),
        differentAs: this.i18n(`Password cannot be the same as username`),
        sameAs: this.i18n(`Password must match.`),
        invalidUsername: this.i18n('This user does not exist.'),
        matDatepickerMax: this.i18n('Date cannot be after {{maxDate}}', {
          maxDate: this.cachedErrors.matDatepickerMax
            ? this.datePipe.transform(this.cachedErrors.matDatepickerMax.max, 'MM/dd/yyyy')
            : ''
        }),
        matDatepickerMin: this.i18n('Date cannot be older than {{minDate}}', {
          minDate: this.cachedErrors.matDatepickerMin
            ? this.datePipe.transform(this.cachedErrors.matDatepickerMin.min, 'MM/dd/yyyy')
            : ''
        }),
        nameTaken: this.i18n('This username has already been taken'),
        directAddressTaken: this.i18n('This Message ID is already taken. Please pick another.'),
        requiresAlpha: this.i18n('Password requires at least one letter'),
        requiresNumber: this.i18n('Password requires at least one number'),
        requiresNumberOrSpecial: 'Password requires at least one number or special character',
        requiresEmail: this.i18n('Please provide a valid email'),
        dobMinimumAge: this.i18n('Minimum age required is {{minAge}}', {
          minAge: this.cachedErrors.dobMinimumAge ? this.cachedErrors.dobMinimumAge : 0
        }),
        coppaMinAge: this.i18n(
          `Based on the Childrens Online Protection Act of 1996 (COPPA) patients under 13 years of age cannot register.`
        ),
        ageExcluded: this.i18n('You are outside of the age requirements for one or more of your products'),
        outsideUsa: this.i18n('Location must be within the United States'),
        invalidzipCode: this.i18n('The zip code entered does not exist'),
        invalidCity: this.i18n('The zipcode does not belong to selected city'),
        invalidState: this.i18n('The zip code does not belong to the selected state.'),
        invalidPhoneno: this.i18n('Invalid phone number. Please re-enter'),
        invalidDate: this.i18n('Invalid date, Date must be in MM/dd/yyyy format.'),
        invalidconfirmationCode: this.i18n('The Confirmation code you entered does not match our records.'),
        invalidIdentity: this.i18n('Access has been locked, please wait 24 hours before trying again.'),
        invalidIdentityPhone: this.i18n('The phone number you entered does not match our records.'),
        invalidEmailorPhone: this.i18n('We did not find an appointment with your information.'),
        invalidDateNew: this.i18n('Invalid Date of Birth: Please type your date of birth as MM/DD/YYYY.'),
        invalidDateMonth: this.i18n('Invalid Date: Please type your date as MM/DD.'),
        invalidDay: this.i18n('Invalid Date of Birth: Please verify that the day is correct.'),
        invalidMonth: this.i18n('Invalid Date of Birth: Please verify that the month is correct.'),
        invalidYear: this.i18n('Invalid Date of Birth: Please verify that the year is correct.'),
        invalidSignature: this.i18n('Please enter valid name'),
        maxDate: this.i18n('Date cannot be after {{maxDate}}', {
          maxDate: this.cachedErrors.maxDate ? this.datePipe.transform(this.cachedErrors.maxDate, 'MM/dd/yyyy') : ''
        }),
        minDate: this.i18n('Date cannot be older than {{minDate}}', {
          minDate: this.cachedErrors.minDate ? this.datePipe.transform(this.cachedErrors.minDate, 'MM/dd/yyyy') : ''
        }),
      };
    }

    return this.cachedMessages[Object.keys(this.cachedErrors)[0]] || '';
  }
}
