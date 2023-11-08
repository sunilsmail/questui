import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'shared/services/data.service';
import { HomeCollectionsService } from 'shared/services/home-collections/home-collections.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-getlabs-dialog',
  templateUrl: './as-getlabs-dialog.component.html',
  styleUrls: ['./as-getlabs-dialog.component.scss']
})
export class AsGetlabsDialogComponent implements OnInit {
  content = homeContent;
  getLabsLink: string;
  partnerName: string;

  constructor(
    public dialogRef: MatDialogRef<AsGetlabsDialogComponent>,
    private router: Router,
    private dialog: MatDialog,
    private dataService: DataService,
    private propertiesService: PropertiesService,
    private pscDetailsService: PscDetailsService,
    private homeCollectionsService: HomeCollectionsService,
  ) { }
  ngOnInit() {
    // this.propertiesService.getLabsLink().subscribe((res)=>{
    //   this.getLabsLink = res;
    // });
    this.getLabsLink = this.pscDetailsService.labRedirectedLink;
    this.partnerName = this.pscDetailsService.partnerName;
  }
  goToOtherWebsite(): void {
    this.dialogRef.close(false);
    this.homeCollectionsService.logGoToOtherWebsite();
    this.homeCollectionsService.saveHomeCollectionsMetrics().subscribe();
    window.open(this.getLabsLink, '_blank');
  }
  closeDialog(): void {
    this.dialogRef.close(false);
  }

}
