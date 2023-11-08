import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFax'
})
export class PhoneFaxPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value || value.length !== 10) {
      return value;
    }

    return `(${value.slice(0, 3)})${value.slice(3, 6)}-${value.slice(6, 10)}`;
  }
}
