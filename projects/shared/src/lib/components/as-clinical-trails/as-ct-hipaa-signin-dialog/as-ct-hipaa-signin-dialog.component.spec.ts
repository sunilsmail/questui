import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClinicalTrailsService } from 'shared/services/clinical-trails/clinical-trails.service';
import { DateService } from 'shared/services/date.service';
import { MockClinicalTrailsService } from 'shared/specs/mocks/mock-clinical-trails-service';
import { AsCtHipaaSigninDialogComponent } from './as-ct-hipaa-signin-dialog.component';

describe('AsCtHipaaSignInDialogComponent', () => {
  let component: AsCtHipaaSigninDialogComponent;
  let fixture: ComponentFixture<AsCtHipaaSigninDialogComponent>;
  let dateService: DateService;
  let clinicalTrailsService: ClinicalTrailsService;

  const mockMatDialogRef = {
    close: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule,ReactiveFormsModule],
      declarations: [ AsCtHipaaSigninDialogComponent ],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: ClinicalTrailsService, useClass: MockClinicalTrailsService }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    dateService = TestBed.inject(DateService);
    fixture = TestBed.createComponent(AsCtHipaaSigninDialogComponent);
    clinicalTrailsService = TestBed.inject(ClinicalTrailsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    beforeEach(() => {
      spyOn(component, 'buildForm').and.callThrough();
      component.ngOnInit();
    });
  });

  describe('buildform()', () => {
    beforeEach(() => {
      spyOn(dateService, 'toDateMMDDYYYY');
    });
    it('should build the form', () => {
      expect(component.consentForm.get('firstName')).toBeTruthy();
      expect(component.consentForm.get('lastName')).toBeTruthy();
      expect(component.consentForm.get('date')).toBeTruthy();
    });
    it('should set consentForm to be vaild if firstName is valid', () => {
      component.consentForm.get('firstName').setValue('James');
      expect(component.consentForm.get('firstName').invalid).toBeFalsy();
    });
    it('should set consentForm to be invaild if firstName is invalid', () => {
      component.consentForm.get('firstName').setValue('$James#');
      expect(component.consentForm.get('firstName').invalid).toBeTruthy();
    });
    it('should set consentForm to be vaild if lastName is valid', () => {
      component.consentForm.get('lastName').setValue('Rody');
      expect(component.consentForm.get('lastName').invalid).toBeFalsy();
    });
    it('should set consentForm to be invaild if lastName is invalid', () => {
      component.consentForm.get('lastName').setValue('$Rody#');
      expect(component.consentForm.get('lastName').invalid).toBeTruthy();
    });
    it('should call toDateMMDDYYYY method', () => {
      component.buildForm();
      expect(dateService.toDateMMDDYYYY).toHaveBeenCalled();
    });
    it('should set consetForm to be vaild if date is vaild', () => {
      component.consentForm.get('date').setValue('12/07/2022');
      expect(component.consentForm.get('date').invalid).toBeFalsy();
    });
  });

  describe('#closeDialog', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close');
    });
    it('closeDialog', () => {
      component.closeDialog('cancel');
      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });
});
