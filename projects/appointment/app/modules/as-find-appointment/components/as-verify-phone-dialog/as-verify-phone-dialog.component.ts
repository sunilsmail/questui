import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VerifyIdentity } from 'shared/models/verify-Identity';
import { DataService } from 'shared/services/data.service';
import { FindAppointmentService } from 'shared/services/find-appointment.service';
import { PropertiesService } from 'shared/services/properties.service';
import { regex } from 'shared/utils/validation/regex-patterns';
import { default as homeContent } from '../../../../../assets/content.json';
import { AsCancelAppointmentDialogComponent } from '../as-cancel-appointment-dialog/as-cancel-appointment-dialog.component';

@Component({
  selector: 'as-verify-phone-dialog',
  templateUrl: './as-verify-phone-dialog.component.html',
  styleUrls: ['./as-verify-phone-dialog.component.scss']
})
export class AsVerifyPhoneDialogComponent implements OnDestroy, OnInit {
  content = homeContent;
  verifyPhoneNumber: FormGroup;
  enableVerifyIdentity = false;
  confirmationCode: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  flow: string;
  appointmentDate: string;
  appointmentTime: string;
  siteCode:string;
  phone:number;
  SpinnerLoading = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<AsVerifyPhoneDialogComponent>,
              private router: Router,
              public matDialog: MatDialog,
              private dataService: DataService,
              private findAppointmentService: FindAppointmentService,
              private renderer: Renderer2,
              private propertiesService: PropertiesService ) {
                this.confirmationCode = data.confirmationCode;
                this.name = data.name;
                this.address1 = data.address1;
                this.address2 = data.address2;
                this.city = data.city;
                this.state = data.state;
                this.zip = data.zip;
                this.appointmentDate = data.appointmentDate;
                this.appointmentTime = data.appointmentTime;
                this.flow = data.flow;
                this.siteCode = data.siteCode;
                this.phone = data.phone;
                this.renderer.addClass(document.body, 'modal-verify-phone');
            }

  ngOnInit() {
    this.verifyPhoneNumber = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern(regex.phoneNumber)]]
    });
  }

  ngOnDestroy(){
    this.renderer.removeClass(document.body, 'modal-verify-phone');
  }

  closeVerifyPhoneNumberDialog() {
    this.dialogRef.close();
  }
  closePhoneNumberDialog(event){
    if (event.key === 'Escape') {
      this.closeVerifyPhoneNumberDialog();
    }
  }

  onKeyup(event: KeyboardEvent, phoneElement: HTMLInputElement) {
    const currentValue = phoneElement.value;
    // checking phone number length
    if (currentValue) {
      const phone = currentValue.replace(/\-+/g, '');
      if (phone.length > 10) {
        this.verifyPhoneNumber.get('phoneNumber').setErrors({ invalidPhoneno: true });
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

  verifyIdentityUser(object: VerifyIdentity) {
    object = {
      'confirmationCode': this.confirmationCode,
      'phone': this.verifyPhoneNumber.get('phoneNumber').value.replace(/\-+/g, '')
    };
    this.dataService.setVerificationInfo(object);
    this.SpinnerLoading = true;
    this.findAppointmentService.verifyIdentity(object).subscribe(result => {
      this.SpinnerLoading = false;
      this.dialogRef.close();
      const flow: string = this.flow;
      switch(flow) {
        case 'CANCEL':
          this.matDialog.open(AsCancelAppointmentDialogComponent, { height: 'auto', width:'696px', disableClose:true,
      data: { confirmationCode: this.confirmationCode,
              phone: this.verifyPhoneNumber.get('phoneNumber').value.replace(/\-+/g, ''),
              name: this.name,
              address1: this.address1,
              address2: this.address2,
              city: this.city,
              state: this.state,
              zip: this.zip,
              appointmentDate: this.appointmentDate,
              appointmentTime: this.appointmentTime
          }
        });
        break;
        case 'EditLocation':
          const data = {
            appointmentDate: this.appointmentDate,
            appointmentTime: this.appointmentTime,
            siteCode: this.siteCode,
            name: this.name,
            address1: this.address1,
            address2: this.address2,
            city: this.city,
            state: this.state,
            zip: this.zip,
            phone: this.phone,
          };
          this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
          this.dataService.setappointmentData({ data: data, selectedIndex: -1 });
          this.dataService.setInsuranceData(null);
          break;
        case 'EditInsuranceInfo':
          this.router.navigate(['/schedule-appointment/as-insurance-information']);
         // this.dataService.setappointmentData(null);
          break;
        case 'EditwhoisVisiting':
            this.router.navigate(['/schedule-appointment/as-personal-information']);
            break;
        default:
          break;
      }
      /* if(this.flow === 'CANCEL') {
       this.matDialog.open(AsCancelAppointmentDialogComponent, { height: 'auto', maxWidth:'100vw', disableClose:true,
      data: { confirmationCode: this.confirmationCode,
              phone: this.verifyPhoneNumber.get('phoneNumber').value.replace(/\-+/g, ''),
              name: this.name,
              address1: this.address1,
              address2: this.address2,
              city: this.city,
              state: this.state,
              zip: this.zip,
              appointmentDate: this.appointmentDate,
              appointmentTime: this.appointmentTime
          }
        }) ;
      }
      else{
        const data = {
          appointmentDate: this.appointmentDate,
          appointmentTime: this.appointmentTime,
          siteCode: this.siteCode,
          name: this.name,
          address1: this.address1,
          address2: this.address2,
          city: this.address2,
          state: this.state,
          zip: this.zip,
          phone: this.phone,
        };
        this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
        this.dataService.setappointmentData({ data: data, selectedIndex: -1 });
      } */
    }, (error) => {
      this.SpinnerLoading = false;
      if (error.status === 404) {
        this.verifyPhoneNumber.get('phoneNumber').setErrors({ invalidIdentityPhone: true });
      } else {
        this.verifyPhoneNumber.get('phoneNumber').setErrors({ invalidIdentity: true });
      }
    });
  }
  onNeverMind() {
    this.dialogRef.close();
  }

}
