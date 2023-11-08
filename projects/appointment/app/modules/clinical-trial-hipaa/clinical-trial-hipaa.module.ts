import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'shared/material.module';

import { AsSpinnerModule } from 'shared/components/as-spinner/as-spinner.module';

import { ClinicalTrialHipaaRoutingModule } from './clinical-trial-hipaa-routing.module';
import { ClinicalTrialOptInComponent } from './components/clinical-trial-opt-in/clinical-trial-opt-in.component';

import { CustomPipesModule } from 'shared/custom-pipes.module';
import { ClinicalTrialDialogComponent } from './components/clinical-trial-dialog/clinical-trial-dialog.component';


@NgModule({
  declarations: [
    ClinicalTrialOptInComponent,
    ClinicalTrialDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ClinicalTrialHipaaRoutingModule,
    ReactiveFormsModule,
    CustomPipesModule,
    AsSpinnerModule
  ]
})
export class ClinicalTrialHipaaModule { }
