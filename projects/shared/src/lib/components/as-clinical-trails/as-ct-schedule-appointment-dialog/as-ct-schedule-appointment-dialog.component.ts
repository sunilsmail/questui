import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClinicalTrailsStatus } from 'shared/models/clinical-trails';
import { ClinicalTrailsService } from 'shared/services/clinical-trails/clinical-trails.service';
import { default as homeContent } from '../../../../../../appointment/assets/content.json';

@Component({
  selector: 'as-ct-schedule-appointment-dialog',
  templateUrl: './as-ct-schedule-appointment-dialog.component.html',
  styleUrls: ['./as-ct-schedule-appointment-dialog.component.scss']
})
export class AsCtScheduleAppointmentDialogComponent {
  content = homeContent;
  dialogOptions = ClinicalTrailsStatus;
  constructor(
    public dialogRef: MatDialogRef<AsCtScheduleAppointmentDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clinicalTrailsService: ClinicalTrailsService,
  ) {
    setTimeout(() => {
      if (document.getElementById('schedule-appointment-close-button')) {
        document.getElementById('schedule-appointment-close-button').focus();
      }
    }, 1000);
  }

  closeDialog(): void {
    this.dialogRef.close(this.dialogOptions.closeDialog);
  }

  goToNext(value): void {
    if (value === this.dialogOptions.yes) {
      this.clinicalTrailsService.trackClinicalTrails.selfAppointment = true;
      this.clinicalTrailsService.trackClinicalTrails.someoneElse = false;
    }
    else if (value === this.dialogOptions.no) {
      this.clinicalTrailsService.trackClinicalTrails.someoneElse = true;
      this.clinicalTrailsService.trackClinicalTrails.selfAppointment = false;
    }
    this.dialogRef.close(value);
  }

}
