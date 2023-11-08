import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'shared';
import { MaterialModule } from 'shared/material.module';
import { AsOpenBalanceRoutingModule } from './as-open-balance-routing.module';
import { AsOpenBalanceComponent } from './as-open-balance.component';
import { AsOpenBalanceConfirmationComponent } from './components/as-open-balance-confirmation/as-open-balance-confirmation.component';
import { AsOpenBalanceSectionComponent } from './components/as-open-balance-section/as-open-balance-section.component';
import { AsPayAtAppointmentComponent } from './components/as-pay-at-appointment/as-pay-at-appointment.component';
@NgModule({
  declarations: [
    AsOpenBalanceComponent,
    AsOpenBalanceConfirmationComponent,
    AsOpenBalanceSectionComponent,
    AsPayAtAppointmentComponent
  ],
  imports: [
    CommonModule,
    AsOpenBalanceRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule
  ]
})
export class AsOpenBalanceModule { }
