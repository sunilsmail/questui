import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from 'shared/services/data.service';
import { PropertiesService } from 'shared/services/properties.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { default as homeContent } from '../../../../../assets/content.json';
@Component({
  selector: 'as-covid19-electronic-common-dialog',
  templateUrl: './as-covid19-electronic-common-dialog.component.html',
  styleUrls: ['./as-covid19-electronic-common-dialog.component.scss']
})
export class AsCovid19ElectronicCommonDialogComponent implements OnInit {
  content = homeContent;
  symtomsDialog: boolean;
  isElectronicOrder: boolean;
  paperSymptomsOrder: boolean;
  covidFilterLink$: Observable<string>;

  constructor(
    public dialogRef: MatDialogRef<AsCovid19ElectronicCommonDialogComponent>, private router: Router,
    private dialog: MatDialog, private dataService: DataService, private skipInsuranceService: SkipInsuranceService,
    private propertiesService: PropertiesService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.covidFilterLink$ = this.propertiesService.getCovidFilterLink();
    if (this.data && this.data.purchaseMyOwnTestCovid) {
      this.symtomsDialog = true;
      setTimeout(() => {
        if (document.getElementById('covid-dialog-closebutton_2')) { document.getElementById('covid-dialog-closebutton_2').focus(); }
      }, 500);
    } else {
      this.symtomsDialog = false;
      setTimeout(() => {
        if (document.getElementById('covid-dialog-closebutton_1')) {
          document.getElementById('covid-dialog-closebutton_1').focus();
        }
      }, 500);
    }
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  openCovidSymptomsDialog(type: string) {
    this.symtomsDialog = true;
    setTimeout(() => {
      if (document.getElementById('covid-dialog-closebutton_2')) { document.getElementById('covid-dialog-closebutton_2').focus(); }
    }, 500);
    if (type === 'electronic') {
      this.isElectronicOrder = true;
    } else {
      this.isElectronicOrder = false;
    }
  }

  gotoSchedular(reason: string) {
    if (this.data && this.data.purchaseMyOwnTestCovid) {
      this.dataService.searchCovidAppointmentsBy = 29;
      if (reason === 'serveSymptoms') {
        // this.dataService.searchCovidAppointmentsBy = 26;
        this.dataService.siteType = 'PSA';
      } else {
        // this.dataService.searchCovidAppointmentsBy = 29;
        this.dataService.siteType = null;
      }
      this.dialogRef.close('CovidPOTF');
      return;
    } else {
      if (this.isElectronicOrder) {
        this.dataService.searchCovidAppointmentsBy = 29;
        if (reason === 'serveSymptoms') {
          // this.dataService.searchCovidAppointmentsBy = 26;
          this.dataService.siteType = 'PSA';
        } else {
          // this.dataService.searchCovidAppointmentsBy = 29;
          this.dataService.siteType = null;
        }
      } else {
        if (reason === 'serveSymptoms') {
          this.paperSymptomsOrder = true;
          this.symtomsDialog = false;
          setTimeout(() => {
            if (document.getElementById('covid-dialog-closebutton_3')) {
              document.getElementById('covid-dialog-closebutton_3').focus();
            }
          }, 500);
          return;
        } else {
          this.paperSymptomsOrder = false;
          this.dataService.searchCovidAppointmentsBy = 29;
          this.dataService.siteType = 'PSC';
        }
      }
    }
    this.closeDialog();
    this.skipInsuranceService.setCovidReasonSelected(true);
    // this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
  }
}
