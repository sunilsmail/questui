import { Directive, DoCheck, ElementRef } from '@angular/core';

@Directive({
  selector: '[AutoCompletePhoneFormatter]'
})
export class AsPhoneFormatterDirective implements DoCheck {
  constructor(private el: ElementRef) {
  }

  ngDoCheck(): void {
    // if (document?.getElementById('phone')?.matches(':-webkit-autofill')) {
    let val = (document?.getElementById('phone') as any).value;
    if (val.length === 11) {
      val = val.replace(/-/gi, '');
    }

    if (val.length >= 10 && !val.includes('-') && val.length !== 12) {
      this.el.nativeElement.value = (`${val.substring(0, 3)}-${val.substring(3, 6)}-${val.substring(6, 10)}`);
    }
    // }
  }
}
