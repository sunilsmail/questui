import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'as-active-infection-common-info-dialog',
  templateUrl: './as-active-infection-common-info-dialog.component.html',
  styleUrls: ['./as-active-infection-common-info-dialog.component.scss']
})
export class AsActiveInfectionCommonInfoDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AsActiveInfectionCommonInfoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data ) {}

  ngOnInit() {
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
