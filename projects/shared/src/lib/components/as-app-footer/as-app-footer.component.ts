import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'as-app-footer',
  templateUrl: './as-app-footer.component.html',
  styleUrls: ['./as-app-footer.component.scss']
})
export class AsAppFooterComponent implements OnInit {
  footerKeyValuePair: any;
  constructor(private sanitizer: DomSanitizer) {
    this.footerKeyValuePair = {
      Cookies:'https://www.questdiagnostics.com/home/privacy/cookies/',
      Copyright: 'https://www.questdiagnostics.com/home/about/copyright',
      PrivacyShield:'https://www.questdiagnostics.com/home/privacy/privacy-shield',
      Privacy: 'https://www.questdiagnostics.com/home/privacy-policy/online-privacy.html',
      Terms: 'https://www.questdiagnostics.com/home/privacy-policy/terms-conditions.html',
      LanguageAssistance: 'https://www.questdiagnostics.com/home/nondiscrimination.html',
      PersonalInfo:'https://www.questdiagnostics.com/home/do-not-sell'
    };
  }

  ngOnInit() {}

  getSafeUrl(value): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }

}
