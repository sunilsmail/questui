import {  Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { AppointmentDetails } from 'shared/models/appointment';
import { DataService } from 'shared/services/data.service';
import { FindAppointmentService } from 'shared/services/find-appointment.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { UserService } from 'shared/services/user.service';
import { default as homeContent } from '../../../../../assets/content.json';
import { AsForgotConfirmationCodeDialogComponent } from './../as-forgot-confirmation-code-dialog/as-forgot-confcode-dialog.component';
// tslint:disable-next-line: max-line-length

@Component({
  selector: 'as-find-appointment-dialog',
  templateUrl: './as-find-appointment-dialog.component.html',
  styleUrls: ['./as-find-appointment-dialog.component.scss']
})
export class AsFindAppointmentDialogComponent implements OnDestroy, OnInit {
content = homeContent;
enableContinue = false;
findAppointment: FormGroup;
siteCode: any;
pscDetails: any = [];
isLoggedIn = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder,
              public dialogRef: MatDialogRef<AsFindAppointmentDialogComponent>,
              private findAppointmentService: FindAppointmentService,
              private dialog: MatDialog,
              private pscService: PscService,
              private router: Router,
              private dataService: DataService,
              private userService: UserService,
              private renderer: Renderer2,
              private propertiesService: PropertiesService) {
                this.renderer.addClass(document.body, 'modal--find-appointment');
               }

  ngOnInit() {
      this.findAppointment = this.fb.group({
      confirmationCode: ['', [Validators.minLength(6), Validators.required, Validators.maxLength(8)]]
    });
    this.userService.isAuthenticated$.subscribe((isAuth)=>{
      this.isLoggedIn = isAuth;
    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'modal--find-appointment');
  }

  closefindAppointmentDialog(): void {
   this.dialogRef.close(true);
  }
  closeAppointmentDialog(event){
    if (event.key === 'Escape') {
      this.closefindAppointmentDialog();
    }
  }

  onKeyup() {
    if(this.findAppointment.get('confirmationCode').value.length > 8 || this.findAppointment.get('confirmationCode').value === ''
    || this.findAppointment.get('confirmationCode').value.indexOf(' ') >= 0) {
      this.enableContinue = false;
    } else {
      this.enableContinue = true;
    }
  }

  onPaste(event) {
    let clipboardData;
    if (window['clipboardData']) { // IE
      clipboardData = window['clipboardData'];
      if (!(clipboardData.getData('text').length > 8)) {
        this.enableContinue = true;
      }
    } if (event.type === 'paste' && !(event.clipboardData.getData('text').length > 8)) { // other browsers
      this.enableContinue = true;
    }
  }

  onContinue(appointmentId: any) {
    appointmentId = this.findAppointment.get('confirmationCode').value.toUpperCase();
    this.findAppointmentService.verifyAppointmentId(appointmentId,this.isLoggedIn).subscribe( (result: AppointmentDetails) =>{
      this.findAppointmentService.appointmentDetails = result;
      if (result && result.message && result.message === 'cancelled') {
        this.findAppointment.get('confirmationCode').setErrors({ 'invalidconfirmationCode': true });
      } else {
        this.siteCode = result.siteCode;
        this.dialogRef.close(true);
        const navigationExtras: NavigationExtras = {
          queryParams: {
            'confirmationCode': appointmentId,
          }
        };
        const navigationExtrasWithCancelParam: NavigationExtras = {
          queryParams: {
            'confirmationCode': appointmentId,
            'cancelFromMQ' : 'true'
          }
        };
        this.dataService.isInFLow = true;
        (this.data && this.data.actionName === 'cancel') ?
        this.router.navigate(['/find-appointment/as-find-appointment-summary'], navigationExtrasWithCancelParam):
        this.router.navigate(['/find-appointment/as-find-appointment-summary'], navigationExtras);
      }
    },(error)=>{
      this.findAppointment.get('confirmationCode').setErrors({'invalidconfirmationCode': true});
  });
}

openForgotConfDailog(){
  this.dialogRef.close(true);
  this.dialog.open(AsForgotConfirmationCodeDialogComponent, {
    height: 'auto', maxWidth: '100vw', disableClose: true,
    data: { },
    panelClass: ['ds-modal', '--scroll-box', 'ds-grid--12', 'ds-elevation--L3']
  });
}

}

