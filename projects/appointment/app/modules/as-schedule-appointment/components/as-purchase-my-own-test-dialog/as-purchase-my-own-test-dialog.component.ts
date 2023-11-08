import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ReasonCategory } from 'shared/models/reason-category';
import { DataService } from 'shared/services/data.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { default as homeContent } from '../../../../../assets/content.json';


@Component({
  selector: 'as-purchase-my-own-test-dialog',
  templateUrl: './as-purchase-my-own-test-dialog.component.html',
  styleUrls: ['./as-purchase-my-own-test-dialog.component.scss']
})
export class AsPurchaseMyOwnTestDialogComponent implements OnInit {
  content = homeContent;
  viewOfferingLink: string;
  featureFlag1421$: Observable<boolean>; // feature-flag 1421 changes
  featureFlag1421 = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReasonCategory,
    private dataService: DataService,
    public dialogRef: MatDialogRef<AsPurchaseMyOwnTestDialogComponent>,
    private propertiesService: PropertiesService,
    private pscService: PscService) {
    // adding code to implement focus on dialog close button.
    setTimeout(() => {
      if (document.getElementById('purchase-test-close-button')) {
        document.getElementById('purchase-test-close-button').focus();
      }
    }, 1000);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
    window.open(this.viewOfferingLink, '_self');
  }

  showOwnDialog(): void {
    this.pscService.isPurchaseTest = true;
    if (this.data.facilityServiceId === 26) {
      this.dataService.isMainCovidActiveInfectionSelected = true;
    } else {
      this.dataService.isMainCovidActiveInfectionSelected = false;
    }
    this.dialogRef.close(true);
  }


  closeDialog(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    this.featureFlag1421$ = this.propertiesService.getCITUpdatedLinksFeatureFlag1421()
      .pipe(tap((featureFlag1421) => {
        this.featureFlag1421 = featureFlag1421;
        this.viewOfferings();
      }));
  }
  viewOfferings() {
    if (this.data && this.data.facilityServiceId) {
      switch (this.data.facilityServiceId) {
        // "COVID-19 Antibody
        case 25: {
          if (this.featureFlag1421) {
            this.propertiesService.getviewOfferingAntiBodyLinkNewUrl().subscribe((antiBodyLink: string) => {
              this.viewOfferingLink = antiBodyLink;
            });
          } else {
            this.propertiesService.getViewOfferingAntiBodyUrl().subscribe((viewOfferingLinks: string) => {
              this.viewOfferingLink = viewOfferingLinks;
            });
          }
          break;
        }
        // COVID-19
        case 26: {
          if (this.featureFlag1421) {
            this.propertiesService.getviewOfferingCovidActiveinfectionNewUrl().subscribe((activeInfectionurl: string) => {
              this.viewOfferingLink = activeInfectionurl;
            });
          } else {
            this.propertiesService.getViewOfferingActiveInfectionUrl().subscribe((viewOfferingLinks: string) => {
              this.viewOfferingLink = viewOfferingLinks;
            });
          }
          break;
        }
        // ALL other Tests
        case 1: {
          if (this.featureFlag1421) {
            this.propertiesService.getviewOfferingAllOtherTestNewUrl().subscribe((allOtherTestsUrl: string) => {
              this.viewOfferingLink = allOtherTestsUrl;
            });
          } else {
            this.propertiesService.getViewOfferingAllOtherTestUrl().subscribe((viewOfferingLinks: string) => {
              this.viewOfferingLink = viewOfferingLinks;
            });
          }
          break;
        }
      }
    }
  }
}
