import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'shared/services/data.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-antibody-f1269-dialog',
  templateUrl: './as-antibody-f1269-dialog.component.html',
  styleUrls: ['./as-antibody-f1269-dialog.component.scss']
})
export class AsAntibodyF1269DialogComponent {
  content = homeContent;
  feature_flag_f1269_rit_aid_locations: boolean;
  constructor(
    public dialogRef: MatDialogRef<AsAntibodyF1269DialogComponent>,
    private router: Router,
    private dialog: MatDialog,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pscService: PscService
  ) {
    setTimeout(() => {
      if (document.getElementById('covid-details-close-button')) {
        document.getElementById('covid-details-close-button').focus();
      }
    }, 1000);
  }

  closeDialog(): void {
    this.dataService.setReasonValue(true);
    this.dialogRef.close(false);
  }

  goToNext(value): void {
    if (value === 'AntiBodyYes' || value === 'CovidYes') {
      this.pscService.isPurchaseTest = true;
    }
    this.dialogRef.close(value);
  }
}
