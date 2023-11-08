import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { ForgotConfirmationCodeService } from 'shared/services/forgot-confcode.service';
import { PropertiesService } from 'shared/services/properties.service';
import { MockForgotConfcodeService } from 'shared/specs/mocks/mock-forgot-confcode';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsForgotConfirmationCodeSuccessDialogComponent } from './as-forgot-confcode-success-dialog.component';
const mockMatDialogRef = {
  updateSize: (size: string) => {},
  close: () => {}
};

describe('AsForgotConfirmationCodeSuccessDialogComponent', () => {
  let component: AsForgotConfirmationCodeSuccessDialogComponent;
  let fixture: ComponentFixture<AsForgotConfirmationCodeSuccessDialogComponent>;
  let forgotConfirmationCodeService: ForgotConfirmationCodeService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsForgotConfirmationCodeSuccessDialogComponent],
      imports: [
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
        CustomPipesModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: ForgotConfirmationCodeService, useClass: MockForgotConfcodeService },
        { provide: PropertiesService, useClass: MockPropertiesService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsForgotConfirmationCodeSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    forgotConfirmationCodeService = TestBed.inject(ForgotConfirmationCodeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#resendConfimationCode', () => {
    it('calling resendConfimationCode', () => {
      spyOn(component.forgotConfirmationCodeService, 'resendConfimationCode').and.returnValue(of({ data: null }));
      component.resendConfimationCode();
      expect(component.forgotConfirmationCodeService.resendConfimationCode).toHaveBeenCalled();
    });
  });

  describe('#dialog close methods', () => {
    it('onNeverMind', () => {
      spyOn(component.dialogRef, 'close');
      component.onNeverMind();
      expect(component.dialogRef.close).toHaveBeenCalled();
    });

    it('closeDialog', () => {
      spyOn(component.dialogRef, 'close');
      component.closeDialog();
      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('#clickEvent methods', () => {
    it('clickEvent with not label or button', () => {
      const mockEvent = jasmine.createSpyObj('Event', ['preventDefault', 'stopPropagation']);
      component.clickEvent(mockEvent);
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
    });

    it('clickEvent for button', () => {
      const event = jasmine.createSpyObj('Event', ['preventDefault', 'stopPropagation', 'target']);
      event.target = { id: 'btnResend' };
      component.clickEvent(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('clickEvent for label click', () => {
      const event = jasmine.createSpyObj('Event', ['preventDefault', 'stopPropagation', 'target']);
      event.target = { id: 'lblResend' };
      component.clickEvent(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('clickEvent with different target id', () => {
      const event = jasmine.createSpyObj('Event', ['preventDefault', 'stopPropagation', 'target']);
      event.target = { id: 'lblResend123' };
      component.clickEvent(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
    });
  });
});
