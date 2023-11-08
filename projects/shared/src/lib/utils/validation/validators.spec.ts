import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl, FormArray,
  FormBuilder,
  FormControl,
  FormGroup, ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DateService } from 'shared/services/date.service';
import { PropertiesService } from 'shared/services/properties.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { CustomValidators, ValidateOnKeypress } from './validators';


@Component({
  template: `
    <form [formGroup]="formGroup">
      <mat-form-field class="control">
        <input matInput
            formControlName="control">
        <mat-error>
          control Error
        </mat-error>
      </mat-form-field>
      <mat-form-field class="controlConfirm">
        <input matInput
              formControlName="controlConfirm">
        <mat-error>
          controlConfirm Error
        </mat-error>
      </mat-form-field>
    </form>
  `
})
class MatInputWithCustomValidatorComponent {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group(
      {
        control: [''],
        controlConfirm: ['']
      },
      { validator: CustomValidators.match('control', 'controlConfirm') }
    );
  }
}

describe('CustomValidators', () => {
  let fixture: ComponentFixture<MatInputWithCustomValidatorComponent>;
  let component: MatInputWithCustomValidatorComponent;
  let control: AbstractControl;
  let controlConfirm: AbstractControl;
  let controlEl: HTMLElement;
  let controlConfirmEl: HTMLElement;
  let dateService: DateService;
  let formBuilder: FormBuilder;
  let group1: FormGroup;
  let error: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
      declarations: [MatInputWithCustomValidatorComponent],
      providers: [
        DateService,
        { provide: PropertiesService, useClass: MockPropertiesService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatInputWithCustomValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    formBuilder = new FormBuilder();
    control = component.formGroup.get('control');
    controlEl = fixture.debugElement.query(By.css('.control')).nativeElement;
    controlConfirm = component.formGroup.get('controlConfirm');
    controlConfirmEl = fixture.debugElement.query(By.css('.controlConfirm')).nativeElement;
    dateService = TestBed.inject(DateService);
  });

  describe('match() on a controlConfirm field', () => {
    it('should be valid before interaction', () => {
      expect(control.invalid).toBe(false, 'Expected control field to be valid');
      expect(controlConfirm.invalid).toBe(false, 'Expected controlConfirm field to be valid');
      expect(controlEl.querySelectorAll('mat-error').length).toBe(0, 'Expected no error messages on control.');
      expect(controlConfirmEl.querySelectorAll('mat-error').length).toBe(
        0,
        'Expected no error messages on controlConfirm.'
      );
    });

    it('should be valid and show no errors after touching control', () => {
      control.markAsTouched();
      fixture.detectChanges();

      expect(control.invalid).toBe(false, 'Expected control field to be valid');
      expect(controlConfirm.invalid).toBe(false, 'Expected controlConfirm field to be valid');
      expect(controlEl.querySelectorAll('mat-error').length).toBe(0, 'Expected no error messages on control.');
      expect(controlConfirmEl.querySelectorAll('mat-error').length).toBe(
        0,
        'Expected no error messages on controlConfirm.'
      );
    });

    it('should be valid and show no errors after touching controlConfirm', () => {
      controlConfirm.markAsTouched();
      fixture.detectChanges();

      expect(control.invalid).toBe(false, 'Expected control field to be valid');
      expect(controlConfirm.invalid).toBe(false, 'Expected controlConfirm field to be valid');
      expect(controlEl.querySelectorAll('mat-error').length).toBe(0, 'Expected no error messages on control.');
      expect(controlConfirmEl.querySelectorAll('mat-error').length).toBe(
        0,
        'Expected no error messages on controlConfirm.'
      );
    });

    it('should be invalid but show no errors after updating the control field', () => {
      control.patchValue('test');
      control.markAsTouched();
      fixture.detectChanges();

      expect(control.invalid).toBe(false, 'Expected control field to be valid');
      expect(controlConfirm.invalid).toBe(true, 'Expected controlConfirm field to be invalid');
      expect(controlEl.querySelectorAll('mat-error').length).toBe(0, 'Expected no error messages on control.');
      expect(controlConfirmEl.querySelectorAll('mat-error').length).toBe(
        0,
        'Expected no error messages on controlConfirm.'
      );
    });

    it('should be invalid and show an error on controlConfirm field only if inputs do not match', () => {
      control.patchValue('test');
      control.markAsTouched();
      controlConfirm.patchValue('noMatch');
      controlConfirm.markAsTouched();
      fixture.detectChanges();

      expect(control.invalid).toBe(false, 'Expected control field to be valid');
      expect(controlConfirm.invalid).toBe(true, 'Expected controlConfirm field to be invalid');
      expect(controlEl.querySelectorAll('mat-error').length).toBe(0, 'Expected no error messages on control.');
      expect(controlConfirmEl.querySelectorAll('mat-error').length).toBe(
        1,
        'Expected one error message on controlConfirm.'
      );
    });

    it('should be valid and show no errors if the inputs match', () => {
      control.patchValue('test');
      control.markAsTouched();
      controlConfirm.patchValue('test');
      controlConfirm.markAsTouched();
      fixture.detectChanges();

      expect(control.invalid).toBe(false, 'Expected control field to be valid');
      expect(controlConfirm.invalid).toBe(false, 'Expected controlConfirm field to be valid');
      expect(controlEl.querySelectorAll('mat-error').length).toBe(0, 'Expected no error messages on control.');
      expect(controlConfirmEl.querySelectorAll('mat-error').length).toBe(
        0,
        'Expected no error messages on controlConfirm.'
      );
    });

    it('should be valid and show errors if the inputs match with different cases', () => {
      control.patchValue('test');
      control.markAsTouched();
      controlConfirm.patchValue('TEST');
      controlConfirm.markAsTouched();
      fixture.detectChanges();

      expect(control.invalid).toBe(false, 'Expected control field to be valid');
      expect(controlConfirm.invalid).toBe(true, 'Expected controlConfirm field to be inValid');
      expect(controlEl.querySelectorAll('mat-error').length).toBe(0, 'Expected no error messages on control.');
      expect(controlConfirmEl.querySelectorAll('mat-error').length).toBe(
        1,
        'Expected  error messages on controlConfirm.'
      );
    });

    it('should be invalid and show an error on controlConfirm if control is modified', () => {
      control.patchValue('test');
      control.markAsTouched();
      controlConfirm.patchValue('test');
      controlConfirm.markAsTouched();
      control.patchValue('noMatch');
      fixture.detectChanges();

      expect(control.invalid).toBe(false, 'Expected control field to be valid');
      expect(controlConfirm.invalid).toBe(true, 'Expected controlConfirm field to be invalid');
      expect(controlEl.querySelectorAll('mat-error').length).toBe(0, 'Expected no error messages on control.');
      expect(controlConfirmEl.querySelectorAll('mat-error').length).toBe(
        1,
        'Expected one error message on controlConfirm.'
      );
    });
  });

  describe('#uniqueArray', () => {
    let group2: FormGroup;
    let group3: FormGroup;
    let formArray: FormArray;

    beforeEach(() => {
      formBuilder = new FormBuilder();
      group1 = formBuilder.group({ id: [''] });
      group2 = formBuilder.group({ id: [''] });
      group3 = formBuilder.group({ id: [''] });
      formArray = formBuilder.array([group1, group2, group3], CustomValidators.uniqueArray('id'));
      error = { notUnique: true };
    });

    it('adds notUnique error to the form array', () => {
      expect(formArray.errors).toEqual(error);
    });

    it('adds notUnique error to the controls with duplicate values', () => {
      expect(group1.get('id').errors).toBe(null);
      expect(group2.get('id').errors).toEqual(error);
      expect(group3.get('id').errors).toEqual(error);
    });

    describe('other control errors', () => {
      beforeEach(() => {
        group2 = formBuilder.group({ id: ['', [Validators.required]] });
        formArray = formBuilder.array([group1, group2, group3], CustomValidators.uniqueArray('id'));
      });

      it('does not overwrite other errors', () => {
        expect(Object.keys(group2.get('id').errors).length).toEqual(2);
      });
    });

    describe('when a control value is updated to a unique value', () => {
      beforeEach(() => {
        group2.get('id').patchValue('2');
      });

      it('removes the error from the control', () => {
        expect(group2.get('id').errors).toBe(null);
      });

      it('keeps the error on the duplicate control', () => {
        expect(group3.get('id').errors).toEqual(error);
      });

      it('keeps the error on the form array', () => {
        expect(formArray.errors).toEqual(error);
      });
    });

    describe('when all controls have unique values', () => {
      beforeEach(() => {
        group1.get('id').patchValue('1');
        group2.get('id').patchValue('2');
      });

      it('removes the error from all control', () => {
        expect(group1.get('id').errors).toBe(null);
        expect(group2.get('id').errors).toBe(null);
        expect(group3.get('id').errors).toBe(null);
      });

      it('removes the error from the form array', () => {
        expect(formArray.errors).toBe(null);
      });
    });
  });

  describe('#atLeastOneChecked', () => {
    beforeEach(() => {
      formBuilder = new FormBuilder();
      group1 = formBuilder.group({ cb1: [false], cb2: [false] }, { validator: CustomValidators.atLeastOneChecked() });
      error = { noneChecked: true };
    });

    it('adds noneChecked error to the form group', () => {
      expect(group1.errors).toEqual(error);
    });

    it('removes the error when a checkbox is checked', () => {
      group1.get('cb1').patchValue(true);
      expect(group1.errors).toBeNull();
    });

    it('removes the error when both checkboxes is checked', () => {
      group1.get('cb1').patchValue(true);
      group1.get('cb2').patchValue(true);
      expect(group1.errors).toBeNull();
    });
  });

  describe('#isEncoded', () => {
    it('adds encodedError error when the control is an falsy', () => {
      control = formBuilder.control('', CustomValidators.isEncoded());
      expect(control.errors).toEqual({ encodedError: true });
    });

    it('does not add encodedError error when the control is truthy', () => {
      control = formBuilder.control('encoded', CustomValidators.isEncoded());
      expect(control.errors).toBe(null);
    });
  });

  describe('#isValidMailFormat', () => {
    it('adds isValidMailFormat error when the control is an falsy', () => {
      control = formBuilder.control('quest@fdsadf', CustomValidators.isValidMailFormat);
      expect(control.errors).toEqual({ requiresEmail: true });
    });

    it('does not add isValidMailFormat error when the control is truthy', () => {
      control = formBuilder.control('encoded@quest.com', CustomValidators.isValidMailFormat);
      expect(control.errors).toBe(null);
    });
  });


  describe('#passwordMatch', () => {
    it('add passwordMatch error when the control value are different', () => {
      const fb = formBuilder.group({
        pass: ['quest'],
        pass2: ['quest2']
      }, {
        validator: CustomValidators.passwordMatch('pass', 'pass2')
      });
      expect(fb.controls.pass2.errors).toEqual({ sameAs: true });
    });
    it('doesnt add passwordMatch error when the control value are same', () => {
      const fb = formBuilder.group({
        pass: ['quest'],
        pass2: ['quest']
      }, {
        validator: CustomValidators.passwordMatch('pass', 'pass2')
      });
      expect(fb.controls.pass2.errors).toBe(null);
    });

  });

  describe('#usernamePasswordMatch', () => {
    it('add usernamePasswordMatch error when the control value are same', () => {
      const fb = formBuilder.group({
        username: ['quest'],
        password: ['quest']
      }, {
        validator: CustomValidators.usernamePasswordMatch('username', 'password')
      });
      expect(fb.controls.password.errors).toEqual({ differentAs: true });
    });
    it('doesnt add usernamePasswordMatch error when the control value are different', () => {
      const fb = formBuilder.group({
        username: ['quest'],
        password: ['quest2']
      }, {
        validator: CustomValidators.usernamePasswordMatch('username', 'password')
      });
      expect(fb.controls.password.errors).toBe(null);
    });

  });


  describe('#maxFileSize', () => {
    it('adds fileSizeInBytes error when the controls file size is greater than allowed', () => {
      const mockFile = jasmine.createSpyObj('File', ['size']);
      mockFile.size = 100;
      control = formBuilder.control(mockFile, CustomValidators.maxFileSize(50));
      expect(control.errors).toEqual({ fileSizeInBytes: 50 });
    });

    it('does not add fileSizeInBytes error when the controls file size is equal to allowed', () => {
      const mockFile = jasmine.createSpyObj('File', ['size']);
      mockFile.size = 50;
      control = formBuilder.control(mockFile, CustomValidators.maxFileSize(50));
      expect(control.errors).toEqual(null);
    });

    it('does not add fileSizeInBytes error when the controls file size is less than allowed', () => {
      const mockFile = jasmine.createSpyObj('File', ['size']);
      mockFile.size = 50;
      control = formBuilder.control(mockFile, CustomValidators.maxFileSize(100));
      expect(control.errors).toEqual(null);
    });
  });

  describe('#allowedFileTypes', () => {
    it('adds validFileTypes error when the controls file type is not allowed', () => {
      const mockFile = jasmine.createSpyObj('File', ['name']);
      mockFile.name = 'invalid.type';
      control = formBuilder.control(mockFile, CustomValidators.allowedFileTypes(['pdf']));
      expect(control.errors).toEqual({ validFileTypes: ['pdf'] });
    });

    it('does not add validFileTypes error when the controls file type is allowed', () => {
      const mockFile = jasmine.createSpyObj('File', ['name']);
      mockFile.name = 'invalid.pdf';
      control = formBuilder.control(mockFile, CustomValidators.allowedFileTypes(['pdf']));
      expect(control.errors).toEqual(null);
    });

    it('matches case insensitively ', () => {
      const mockFile = jasmine.createSpyObj('File', ['name']);
      mockFile.name = 'invalid.pDf';
      control = formBuilder.control(mockFile, CustomValidators.allowedFileTypes(['PdF']));
      expect(control.errors).toEqual(null);
    });
  });

  describe('#hasNumber', () => {
    it('returns validation error if there is no number in the string', () => {
      control = formBuilder.control('nonumber', CustomValidators.hasNumber());
      expect(control.errors).toEqual({ requiresNumber: true });
    });

    it('does not return an error if there is a number in the string', () => {
      control = formBuilder.control('hasnumber3', CustomValidators.hasNumber());
      expect(control.errors).toBe(null);
    });

    it('does not return an error if there is no value', () => {
      control = formBuilder.control('', CustomValidators.hasNumber());
      expect(control.errors).toBe(null);
    });
  });

  describe('#hasNumberOrSpecialCharacter', () => {
    it('returns validation error if there is no number in the string', () => {
      control = formBuilder.control('nonumber', CustomValidators.hasNumberOrSpecialCharacter());
      expect(control.errors).toEqual({ requiresNumberOrSpecial: true });
    });

    it('does not return an error if there is a number in the string', () => {
      control = formBuilder.control('hasnumber3$', CustomValidators.hasNumberOrSpecialCharacter());
      expect(control.errors).toBe(null);
    });

    it('does not return an error if there is a no value', () => {
      control = formBuilder.control('', CustomValidators.hasNumberOrSpecialCharacter());
      expect(control.errors).toBe(null);
    });
  });

  describe('#hasAlpha', () => {
    it('returns validation error if there are no letters in the string', () => {
      control = formBuilder.control('12345678', CustomValidators.hasAlpha());
      expect(control.errors).toEqual({ requiresAlpha: true });
    });

    it('does not return an error if there is a number in the string', () => {
      control = formBuilder.control('thishasletters', CustomValidators.hasAlpha());
      expect(control.errors).toBe(null);
    });
    it('does not return an error if there is no value', () => {
      control = formBuilder.control('', CustomValidators.hasAlpha());
      expect(control.errors).toBe(null);
    });
  });

  describe('#coppaMinAge', () => {
    it('adds coppaMinAge error when the control is invalid', () => {
      control = formBuilder.control(new Date(), CustomValidators.coppaMinAge());
      expect(control.errors).toEqual({ coppaMinAge: 13 });
    });

    it('does not add coppaMinAge error when the control is valid', () => {
      control = formBuilder.control(
        'Mon Jan 24 2000 00:00:00 GMT-0800 (Pacific Standard Time)',
        CustomValidators.coppaMinAge()
      );
      expect(control.errors).toBe(undefined);
    });
  });

  describe('#dobMinimumAge', () => {
    it('adds dobMinimumAge error when the control is invalid', () => {
      control = formBuilder.control(new Date(), CustomValidators.dobMinimumAge(21));
      expect(control.errors).toEqual({ dobMinimumAge: 21 });
    });

    it('does not add dobMinimumAge error when the control is valid', () => {
      control = formBuilder.control(
        'Mon Jan 24 2000 00:00:00 GMT-0800 (Pacific Standard Time)',
        CustomValidators.dobMinimumAge(13)
      );
      expect(control.errors).toBe(undefined);
    });
  });

});

describe('Error State Matchers', () => {
  describe('ValidateOnKeypress', () => {
    let errorStateMatcher: ValidateOnKeypress;
    const pristine: FormControl = {
      invalid: true,
      dirty: false,
      touched: false,
      value: ''
    } as FormControl;

    beforeEach(() => {
      errorStateMatcher = TestBed.inject(ValidateOnKeypress);
    });

    it('does not reflect error state if invalid control is pristine', () => {
      const control = { ...pristine } as FormControl;
      const result = errorStateMatcher.isErrorState(control);
      expect(result).toBe(false);
    });

    it('reflects error state if invalid control is touched', () => {
      const control = { ...pristine, touched: true, dirty: true } as FormControl;
      const result = errorStateMatcher.isErrorState(control);
      expect(result).toBe(true);
    });
  });
});
