import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'shared';
import { MaterialModule } from 'shared/material.module';
import { AsFindAppointmentRoutingModule } from './as-find-appointment-routing.module';
import { AsFindAppointmentComponent } from './as-find-appointment.component';
import { AsCancelAppointmentDialogComponent } from './components/as-cancel-appointment-dialog/as-cancel-appointment-dialog.component';
// tslint:disable-next-line: max-line-length
import { AsCancelAppointmentSuccessDialogComponent } from './components/as-cancel-appointment-success-dialog/as-cancel-appointment-success-dialog.component';
import { AsFindAppointmentDialogComponent } from './components/as-find-appointment-dialog/as-find-appointment-dialog.component';
import { AsFindAppointmentSummaryComponent } from './components/as-find-appointment-summary/as-find-appointment-summary.component';
// tslint:disable-next-line: max-line-length
import { AsForgotConfirmationCodeDialogComponent } from './components/as-forgot-confirmation-code-dialog/as-forgot-confcode-dialog.component';
// tslint:disable-next-line: max-line-length
import { AsForgotConfirmationCodeSuccessDialogComponent } from './components/as-forgot-confirmation-code-success-dialog/as-forgot-confcode-success-dialog.component';
// tslint:disable-next-line: max-line-length
import { AsVerifyPhoneDialogComponent } from './components/as-verify-phone-dialog/as-verify-phone-dialog.component';

@NgModule({
  declarations: [
    AsFindAppointmentSummaryComponent,
    AsFindAppointmentComponent,
    AsFindAppointmentDialogComponent,
    AsVerifyPhoneDialogComponent,
    AsCancelAppointmentDialogComponent,
    AsCancelAppointmentSuccessDialogComponent,
    AsForgotConfirmationCodeDialogComponent,
    AsForgotConfirmationCodeSuccessDialogComponent
    ],
  imports: [
    CommonModule,
    AsFindAppointmentRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule

  ],
  entryComponents: [ AsFindAppointmentDialogComponent, AsVerifyPhoneDialogComponent,
                      AsCancelAppointmentDialogComponent,AsCancelAppointmentSuccessDialogComponent,
                      AsForgotConfirmationCodeDialogComponent,
                      AsForgotConfirmationCodeSuccessDialogComponent],
  exports: [AsFindAppointmentDialogComponent],

})
export class AsFindAppointmentModule { }
