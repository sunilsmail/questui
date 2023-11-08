import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'shared/material.module';
import { AsPscSearchWithoutGoogleMapsComponent } from './as-psc-search-without-googlemaps/as-psc-search-without-googlemaps.component';
import { AsPscSearchComponent } from './as-psc-search.component';

@NgModule({
  declarations: [AsPscSearchComponent, AsPscSearchWithoutGoogleMapsComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    ReactiveFormsModule
  ],
  exports: [AsPscSearchComponent, AsPscSearchWithoutGoogleMapsComponent]
})
export class AsPscSearchModule { }
