import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'shared/material.module';
import { AsOpenEorderListComponent } from './as-open-eorder-list.component';

@NgModule({
  declarations: [AsOpenEorderListComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [AsOpenEorderListComponent]
})
export class AsOpenEorderListModule { }
