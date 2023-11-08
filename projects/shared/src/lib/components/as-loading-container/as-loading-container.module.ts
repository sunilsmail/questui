import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'shared/material.module';
import { AsSpinnerModule } from '../as-spinner/as-spinner.module';
import { AsLoadingContainerComponent } from './as-loading-container.component';

@NgModule({
  declarations: [AsLoadingContainerComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
    AsSpinnerModule
  ],
  exports: [AsLoadingContainerComponent]
})
export class AsLoadingContainerModule { }
