import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor(@Inject(LOCALE_ID) private locale: string) { }

  /**
   * Returns a string representation of the date in the
   * format `yyyy-mm-dd`
   * @param dateTime - DateTime to retrieve year/month/day
   */
  toDate(dateTime: string): string {
    if (!dateTime) { return dateTime; }

    return formatDate(dateTime, 'yyyy-MM-dd', this.locale);
  }


  toDateTime(date: string): string {
    if (!date) { return date; }

    return `${date}T00:00:00`;
  }

  /**
   * Returns a string representation of the date in the
   * format `yyyy-mm-dd`
   * @param dateTime - DateTime to retrieve year/month/day
   */
  toDateMMDDYY(dateTime: string): string {
    if (!dateTime) { return dateTime; }

    return formatDate(dateTime, 'MM/dd/yy', this.locale);
  }
  getAge(dateOfBirth: string): number {
    // https://stackoverflow.com/a/7091965
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  lessThanToday(date: Date): boolean {
    const compareDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate.getTime() < today.getTime();
  }

  getTimezoneOffset(data: string) {
    const date = new Date(data);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date;
  }

  toDateMMDDYYYY(dateTime: string): string {
    if (!dateTime) { return dateTime; }

    return formatDate(dateTime, 'MM/dd/yyyy', this.locale);
  }

  getCurrentDateWithTimeZone() {
    // getting time zone
    const timeZone = moment.tz.guess();
    // getting current time
    const time = new Date();
    // calculating timezone offset
    const timeZoneOffset = time.getTimezoneOffset();
    // formatting date time and timezone
    return (`${moment().format('L')} - ${moment().format('LT')} ${moment.tz.zone(timeZone).abbr(timeZoneOffset)}`);
  }

  getCurrentDateWithTimeZoneForStandAloneHipaa() {
    const timeZone = moment.tz.guess();
    return (`${moment().tz(timeZone).format('MM/DD/YYYY - hh:mm A zz')}`);
  }

  getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

}
