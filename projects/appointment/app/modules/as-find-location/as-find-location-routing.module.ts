import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeepLinkReasonResolver } from 'shared/guards/deeplink-reason.resolver';
import { GoogleMapsOptimizationResolver } from 'shared/guards/google-maps-optimization-resolver';
import { LocationFinderDetailsGuard } from 'shared/guards/location-finder-details-guard';
import { LocationFinderDetailsResolver } from 'shared/guards/location-finder-details.resolver';
import { AsFindLocationComponent } from './as-find-location.component';
import { AsLocationFinderDetailsComponent } from './components/as-location-finder-details/as-location-finder-details.component';
import { AsLocationFinderReasonComponent } from './components/as-location-finder-reason/as-location-finder-reason.component';
import { AsLocationFinderComponent } from './components/as-location-finder/as-location-finder.component';




const routes: Routes = [
    {
      path: '',
      component: AsFindLocationComponent,
      canActivate: [],
      resolve: {
        reasons : DeepLinkReasonResolver
      },
      children: [
        {
            path: 'as-location-finder',
            component: AsLocationFinderComponent,
            data: { title: 'Find Location - finder' },
            canActivate: [],
            resolve: {
              reasons : DeepLinkReasonResolver,
              f4191: GoogleMapsOptimizationResolver
            },
          },
          {
            path: 'as-location-finder-reason',
            component: AsLocationFinderReasonComponent,
            data: { title: 'Find Location - Reason for visit' },
            canActivate: []
          },
          {
            path: 'as-location-finder-details',
            component: AsLocationFinderDetailsComponent,
            data: { title: 'Find Location - finder details' },
            resolve: {
              Location : LocationFinderDetailsResolver
            },
            canActivate: [LocationFinderDetailsGuard]
          },
          {
            path: '',
            redirectTo: 'as-location-finder'
          },
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsFindLocationRoutingModule { }
