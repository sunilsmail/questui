import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-covid19-confirm-dialog',
  templateUrl: './as-covid19-confirm-dialog.component.html',
  styleUrls: ['./as-covid19-confirm-dialog.component.scss']
})
export class AsCovid19ConfirmDialogComponent implements OnInit {
  content = homeContent;

  constructor(
    public dialogRef: MatDialogRef<AsCovid19ConfirmDialogComponent>,
    private router: Router,
    private dialog: MatDialog,
    private skipInsuranceService: SkipInsuranceService) { }

  ngOnInit() {
    document.getElementById('covid-closebutton').focus();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  continue(): void {
    this.skipInsuranceService.setCovidReasonSelected(true);
    this.dialog.closeAll();
    this.router.navigate(['/schedule-appointment/as-active-infection-symptoms']);
    window.scrollTo(0,0);
  }



}
