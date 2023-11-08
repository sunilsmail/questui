import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DateService } from 'shared/services/date.service';
import { PropertiesService } from 'shared/services/properties.service';
import { UserService } from 'shared/services/user.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockUserService } from 'shared/specs/mocks/mock-user.service';
import { CustomDateValidators } from 'shared/utils/validation/date-validator';


@Component({
  template: `
    <form [formGroup]="formGroup">
      <mat-form-field class="control">
        <input matInput formControlName="control" />
        <mat-error>
          control Error
        </mat-error>
      </mat-form-field>
      <mat-form-field class="controlConfirm">
        <input matInput formControlName="controlConfirm" />
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
    this.formGroup = this.fb.group({
      control: [''],
      controlConfirm: ['']
    });
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
      declarations: [MatInputWithCustomValidatorComponent],
      providers: [
        DateService,
        { provide: UserService, useClass: MockUserService },
        { provide: PropertiesService, useClass: MockPropertiesService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatInputWithCustomValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    control = component.formGroup.get('control');
    controlEl = fixture.debugElement.query(By.css('.control')).nativeElement;
    controlConfirm = component.formGroup.get('controlConfirm');
    controlConfirmEl = fixture.debugElement.query(By.css('.controlConfirm')).nativeElement;
    dateService = TestBed.inject(DateService);
  });


  describe('#triggerValidations', () => {
    beforeEach(() => {
      formBuilder = new FormBuilder();
    });

    it('invalid chars in date field', () => {
      expect(CustomDateValidators.checkingDateFormat('01-01-2000')).toEqual(true);
    });
    it('valid chars in date field', () => {
      expect(CustomDateValidators.checkingDateFormat('01/01/2000')).toEqual(false);
    });
  });
});
