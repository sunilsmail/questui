import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'shared/material.module';
import { AsReasonTestListComponent } from './as-reason-test-list.component';

@NgModule({
  declarations: [AsReasonTestListComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [AsReasonTestListComponent]
})
export class AsReasonTestListModule { }
