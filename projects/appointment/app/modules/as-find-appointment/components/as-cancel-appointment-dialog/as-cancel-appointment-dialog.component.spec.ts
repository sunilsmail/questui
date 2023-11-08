import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { CancelAppointmentService } from 'shared/services/cancel-appointment.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockCancelAppointmentService } from 'shared/specs/mocks/mock-cancel-appointment.service';
// tslint:disable-next-line: max-line-length
import { AsCancelAppointmentSuccessDialogComponent } from '../as-cancel-appointment-success-dialog/as-cancel-appointment-success-dialog.component';
import { AsCancelAppointmentDialogComponent } from './as-cancel-appointment-dialog.component';

const mockMatDialogRef = {
  updateSize: (size: string) => {},
  close: () => {},
  afterClosed: () => {}
};

describe('AsCancelAppointmentDialogComponent', () => {
  let component: AsCancelAppointmentDialogComponent;
  let fixture: ComponentFixture<AsCancelAppointmentDialogComponent>;
  let router: Router;
  let cancelAppointmentService: CancelAppointmentService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsCancelAppointmentDialogComponent, AsCancelAppointmentSuccessDialogComponent],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        MatIconModule,
        HttpClientTestingModule,
        CustomPipesModule,
        MockI18nModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: CancelAppointmentService, useClass: MockCancelAppointmentService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: { entryComponents: [AsCancelAppointmentSuccessDialogComponent] }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    cancelAppointmentService = TestBed.inject(CancelAppointmentService);
    fixture = TestBed.createComponent(AsCancelAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onCancelAppointment', () => {
    const mockObject = { confirmationCode: 'ASDFGH', phone: '1324568790' };
    it('on valid confirmationCode and phone , appointment gets cancelled', () => {
      spyOn(component, 'dialogClose');
      component.onCancelAppointment();
      cancelAppointmentService.cancelAppointment(mockObject).subscribe(result => {
        expect(component.dialogClose).toHaveBeenCalled();
      });
    });
  });

  describe('#closeDialog', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close');
    });
    it('closeDialog', () => {
      component.closeDialog();
      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('#dialogClose', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'afterClosed').and.returnValue(of(null));
    });
    it('dialogClose', () => {
      component.dialogClose();
      expect(component.dialogRef.afterClosed).toHaveBeenCalled();
    });
  });

});
