import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PropertiesService } from 'shared/services/properties.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-covid19-details-dialog',
  templateUrl: './as-covid19-details-dialog.component.html',
  styleUrls: ['./as-covid19-details-dialog.component.scss']
})
export class AsCovid19DetailsDialogComponent implements OnInit {
  content = homeContent;
  QuestCovidDialogLink: string;
  covidFilterLinks$: Observable<string>;
  featureFlag1421$: Observable<boolean>;
  feature_flag_f1269_rit_aid_locations: boolean;

  constructor(
    public dialogRef: MatDialogRef<AsCovid19DetailsDialogComponent>, private router: Router,
    private dialog: MatDialog,private propertiesService: PropertiesService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.featureFlag1421$ = this.propertiesService.getCITUpdatedLinksFeatureFlag1421()
    .pipe(tap((value)=>{
      this.covidFilterLinks$ = value ?
      this.propertiesService.getcovidFilterLinkNew() : this.propertiesService.getCovidFilterLink();
    }));
    setTimeout(() => {
      if(document.getElementById('covid-details-close-button')){
        document.getElementById('covid-details-close-button').focus();
      }
    }, 500);
    this.propertiesService.getRitAidLocationsf1269().subscribe(flag => {
      this.feature_flag_f1269_rit_aid_locations = flag;
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  getStarted() {
    this.dialog.closeAll();
    this.propertiesService.getQuestCovidDialogLink().subscribe((QuestCovidDialogLinks: string) => {
      window.open(QuestCovidDialogLinks, '_self');
    });
  }

}
