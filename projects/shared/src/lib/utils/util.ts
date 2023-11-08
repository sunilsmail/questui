import { AbstractControl } from '@angular/forms';
import moment from 'moment';
import { regex } from './validation/regex-patterns';

export function getValueByKeys(data: any, keys: string[]) {
  const returnVal = keys.reduce((obj, level) => {
    return obj && obj[level];
  }, data);

  if (returnVal === null || returnVal === undefined) {
    return null;
  }
  return returnVal;
}


export function groupBy(items: any[], key: string) {
  return items.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}


export function repeat<T>(item: T, times: number): T[] {
  // temporary production fix need to revisit.
  if (times > 0) {
    return new Array(times).fill(item);
  }
  return new Array().fill(item);
}

export function timeDiff(startTime: string, endTime: string): number {
  try {
    const startDate = '01/01/2000 ' + startTime;
    const endDate = '01/01/2000 ' + endTime;
    const diff2 = moment.duration(moment(endDate, 'DD/MM/YYYY HH:mm')
      .diff(moment(startDate, 'DD/MM/YYYY HH:mm')));
    return Math.abs(diff2.asMinutes());
  } catch (ex) {
    return 0;
  }
}
export function getGender(gender: string) {
  switch (gender.toLowerCase()) {
    case 'm': return 'Male';
    case 'f': return 'Female';
    case 'male': return 'Male';
    case 'female': return 'Female';
  }
}

export function getBooleanFromString(value: string) {
  return JSON.parse(value.toLowerCase());
}

export function formatPhone(phone: string, control: AbstractControl = null) {

  if (phone.length === 12 && phone.match(regex.phoneNumber)) {
    return phone;
  } else if (!phone.includes('-')) {
    phone = phone.replace(/[^0-9]+/ig, '');
    if (phone && phone.length === 10) {
      return phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
    }
    if (phone && phone.length >= 10 && control) {
      control.markAsDirty();
      control.markAsTouched();
      return phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
    }
    if (phone && phone.length < 10 && control) {
      control.markAsDirty();
      control.markAsTouched();
      return phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
    }
  } else if ((phone.match(/-/g) || []).length < 2) {
    phone = phone.replace(/[^0-9]+/ig, '');
    return phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
  }

}


export function getValueIfNull(value: any) {
  if (value === null || value === undefined) {
    return false;
  }
  return value;
}


export function getClinicalTrailsFormatGender(gender: string) {
  switch (gender.toLowerCase()) {
    case 'male': return 'M';
    case 'female': return 'F';
  }
}

export const PR_State = 'PR';
export const NJ_State = 'nj';

export function formatDOB(value: string) {
  try {
    const dob = value.replace(/[/]/gi, '');
    return `${dob.slice(0, 2)}/${dob.slice(2, 4)}/${dob.slice(4, 8)}`;
  }
  catch (e) {
    return value;
  }

}

