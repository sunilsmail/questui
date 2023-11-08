import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClinicalTrailsStatus } from 'shared/models/clinical-trails';
import { ClinicalTrailsService } from 'shared/services/clinical-trails/clinical-trails.service';
import { DataService } from 'shared/services/data.service';
import { default as homeContent } from '../../../../../appointment/assets/content.json';
import { AsCtHipaaSigninDialogComponent } from './as-ct-hipaa-signin-dialog/as-ct-hipaa-signin-dialog.component';
import { AsCtNeedMoreInfoDialogComponent } from './as-ct-need-more-info-dialog/as-ct-need-more-info-dialog.component';
import { AsCtScheduleAppointmentDialogComponent } from './as-ct-schedule-appointment-dialog/as-ct-schedule-appointment-dialog.component';

@Component({
  selector: 'as-clinical-trails',
  templateUrl: './as-clinical-trails.component.html',
  styleUrls: ['./as-clinical-trails.component.scss']
})
export class AsClinicalTrailsComponent implements OnInit {
  content = homeContent;
  enableClinicalTrails$ = new Observable<boolean>();
  clinicalTrails = new FormControl(false);
  @Input() isAuthEdit = false;
  @Input() form: any = null;
  showReviewSection$ = new Observable<boolean>();
  disabledCTSwitch$ = new Observable<boolean>();


  constructor(
    public dialog: MatDialog,
    private clinicalTrailsService: ClinicalTrailsService,
    private dataService: DataService) { }

  ngOnInit() {
    this.showReviewSection$ = this.clinicalTrailsService.getShowReview();
    this.enableClinicalTrails$ = this.clinicalTrailsService.getClinicalTrails();
    this.disabledCTSwitch$ = this.clinicalTrailsService.getDisableClinicalTrails().pipe(tap((value) => {
      if (value) {
        this.clinicalTrails.disable();
      }
    }));
    this.clinicalTrailsService.getClinicalTrailsSelection().subscribe((value) => {
      this.clinicalTrails.patchValue(value);
    });
    if (this.dataService.isModifyCancel) {
      this.enableClinicalTrails$ = of(false);
    } else if (this.isAuthEdit) {
      this.enableClinicalTrails$ = of(false);
    }
  }

  open() {
    this.dialog.open(AsCtScheduleAppointmentDialogComponent, {
      height: 'auto', maxWidth: '100vw', disableClose: true,
    }).afterClosed().subscribe((response: string) => {
      if (response === ClinicalTrailsStatus.yes) {
        this.dialog.open(AsCtHipaaSigninDialogComponent, {
          panelClass: ['ds-modal', '--scroll-box', 'ds-grid--12', 'ds-elevation--L3'],
          disableClose: true,
          data: {
            ...this.getData(),
            isReview: false
          }
        }).afterClosed().subscribe((value) => {
          if (value === ClinicalTrailsStatus.closeDialog) {
            this.clinicalTrailsService.setDisableClinicalTrails(false);
            this.clinicalTrailsService.setClinicalTrailsSelection(false);
          } else if (value === ClinicalTrailsStatus.yes) {
            this.clinicalTrailsService.setDisableClinicalTrails(true);
            this.clinicalTrailsService.setClinicalTrailsSelection(true);
            this.clinicalTrailsService.signClinicalTrails(this.getData()).subscribe();
            this.clinicalTrailsService.setShowReview(true);
          }
        });
      } else if (response === ClinicalTrailsStatus.no) {
        this.dialog.open(AsCtNeedMoreInfoDialogComponent, {
          height: 'auto', maxWidth: '100vw', disableClose: true,
        }).afterClosed().subscribe((res: string) => {
          this.clinicalTrailsService.setDisableClinicalTrails(true);
          this.clinicalTrailsService.setClinicalTrailsSelection(false);
        });
        this.clinicalTrailsService.setClinicalTrailsSelection(false);
      } else if (response === ClinicalTrailsStatus.closeDialog) {
        this.clinicalTrailsService.setClinicalTrailsSelection(false);
      }
    });
  }

  openReviewDialog() {
    this.dialog.open(AsCtHipaaSigninDialogComponent, {
      panelClass: ['ds-modal', '--scroll-box', 'ds-grid--12', 'ds-elevation--L3'],
      disableClose: true,
      data: {
        ...this.getData(),
        isReview: true
      }
    });
  }

  getData() {
    if (this.form && this.form?.value && this.form?.value?.phone) {
      const phone = this.form.value.phone.replace(/-/gi, '');
      this.form.value.phone =(`${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6, 10)}`);
      return this.form?.value;
    } else {
      return this.form;
    }
  }

  get isSwitchEnabled() {
    if (this.clinicalTrailsService.signedHipaa) {
      return null;
    }
    if (!this.form?.get('firstName').valid
      || !this.form?.get('lastName').valid
      || !this.form?.get('dateOfBirth').valid
      || !this.form?.get('email').valid
      || !this.form?.get('phone').valid
      || !this.form?.get('isMobile').valid
      || !this.form?.get('patientAddressInfo')?.valid
      || !this.form?.get('gender').valid
      || !this.check18YearsAge()) {
      this.clinicalTrailsService.setDisableClinicalTrails(true);
      this.clinicalTrailsService.setClinicalTrailsSelection(false);

    } else {
      this.clinicalTrailsService.setDisableClinicalTrails(false);
    }
    return null;
  }

  check18YearsAge() {
    const selectedDate = new Date(this.form?.get('dateOfBirth').value);
    const maxDate: Date = new Date();
    maxDate.setFullYear(new Date().getFullYear() - 18);
    if (selectedDate > maxDate) {
      return false;
    }
    return true;
  }
}
