import { LOCALE_ID, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

const XLIFF = `<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="f4661fab0bda1dae3620088f290a8f086a6ca26e" datatype="html">
        <source>Foo</source>
        <target>Foo</target>
        <context-group purpose="location">
          <context context-type="sourcefile">file.ts</context>
          <context context-type="linenumber">1</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>
`;

@NgModule({
  declarations: [],
  exports: [],
  imports: [],
  providers: [
    I18n,
    { provide: LOCALE_ID, useFactory: () => 'en' },
    {
      provide: TRANSLATIONS,
      useValue: XLIFF,
      deps: [LOCALE_ID]
    },
    { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' }
  ]
})
export class MockI18nModule {}
