import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'shared/services/data.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-active-infection-dialog',
  templateUrl: './as-active-infection-order-dialog.component.html',
  styleUrls: ['./as-active-infection-order-dialog.component.scss']
})
export class AsActiveInfectionOrderDialogComponent implements OnInit {
  content = homeContent;

  constructor(
    public dialogRef: MatDialogRef<AsActiveInfectionOrderDialogComponent>, private router: Router,
    private dialog: MatDialog, private dataService: DataService) {}

  ngOnInit() {
  }

  closeDialog(): void {
    this.dataService.setReasonValue(true);
    this.dialog.closeAll();
  }

}
