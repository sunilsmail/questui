import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClinicalTrailsService } from 'shared/services/clinical-trails/clinical-trails.service';
import { MockClinicalTrailsService } from 'shared/specs/mocks/mock-clinical-trails-service';

import { AsCtScheduleAppointmentDialogComponent } from './as-ct-schedule-appointment-dialog.component';

describe('AsCtScheduleAppointmentDialogComponent', () => {
  let component: AsCtScheduleAppointmentDialogComponent;
  let fixture: ComponentFixture<AsCtScheduleAppointmentDialogComponent>;
  let clinicalTrailsService: ClinicalTrailsService;

  const mockMatDialogRef = {
    close: () => { }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [AsCtScheduleAppointmentDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: ClinicalTrailsService, useClass: MockClinicalTrailsService },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsCtScheduleAppointmentDialogComponent);
    clinicalTrailsService = TestBed.inject(ClinicalTrailsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#goToNext', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close');
    });
    it('goToNext', () => {
      component.goToNext('Yes');
      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('#closeDialog', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close');
    });
    it('closeDialog', () => {
      component.closeDialog();
      expect(component.dialogRef.close).toHaveBeenCalledWith('closeDialog');
    });
  });
});
