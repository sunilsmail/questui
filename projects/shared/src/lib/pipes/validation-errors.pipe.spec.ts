import { DatePipe } from '@angular/common';
import { ValidationErrors } from '@angular/forms';
import { MockI18nService } from 'shared/specs/mocks/I18n/mock-i18n.service';
import { regex } from 'shared/utils/validation/regex-patterns';
import { ValidationErrorPipe } from './validation-errors.pipe';

describe('validationError pipe', () => {
  const validationErrorPipe = new ValidationErrorPipe(MockI18nService, new DatePipe('en'));
  let errors: ValidationErrors = {};

  it('should return an empty string if no errors are present', () => {
    errors = {};
    expect(validationErrorPipe.transform(errors)).toBe('');
  });

  it('should return a required message if a required error is present', () => {
    errors = { required: true };
    expect(validationErrorPipe.transform(errors)).toBe('This field is required');
  });

  it('should return a message with correct character count if maxlength error is present', () => {
    errors = { maxlength: { requiredLength: 30 } };
    expect(validationErrorPipe.transform(errors)).toBe('The maximum length for this field is 30');
  });

  it('should return the correct pattern message if a pattern error is present', () => {
    errors = { pattern: { requiredPattern: regex.name } };
    expect(validationErrorPipe.transform(errors)).toBe(`Valid characters are letters, spaces, and symbols: ,.'-`);
  });

  it('should return the default pattern message if a pattern error is present and is not defined', () => {
    errors = { pattern: { requiredPattern: 'test' } };
    expect(validationErrorPipe.transform(errors)).toBe(`This field contains invalid characters`);
  });

  it('should return a message with correct max date if matDatepickerMax error is present', () => {
    errors = { matDatepickerMax: { max: new Date('2018-07-08 00:00') } };
    expect(validationErrorPipe.transform(errors)).toBe('Date cannot be after 07/08/2018');
  });
});
