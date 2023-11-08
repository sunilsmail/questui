import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CachingInterceptor } from 'shared/interceptors/caching-interceptor';
import { ApiService } from 'shared/services/api.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';

@NgModule({
  imports: [HttpClientModule, RouterTestingModule, MatSnackBarModule, MockI18nModule, NoopAnimationsModule],
  providers: [ApiService, { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true }]
})
export class MockPactModule {}
