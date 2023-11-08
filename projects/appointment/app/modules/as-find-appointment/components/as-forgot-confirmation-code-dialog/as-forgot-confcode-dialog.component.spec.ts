import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { ForgotConfirmationCodeService } from 'shared/services/forgot-confcode.service';
import { I18nConstantsService } from 'shared/services/i18n-constants.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockForgotConfcodeService } from 'shared/specs/mocks/mock-forgot-confcode';
import { AsForgotConfirmationCodeDialogComponent } from './as-forgot-confcode-dialog.component';
const mockMatDialogRef = {
  updateSize: (size: string) => {},
  close: () => {}
};

describe('AsForgotConfirmationCodeDialogComponent', () => {
  let component: AsForgotConfirmationCodeDialogComponent;
  let fixture: ComponentFixture<AsForgotConfirmationCodeDialogComponent>;
  let forgotConfirmationCodeService: ForgotConfirmationCodeService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsForgotConfirmationCodeDialogComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        CustomPipesModule,
        MockI18nModule
      ],
      providers: [
        I18nConstantsService,
        Renderer2,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: ForgotConfirmationCodeService, useClass: MockForgotConfcodeService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsForgotConfirmationCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    forgotConfirmationCodeService = TestBed.inject(ForgotConfirmationCodeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('valid phone number', () => {
      component.forgotConfirmationCodeForm.get('phoneNumber').setValue('201-201-9999');
      expect(component.forgotConfirmationCodeForm.get('phoneNumber').invalid).toBeFalsy();
    });

    it('invalid phone number', () => {
      component.forgotConfirmationCodeForm.get('phoneNumber').setValue('0123456');
      expect(component.forgotConfirmationCodeForm.get('phoneNumber').invalid).toBeTruthy();
    });

    it('valid email', () => {
      component.forgotConfirmationCodeForm.get('email').setValue('admin@gmail.com');
      expect(component.forgotConfirmationCodeForm.get('email').invalid).toBeFalsy();
    });
    it('invalid email', () => {
      component.forgotConfirmationCodeForm.get('email').setValue('admin@gmail');
      expect(component.forgotConfirmationCodeForm.get('email').invalid).toBeTruthy();
    });
  });

  describe('#forgotConfirmationCode', () => {
    beforeEach(() => {
      component.ngOnInit();
      spyOn(component.matDialog, 'open');
    });
    it('forgot Confirmation Code', () => {
      component.forgotConfirmationCodeForm.get('phoneNumber').setValue('201-201-9999');
      component.forgotConfirmationCodeForm.get('email').setValue('admin@gmail.com');
      component.forgotConfirmationCode();
      expect(component.matDialog.open).toHaveBeenCalled();
    });

    it('forgot Confirmation Code error response', () => {
      component.forgotConfirmationCodeForm.get('phoneNumber').setValue('201-201-9999');
      component.forgotConfirmationCodeForm.get('email').setValue('admin@gmail.com');
      spyOn(forgotConfirmationCodeService, 'forgotConfirmationCode').and.returnValue(
        throwError({ error: { statusCode: 404 } })
      );
      component.forgotConfirmationCode();
      const expectedErrors = { invalidEmailorPhone: true };
      expect(component.forgotConfirmationCodeForm.get('phoneNumber').errors).toEqual(expectedErrors);
    });

    it('forgot Confirmation Code error response when empty phone number', () => {
      component.forgotConfirmationCodeForm.get('email').setValue('admin@gmail.com');
      spyOn(forgotConfirmationCodeService, 'forgotConfirmationCode').and.returnValue(
        throwError({ error: { statusCode: 404 } })
      );
      component.forgotConfirmationCode();
      expect(component.forgotConfirmationCodeForm.get('phoneNumber').dirty).toEqual(true);
    });

  });

  describe('#close dialog #send details', () => {
    it('onNeverMind', () => {
      spyOn(component.dialogRef, 'close');
      component.onNeverMind();
      expect(component.dialogRef.close).toHaveBeenCalled();
    });

    it('closeForgotConfCode', () => {
      spyOn(component.dialogRef, 'close');
      component.closeForgotConfCode();
      expect(component.dialogRef.close).toHaveBeenCalled();
    });

    it('disabling button when phone number is invalid', () => {
      component.forgotConfirmationCodeForm.get('phoneNumber').setValue('201-201');
      expect(component.isButtonEnabled).toEqual(false);
    });

    it('disabling button when email is invalid', () => {
      component.forgotConfirmationCodeForm.get('email').setValue('admin@gmail');
      expect(component.isButtonEnabled).toEqual(false);
    });

    it('disabling button when email is invalid and phone is valid', () => {
      component.forgotConfirmationCodeForm.get('email').setValue('admin@gmail');
      component.forgotConfirmationCodeForm.get('phoneNumber').setValue('201-201-9999');
      expect(component.isButtonEnabled).toEqual(false);
    });

    it('disabling button when email is valid and phone is invalid', () => {
      component.forgotConfirmationCodeForm.get('email').setValue('admin@gmail.com');
      component.forgotConfirmationCodeForm.get('phoneNumber').setValue('201-201');
      expect(component.isButtonEnabled).toEqual(false);
    });

    it('enable button when email is valid', () => {
      component.forgotConfirmationCodeForm.get('email').setValue('admin@gmail.com');
      expect(component.isButtonEnabled).toEqual(true);
    });

    it('enable button when email is valid', () => {
      component.forgotConfirmationCodeForm.get('phoneNumber').setValue('201-201-9999');
      expect(component.isButtonEnabled).toEqual(true);
    });

    it('enable button when email and phone are valid', () => {
      component.forgotConfirmationCodeForm.get('email').setValue('admin@gmail.com');
      component.forgotConfirmationCodeForm.get('phoneNumber').setValue('201-201-9999');
      expect(component.isButtonEnabled).toEqual(true);
    });
  });

  describe('onKeyup', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should add - after three digit is entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('#phoneNumber')).nativeElement;
      phoneElement.value = '908';
      component.onKeyup(event, phoneElement);
      expect(phoneElement.value).toEqual('908-');
    });
    it('should not enter - if already entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('#phoneNumber')).nativeElement;
      phoneElement.value = '908-';
      component.onKeyup(event, phoneElement);
      expect(phoneElement.value).toEqual('908-');
    });

    it('should add - if 7 characters are entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('#phoneNumber')).nativeElement;
      phoneElement.value = '908-332';
      component.onKeyup(event, phoneElement);
      expect(phoneElement.value).toEqual('908-332-');
    });

    it('should add set error if 11 characters are entered', () => {
      fixture.detectChanges();
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('#phoneNumber')).nativeElement;
      phoneElement.value = '856-854-8555544';
      component.onKeyup(event, phoneElement);
      const expectedErrors = { invalidPhoneno: true };
      expect(component.forgotConfirmationCodeForm.get('phoneNumber').errors).toEqual(expectedErrors);
    });
  });
});
