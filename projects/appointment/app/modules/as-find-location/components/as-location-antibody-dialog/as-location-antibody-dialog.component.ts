import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'shared/services/data.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-location-antibody-dialog',
  templateUrl: './as-location-antibody-dialog.component.html',
  styleUrls: ['./as-location-antibody-dialog.component.scss']
})
export class AsLocationAntibodyDialogComponent implements OnInit {
  content = homeContent;
  constructor(
    public dialogRef: MatDialogRef<AsLocationAntibodyDialogComponent>,
    private router: Router,
    private dialog: MatDialog,
    private dataService: DataService
  ) {}

  closeDialog(): void {
    this.dataService.setReasonValue(true);
    this.dialogRef.close(false);
  }

  goToNext(value): void {
    this.dialogRef.close(value);
  }

  ngOnInit() {
  }

}
