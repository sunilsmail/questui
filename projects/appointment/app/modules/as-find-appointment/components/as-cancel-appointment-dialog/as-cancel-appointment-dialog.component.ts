import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CancelAppointmentService } from 'shared/services/cancel-appointment.service';
import { default as homeContent } from '../../../../../assets/content.json';
// tslint:disable-next-line: max-line-length
import { AsCancelAppointmentSuccessDialogComponent } from '../as-cancel-appointment-success-dialog/as-cancel-appointment-success-dialog.component';


@Component({
  selector: 'as-cancel-appointment-dialog',
  templateUrl: './as-cancel-appointment-dialog.component.html',
  styleUrls: ['./as-cancel-appointment-dialog.component.scss']
})
export class AsCancelAppointmentDialogComponent implements OnDestroy, OnInit {
  content = homeContent;
  confirmationCode: string;
  phone: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  appointmentDate: string;
  appointmentTime: string;
  loading = false;
  constructor(public dialogRef: MatDialogRef<AsCancelAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private cancelAppointmentService: CancelAppointmentService,
    private dialog: MatDialog,
    private renderer: Renderer2) {
    this.confirmationCode = data.confirmationCode;
    this.phone = data.phone;
    this.name = data.name;
    this.address1 = data.address1;
    this.address2 = data.address2;
    this.city = data.city;
    this.state = data.state;
    this.zip = data.zip;
    this.appointmentDate = data.appointmentDate;
    this.appointmentTime = data.appointmentTime;
    this.renderer.addClass(document.body, 'modal-cancel-appointment');
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'modal-cancel-appointment');
  }

  closeDialog() {
    this.dialogRef.close();
  }
  closeCancelDialog(event){
    if (event.key === 'Escape') {
      this.closeDialog();
    }
  }
  onCancelAppointment() {
    this.loading = true;
    const object = {
      'confirmationCode': this.confirmationCode,
      'phone': this.phone
    };
    this.cancelAppointmentService.cancelAppointment(object).subscribe(response => {
      this.loading = false;
      this.dialogClose();
    }, () => {
      this.loading = false;
    });
  }

  dialogClose() {
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialog.open(AsCancelAppointmentSuccessDialogComponent, { height: 'auto', maxWidth: '100vw', disableClose: true });
    });
    this.dialogRef.close(true);
  }

}


