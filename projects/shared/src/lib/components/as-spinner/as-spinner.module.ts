import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'shared/material.module';

import { AsSpinnerComponent } from './as-spinner.component';

@NgModule({
  declarations: [AsSpinnerComponent ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  exports: [AsSpinnerComponent]
})
export class AsSpinnerModule { }
