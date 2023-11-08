import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'shared';
import { MaterialModule } from 'shared/material.module';
import { AsEorderModule } from '../as-eorder/as-eorder.module';
import { AsFindAppointmentModule } from '../as-find-appointment/as-find-appointment.module';
import { AsHomeRoutingModule } from './as-home-routing.module';
import { AsHomeNewComponent } from './components/as-home-new/as-home-new.component';
import { AsImportantVisitInfoDialogComponent } from './components/as-important-visit-info-dialog/as-important-visit-info-dialog.component';


@NgModule({
  declarations: [
    AsImportantVisitInfoDialogComponent,
    AsHomeNewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AsHomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    AsFindAppointmentModule,
    AsEorderModule

  ],
  entryComponents: [AsImportantVisitInfoDialogComponent]
})
export class AsHomeModule { }
