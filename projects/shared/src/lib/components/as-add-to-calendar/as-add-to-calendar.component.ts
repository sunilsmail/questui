import { Component, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Calendar } from 'shared/models/calendar';

@Component({
  selector: 'as-add-to-calendar',
  templateUrl: './as-add-to-calendar.component.html',
  styleUrls: ['./as-add-to-calendar.component.scss']
})
export class AsAddToCalendarComponent implements OnInit, OnChanges {
  MS_IN_MINUTES = 60 * 1000;
  googleUri: string;
  @Input() inputEvent: Calendar;
  @Input() buttonType: String;
  event = {
    title: 'Get on the front page of HN',     // Event title
    start: new Date('2013-06-15T19:00'),   // Event start date
    duration: 0,                            // Event duration (IN MINUTES)
    address: 'The internet',
    description: 'Dear, Your appointment has been confirmed as follows:' +
      'Confirmation Number: FXLRYW Activity Name:  Routine Lab Tests' +
      'Date: Thursday, January 30, 2020 02:15 PM EST'
  };
  yahooUri: string;
  ical: SafeUrl;
  outlook: SafeUrl;
  showDialog: boolean;
  icalUri: SafeUrl;
  outlookUri: SafeUrl;
  isIE: boolean;
  AddToCalAriaLabel = this.i18n('Add to calendar');
  icsfileName = 'Quest Diagnostics Appointment.ics';
  constructor(private sanitizer: DomSanitizer, private router: Router, private i18n: I18n) { }

  ngOnChanges(changes: any) {
    if(changes && changes.inputEvent && changes.inputEvent.currentValue){
      this.inputEvent = changes.inputEvent.currentValue;
      this.init();
    }
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.inputEvent.title = this.inputEvent.title === 'T-SPOT.<i>TB</i> test (tuberculosis)' ?
      'T-SPOT.TB test (tuberculosis)' : this.inputEvent.title;
    if ((navigator.userAgent.includes('Trident/')) || (navigator.userAgent.includes('Edge/'))) // IF IE > 10
    {
      this.isIE = true;
    }
    if (this.inputEvent && this.inputEvent.appointmentTime) {
    const formattedEvent = {
      title: this.inputEvent.title,
      start: new Date(`${this.inputEvent.appointmentDate}T${this.inputEvent.appointmentTime}`.replace(/-/g, '/').replace('T', ' ')),
      duration: 15,
      address: this.inputEvent.name + ', ' +
        this.inputEvent.address1 + ' ' +
        this.inputEvent.address2 + ', ' +
        this.inputEvent.city + ', ' +
        this.inputEvent.state + ' ' +
        this.inputEvent.zip,
      description: `Your appointment has been confirmed as follows:
        Confirmation Number:  ${this.inputEvent.confirmationCode}
        Activity Name: ${this.inputEvent.title}
        Date:  ${this.inputEvent.appointmentDate}, ${this.tConvert(this.inputEvent.appointmentTime)} ${this.inputEvent.time_zone}`
    };
    this.event = this.inputEvent ? formattedEvent : this.event;
    this.getGoogleUri(this.event);
    this.getYahooUri(this.event);
    this.getIcal(this.event);
    this.getOutlook(this.event);
  }
  }

  formatTime(date) {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  }

  tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
      if (time[0].toString().length === 1) {
        time[0] = '0' + time[0];
      }
    }
    return time.join (''); // return adjusted time or original string
  }

  calculateEndTime(event) {
    return event.end ?
      this.formatTime(event.end) :
      this.formatTime(new Date(event.start.getTime() + (event.duration * this.MS_IN_MINUTES)));
  }

  getGoogleUri(event) {
    const startTime = this.formatTime(event.start);
    const endTime = this.calculateEndTime(event);

    this.googleUri = encodeURI([
      'https://www.google.com/calendar/render',
      '?action=TEMPLATE',
      '&text=' + ('Quest Diagnostics Appointment'),
      '&dates=' + (startTime || ''),
      '/' + (endTime || ''),
      '&details=' + (event.description || ''),
      '&location=' + (event.address || ''),
      '&sprop=&sprop=name:'
    ].join(''));
  }

  getYahooUri(event) {
    const yahooEventDuration = '0015';
    const st = this.formatTime(event.start) || '';

    this.yahooUri = encodeURI([
      'http://calendar.yahoo.com/?v=60&view=d&type=20',
      '&title=' + ('Quest Diagnostics Appointment'),
      '&st=' + st,
      '&dur=' + (yahooEventDuration || ''),
      '&desc=' + (event.description || ''),
      '&in_loc=' + (event.address || '')
    ].join(''));
  }

  getIcs(event) {
    const startTime = this.formatTime(event.start);
    const endTime = this.calculateEndTime(event);

    const href = encodeURI(
      'data:text/calendar;charset=utf8,' + [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        'URL:' + document.URL,
        'DTSTART:' + (startTime || ''),
        'DTEND:' + (endTime || ''),
        'SUMMARY:' + ('Quest Diagnostics Appointment'),
        'DESCRIPTION:' + (event.description || ''),
        'LOCATION:' + (event.address || ''),
        'END:VEVENT',
        'END:VCALENDAR'].join('\n'));
    return href;
  }

  // this is for ie11 and edge only
  getIcsForDownload(event) {
    const startTime = this.formatTime(event.start);
    const endTime = this.calculateEndTime(event);

    const href = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'URL:' + document.URL,
      'DTSTART:' + (startTime || ''),
      'DTEND:' + (endTime || ''),
      'SUMMARY:' + ('Quest Diagnostics Appointment'),
      'DESCRIPTION:' + (event.description || ''),
      'LOCATION:' + (event.address || ''),
      'END:VEVENT',
      'END:VCALENDAR'].join('\n');
    return href;
  }

  getIcal(event) {
    this.icalUri = this.sanitizer.bypassSecurityTrustUrl(this.getIcs(event));

  }

  getOutlook(event) {
    this.outlookUri = this.sanitizer.bypassSecurityTrustUrl(this.getIcs(event));
  }

  icsDownload() {
    const blob = new Blob([this.getIcsForDownload(this.event)], { type: 'text/calendar' });
    (window.navigator as any).msSaveOrOpenBlob(blob, this.icsfileName);
  }

  openDialog(ev: MouseEvent) {
    ev.stopPropagation();
    this.showDialog = true;
    setTimeout(() => {
      const element = document.getElementById('googleButton');
      if (element) {
        element.focus();
      }
    });
    this.AddToCalAriaLabel = this.i18n('Calendar list is open and having 4 items');
  }
  closeCalenderDialog(event) {
    if (event.key === 'Escape') {
      this.showDialog = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showDialog) {
      this.showDialog = false;
      this.AddToCalAriaLabel = this.i18n('Add to calendar');
    }
  }

}
