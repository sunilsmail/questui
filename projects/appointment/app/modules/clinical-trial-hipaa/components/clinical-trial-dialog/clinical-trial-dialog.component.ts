import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'clinical-trial-dialog',
  templateUrl: './clinical-trial-dialog.component.html',
  styleUrls: ['./clinical-trial-dialog.component.scss']
})
export class ClinicalTrialDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ClinicalTrialDialogComponent>) { }

  ngOnInit(): void {
  }

  nevigateToAccount() {
    window.location.href = this.data.redirectUrl;
  }

}
