import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthInsuranceResolver } from 'shared/guards/auth-insurance.resolver';
import { DeepLinkReasonResolver } from 'shared/guards/deeplink-reason.resolver';
import { GenderRaceOptionsResolver } from 'shared/guards/gender-race.resolver';
import { GoogleMapsOptimizationResolver } from 'shared/guards/google-maps-optimization-resolver';
import { GuestFlowGuard } from 'shared/guards/guest-flow-guard';
import { MandateAddressReasonResolver } from 'shared/guards/mandate-address-reason.resolver';
import { OpenEordersGuard } from 'shared/guards/open-eorders-guard';
import { AsScheduleAppointmentComponent } from './as-schedule-appointment.component';
import { AsActiveInfectionSymptomsComponent } from './components/as-active-infection-symptoms/as-active-infection-symptoms.component';
import { AsApptSchedulerContainerComponent } from './components/as-appt-scheduler-container/as-appt-scheduler-container.component';
import { AsApptSchedulerComponent } from './components/as-appt-scheduler/as-appt-scheduler.component';
import { AsConfirmationPrintComponent } from './components/as-confirmation-print/as-confirmation-print.component';
import { AsConfirmationComponent } from './components/as-confirmation/as-confirmation.component';
import { AsFindLcnApptSchedulerComponent } from './components/as-find-lcn-appt-scheduler/as-find-lcn-appt-scheduler.component';
import { AsInsuranceContainerComponent } from './components/as-insurance-container/as-insurance-container.component';
import { AsInsuranceInformationComponent } from './components/as-insurance-information/as-insurance-information.component';
import { AsOpenEordersComponent } from './components/as-open-eorders/as-open-eorders.component';
import { AsPersonalInformationComponent } from './components/as-personal-information/as-personal-information.component';
import { AsReasonForVisitComponent } from './components/as-reason-for-visit/as-reason-for-visit.component';
import { AsReviewDetailsComponent } from './components/as-review-details/as-review-details.component';
import { AsSecondaryInsuranceContainerComponent } from './components/as-secondary-insurance-container/as-secondary-insurance-container.component';
import { AsSecondaryInsuranceComponent } from './components/as-secondary-insurance/as-secondary-insurance.component';
import { AsTermsAndConditionsComponent } from './components/as-terms-and-conditions/as-terms-and-conditions.component';

const routes: Routes = [
  {
    path: '',
    component: AsScheduleAppointmentComponent,
    canActivate: [],
    resolve: {
      reasons: DeepLinkReasonResolver
    },
    children: [
      {
        path: '',
        redirectTo: 'as-reason-for-visit'
      },
      {
        path: 'as-reason-for-visit',
        component: AsReasonForVisitComponent,
        data: { title: 'Schedule Appointment - Reason for visit' },
        canActivate: [],
        resolve: {
          reasons: DeepLinkReasonResolver
        },
      },
      {
        path: 'as-reason-for-visit/as-tests',
        component: AsReasonForVisitComponent,
        data: { title: 'Schedule Appointment - Reason for visit' },
        canActivate: [GuestFlowGuard]
      },
      {
        path: 'as-appt-scheduler',
        component: AsApptSchedulerContainerComponent,
        data: { title: 'Schedule Appointment - Appointment scheduler' },
        canActivate: [GuestFlowGuard],
        resolve: {
          fields: GenderRaceOptionsResolver,
          f4191: GoogleMapsOptimizationResolver
        },
      },
      {
        path: 'as-personal-information',
        component: AsPersonalInformationComponent,
        data: { title: 'Schedule Appointment - Personal information', pageName: 'personalInfo' },
        canActivate: [GuestFlowGuard],
        resolve: {
          fields: GenderRaceOptionsResolver,
          authInsurance: AuthInsuranceResolver
        },
      },
      {
        path: 'as-insurance-information',
        component: AsInsuranceContainerComponent,
        data: { title: 'Schedule Appointment - Insurance Information' },
        canActivate: [GuestFlowGuard],
        resolve: {
          f1687: MandateAddressReasonResolver,
          authInsurance: AuthInsuranceResolver
        }
      },
      {
        path: 'as-secondary-insurance',
        component: AsSecondaryInsuranceContainerComponent,
        data: { title: 'Schedule Appointment - Secondary Insurance' },
        canActivate: [GuestFlowGuard]
      },
      {
        path: 'as-review-details',
        component: AsReviewDetailsComponent,
        data: { title: 'Schedule Appointment - Review details' },
        canActivate: [GuestFlowGuard]
      },
      {
        path: 'as-confirmation',
        component: AsConfirmationComponent,
        data: { title: 'Schedule Appointment - Confirmation' },
        canActivate: [GuestFlowGuard]
      },
      {
        path: 'as-confirmation-print',
        component: AsConfirmationPrintComponent,
        data: { title: 'Schedule Appointment - Confirmation Print' },
        canActivate: [GuestFlowGuard]
      },
      {
        path: 'as-terms-and-conditions',
        component: AsTermsAndConditionsComponent,
        data: { title: 'Schedule Appointment - Terms and conditions' }
        // canActivate: [GuestFlowGuard]
      },
      {
        path: 'as-find-lcn-appt-scheduler',
        component: AsFindLcnApptSchedulerComponent,
        data: { title: 'Schedule Appointment - find location appointment scheduler' },
        canActivate: [GuestFlowGuard]
      },
      {
        path: 'as-active-infection-symptoms',
        component: AsActiveInfectionSymptomsComponent,
        data: { title: 'Schedule Appointment - Covid Active Infection Symptoms' },
        canActivate: [GuestFlowGuard]
      },
      {
        path: 'as-open-eorders',
        component: AsOpenEordersComponent,
        data: { title: 'Schedule Appointment - Open eorders' },
        canActivate: [OpenEordersGuard]
      },
      /*{
        path: '**',
        canActivate: [GuestFlowGuard]
      }*/
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsScheduleAppointmentRoutingModule { }
