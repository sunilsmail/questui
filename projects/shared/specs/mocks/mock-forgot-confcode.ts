import { of, Observable } from 'rxjs';


export const mockForgotConfcodedata = {data: null};


export class MockForgotConfcodeService {

  forgotConfirmationCode(request: any): Observable<any> {
     return of(mockForgotConfcodedata);
  }

  resendConfimationCode(){
    return of(mockForgotConfcodedata);
  }
}


