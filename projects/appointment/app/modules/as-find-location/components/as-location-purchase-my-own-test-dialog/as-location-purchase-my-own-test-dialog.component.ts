import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReasonCategory } from 'shared/models/reason-category';
import { PropertiesService } from 'shared/services/properties.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-purchase-my-own-test-dialog',
  templateUrl: './as-location-purchase-my-own-test-dialog.component.html',
  styleUrls: ['./as-location-purchase-my-own-test-dialog.component.scss']
})
export class AsLocationPurchaseMyOwnTestDialogComponent implements OnInit {
  content = homeContent;
  viewOfferingLink: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReasonCategory,
    public dialogRef: MatDialogRef<AsLocationPurchaseMyOwnTestDialogComponent>,
    private propertiesService: PropertiesService
  ) {
    // adding code to implement focus on dialog close button.
    setTimeout(() => {
      if (document.getElementById('location-purchase-test-close-button')) {
        document.getElementById('location-purchase-test-close-button').focus();
      }
    }, 1000);
   }

  onNoClick(): void {
    this.dialogRef.close(false);
    window.open(this.viewOfferingLink, '_self');
  }

  showOwnDialog(): void {
    this.dialogRef.close(true);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    this.viewOfferings();
  }
  keyboardIn(e){
    const a=document.getElementById('keyboard');
    a.classList.add('Scrollable');
  }
  keyboardOut(event){
    const a=document.getElementById('keyboard');
    a.classList.remove('Scrollable');
  }
  viewOfferings() {
    if (this.data && this.data.facilityServiceId) {
      switch (this.data.facilityServiceId) {
        // "COVID-19 Antibody
        case 25: {
          this.propertiesService.getViewOfferingAntiBodyUrl().subscribe((viewOfferingLinks: string) => {
            this.viewOfferingLink = viewOfferingLinks;
          });
          break;
        }
        // COVID-19
        case 26: {
          this.propertiesService.getViewOfferingActiveInfectionUrl().subscribe((viewOfferingLinks: string) => {
            this.viewOfferingLink = viewOfferingLinks;
          });
          break;
        }
        // ALL other Tests
        case 1: {
          this.propertiesService.getViewOfferingAllOtherTestUrl().subscribe((viewOfferingLinks: string) => {
            this.viewOfferingLink = viewOfferingLinks;
          });
          break;
        }
      }
    }
  }
}
