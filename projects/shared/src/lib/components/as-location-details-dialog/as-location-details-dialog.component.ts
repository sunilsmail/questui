import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-as-location-details-dialog',
  templateUrl: './as-location-details-dialog.component.html',
  styleUrls: ['./as-location-details-dialog.component.scss']
})
export class AsLocationDetailsDialogComponent implements OnDestroy, OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AsLocationDetailsDialogComponent>,private renderer: Renderer2,) {
    this.renderer.addClass(document.body, 'modal--location-details-dialog');
   }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'modal--location-details-dialog');
  }

  closeViewLocationDetails(): void {
    this.dialogRef.close(true);
   }

}
