import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AsAppFooterComponent } from './as-app-footer.component';


describe('AsAppFooterComponent', () => {
  let component: AsAppFooterComponent;
  let fixture: ComponentFixture<AsAppFooterComponent>;
  let sanitizer: DomSanitizer;
  const footerKeyValuePair = {
    Cookies:'https://www.questdiagnostics.com/home/privacy/cookies',
    Copyright: 'https://www.questdiagnostics.com/home/about/copyright',
    PrivacyShield:'https://www.questdiagnostics.com/home/privacy/privacy-shield',
    Privacy: 'https://www.questdiagnostics.com/home/privacy-policy/online-privacy.html',
    Terms: 'https://www.questdiagnostics.com/home/privacy-policy/terms-conditions.html',
    LanguageAssistance: 'https://www.questdiagnostics.com/home/nondiscrimination.html',
    PersonalInfo:'https://www.questdiagnostics.com/home/do-not-sell'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsAppFooterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, MatIconModule, MatButtonModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsAppFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    sanitizer = TestBed.inject(DomSanitizer);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getSafeUrl', () => {
    it('should return cookies notice safeURL', () => {
      expect(component.getSafeUrl(footerKeyValuePair.Cookies))
        .toEqual(sanitizer.bypassSecurityTrustUrl('https://www.questdiagnostics.com/home/privacy/cookies'));
    });
    it('should return copyright safeURL', () => {
      expect(component.getSafeUrl(footerKeyValuePair.Copyright))
        .toEqual(sanitizer.bypassSecurityTrustUrl('https://www.questdiagnostics.com/home/about/copyright'));
    });
    it('should return Privacy Shield safeURL', () => {
      expect(component.getSafeUrl(footerKeyValuePair.PrivacyShield))
        .toEqual(sanitizer.bypassSecurityTrustUrl('https://www.questdiagnostics.com/home/privacy/privacy-shield'));
    });
    it('should return Privacy safeURL', () => {
      expect(component.getSafeUrl(footerKeyValuePair.Privacy))
        .toEqual(sanitizer.bypassSecurityTrustUrl('https://www.questdiagnostics.com/home/privacy-policy/online-privacy.html'));
    });

    it('should return Terms safeURL', () => {
      expect(component.getSafeUrl(footerKeyValuePair.Terms))
        .toEqual(sanitizer.bypassSecurityTrustUrl('https://www.questdiagnostics.com/home/privacy-policy/terms-conditions.html'));
    });

    it('should return LanguageAssistance safeURL', () => {
      expect(component.getSafeUrl(footerKeyValuePair.LanguageAssistance))
        .toEqual(sanitizer.bypassSecurityTrustUrl('https://www.questdiagnostics.com/home/nondiscrimination.html'));
    });
    it('should return DO NOT SELL MY PERSONAL INFORMATION safeURL', () => {
      expect(component.getSafeUrl(footerKeyValuePair.PersonalInfo))
        .toEqual(sanitizer.bypassSecurityTrustUrl('https://www.questdiagnostics.com/home/do-not-sell'));
    });
  });

});
