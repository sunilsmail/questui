import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'shared/material.module';
import { AsSpinnerModule } from '../as-spinner/as-spinner.module';
import { AsEnableBrowserLocationComponent } from './as-enable-browser-location.component';

@NgModule({
  declarations: [AsEnableBrowserLocationComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
    AsSpinnerModule
  ],
  exports: [AsEnableBrowserLocationComponent]
})
export class AsEnableBrowserLocationModule { }
