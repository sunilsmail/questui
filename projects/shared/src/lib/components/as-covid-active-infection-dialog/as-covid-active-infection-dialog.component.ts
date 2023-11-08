import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'shared/services/data.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { default as homeContent } from '../../../../../appointment/assets/content.json';
// tslint:disable-next-line: max-line-length
import { AsCovidActiveInfectionOrderDialogComponent } from '../as-covid-active-infection-order-dialog/as-covid-active-infection-order-dialog.component';

@Component({
  selector: 'as-covid-active-infection-dialog',
  templateUrl: './as-covid-active-infection-dialog.component.html',
  styleUrls: ['./as-covid-active-infection-dialog.component.scss']
})
export class AsCovidActiveInfectionDialogComponent implements OnInit {
  content = homeContent;
  destination: string;
  constructor(
    public dialogRef: MatDialogRef<AsCovidActiveInfectionDialogComponent>, private router: Router,
    private dialog: MatDialog, private dataService: DataService, private eorderDataService: EorderDataService) {}

  ngOnInit() {
  }

  closeDialog(): void {
    this.dataService.setReasonValue(true);
    this.eorderDataService.setReasonValue(true);
    this.dialogRef.close(false);
  }
  continue(): void {
    this.dialogRef.close('continue');
  }

  openActiveInfectionOrderDialog() {
    const dialogRef = this.dialog.open(AsCovidActiveInfectionOrderDialogComponent, {
      autoFocus: false,
      maxHeight:'90vh'
    });
  }

}
