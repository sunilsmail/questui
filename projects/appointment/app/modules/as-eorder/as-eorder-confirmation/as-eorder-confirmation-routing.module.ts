import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsEorderConfirmationComponent } from '../components/as-eorder-confirmation/as-eorder-confirmation.component';
const routes: Routes = [
  {
    path: '',
    component: AsEorderConfirmationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsEorderConfirmationRoutingModule {}
