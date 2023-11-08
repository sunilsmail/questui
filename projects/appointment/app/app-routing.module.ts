import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'as-home',
    loadChildren: () => import('app/modules/as-home/as-home.module').then(m => m.AsHomeModule),
    data: { title: 'Schedule Appointment - Home Page' }
  },
  {
    path: 'clinical-trial-hipaa',
    loadChildren: () => import('app/modules/clinical-trial-hipaa/clinical-trial-hipaa.module').then(m => m.ClinicalTrialHipaaModule),
    data: { title: 'Clinical Trial - Opt-in' }
  },
  {
    path: 'schedule-appointment',
    loadChildren: () => import('app/modules/as-schedule-appointment/as-schedule-appointment.module')
    .then(m => m.AsScheduleAppointmentModule),
    data: { title: 'Schedule Appointment' }
  },
  {
    path: 'find-location',
    loadChildren: () => import('app/modules/as-find-location/as-find-location.module').then(m => m.AsFindLocationModule),
    data: { title: 'Find Location' }
  },
  {
    path: 'find-appointment',
    loadChildren: () => import('app/modules/as-find-appointment/as-find-appointment.module').then(m => m.AsFindAppointmentModule),
    data: { title: 'Find Appointment' }
  },
  {
    path: 'eorder',
    loadChildren: () => import('app/modules/as-eorder/as-eorder.module').then(m => m.AsEorderModule),
    data: { title: 'Eorder' }
  },
  {
    path: 'echeckin',
    loadChildren: () => import('app/modules/as-echeckin/as-echeckin.module').then(m => m.AsEcheckinModule),
    data: { title: 'Echeckin' }
  },
  {
    // redirect any unrecognized paths to the home page
    path: '**',
    redirectTo: 'as-home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
