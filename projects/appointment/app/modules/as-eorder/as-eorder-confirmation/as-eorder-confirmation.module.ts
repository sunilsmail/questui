import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'shared';
import { MaterialModule } from 'shared/material.module';
import { AsEorderConfirmationComponent } from '../components/as-eorder-confirmation/as-eorder-confirmation.component';
import { AsOpenBalanceModule } from './../../as-open-balances/as-open-balance.module';
import { AsEorderConfirmationRoutingModule } from './as-eorder-confirmation-routing.module';
@NgModule({
  declarations: [AsEorderConfirmationComponent],
  imports: [
    CommonModule,
    AsEorderConfirmationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule,
    AsOpenBalanceModule
  ]
})
export class AsEorderConfirmationModule {}
