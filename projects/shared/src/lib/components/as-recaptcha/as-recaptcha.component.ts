import { Component, ElementRef, EventEmitter, Inject, LOCALE_ID, NgZone, OnInit, Output } from '@angular/core';
import { environment } from 'shared/environments/environment';

const SITE_KEY = environment.invisibleRecaptchaKey;

// Stop Typescript complaints on Window
interface WindowHack extends Window {
  grecaptcha: any;
  reCaptchaLoad: () => void;
}
@Component({
  selector: 'as-recaptcha',
  templateUrl: './as-recaptcha.component.html',
  styleUrls: ['./as-recaptcha.component.scss']
})
export class AsRecaptchaComponent implements OnInit {
  @Output() valueChanged = new EventEmitter<string>();

  constructor(private element: ElementRef, private ngZone: NgZone, @Inject(LOCALE_ID) private locale: string) {}

  ngOnInit() {
    this.registerReCaptchaCallback();
    this.addScript();
  }

  registerReCaptchaCallback() {
    (window as WindowHack & typeof globalThis).reCaptchaLoad = () => {
      const config = {
        sitekey: SITE_KEY,
        id: 'recaptcha',
        class: 'g-recaptcha',
        size: 'invisible',
        callback: this.onSuccess.bind(this),
        'expired-callback': this.onExpired.bind(this)
      };
      this.render(this.element.nativeElement, config);
    };
  }

  addScript() {
    const script = document.createElement('script');
    const lang = this.locale ? '&hl=' + this.locale : '';
    script.src = `https://www.google.com/recaptcha/api.js?onload=reCaptchaLoad&render=explicit${lang}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  onSuccess(token: string) {
    this.emitValueInAngularZone(token);
  }

  onExpired() {
    // No need to check for expired currently as its not possible for the token to be expired
    // this.emitValueInAngularZone(null);
  }

  execute() {
    return (window as WindowHack & typeof globalThis).grecaptcha.execute();
  }

  private emitValueInAngularZone(token: string) {
    // onSuccess and onExpired are called outside of Angular, and this gets the event back in Angular so other components can respond to it.
    this.ngZone.run(() => {
      this.valueChanged.emit(token);
    });
  }

  private render(element: HTMLElement, config): number {
    return (window as WindowHack & typeof globalThis).grecaptcha.render(element, config);
  }

}
