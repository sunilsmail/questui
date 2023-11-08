import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicalTrialOptInComponent } from './components/clinical-trial-opt-in/clinical-trial-opt-in.component';

const routes: Routes = [
  {
    path: '',
    component: ClinicalTrialOptInComponent,
    canActivate: [],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicalTrialHipaaRoutingModule { }
