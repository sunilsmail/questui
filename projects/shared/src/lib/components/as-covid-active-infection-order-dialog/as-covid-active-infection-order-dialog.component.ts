import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'shared/services/data.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { default as homeContent } from '../../../../../appointment/assets/content.json';

@Component({
  selector: 'as-covid-active-infection-order-dialog',
  templateUrl: './as-covid-active-infection-order-dialog.component.html',
  styleUrls: ['./as-covid-active-infection-order-dialog.component.scss']
})
export class AsCovidActiveInfectionOrderDialogComponent implements OnInit {

  content = homeContent;

  constructor(
    public dialogRef: MatDialogRef<AsCovidActiveInfectionOrderDialogComponent>, private router: Router,
    private dialog: MatDialog, private dataService: DataService, private eorderDataService: EorderDataService) { }

  ngOnInit() {
  }

  closeDialog(): void {
    this.dataService.setReasonValue(true);
    this.eorderDataService.setReasonValue(true);
    this.dialog.closeAll();
  }

}
