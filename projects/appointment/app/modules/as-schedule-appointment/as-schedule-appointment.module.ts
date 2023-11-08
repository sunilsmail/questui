import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'shared';
import { AsScheduleAppointmentRoutingModule } from './as-schedule-appointment-routing.module';
import { AsScheduleAppointmentComponent } from './as-schedule-appointment.component';
import { AsActiveInfectionCommonInfoDialogComponent } from './components/as-active-infection-common-info-dialog/as-active-infection-common-info-dialog.component';
import { AsActiveInfectionDialogComponent } from './components/as-active-infection-dialog/as-active-infection-dialog.component';
import { AsActiveInfectionOrderDialogComponent } from './components/as-active-infection-order-dialog/as-active-infection-order-dialog.component';
import { AsActiveInfectionSymptomsComponent } from './components/as-active-infection-symptoms/as-active-infection-symptoms.component';
import { AsAddressComponent } from './components/as-address/as-address.component';
import { AsAntibodyDialogComponent } from './components/as-antibody-dialog/as-antibody-dialog.component';
import { AsAntibodyF1269DialogComponent } from './components/as-antibody-f1269-dialog/as-antibody-f1269-dialog.component';
import { AsApptSchedulerContainerComponent } from './components/as-appt-scheduler-container/as-appt-scheduler-container.component';
import { AsApptSchedulerWithoutGoogleMapsComponent } from './components/as-appt-scheduler-without-google-maps/as-appt-scheduler-without-google-maps.component';
import { AsApptSchedulerComponent } from './components/as-appt-scheduler/as-appt-scheduler.component';
import { AsBfaRedirectDialogComponent } from './components/as-bfa-redirect-dialog/as-bfa-redirect-dialog.component';
import { AsConfirmationBannerComponent } from './components/as-confirmation-banner/as-confirmation-banner.component';
import { AsConfirmationMobileBannerComponent } from './components/as-confirmation-mobile-banner/as-confirmation-mobile-banner.component';
import { AsConfirmationComponent } from './components/as-confirmation/as-confirmation.component';
import { AsCovid19ConfirmDialogComponent } from './components/as-covid19-confirm-dialog/as-covid19-confirm-dialog.component';
import { AsCovid19DetailsDialogComponent } from './components/as-covid19-details-dialog/as-covid19-details-dialog.component';
import { AsCovid19DialogComponent } from './components/as-covid19-dialog/as-covid19-dialog.component';
import { AsCovid19ElectronicCommonDialogComponent } from './components/as-covid19-electronic-common-dialog/as-covid19-electronic-common-dialog.component';
import { AsFindLcnApptSchedulerComponent } from './components/as-find-lcn-appt-scheduler/as-find-lcn-appt-scheduler.component';
import { AsGetlabsDialogComponent } from './components/as-getlabs-dialog/as-getlabs-dialog.component';
import { AsGetlabsLearnMoreDialogComponent } from './components/as-getlabs-learn-more-dialog/as-getlabs-learn-more-dialog.component';
import { AsInsuranceContainerComponent } from './components/as-insurance-container/as-insurance-container.component';
import { AsInsuranceInformationComponent } from './components/as-insurance-information/as-insurance-information.component';
import { AsInsuranceNewComponent } from './components/as-insurance-new/as-insurance-new.component';
import { AsNavigationSidebarComponent } from './components/as-navigation-sidebar/as-navigation-sidebar.component';
import { AsNeverMindDialogComponent } from './components/as-never-mind-dialog/as-never-mind-dialog.component';
import { AsOpenEordersComponent } from './components/as-open-eorders/as-open-eorders.component';
import { AsPeaceOfMindTestDialogComponent } from './components/as-peace-of-mind-test-dialog/as-peace-of-mind-test-dialog.component';
import { AsPersonalInformationComponent } from './components/as-personal-information/as-personal-information.component';
import { AsPurchaseMyOwnTestDialogComponent } from './components/as-purchase-my-own-test-dialog/as-purchase-my-own-test-dialog.component';
import { AsReasonForVisitComponent } from './components/as-reason-for-visit/as-reason-for-visit.component';
import { AsReviewDetailsComponent } from './components/as-review-details/as-review-details.component';
import { AsSecondaryInsuranceContainerComponent } from './components/as-secondary-insurance-container/as-secondary-insurance-container.component';
import { AsSecondaryInsuranceNewComponent } from './components/as-secondary-insurance-new/as-secondary-insurance-new.component';
import { AsSecondaryInsuranceComponent } from './components/as-secondary-insurance/as-secondary-insurance.component';
import { AsTermsAndConditionsComponent } from './components/as-terms-and-conditions/as-terms-and-conditions.component';

@NgModule({
  declarations: [
    AsReasonForVisitComponent,
    AsScheduleAppointmentComponent,
    AsBfaRedirectDialogComponent,
    AsApptSchedulerComponent,
    AsInsuranceInformationComponent,
    AsPersonalInformationComponent,
    AsReviewDetailsComponent,
    AsTermsAndConditionsComponent,
    AsConfirmationComponent,
    AsNeverMindDialogComponent,
    AsNavigationSidebarComponent,
    AsFindLcnApptSchedulerComponent,
    AsPurchaseMyOwnTestDialogComponent,
    AsPeaceOfMindTestDialogComponent,
    AsActiveInfectionDialogComponent,
    AsActiveInfectionOrderDialogComponent,
    AsAntibodyDialogComponent,
    AsActiveInfectionSymptomsComponent,
    AsActiveInfectionCommonInfoDialogComponent,
    AsOpenEordersComponent,
    AsSecondaryInsuranceComponent,
    AsConfirmationBannerComponent,
    AsCovid19DialogComponent,
    AsCovid19DetailsDialogComponent,
    AsCovid19ConfirmDialogComponent,
    AsConfirmationMobileBannerComponent,
    AsGetlabsDialogComponent,
    AsGetlabsLearnMoreDialogComponent,
    AsAddressComponent,
    AsCovid19ElectronicCommonDialogComponent,
    AsAntibodyF1269DialogComponent,
    AsInsuranceNewComponent,
    AsInsuranceContainerComponent,
    AsSecondaryInsuranceNewComponent,
    AsSecondaryInsuranceContainerComponent,
    AsApptSchedulerWithoutGoogleMapsComponent,
    AsApptSchedulerContainerComponent
  ],
  imports: [
    CommonModule,
    AsScheduleAppointmentRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  entryComponents: [AsBfaRedirectDialogComponent, AsActiveInfectionDialogComponent, AsActiveInfectionOrderDialogComponent,
    AsNeverMindDialogComponent, AsPurchaseMyOwnTestDialogComponent, AsPeaceOfMindTestDialogComponent, AsAntibodyDialogComponent,
    AsActiveInfectionCommonInfoDialogComponent, AsCovid19DialogComponent, AsCovid19DetailsDialogComponent,
    AsCovid19ConfirmDialogComponent, AsGetlabsDialogComponent, AsGetlabsLearnMoreDialogComponent, AsCovid19ElectronicCommonDialogComponent,
    AsAntibodyF1269DialogComponent]
})
export class AsScheduleAppointmentModule { }
