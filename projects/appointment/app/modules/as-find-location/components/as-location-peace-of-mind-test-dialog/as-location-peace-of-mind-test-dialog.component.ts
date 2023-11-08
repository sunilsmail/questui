import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-own-test-dialog',
  templateUrl: './as-location-peace-of-mind-test-dialog.component.html',
  styleUrls: ['./as-location-peace-of-mind-test-dialog.component.scss']
})
export class AsLocationPeaceOfMindTestDialogComponent implements OnInit {
  content = homeContent;
  constructor(
    public dialogRef: MatDialogRef<AsLocationPeaceOfMindTestDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  filterSlots(): void {
    this.dialogRef.close(true);
  }

  showAllSlots(): void {
    this.dialogRef.close(false);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
  }



}
