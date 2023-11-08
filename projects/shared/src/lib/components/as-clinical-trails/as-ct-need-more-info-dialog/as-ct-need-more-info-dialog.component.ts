import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PropertiesService } from 'shared/services/properties.service';
import { default as homeContent } from '../../../../../../appointment/assets/content.json';

@Component({
  selector: 'as-ct-need-more-info-dialog',
  templateUrl: './as-ct-need-more-info-dialog.component.html',
  styleUrls: ['./as-ct-need-more-info-dialog.component.scss']
})
export class AsCtNeedMoreInfoDialogComponent implements OnInit {

  content = homeContent;
  clinicalTrailsLink$: Observable<string>;
  constructor(
    public dialogRef: MatDialogRef<AsCtNeedMoreInfoDialogComponent>,
    private propertiesService: PropertiesService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    setTimeout(() => {
      if (document.getElementById('need-more-info-close-button')) {
        document.getElementById('need-more-info-close-button').focus();
      }
    }, 1000);
  }

  ngOnInit(): void {
    this.clinicalTrailsLink$ = this.propertiesService.getCtcConnectUrl();
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

}
