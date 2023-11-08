import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'shared/services/data.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { default as homeContent } from '../../../../../appointment/assets/content.json';

@Component({
  selector: 'as-covid-antibody-dialog',
  templateUrl: './as-covid-antibody-dialog.component.html',
  styleUrls: ['./as-covid-antibody-dialog.component.scss']
})
export class AsCovidAntibodyDialogComponent {

  content = homeContent;
  constructor(
    public dialogRef: MatDialogRef<AsCovidAntibodyDialogComponent>,
    private router: Router,
    private dialog: MatDialog,
    private dataService: DataService,
    private eorderDataService: EorderDataService
  ) {}

  closeDialog(): void {
    this.dataService.setReasonValue(true);
    this.eorderDataService.setReasonValue(true);
    this.dialogRef.close(false);
  }

  goToNext(value): void {
    this.dialogRef.close(value);
  }

}
