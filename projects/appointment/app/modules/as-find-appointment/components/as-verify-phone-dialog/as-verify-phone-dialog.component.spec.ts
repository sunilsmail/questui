import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { DataService } from 'shared/services/data.service';
import { FindAppointmentService } from 'shared/services/find-appointment.service';
import { PropertiesService } from 'shared/services/properties.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockFindAppointmentService } from 'shared/specs/mocks/mock-find-appointment';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsCancelAppointmentDialogComponent } from '../as-cancel-appointment-dialog/as-cancel-appointment-dialog.component';
import { AsVerifyPhoneDialogComponent } from './as-verify-phone-dialog.component';

const mockMatDialogRef = {
  updateSize: (size: string) => { },
  close: () => { },
  open: () => { }
};

describe('AsVerifyPhoneDialogComponent', () => {
  let component: AsVerifyPhoneDialogComponent;
  let fixture: ComponentFixture<AsVerifyPhoneDialogComponent>;
  let router: Router;
  let findAppointmentService: FindAppointmentService;
  let dataService: DataService;
  let propertiesService: PropertiesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsVerifyPhoneDialogComponent, AsCancelAppointmentDialogComponent],
      imports: [BrowserAnimationsModule, MatDialogModule, MockI18nModule,
        ReactiveFormsModule,
        FormsModule,
        CustomPipesModule,
        RouterTestingModule,
        HttpClientTestingModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MatDialogRef, useValue: mockMatDialogRef },
      { provide: FindAppointmentService, useClass: MockFindAppointmentService },
      { provide: DataService, useClass: MockDataService },
      { provide: PropertiesService, useClass: MockPropertiesService }
    ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [AsCancelAppointmentDialogComponent],
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    dataService = TestBed.inject(DataService);
    propertiesService = TestBed.inject(PropertiesService);
    fixture = TestBed.createComponent(AsVerifyPhoneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    findAppointmentService = TestBed.inject(FindAppointmentService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('#ngOnInit', () => {
    it('set the form to be invalid if the phoneNumber is invalid', () => {
      component.verifyPhoneNumber.get('phoneNumber').setValue('');
      expect(component.verifyPhoneNumber.get('phoneNumber').invalid).toBeTruthy();
    });
    it('set the form to be valid if the phoneNumber code is valid', () => {
      component.verifyPhoneNumber.get('phoneNumber').setValue('2234567890');
      expect(component.verifyPhoneNumber.get('phoneNumber').invalid).toBeFalsy();
    });
  });
  describe('#verifyIdentityUser', () => {
    const mockObject = {
      'confirmationCode': 'asdfg',
      'phone': '1234567890'
    };
  });
  describe('onKeyup()', () => {
    it('should add - after three digit is entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('input')).nativeElement;
      phoneElement.value = '908';
      component.onKeyup(event, phoneElement);
      expect(phoneElement.value).toEqual('908-');
    });
    it('should not add not check phone length if there no value.', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('input')).nativeElement;
      phoneElement.value = '';
      component.onKeyup(event, phoneElement);
      expect(phoneElement.value).toEqual('');
    });
    it('should not enter - if already entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('input')).nativeElement;
      phoneElement.value = '908-';
      component.onKeyup(event, phoneElement);
      expect(phoneElement.value).toEqual('908-');
    });

    it('should add - if 7 characters are entered', () => {
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('input')).nativeElement;
      phoneElement.value = '908-332';
      component.onKeyup(event, phoneElement);
      expect(phoneElement.value).toEqual('908-332-');
    });

    it('should add set error if 11 characters are entered', () => {
      component.ngOnInit();
      fixture.detectChanges();
      const event = new KeyboardEvent('keypress', { code: 'Digit2' });
      const phoneElement = fixture.debugElement.query(By.css('input')).nativeElement;
      phoneElement.value = '856-854-85555';
      const expectedErrors = { invalidPhoneno: true };

      component.onKeyup(event, phoneElement);
      expect(component.verifyPhoneNumber.get('phoneNumber').errors).toEqual(expectedErrors);
    });
  });
  describe('#closeVerifyPhoneNumberDialog', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close').and.callThrough();
    });
    it(
      'should be called', () => {
        component.closeVerifyPhoneNumberDialog();
        expect(component.dialogRef.close).toHaveBeenCalled();
      });
  });
  describe('#onNeverMind', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close').and.callThrough();
    });
    it(
      'onNeverMind should be called', () => {
        component.onNeverMind();
        expect(component.dialogRef.close).toHaveBeenCalled();
      });
  });
  describe('#verifyIdentityUser', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close').and.callThrough();
      spyOn(component.matDialog, 'open').and.callThrough();
    });
    it(
      'should call verifyIdentityUser', () => {
        //  verifyIdentity =
        spyOn(findAppointmentService, 'verifyIdentity').and.callFake(() => {
          return of(null);
        });
        component.verifyIdentityUser({
          confirmationCode: 'string',
          phone: '9876543210',
        });
        expect(component.dialogRef.close).toHaveBeenCalled();
      });
    it(
      'should call verifyIdentityUser and open Dialog', () => {
        spyOn(findAppointmentService, 'verifyIdentity').and.callFake(() => {
          return of(null);
        });
        component.flow = 'CANCEL';
        component.verifyIdentityUser({
          confirmationCode: 'string',
          phone: '9876543210',
        });
        expect(component.matDialog.open).toHaveBeenCalled();
      });
    it(
      'should throw error on verifyIdentity if invalid phone', () => {
        spyOn(findAppointmentService, 'verifyIdentity').and.returnValue(
          throwError({ status: 404 })
        );
        component.flow = 'CANCEL';
        component.verifyIdentityUser({
          confirmationCode: 'string',
          phone: '9876543210',
        });
        expect(component.verifyPhoneNumber.get('phoneNumber').errors).toEqual({ invalidIdentityPhone: true });
      });
    it(
      'should throw error on verifyIdentity if too many attemps', () => {
        spyOn(findAppointmentService, 'verifyIdentity').and.returnValue(
          throwError({ status: 400 })
        );
        component.flow = 'CANCEL';
        component.verifyIdentityUser({
          confirmationCode: 'string',
          phone: '9876543210',
        });
        expect(component.verifyPhoneNumber.get('phoneNumber').errors).toEqual({ invalidIdentity: true });
      });
  });
});
