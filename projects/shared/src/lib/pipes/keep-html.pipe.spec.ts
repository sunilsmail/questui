import { SecurityContext } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { EscapeHtmlPipe } from 'shared/pipes/keep-html.pipe';

describe('EscapeHTMLPipe', () => {
  let pipe: EscapeHtmlPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule]
    });
  });

  beforeEach(
    inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
      pipe = new EscapeHtmlPipe(domSanitizer);
    })
  );
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it(
    'should transform',
    inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
      const string = pipe.transform('Cross <script>alert(\'Hello\')</script>');
      const stringValue = domSanitizer.sanitize(SecurityContext.HTML, string);

      expect(stringValue).toBe('Cross <script>alert(\'Hello\')</script>');
    })
  );
});
