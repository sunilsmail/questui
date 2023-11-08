import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { MaterialModule } from 'shared/material.module';
import { AsClinicalTrailsComponent } from './as-clinical-trails.component';
import { AsCtHipaaSigninDialogComponent } from './as-ct-hipaa-signin-dialog/as-ct-hipaa-signin-dialog.component';
import { AsCtNeedMoreInfoDialogComponent } from './as-ct-need-more-info-dialog/as-ct-need-more-info-dialog.component';
import { AsCtScheduleAppointmentDialogComponent } from './as-ct-schedule-appointment-dialog/as-ct-schedule-appointment-dialog.component';
@NgModule({
  declarations: [
    AsClinicalTrailsComponent,
    AsCtScheduleAppointmentDialogComponent,
    AsCtNeedMoreInfoDialogComponent,
    AsCtHipaaSigninDialogComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    CustomPipesModule
  ],
  entryComponents: [AsCtScheduleAppointmentDialogComponent, AsCtHipaaSigninDialogComponent],
  exports: [
    AsClinicalTrailsComponent,
    AsCtNeedMoreInfoDialogComponent,
    AsCtScheduleAppointmentDialogComponent
  ]
})
export class AsClinicalTrailsModule { }
