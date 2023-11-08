import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClinicalTrailsStatus } from 'shared/models/clinical-trails';
import { ClinicalTrailsService } from 'shared/services/clinical-trails/clinical-trails.service';
import { DateService } from 'shared/services/date.service';
import { regex } from 'shared/utils/validation/regex-patterns';
import { default as homeContent } from '../../../../../../appointment/assets/content.json';

@Component({
  selector: 'as-ct-hipaa-signin-dialog',
  templateUrl: './as-ct-hipaa-signin-dialog.component.html',
  styleUrls: ['./as-ct-hipaa-signin-dialog.component.scss']
})
export class AsCtHipaaSigninDialogComponent implements OnInit, OnDestroy {

  content = homeContent;
  dialogOptions = ClinicalTrailsStatus;
  consentForm: FormGroup;
  enableSignInButton = false;
  scrollValue = 0;
  constructor(
    public dialogRef: MatDialogRef<AsCtHipaaSigninDialogComponent>,
    private renderer: Renderer2,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dateService: DateService,
    private clinicalTrailsService: ClinicalTrailsService,
  ) {
    this.renderer.addClass(document.body, 'as-find-location');
  }

  ngOnInit(): void {
    const element = document.getElementById('dialogcontent');
    element.addEventListener('scroll', this.scrollevent.bind(this), true);
    this.buildForm();
  }

  scrollevent(event) {
    const numA = (event.target.offsetHeight + event.target.scrollTop);
    const numB = event.target.scrollHeight;
    if (((event.target.offsetHeight + event.target.scrollTop) + 100) >= event.target.scrollHeight) {
      this.enableSignInButton = true;
    }
    const value = Math.round((numA / numB) * 100);
    this.scrollValue = value <= 18 ? 0 : value;
    event.preventDefault();
  }

  ngOnDestroy(): void {
    const element = document.getElementById('dialogcontent');
    element.removeEventListener('scroll', null);
    this.renderer.removeClass(document.body, 'as-find-location');
  }

  closeDialog(value: string): void {
    if (value === ClinicalTrailsStatus.yes) {
      this.clinicalTrailsService.signedUser = this.consentForm.getRawValue();
    }
    this.dialogRef.close(value);
  }

  buildForm() {
    this.consentForm = this.fb.group({
      firstName: ['', [Validators.maxLength(75), Validators.pattern(regex.firstName), Validators.required]],
      lastName: ['', [Validators.maxLength(75), Validators.pattern(regex.lastName), Validators.required]],
      date: ['', [Validators.required]],
    });
    if (this.data && !this.data?.firstName) {
      this.data = { ...this.data, ...this.clinicalTrailsService.signedUser };
    }
    if (this.data && this.data?.firstName) {
      this.consentForm.get('firstName').patchValue(this.data?.firstName);
    }
    if (this.data && this.data?.lastName) {
      this.consentForm.get('lastName').patchValue(this.data.lastName);
    }
    this.consentForm.get('date').patchValue(this.dateService.toDateMMDDYYYY((new Date()).toDateString()));
  }

  get disbaleSignupButton() {
    return this.consentForm.valid && this.enableSignInButton;
  }

}
