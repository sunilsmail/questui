import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'as-location-unavailable-dialog',
  templateUrl: './as-location-unavailable-dialog.component.html',
  styleUrls: ['./as-location-unavailable-dialog.component.scss']
})
export class AsLocationUnavailableDialogComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AsLocationUnavailableDialogComponent>,
    private renderer: Renderer2) {
      dialogRef.disableClose = false;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  closePopUp() {
    this.dialogRef.close();
  }

  navigateToLocations() {
    this.dialogRef.close(true);
  }

}
