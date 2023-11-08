import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsEorderPriceContainerComponent } from '../components/as-eorder-price-container/as-eorder-price-container.component';
const routes: Routes = [
  {
    path: '',
    component: AsEorderPriceContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsEorderPriceEstimateRoutingModule {}
