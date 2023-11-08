import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'shared';
import { AsFindLocationRoutingModule } from './as-find-location-routing.module';
import { AsFindLocationComponent } from './as-find-location.component';
import { AsLocationAntibodyDialogComponent } from './components/as-location-antibody-dialog/as-location-antibody-dialog.component';
// tslint:disable-next-line: max-line-length
import { AsLocationFinderBfaRedirectDialogComponent } from './components/as-location-finder-bfa-redirect-dialog/as-location-finder-bfa-redirect-dialog.component';
import { AsLocationFinderDetailsComponent } from './components/as-location-finder-details/as-location-finder-details.component';
import { AsLocationFinderReasonComponent } from './components/as-location-finder-reason/as-location-finder-reason.component';
import { AsLocationFinderComponent } from './components/as-location-finder/as-location-finder.component';
// tslint:disable-next-line: max-line-length
import { AsLocationPeaceOfMindTestDialogComponent } from './components/as-location-peace-of-mind-test-dialog/as-location-peace-of-mind-test-dialog.component';
// tslint:disable-next-line: max-line-length
import { AsLocationPurchaseMyOwnTestDialogComponent } from './components/as-location-purchase-my-own-test-dialog/as-location-purchase-my-own-test-dialog.component';
import { AsLocationUnavailableDialogComponent } from './components/as-location-unavailable-dialog/as-location-unavailable-dialog.component';

@NgModule({
  declarations: [
    AsFindLocationComponent,
    AsLocationFinderComponent,
    AsLocationFinderReasonComponent,
    AsLocationFinderBfaRedirectDialogComponent,
    AsLocationFinderDetailsComponent,
    AsLocationPeaceOfMindTestDialogComponent,
    AsLocationPurchaseMyOwnTestDialogComponent,
    AsLocationAntibodyDialogComponent,
    AsLocationUnavailableDialogComponent
  ],
  imports: [
    CommonModule,
    AsFindLocationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  // tslint:disable-next-line: max-line-length
  entryComponents: [AsLocationFinderBfaRedirectDialogComponent,AsLocationPeaceOfMindTestDialogComponent, AsLocationPurchaseMyOwnTestDialogComponent
  ,AsLocationAntibodyDialogComponent, AsLocationUnavailableDialogComponent]
})
export class AsFindLocationModule { }
