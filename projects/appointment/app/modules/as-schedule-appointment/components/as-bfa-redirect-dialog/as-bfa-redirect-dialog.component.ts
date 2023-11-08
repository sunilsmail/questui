import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-bfa-redirect-dialog',
  templateUrl: './as-bfa-redirect-dialog.component.html',
  styleUrls: ['./as-bfa-redirect-dialog.component.scss']
})
export class AsBfaRedirectDialogComponent implements OnInit {
  content = homeContent;
  URL = 'https://My.QuestForHealth.com';

  constructor(
    public dialogRef: MatDialogRef<AsBfaRedirectDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  goToOtherWebsite(): void {
    this.dialogRef.close();
    window.open(this.URL, '_blank');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }



}
