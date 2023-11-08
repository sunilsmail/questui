import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'shared/services/data.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { default as homeContent } from '../../../../../assets/content.json';
import { AsGetlabsDialogComponent } from '../as-getlabs-dialog/as-getlabs-dialog.component';

@Component({
  selector: 'as-getlabs-learn-more-dialog',
  templateUrl: './as-getlabs-learn-more-dialog.component.html',
  styleUrls: ['./as-getlabs-learn-more-dialog.component.scss']
})
export class AsGetlabsLearnMoreDialogComponent implements OnInit{
  content = homeContent;
  getLabsLink: string;
  partnerName: string;

  constructor(
    public dialogRef: MatDialogRef<AsGetlabsLearnMoreDialogComponent>,
    private router: Router,
    private dialog: MatDialog,
    private dataService: DataService,
    private propertiesService: PropertiesService,
    private pscDetailsService: PscDetailsService
  ) {}
  ngOnInit() {
    this.propertiesService.getLabsLink().subscribe((res)=>{
      this.getLabsLink = res;
      this.partnerName = this.pscDetailsService.partnerName;
    });
  }
  goToOtherWebsite(): void {
    this.dialogRef.close(false);
    const dialogRef = this.dialog.open(AsGetlabsDialogComponent, {
      // panelClass: 'as-get-labs',
      autoFocus: false
    });
  }
  closeDialog(): void {
    this.dialogRef.close(false);
  }

}
