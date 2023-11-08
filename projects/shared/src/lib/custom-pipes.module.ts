import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { EscapeHtmlPipe } from 'shared/pipes/keep-html.pipe';
import { PhoneFaxPipe } from './pipes/phone-fax.pipe';
import { PhonePipe } from './pipes/phone.pipe';
import { TwelveHourTimeWithoutSuffixPipe } from './pipes/twelve-hour-time-withoutsuffix.pipe';
import { TwelveHourTimePipe } from './pipes/twelve-hour-time.pipe';
import { ValidationErrorPipe } from './pipes/validation-errors.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [EscapeHtmlPipe, TwelveHourTimePipe, ValidationErrorPipe, PhonePipe, PhoneFaxPipe, TwelveHourTimeWithoutSuffixPipe],
  exports: [EscapeHtmlPipe, TwelveHourTimePipe, ValidationErrorPipe, PhonePipe, PhoneFaxPipe, TwelveHourTimeWithoutSuffixPipe],
  providers: [DatePipe, PhonePipe, PhoneFaxPipe]
})
export class CustomPipesModule { }
