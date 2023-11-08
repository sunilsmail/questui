import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twelveHourTimeWithoutSuffix'
})
export class TwelveHourTimeWithoutSuffixPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) { return null; }

    const times = value.split(':', 2);
    let hours = parseInt(times[0], 10);

    if (hours >= 12) {

      if (hours >= 13) {
        hours -= 12;
      }
    }

    if (times[0] === '00') {
      hours = 12;
    }

    return hours.toString() + ':' + times[1];
  }
}
