import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'shared';
import { MaterialModule } from 'shared/material.module';
import { AsEorderPriceContainerComponent } from '../components/as-eorder-price-container/as-eorder-price-container.component';
import { AsEorderPriceEstimateOldComponent } from '../components/as-eorder-price-estimate-old/as-eorder-price-estimate-old.component';
import { AsEorderPriceEstimateComponent } from '../components/as-eorder-price-estimate/as-eorder-price-estimate.component';
import { AsEorderPriceEstimateRoutingModule } from './as-cost-estimate-routing.module';
@NgModule({
  declarations: [
    AsEorderPriceContainerComponent,
    AsEorderPriceEstimateComponent,
    AsEorderPriceEstimateOldComponent
  ],
  imports: [
    CommonModule,
    AsEorderPriceEstimateRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule
  ]
})
export class AsEorderPriceEstimateModule {}
