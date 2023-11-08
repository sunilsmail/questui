import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { default as homeContent } from '../../../../../appointment/assets/content.json';

@Component({
  selector: 'as-bfa-redirection-dialog',
  templateUrl: './as-bfa-redirection-dialog.component.html',
  styleUrls: ['./as-bfa-redirection-dialog.component.scss']
})
export class AsBfaRedirectionDialogComponent implements OnInit {

  content = homeContent;
  URL = 'https://My.QuestForHealth.com';

  constructor(public dialogRef: MatDialogRef<AsBfaRedirectionDialogComponent>) {}

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
