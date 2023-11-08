import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AsValidPatternsComponent } from 'shared/components/as-valid-patterns/as-valid-patterns.component';
// tslint:disable-next-line: max-line-length
import { AsConfirmationPrintComponent } from '../../../appointment/app/modules/as-schedule-appointment/components/as-confirmation-print/as-confirmation-print.component';
import { AsAddToCalendarComponent } from './components/as-add-to-calendar/as-add-to-calendar.component';
import { AsAddressWithoutGoogleMapsComponent } from './components/as-address-without-google-maps/as-address-without-google-maps.component';
import { AsAppFooterComponent } from './components/as-app-footer/as-app-footer.component';
// tslint:disable-next-line: max-line-length
import { AsBfaRedirectionDialogComponent } from './components/as-bfa-redirection-dialog/as-bfa-redirection-dialog.component';
import { AsCalendarComponent } from './components/as-calendar/as-calendar.component';
import { AsChatBotComponent } from './components/as-chatbot/as-chat-bot.component';
import { AsClinicalTrailsModule } from './components/as-clinical-trails/as-clinical-trails.module';
// tslint:disable-next-line: max-line-length
import { AsCovidActiveInfectionDialogComponent } from './components/as-covid-active-infection-dialog/as-covid-active-infection-dialog.component';
// tslint:disable-next-line: max-line-length
import { AsCovidActiveInfectionOrderDialogComponent } from './components/as-covid-active-infection-order-dialog/as-covid-active-infection-order-dialog.component';
import { AsCovidAntibodyDialogComponent } from './components/as-covid-antibody-dialog/as-covid-antibody-dialog.component';
import { AsDatepickerCalendarComponent } from './components/as-datepicker-calendar/as-datepicker-calendar.component';
import { AsEnableBrowserLocationModule } from './components/as-enable-browser-location/as-enable-browser-location.module';
import { AsEorderFooterOldComponent } from './components/as-eorder-footer-old/as-eorder-footer-old.component';
import { AsEorderFooterComponent } from './components/as-eorder-footer/as-eorder-footer.component';
import { AsFooterComponent } from './components/as-footer/as-footer.component';
import { AsGenderFieldsDialogComponent } from './components/as-gender-fields-dialog/as-gender-fields-dialog.component';
import { AsGoogleMapComponent } from './components/as-google-map/as-google-map.component';
import { AsLoadingContainerModule } from './components/as-loading-container/as-loading-container.module';
import { AsLocationDetailsDialogComponent } from './components/as-location-details-dialog/as-location-details-dialog.component';
import { AsClosureMessageComponent } from './components/as-maintance/as-closure-message.component';
import { AsOpenEorderListModule } from './components/as-open-eorder-list/as-open-eorder-list.module';
import { PscClosureComponent } from './components/as-psc-closure/psc-closure/psc-closure.component';
import { AsPscDetailsNewComponent } from './components/as-psc-details-new/as-psc-details-new.component';
import { AsPscDetailsComponent } from './components/as-psc-details/as-psc-details.component';
import { AsPscSearchModule } from './components/as-psc-search/as-psc-search.module';
import { AsPscTimeSlotNewComponent } from './components/as-psc-time-slot-new/as-psc-time-slot-new.component';
import { AsPscTimeSlotComponent } from './components/as-psc-time-slot/as-psc-time-slot.component';
import { AsReasonTestListModule } from './components/as-reason-test-list/as-reason-test-list.module';
import { AsRecaptchaComponent } from './components/as-recaptcha/as-recaptcha.component';
import { AsSecInsDisplayComponent } from './components/as-sec-ins-display/as-sec-ins-display.component';
// tslint:disable-next-line: max-line-length
import { AsSecondaryInsuranceUserInfoComponent } from './components/as-secondary-insurance-userinfo/as-secondary-insurance-userinfo.component';
import { AsSessionTimoutPopupComponent } from './components/as-session-timout-popup/as-session-timout-popup.component';
import { AsSpinnerModule } from './components/as-spinner/as-spinner.module';
import { AsToolbarModule } from './components/as-toolbar/as-toolbar.module';
import { AsViewLocationDetailsComponent } from './components/as-view-location-details/as-view-location-details.component';
import { CustomPipesModule } from './custom-pipes.module';
import { AsPhoneFormatterDirective } from './directive/as-phone-formatter-directive';
import { MaterialModule } from './material.module';



@NgModule({
  declarations: [AsPscDetailsComponent,
    AsCalendarComponent,
    AsFooterComponent,
    AsPscTimeSlotComponent,
    AsGoogleMapComponent,
    AsAppFooterComponent,
    AsClosureMessageComponent,
    AsSessionTimoutPopupComponent,
    AsAddToCalendarComponent,
    AsConfirmationPrintComponent,
    AsEorderFooterComponent,
    AsRecaptchaComponent,
    AsBfaRedirectionDialogComponent,
    AsCovidActiveInfectionDialogComponent,
    AsCovidActiveInfectionOrderDialogComponent,
    AsCovidAntibodyDialogComponent,
    AsChatBotComponent,
    AsPscTimeSlotNewComponent,
    AsPscDetailsNewComponent,
    AsDatepickerCalendarComponent,
    PscClosureComponent,
    AsEorderFooterOldComponent,
    AsSecondaryInsuranceUserInfoComponent,
    AsSecInsDisplayComponent,
    AsViewLocationDetailsComponent,
    AsLocationDetailsDialogComponent,
    AsValidPatternsComponent,
    AsGenderFieldsDialogComponent,
    AsPhoneFormatterDirective,
    AsAddressWithoutGoogleMapsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    AsToolbarModule,
    AsLoadingContainerModule,
    AsSpinnerModule,
    CustomPipesModule,
    AsReasonTestListModule,
    AsPscSearchModule,
    AsEnableBrowserLocationModule,
    RouterModule,
    AsOpenEorderListModule,
    ReactiveFormsModule,
    AsClinicalTrailsModule,
  ],
  entryComponents: [
    AsSessionTimoutPopupComponent,
    AsBfaRedirectionDialogComponent,
    AsCovidActiveInfectionDialogComponent,
    AsCovidActiveInfectionOrderDialogComponent,
    AsCovidAntibodyDialogComponent,
    AsLocationDetailsDialogComponent,
    AsGenderFieldsDialogComponent,
  ],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    AsToolbarModule,
    AsLoadingContainerModule,
    AsSpinnerModule,
    CustomPipesModule,
    AsReasonTestListModule,
    AsPscSearchModule,
    AsEnableBrowserLocationModule,
    AsPscDetailsComponent,
    AsCalendarComponent,
    AsFooterComponent,
    AsPscTimeSlotComponent,
    AsGoogleMapComponent,
    AsAppFooterComponent,
    AsClosureMessageComponent,
    AsSessionTimoutPopupComponent,
    AsAddToCalendarComponent,
    AsConfirmationPrintComponent,
    AsEorderFooterComponent,
    AsRecaptchaComponent,
    AsChatBotComponent,
    AsPscDetailsNewComponent,
    AsPscTimeSlotNewComponent,
    AsDatepickerCalendarComponent,
    AsOpenEorderListModule,
    PscClosureComponent,
    AsEorderFooterOldComponent,
    AsSecondaryInsuranceUserInfoComponent,
    AsSecInsDisplayComponent,
    AsViewLocationDetailsComponent,
    AsValidPatternsComponent,
    AsClinicalTrailsModule,
    AsPhoneFormatterDirective,
    AsAddressWithoutGoogleMapsComponent
  ]
})
export class SharedModule { }
