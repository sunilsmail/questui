import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'shared';
import { MaterialModule } from 'shared/material.module';
import { AsEcheckinRoutingModule } from './as-echeckin-routing.module';
import { AsEcheckinComponent } from './as-echeckin.component';
import { AsEcheckinConfirmationComponent } from './components/as-echeckin-confirmation/as-echeckin-confirmation.component';
// tslint:disable-next-line: max-line-length
import { AsEcheckinInsuranceInformationComponent } from './components/as-echeckin-insurance-information/as-echeckin-insurance-information.component';
import { AsEcheckinOrderExpiryComponent } from './components/as-echeckin-order-expiry/as-echeckin-order-expiry.component';
// tslint:disable-next-line: max-line-length
import { AsEcheckinPersonalInformationComponent } from './components/as-echeckin-personal-information/as-echeckin-personal-information.component';
import { AsEcheckinTokenNotFoundComponent } from './components/as-echeckin-token-not-found/as-echeckin-token-not-found.component';
@NgModule({
  declarations: [
    AsEcheckinComponent,
    AsEcheckinPersonalInformationComponent,
    AsEcheckinInsuranceInformationComponent,
    AsEcheckinConfirmationComponent,
    AsEcheckinOrderExpiryComponent,
    AsEcheckinTokenNotFoundComponent],
  imports: [
    CommonModule,
    AsEcheckinRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule
  ]
})
export class AsEcheckinModule { }
