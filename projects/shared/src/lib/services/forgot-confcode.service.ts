import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ForgotConfirmationCode } from 'shared/models/forgot-confirmationcode';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotConfirmationCodeService {
  constructor(private api: ApiService) { }
  public requestBody = null;

  forgotConfirmationCode(request: ForgotConfirmationCode): Observable<any> {
    this.requestBody = request;
    return this.api.post('/guest/forgotConfCode', request);
  }

  resendConfimationCode(){
    return this.api.post('/guest/forgotConfCode', this.requestBody);
  }

}
