import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ClinicalTrailsStatus } from 'shared/models/clinical-trails';
import { ClinicalTrailsService } from 'shared/services/clinical-trails/clinical-trails.service';
import { DataService } from 'shared/services/data.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockClinicalTrailsService } from 'shared/specs/mocks/mock-clinical-trails-service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { AsClinicalTrailsComponent } from './as-clinical-trails.component';
import { AsCtHipaaSigninDialogComponent } from './as-ct-hipaa-signin-dialog/as-ct-hipaa-signin-dialog.component';
import { AsCtNeedMoreInfoDialogComponent } from './as-ct-need-more-info-dialog/as-ct-need-more-info-dialog.component';
import { AsCtScheduleAppointmentDialogComponent } from './as-ct-schedule-appointment-dialog/as-ct-schedule-appointment-dialog.component';

const mockMatDialogRef = {
  updateSize: (size: string) => { },
  close: () => { },
  open: () => { }
};

describe('AsClinicalTrailsComponent', () => {
  let component: AsClinicalTrailsComponent;
  let fixture: ComponentFixture<AsClinicalTrailsComponent>;
  let mdialog: MatDialog;
  let clinicalTrailsService: ClinicalTrailsService;
  let dataService: DataService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsClinicalTrailsComponent, AsCtScheduleAppointmentDialogComponent, AsCtNeedMoreInfoDialogComponent],
      imports: [MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        MockI18nModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: ClinicalTrailsService, useClass: MockClinicalTrailsService},
        { provide: DataService, useClass: MockDataService}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: { entryComponents: [AsCtScheduleAppointmentDialogComponent, AsCtNeedMoreInfoDialogComponent] }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsClinicalTrailsComponent);
    mdialog = TestBed.inject(MatDialog);
    clinicalTrailsService = TestBed.inject(ClinicalTrailsService);
    dataService = TestBed.inject(DataService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onInit', () => {
    beforeEach(() => {
      spyOn(clinicalTrailsService, 'getShowReview').and.returnValue(of(true));
      spyOn(clinicalTrailsService, 'getClinicalTrails').and.returnValue(of(true));
      spyOn(clinicalTrailsService, 'getDisableClinicalTrails').and.returnValue(of(true));
    });
    it('load ClinicalTrails Section', () => {
      component.ngOnInit();
      expect(clinicalTrailsService.getShowReview).toHaveBeenCalled();
      expect(clinicalTrailsService.getClinicalTrails).toHaveBeenCalled();
      expect(clinicalTrailsService.getDisableClinicalTrails).toHaveBeenCalled();
    });
    it('hide ClinicalTrails Section, in modify appointment flow', () => {
      let result;
      dataService.isModifyCancel = true;
      component.ngOnInit();
      expect(clinicalTrailsService.getShowReview).toHaveBeenCalled();
      expect(clinicalTrailsService.getClinicalTrails).toHaveBeenCalled();
      expect(clinicalTrailsService.getDisableClinicalTrails).toHaveBeenCalled();
      component.enableClinicalTrails$.subscribe((value) => {
        result = value;
      });
      expect(result).toBeFalsy();
    });
    it('hide ClinicalTrails Section, in authEdit flow', () => {
      let result;
      dataService.isModifyCancel = false;
      component.isAuthEdit = true;
      component.ngOnInit();
      expect(clinicalTrailsService.getShowReview).toHaveBeenCalled();
      expect(clinicalTrailsService.getClinicalTrails).toHaveBeenCalled();
      expect(clinicalTrailsService.getDisableClinicalTrails).toHaveBeenCalled();
      component.enableClinicalTrails$.subscribe((value) => {
        result = value;
      });
      expect(result).toBeFalsy();
    });
  });

  describe('#openReviewDialog', () => {
    beforeEach(() => {
      spyOn(mdialog, 'open').and.callThrough();
    });
    it('should open Review HIPPA Sign-in dialog', () => {
      component.openReviewDialog();
      expect(mdialog.open).toHaveBeenCalledWith(AsCtHipaaSigninDialogComponent, {
        panelClass: ['ds-modal', '--scroll-box', 'ds-grid--12', 'ds-elevation--L3'],
        disableClose: true,
        data: { isReview: true }
      });
    });
  });

  describe('#Review Section', () => {
    it('display clinical trails Review Section, when HIPPA Auth completed', () => {
      spyOn(clinicalTrailsService, 'getShowReview').and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('.hippa-review-section').length).toBeGreaterThanOrEqual(1);
    });
    it('hide clinical trails Review Section, when HIPPA Auth not signed', () => {
      spyOn(clinicalTrailsService, 'getShowReview').and.returnValue(of(false));
      component.ngOnInit();
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('.hippa-review-section').length).toBeLessThanOrEqual(0);
    });
  });

  describe('#open', () => {
    it('should open Schedule appointment dialog', () => {
      spyOn(mdialog, 'open').and.callThrough();
      component.open();
      expect(mdialog.open).toHaveBeenCalledWith(AsCtScheduleAppointmentDialogComponent, {
        height: 'auto', maxWidth: '100vw', disableClose: true,
      });
    });
    it('when "No" selected on schedule appt dialog, then show Need More Info dialog', () => {
      spyOn(mdialog, 'open')
        .and
        .returnValue({
          afterClosed: () => of(ClinicalTrailsStatus.no)
        } as MatDialogRef<typeof component>);
      component.open();
      expect(mdialog.open).toHaveBeenCalledWith(AsCtNeedMoreInfoDialogComponent, {
        height: 'auto', maxWidth: '100vw', disableClose: true,
      });
      expect(mdialog.open).toHaveBeenCalledTimes(2);
    });

    // it('when "Yes" selected on schedule appt dialog, then show HIPAA Sign-in dialog', () => {
    //   spyOn(mdialog, 'open')
    //     .and
    //     .returnValue({
    //       afterClosed: () => of(ClinicalTrailsStatus.yes)
    //     } as MatDialogRef<typeof component>);
    //     spyOn(clinicalTrailsService, 'signClinicalTrails').and.callFake(() => {
    //       return of (null);
    //     });
    //     component.form = new FormGroup({
    //       first_name: new FormControl('Hello'),
    //       last_name: new FormControl('World')
    //     });
    //   component.open();
    //   expect(mdialog.open).toHaveBeenCalledWith(AsCtHipaaSigninDialogComponent, {
    //     panelClass: ['ds-modal', '--scroll-box', 'ds-grid--12', 'ds-elevation--L3'],
    //     disableClose: true,
    //     data: { first_name: 'Hello', last_name: 'World', isReview: false }
    //   });
    //   expect(mdialog.open).toHaveBeenCalledTimes(2);
    // });
    it('when "X" out on schedule appt dialog, then should not open any follow-up dialog', () => {
      spyOn(mdialog, 'open')
        .and
        .returnValue({
          afterClosed: () => of(ClinicalTrailsStatus.closeDialog)
        } as MatDialogRef<typeof component>);
      component.open();
      expect(mdialog.open).toHaveBeenCalledTimes(1);
    });
  });
});
