import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PropertiesService } from 'shared/services/properties.service';
import { default as homeContent } from '../../../../../assets/content.json';
import { AsCovid19ElectronicCommonDialogComponent } from '../as-covid19-electronic-common-dialog/as-covid19-electronic-common-dialog.component';
import { AsCovid19ConfirmDialogComponent } from './../as-covid19-confirm-dialog/as-covid19-confirm-dialog.component';
import { AsCovid19DetailsDialogComponent } from './../as-covid19-details-dialog/as-covid19-details-dialog.component';

@Component({
  selector: 'as-covid19-dialog',
  templateUrl: './as-covid19-dialog.component.html',
  styleUrls: ['./as-covid19-dialog.component.scss']
})
export class AsCovid19DialogComponent implements OnInit {
  content = homeContent;
  feature_flag_f1269_rit_aid_locations: boolean;

  constructor(
    public dialogRef: MatDialogRef<AsCovid19DialogComponent>, private router: Router,
    private dialog: MatDialog, private propertiesService: PropertiesService) {}

  ngOnInit() {
    setTimeout(() => {
      if(document.getElementById('covid-dialog-closebutton')){
        document.getElementById('covid-dialog-closebutton').focus();
      }
    }, 500);
    this.propertiesService.getRitAidLocationsf1269().subscribe(flag => {
      this.feature_flag_f1269_rit_aid_locations = flag;
    });
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  openCovidDetailsDialog() {
    this.closeDialog();
    this.dialog.open(AsCovid19DetailsDialogComponent, {
      autoFocus: false,
      disableClose: false,
      maxHeight: '90vh'
    });
  }

  openCovidConfirmDialog() {
    if (this.feature_flag_f1269_rit_aid_locations) {
      this.closeDialog();
      this.dialog.open(AsCovid19ElectronicCommonDialogComponent, {
        autoFocus: false,
        disableClose: false,
        maxHeight: '90vh'
      });
    } else {
      this.dialog.open(AsCovid19ConfirmDialogComponent, {
        autoFocus: false,
        disableClose: false,
        maxHeight: '90vh'
      });
    }
}

}
