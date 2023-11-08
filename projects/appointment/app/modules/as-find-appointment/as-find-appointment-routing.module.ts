import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsFindAppointmentComponent } from './as-find-appointment.component';
import { AsFindAppointmentSummaryComponent } from './components/as-find-appointment-summary/as-find-appointment-summary.component';

const routes: Routes = [
  {
    path: '',
    component: AsFindAppointmentComponent,
    canActivate: [],
    children: [
      {
        path: '',
        redirectTo: 'as-find-appointment-summary'
      },
      {
        path: 'as-find-appointment-summary',
        component: AsFindAppointmentSummaryComponent,
        data: { title: 'Find Appointment - Appointment Summary' }
        // canActivate: [GuestFlowGuard] //disabled guard as confirmation page is coming as deep link in email
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsFindAppointmentRoutingModule { }
