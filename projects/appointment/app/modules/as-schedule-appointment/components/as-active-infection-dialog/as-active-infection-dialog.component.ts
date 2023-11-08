import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'shared/services/data.service';
import { default as homeContent } from '../../../../../assets/content.json';
import { AsActiveInfectionOrderDialogComponent } from '../as-active-infection-order-dialog/as-active-infection-order-dialog.component';

@Component({
  selector: 'as-active-infection-dialog',
  templateUrl: './as-active-infection-dialog.component.html',
  styleUrls: ['./as-active-infection-dialog.component.scss']
})
export class AsActiveInfectionDialogComponent implements OnInit {
  content = homeContent;
  destination: string;
  constructor(
    public dialogRef: MatDialogRef<AsActiveInfectionDialogComponent>, private router: Router,
    private dialog: MatDialog, private dataService: DataService) {}

  ngOnInit() {
  }

  closeDialog(): void {
    this.dataService.setReasonValue(true);
    this.dialogRef.close(false);
  }
  continue(): void {
    this.dialogRef.close(false);
    // this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
    window.scroll(0,0);
  }

  openActiveInfectionOrderDialog() {
    const dialogRef = this.dialog.open(AsActiveInfectionOrderDialogComponent, {
      autoFocus: false,
      maxHeight:'90vh'
    });

    dialogRef.afterClosed().subscribe(() => {
      // on close do something here
    });
  }
}
