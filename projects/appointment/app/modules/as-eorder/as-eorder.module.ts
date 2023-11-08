import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'shared';
import { MaterialModule } from 'shared/material.module';
import { AsScheduleAppointmentModule } from '../as-schedule-appointment/as-schedule-appointment.module';
import { AsEorderRoutingModule } from './as-eorder-routing.module';
import { AsEorderComponent } from './as-eorder.component';
import { AsEorderAddressComponent } from './components/as-eorder-address/as-eorder-address.component';
import { AsEorderApptSchedulerComponent } from './components/as-eorder-appt-scheduler/as-eorder-appt-scheduler.component';
// tslint:disable-next-line: max-line-length
import { AsEorderFindAppointmentSummaryComponent } from './components/as-eorder-find-appointment-summary/as-eorder-find-appointment-summary.component';
import { AsEorderInsuranceContainerComponent } from './components/as-eorder-insurance-container/as-eorder-insurance-container.component';
import { AsEorderInsuranceInformationNewComponent } from './components/as-eorder-insurance-information-new/as-eorder-insurance-information-new.component';
// tslint:disable-next-line: max-line-length
import { AsEorderInsuranceInformationComponent } from './components/as-eorder-insurance-information/as-eorder-insurance-information.component';
import { AsEorderNavigationSidebarComponent } from './components/as-eorder-navigation-sidebar/as-eorder-navigation-sidebar.component';
import { AsEorderOrderExpiryComponent } from './components/as-eorder-order-expiry/as-eorder-order-expiry.component';
import { AsEorderPersonalInformationComponent } from './components/as-eorder-personal-information/as-eorder-personal-information.component';
import { AsEorderReasonForVisitComponent } from './components/as-eorder-reason-for-visit/as-eorder-reason-for-visit.component';
import { AsEorderReviewDetailsComponent } from './components/as-eorder-review-details/as-eorder-review-details.component';
import { AsEorderSecInsContainerComponent } from './components/as-eorder-sec-insurance-container/as-eorder-sec-ins-container.component';
import { AsEorderSecondaryInsuranceNewComponent } from './components/as-eorder-secondary-insurance-new/as-eorder-secondary-insurance-new.component';
import { AsEorderSecondaryInsuranceComponent } from './components/as-eorder-secondary-insurance/as-eorder-secondary-insurance.component';
import { AsPriceEstimateDialogComponent } from './components/as-price-estimate-dialog/as-price-estimate-dialog.component';
import { AsVerifyIdentityDialogComponent } from './components/as-verify-identity-dialog/as-verify-identity-dialog.component';
@NgModule({
  declarations: [
    AsVerifyIdentityDialogComponent,
    AsEorderComponent,
    AsEorderPersonalInformationComponent,
    AsEorderNavigationSidebarComponent,
    AsEorderApptSchedulerComponent,
    AsEorderInsuranceInformationComponent,
    AsEorderReviewDetailsComponent,
    // AsEorderConfirmationComponent,
    AsPriceEstimateDialogComponent,
    AsEorderReasonForVisitComponent,
    AsEorderOrderExpiryComponent,
    AsEorderFindAppointmentSummaryComponent,
    AsEorderSecondaryInsuranceComponent,
    AsEorderAddressComponent,
    AsEorderInsuranceInformationNewComponent,
    AsEorderInsuranceContainerComponent,
    AsEorderSecInsContainerComponent,
    AsEorderSecondaryInsuranceNewComponent,
  ],
  imports: [
    CommonModule,
    AsEorderRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule,
    AsScheduleAppointmentModule,
  ],
  entryComponents: [AsVerifyIdentityDialogComponent, AsPriceEstimateDialogComponent],
  exports: [AsVerifyIdentityDialogComponent],

})
export class AsEorderModule { }
