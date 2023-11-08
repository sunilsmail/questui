import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'shared/material.module';
import { AsToolbarAuthComponent } from './as-toolbar-auth/as-toolbar-auth.component';
import { AsToolbarComponent } from './as-toolbar.component';
@NgModule({
  declarations: [AsToolbarComponent, AsToolbarAuthComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule
  ],
  // entryComponents: [AsSessionTimoutPopupComponent],
  exports: [AsToolbarComponent, AsToolbarAuthComponent]
})
export class AsToolbarModule { }
