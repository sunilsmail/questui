import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { regex } from 'shared/utils/validation/regex-patterns';
import { default as homeContent } from '../../../../../assets/content.json';
import { ForgotConfirmationCode } from './../../../../../../shared/src/lib/models/forgot-confirmationcode';
import { ForgotConfirmationCodeService } from './../../../../../../shared/src/lib/services/forgot-confcode.service';
// tslint:disable-next-line: max-line-length
import { AsForgotConfirmationCodeSuccessDialogComponent } from './../as-forgot-confirmation-code-success-dialog/as-forgot-confcode-success-dialog.component';

@Component({
  templateUrl: './as-forgot-confcode-dialog.component.html',
  styleUrls: ['./as-forgot-confcode-dialog.component.scss']
})
export class AsForgotConfirmationCodeDialogComponent implements OnDestroy, OnInit {
  content = homeContent;
  forgotConfirmationCodeForm: FormGroup;
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AsForgotConfirmationCodeDialogComponent>,
    public matDialog: MatDialog,
    private forgotConfirmationCodeService: ForgotConfirmationCodeService,
    private renderer: Renderer2) {
    this.renderer.addClass(document.body, 'modal-verify-phone');
  }

  public get isButtonEnabled(): boolean {
    return (this.forgotConfirmationCodeForm.valid && (this.forgotConfirmationCodeForm.get('phoneNumber').value.length > 0
    || this.forgotConfirmationCodeForm.get('email').value.length > 0 ));
  }

  ngOnInit() {
    document.getElementById('closeButton').blur();
    document.getElementById('mat-dialog-title').focus();
    this.forgotConfirmationCodeForm = this.fb.group({
      phoneNumber: ['', [Validators.minLength(10), Validators.maxLength(12), Validators.pattern(regex.phoneNumber)]],
      email: ['', [Validators.maxLength(60), Validators.pattern(regex.email)]]
    });
    this.init();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'modal-verify-phone');
  }

  closeForgotConfCode() {
    this.dialogRef.close();
  }
   closeForgotDialog(event){
    if (event.key === 'Escape') {
      this.closeForgotConfCode();
    }
  }

  onKeyup(event: KeyboardEvent, phoneElement: HTMLInputElement) {
    const currentValue = phoneElement.value;
    // checking phone number length
    if (currentValue) {
      const phone = currentValue.replace(/\-+/g, '');
      if (phone.length > 10) {
        this.forgotConfirmationCodeForm.get('phoneNumber').setErrors({ invalidPhoneno: true });
        return;
      }
      else if (event['keyCode'] === 8) {
        return currentValue.length-1;
    }
    }
    if (event.code !== 'Backspace' && (currentValue.match(/^\d{3}$/) !== null || currentValue.match(/^\d{3}\/\/$/) !== null)) {
      phoneElement.value = currentValue.substring(0, 3) + '-';
    } else if (event.code !== 'Backspace' && (currentValue.match(/^\d{3}\-\d{3}$/) !== null ||
      currentValue.match(/^\d{3}\-\d{3}\/\/$/) !== null)) {
      phoneElement.value = currentValue.substring(0, 7) + '-';
    }
  }

  forgotConfirmationCode() {
    const request: ForgotConfirmationCode = {
      email: this.forgotConfirmationCodeForm.get('email').value,
      phone: this.forgotConfirmationCodeForm.get('phoneNumber').value.replace(/-/g, '')
    };
    const inputPhoneNumber = document.getElementById('phoneNumber');
    this.forgotConfirmationCodeService.forgotConfirmationCode(request).subscribe(result => {
      this.dialogRef.close();
      this.matDialog.open(AsForgotConfirmationCodeSuccessDialogComponent, { height: 'auto', maxWidth: '100vw', disableClose: true });
    }, (error) => {
      inputPhoneNumber.focus();
      this.forgotConfirmationCodeForm.get('phoneNumber').setErrors({ invalidEmailorPhone: true });
      if(!this.forgotConfirmationCodeForm.get('phoneNumber').value){
        this.forgotConfirmationCodeForm.get('phoneNumber').markAsDirty();
        this.forgotConfirmationCodeForm.get('phoneNumber').markAsTouched({ onlySelf: true });
      }
    });
  }

  onNeverMind() {
    this.dialogRef.close();
  }

  init() {
    this.forgotConfirmationCodeForm.get('email').valueChanges.subscribe(data => {
      const phoneNumber = this.forgotConfirmationCodeForm.get('phoneNumber').value.replace(/-/g, '').length;
      if ((phoneNumber === 0 || phoneNumber === 10) && this.forgotConfirmationCodeForm.get('email').valid) {
        this.forgotConfirmationCodeForm.get('phoneNumber').setErrors(null);
      }
    });
  }

}
