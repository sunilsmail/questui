import { HttpClientXsrfModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    HttpClientXsrfModule.withOptions({
      headerName: 'X-CSRF-TOKEN',
      cookieName: 'CSRF-TOKEN'
    })
  ],
  exports: [HttpClientXsrfModule]
})
export class CsrfModule {}
