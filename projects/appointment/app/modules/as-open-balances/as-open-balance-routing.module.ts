import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsOpenBalanceComponent } from './as-open-balance.component';
import { AsOpenBalanceConfirmationComponent } from './components/as-open-balance-confirmation/as-open-balance-confirmation.component';
import { AsPayAtAppointmentComponent } from './components/as-pay-at-appointment/as-pay-at-appointment.component';
const routes: Routes = [
  {
    path: '',
    component: AsOpenBalanceComponent,
    canActivate: [],
    children: [
      {
        path: 'confirmation',
        component: AsOpenBalanceConfirmationComponent,
        data: { title: 'eorder - open balance confirmation' },
        canActivate: []
      },
      {
        path: 'as-pay-at-appointment',
        component: AsPayAtAppointmentComponent,
        data: { title: 'Pay At Appointment - Open Balance' },
        canActivate: []
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsOpenBalanceRoutingModule { }
