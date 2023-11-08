import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { FindAppointmentService } from 'shared/services/find-appointment.service';
import { PropertiesService } from 'shared/services/properties.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockFindAppointmentService } from 'shared/specs/mocks/mock-find-appointment';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsForgotConfirmationCodeDialogComponent } from '../as-forgot-confirmation-code-dialog/as-forgot-confcode-dialog.component';
import { AsFindAppointmentDialogComponent } from './as-find-appointment-dialog.component';

const mockMatDialogRef = {
  updateSize: (size: string) => {},
  close: () => {}
};

class MockRouteComponent { }
const routes = [
  { path: 'find-appointment/as-find-appointment-summary', component: MockRouteComponent }
];

describe('AsFindAppointmentDialogComponent', () => {
  let component: AsFindAppointmentDialogComponent;
  let fixture: ComponentFixture<AsFindAppointmentDialogComponent>;
  let router: Router;
  let findAppointmentService: FindAppointmentService;
  let propertiesService: PropertiesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsFindAppointmentDialogComponent, AsForgotConfirmationCodeDialogComponent],
      imports: [
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
        CustomPipesModule,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MockI18nModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: FindAppointmentService, useClass: MockFindAppointmentService },
        { provide: PropertiesService, useClass: MockPropertiesService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: { entryComponents: [AsForgotConfirmationCodeDialogComponent] }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    findAppointmentService = TestBed.inject(FindAppointmentService);
    propertiesService = TestBed.inject(PropertiesService);
    fixture = TestBed.createComponent(AsFindAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('set the form to be invalid if the conformation code is invalid', () => {
      component.findAppointment.get('confirmationCode').setValue('asd12');
      expect(component.findAppointment.get('confirmationCode').invalid).toBeTruthy();
    });
    it('set the form to be valid if the conformation code is valid', () => {
      component.findAppointment.get('confirmationCode').setValue('asdfgh');
      expect(component.findAppointment.get('confirmationCode').invalid).toBeFalsy();
    });
    it('should set validation on confirmationCode to be of min length 6', () => {
      component.findAppointment.get('confirmationCode').setValue('asdqw');
      expect(component.findAppointment.get('confirmationCode').invalid).toBeTruthy();
      component.findAppointment.get('confirmationCode').setValue('asdfghj');
      expect(component.findAppointment.get('confirmationCode').valid).toBeTruthy();
    });
  });

  describe('#onContinue', () => {
    it('user redirected to accountsummary on a valid appointment id', () => {
      const appointmentId = 'ASDFGH';
      spyOn(component.dialogRef, 'close');
      component.findAppointment.get('confirmationCode').setValue(appointmentId);
      component.onContinue(appointmentId);
      expect(component.dialogRef.close).toHaveBeenCalled();
    });

    it('user redirected to accountsummary on a valid appointment id with route', () => {
      spyOn(router, 'navigate').and.callThrough();
      const appointmentId1 = 'ASDFGH';
      component.findAppointment.get('confirmationCode').setValue(appointmentId1);
      component.onContinue(appointmentId1);
      expect(router.navigate).toHaveBeenCalledWith(['/find-appointment/as-find-appointment-summary'], {
        queryParams: { confirmationCode: appointmentId1 }
      });
    });
  });
  describe('#openForgotConfDailog', () => {
    it('openForgotConfDailog', () => {
      spyOn(component.dialogRef, 'close');
      component.openForgotConfDailog();
      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });
});
