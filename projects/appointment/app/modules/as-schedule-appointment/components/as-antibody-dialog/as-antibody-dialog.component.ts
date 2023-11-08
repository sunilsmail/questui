import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'shared/services/data.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-antibody-dialog',
  templateUrl: './as-antibody-dialog.component.html',
  styleUrls: ['./as-antibody-dialog.component.scss']
})
export class AsAntibodyDialogComponent {
  content = homeContent;
  constructor(
    public dialogRef: MatDialogRef<AsAntibodyDialogComponent>,
    private router: Router,
    private dialog: MatDialog,
    private dataService: DataService
  ) {
    setTimeout(() => {
      if(document.getElementById('covid-details-close-button')){
        document.getElementById('covid-details-close-button').focus();
      }

    }, 500);
  }

  closeDialog(): void {
    this.dataService.setReasonValue(true);
    this.dialogRef.close(false);
  }

  goToNext(value): void {
    this.dialogRef.close(value);
  }
}
