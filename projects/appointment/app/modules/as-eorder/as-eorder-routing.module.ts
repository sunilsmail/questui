import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenderRaceOptionsResolver } from 'shared/guards/gender-race.resolver';
import { GoogleMapsOptimizationResolver } from 'shared/guards/google-maps-optimization-resolver';
import { GuestCostEstimateGuard } from 'shared/guards/guest-costestimate-guard';
import { GuestEorderflowGuard } from 'shared/guards/guest-eorderflow-guard.ts.service';
import { MandateAddressReasonResolver } from 'shared/guards/mandate-address-reason.resolver';
import { OpenBalanceGuard } from 'shared/guards/open-balance-guard';
import { AsConfirmationPrintComponent } from '../as-schedule-appointment/components/as-confirmation-print/as-confirmation-print.component';
import { AsEorderComponent } from './as-eorder.component';
import { AsEorderApptSchedulerComponent } from './components/as-eorder-appt-scheduler/as-eorder-appt-scheduler.component';
// import { AsEorderConfirmationComponent } from './components/as-eorder-confirmation/as-eorder-confirmation.component';
// tslint:disable-next-line: max-line-length
import { AsEorderFindAppointmentSummaryComponent } from './components/as-eorder-find-appointment-summary/as-eorder-find-appointment-summary.component';
import { AsEorderInsuranceContainerComponent } from './components/as-eorder-insurance-container/as-eorder-insurance-container.component';
// tslint:disable-next-line: max-line-length
import { AsEorderOrderExpiryComponent } from './components/as-eorder-order-expiry/as-eorder-order-expiry.component';
import { AsEorderPersonalInformationComponent } from './components/as-eorder-personal-information/as-eorder-personal-information.component';
import { AsEorderReasonForVisitComponent } from './components/as-eorder-reason-for-visit/as-eorder-reason-for-visit.component';
import { AsEorderReviewDetailsComponent } from './components/as-eorder-review-details/as-eorder-review-details.component';
import { AsEorderSecInsContainerComponent } from './components/as-eorder-sec-insurance-container/as-eorder-sec-ins-container.component';
const routes: Routes = [
  {
    path: '',
    component: AsEorderComponent,
    canActivate: [],
    children: [
      {
        path: 'as-eorder-personal-information',
        component: AsEorderPersonalInformationComponent,
        data: { title: 'Eorder - Personal Information' },
        canActivate: [GuestEorderflowGuard],
        resolve:{
          fields: GenderRaceOptionsResolver,
          f4191: GoogleMapsOptimizationResolver
        },
      },
      {
        path: 'as-eorder-reason-for-visit',
        component: AsEorderReasonForVisitComponent,
        data: { title: 'Eorder - Reason For Visit' },
        canActivate: [GuestEorderflowGuard]
      },
      {
        path: 'as-eorder-appt-scheduler',
        component: AsEorderApptSchedulerComponent,
        data: { title: 'Eorder - Appointment Scheduler' },
        canActivate: [GuestEorderflowGuard],
        resolve:{
          fields: GenderRaceOptionsResolver,
          f4191: GoogleMapsOptimizationResolver
        },
      },
      {
        path: 'as-eorder-insurance-information',
        component: AsEorderInsuranceContainerComponent,
        data: { title: 'Eorder - Insurance Information' },
        canActivate: [GuestEorderflowGuard],
        resolve: {
          f4191: GoogleMapsOptimizationResolver
        }
      },
      {
        path: 'as-eorder-secondary-insurance',
        component: AsEorderSecInsContainerComponent,
        data: { title: 'Eorder - Secondary Insurance' },
        canActivate: [GuestEorderflowGuard],
        resolve: {
          f1687 : MandateAddressReasonResolver,
          f4191: GoogleMapsOptimizationResolver
        },
      },
      {
        path: 'as-eorder-review-details',
        component: AsEorderReviewDetailsComponent,
        data: { title: 'Eorder - Review Details' },
        canActivate: [GuestEorderflowGuard]
      },
      {
        path: 'as-eorder-price-estimate',
        loadChildren:() => import('./as-cost-estimate/as-cost-estimate.module').then(m => m.AsEorderPriceEstimateModule),
        data: { title: 'Eorder - price estimate' },
        canActivate: [GuestEorderflowGuard, GuestCostEstimateGuard]
      },
      /* {
        path: 'as-eorder-price-estimate',
        component: AsEorderPriceEstimateComponent,
        data: { title: 'Eorder - price estimate' },
        canActivate: [GuestEorderflowGuard]
      },
      {
        path: 'as-eorder-confirmation',
        component: AsEorderConfirmationComponent,
        data: { title: 'Eorder - confirmation' },
        canActivate: [GuestEorderflowGuard]
      }, */
      {
        path: 'as-eorder-confirmation',
        loadChildren:() => import('./as-eorder-confirmation/as-eorder-confirmation.module').then(m => m.AsEorderConfirmationModule),
        data: { title: 'Eorder - confirmation' },
        canActivate: [GuestEorderflowGuard, OpenBalanceGuard]
      },
      {
        path: 'as-confirmation-print',
        component: AsConfirmationPrintComponent,
        data: { title: 'Eorder - Confirmation Print' },
        canActivate: [GuestEorderflowGuard]
      },
      {
        path:'as-eorder-order-expiry',
        component: AsEorderOrderExpiryComponent,
        data: { title: 'Eorder - Order expiry' },
        canActivate: [GuestEorderflowGuard]
      },
      {
        path:'as-sample-already-taken',
        component: AsEorderOrderExpiryComponent,
        data: { title: 'Eorder - Sample already taken' }
      },
      {
        path:'email-unsubscribe',
        component: AsEorderOrderExpiryComponent,
        data: { title: 'Eorder - email unsubscribe' }
      },
      {
        path:'as-eorder-summary',
        component: AsEorderFindAppointmentSummaryComponent,
        data: { title: 'Eorder - Summary Detail' },
        canActivate: [GuestEorderflowGuard]
      },
      {
        path: 'as-open-balance',
        loadChildren:() => import('../as-open-balances/as-open-balance.module').then(m => m.AsOpenBalanceModule),
        data: { title: 'Eorder - confirmation' },
        canActivate: [GuestEorderflowGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsEorderRoutingModule {}
