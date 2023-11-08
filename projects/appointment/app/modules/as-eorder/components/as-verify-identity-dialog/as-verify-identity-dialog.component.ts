import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';
import moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { AsRecaptchaComponent } from 'shared/components/as-recaptcha/as-recaptcha.component';
import { editSummaryDetails, VerifyIdentityResponse } from 'shared/models/eOrder-state-navigation';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { CostEstimateService } from 'shared/services/eorder/easy-pay/cost-estimate.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { PropertiesService } from 'shared/services/properties.service';
import { regex } from 'shared/utils/validation/regex-patterns';
import { CustomValidators } from 'shared/utils/validation/validators';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-verify-identity-dialog',
  templateUrl: './as-verify-identity-dialog.component.html',
  styleUrls: ['./as-verify-identity-dialog.component.scss']
})
export class AsVerifyIdentityDialogComponent implements OnDestroy, OnInit {
  @ViewChild(AsRecaptchaComponent) recaptcha: AsRecaptchaComponent;
  content = homeContent;
  imageSrc: any;
  verifyIdentityForm: FormGroup;
  firstName: String;
  isError = false;
  minDate = new Date();
  maxDate = new Date();
  lockedUntil: boolean;
  retry: boolean;
  lockedMinutes: number;
  loading = false;
  captchaString: string;
  reCaptchaEnable$: Observable<boolean>;
  ariaTitle = null;
  easypayFixesf2100 = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AsVerifyIdentityDialogComponent>,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private eorderService: EorderService,
    private dataService: DataService,
    private dateService: DateService,
    private eorderDataService: EorderDataService,
    private router: Router,
    private eOrderStateNavigationService: EorderStateNavigationService,
    private propertiesService: PropertiesService,
    private i18n: I18n,
    private costEstimateService: CostEstimateService) {
    this.renderer.addClass(document.body, 'modal--verify-identity');
    this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/ds-images/ds-icon-error-24.svg`);
  }

  ngOnInit() {
    this.reCaptchaEnable$ = this.propertiesService.getRecaptchaEnable();
    this.propertiesService.getEasypayFixesf2100().subscribe((f2100) => {
      this.easypayFixesf2100 = f2100;
    });
    const currentYear = this.minDate.getFullYear();
    this.minDate.setFullYear(currentYear - 120);
    this.verifyIdentityForm = this.fb.group({
      lastName: ['', [Validators.maxLength(75), Validators.pattern(regex.lastName), Validators.required]],
      // dateOfBirth: ['', [Validators.minLength(3), Validators.maxLength(30), Validators.required]],
      dateOfBirth: ['', [Validators.required, CustomValidators.dateValidations(this.minDate, this.maxDate)]],
    });
    if (this.data) {
      if (this.data.firstName) {
        this.firstName = this.data.firstName;
        this.ariaTitle = this.i18n(`Hello ${this.firstName} identity verification dialog`);
      }
      if (this.data.nextAllowedVerificationDate) {
        this.isError = true;
        this.lockedUntil = true;
        // calculate the waiting time
        this.lockedMinutes = this.getWaitTime(this.data.nextAllowedVerificationDate);
      }
    }
    // this.eorderService.getEncounterInfo(this.data.token).subscribe((encounter: any) => {
    //   this.firstName = encounter.eOrder.firstName;
    //   const nextAllowedVerificationDate = encounter.authentication.nextAllowedVerificationDate;
    //   if(nextAllowedVerificationDate) {
    //     this.isError = true;
    //     this.lockedUntil = true;
    //     // calculate the waiting time
    //     this.lockedMinutes = this.getWaitTime(nextAllowedVerificationDate);
    //   }
    // });
    this.reset();
  }

  closeVerifyIdentityDialog(): void {
    this.dialogRef.close(true);
    this.router.navigate(['/']);
  }

  getWaitTime(nextAllowed: string): number {
    const today = new Date();
    const localTime = moment(today).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
    const lockedTime = moment(this.dateService.getTimezoneOffset(nextAllowed)).format('YYYY-MM-DD HH:mm:ss');
    const ms = moment(lockedTime).diff(moment(localTime));
    const diff: any = moment.duration(ms);
    const minutes = Math.floor(diff / 60000);
    return minutes;
  }

  recaptchaChanged(token: string) {
    this.captchaString = token;
    this.verifyIdentity();
  }

  verifyUser() {
    this.propertiesService.getRecaptchaEnable().subscribe(flag=>{
      if(flag){
        this.captchaString ? this.verifyIdentity() : this.recaptcha.execute();
      }
      else{
        this.captchaString = 'disableCaptcha';
        this.verifyIdentity();
      }
    });
  }

  verifyIdentity() {
    this.loading = true;
    const params = {
      'lastName': this.verifyIdentityForm.get('lastName').value,
      'dob': this.datePipe.transform(this.verifyIdentityForm.get('dateOfBirth').value, 'yyyyMMdd')
    };
    this.eorderService.verifyIdentity(params, this.captchaString).subscribe((data: VerifyIdentityResponse) => {
      this.eOrderStateNavigationService.easypayFixesf2100 = this.easypayFixesf2100;
      this.loading = false;
      // TODO: maxAttempts to be configured from properties service
      if (data.verifyIdentity === 'T' || (data.authAttempts === 3 && data.verifyIdentity === 'F')) {
        this.isError = false;
        // redirect to Eorder Your Info
        this.dialogRef.close(true);

        // When max attempts reached, switch from Eorder to regular appointment flow
        if (data.authAttempts === 3 && data.verifyIdentity === 'F') {
          const verifyIdentityData = {
            status: data.verifyIdentity,
            lastName: this.verifyIdentityForm.get('lastName').value,
            dob: this.datePipe.transform(this.verifyIdentityForm.get('dateOfBirth').value, 'MM/dd/yyyy')
          };
          this.dataService.setVerifyIdentityData(verifyIdentityData);
          this.eOrderStateNavigationService.getRoutePathByFlow(editSummaryDetails.maxAttemptsFailed);
        } else {
          // Continue with Eorder flow
          this.eorderDataService.setEorderFlow(true);
          const verifyData = {
            status: data.verifyIdentity,
            lastName: this.verifyIdentityForm.get('lastName').value,
            dob: this.verifyIdentityForm.get('dateOfBirth').value
          };
          this.eorderDataService.setVerifyIdentityData(verifyData);
          // confirmation code come from verifyIdentity response

          if (data.confirmation && data.stateNavigation && data.stateNavigation === editSummaryDetails.summaryDetails) {
            this.eOrderStateNavigationService.getRoutePathByFlow(editSummaryDetails.summaryDetails, data.confirmation);
          } else {
            if (data.stateNavigation) {
              this.eOrderStateNavigationService.getRoutePathByFlow(data.stateNavigation, data.confirmation);
            } else {
              this.eOrderStateNavigationService.getRoutePathByFlow(editSummaryDetails.whoIsVisiting, data.confirmation);
            }
          }
        }

        // this.router.navigate(['/eorder/as-eorder-summary'],navigationExtras);
      } else if (data.authAttempts < 3) { // user is allowed to retry till max attempts
        this.isError = true;
        this.lockedUntil = false;
        this.retry = true;
      } else if (data.nextAllowed) { // display number of minutes locked msg
        this.isError = true;
        this.lockedUntil = true;
        this.retry = false;
        this.lockedMinutes = this.getWaitTime(data.nextAllowed);
      }
      // this.costEstimateService.verifyIentityTokenEnabled = data.enableEasypay;
    }, (error) => {
      const response = error.data;
      this.loading = false;
    });
  }

  onkeypressdate(event: KeyboardEvent, dateElement: HTMLInputElement) {
    const currentValue = dateElement.value;
    if (event.code !== 'Backspace' && (currentValue.match(/^\d{2}$/) !== null || currentValue.match(/^\d{2}\/\/$/) !== null)) {
      dateElement.value = currentValue.substring(0, 2) + '/';
    } else if (
      event.code !== 'Backspace' &&
      (currentValue.match(/^\d{2}\/\d{2}$/) !== null || currentValue.match(/^\d{2}\/\d{2}\/\/$/) !== null)
    ) {
      dateElement.value = currentValue.substring(0, 5) + '/';
    }
  }

  focusOut(event) {
    /** when fousing out from DOB field and checking month and day are prefixed with zero when single digit. */
    const controlValue = event.target.value;
    const arrDOB = controlValue.split('/');
    if (arrDOB.length === 3 && arrDOB[2].length === 4) {
      event.target.value = this.prefixZeroForDate(arrDOB);
    } else {
      if (controlValue.length > 0) {
        this.verifyIdentityForm.get('dateOfBirth').setErrors({ invalidDateNew: true });
      }
    }
  }

  prefixZeroForDate(arrDOB: string[]): string {
    if (arrDOB.length === 3) {
      for (let i = 0; i <= arrDOB.length; i++) {
        /** adding prefix zero to month and day if their length is 1 */
        if (i === 0 || i === 1) {
          if (arrDOB[i].length === 1) {
            arrDOB[i] = `0${arrDOB[i]}`;
          }
        }
      }
      return `${arrDOB[0]}/${arrDOB[1]}/${arrDOB[2]}`;
    }
  }

  onKeyPress(event) {
    /** allowing only numbers and forward slash */
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57) && charCode !== 47) {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'modal--verify-identity');
  }

  reset(){
    this.verifyIdentityForm.valueChanges.subscribe(()=>{
      this.retry = false;
    });
  }
}
