import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-location-finder-bfa-redirect-dialog',
  templateUrl: './as-location-finder-bfa-redirect-dialog.component.html',
  styleUrls: ['./as-location-finder-bfa-redirect-dialog.component.scss']
})
export class AsLocationFinderBfaRedirectDialogComponent implements OnInit {

  content = homeContent;
  URL = 'https://My.QuestForHealth.com';

  constructor(
    public dialogRef: MatDialogRef<AsLocationFinderBfaRedirectDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  goToOtherWebsite(): void {
    window.open(this.URL, '_blank');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}

