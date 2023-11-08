import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Angulartics2Module } from 'angulartics2';
import { CachingInterceptor } from 'shared/interceptors/caching-interceptor';
import { ApiService } from 'shared/services/api.service';
import { GoogleKeyService } from 'shared/services/google-key.service';
import { SharedModule } from 'shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

declare const require;
export function translationsFactory(locale: string) {
  return require(`raw-loader!../locale/messages.${locale}.xlf`).default;
}
// To avoid calling multiple times propertiesService.getGoogleApiKey() for key, implemented APP_INITIALIZER
export function getGoogleKey(configService: GoogleKeyService){
  return () => configService.loadKey();
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    Angulartics2Module.forRoot(),
    HttpClientXsrfModule.withOptions({
      headerName: 'X-CSRF-TOKEN',
      cookieName: 'CSRF-TOKEN'
    })
  ],
  providers: [
    ApiService,
    I18n,
    { provide: LOCALE_ID, useFactory: () => 'en' },
    {
      provide: TRANSLATIONS,
      useFactory: translationsFactory,
      deps: [LOCALE_ID]
    },
    { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
    { provide: APP_INITIALIZER, multi: true, deps: [GoogleKeyService], useFactory: getGoogleKey },
    { provide: MAT_SELECT_CONFIG, useValue: { overlayPanelClass: 'ds-overlay-panel' }},
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {
        panelClass: ['ds-modal', 'ds-grid--12', 'ds-elevation--L3'],
        hasBackdrop: true,
        role: 'dialog',
        ariaLabelledBy: 'mat-dialog-title',
        autoFocus: true,
      }
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
