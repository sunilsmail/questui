import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { ApiService } from './api.service';
import { ForgotConfirmationCodeService } from './forgot-confcode.service';


describe('ForgotConfirmationCodeService', () => {
  let forgotConfirmationCodeService: ForgotConfirmationCodeService;
  let apiMock: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ForgotConfirmationCodeService,
        { provide: ApiService, useClass: MockApiService }
      ]
    });
    forgotConfirmationCodeService = TestBed.inject(ForgotConfirmationCodeService);
    apiMock = TestBed.inject(ApiService);
    spyOn(apiMock, 'post').and.returnValue(of(null));
  });
  it('should be created', () => {
    const service: ForgotConfirmationCodeService = TestBed.inject(ForgotConfirmationCodeService);
    expect(service).toBeTruthy();
  });

  describe('#forgotConfirmationCode', () => {
    const request = {
      phone: '1234567890',
      email: 'admin@gmail.com'
    };
    it('should call guest/forgotConfCode api', () => {
      forgotConfirmationCodeService.forgotConfirmationCode(request).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/guest/forgotConfCode', request);
    });
  });

  describe('#resendConfimationCode', () => {
    const request = {
      phone: '1234567890',
      email: 'admin@gmail.com'
    };
    it('should call guest/forgotConfCode api resend', () => {
      forgotConfirmationCodeService.requestBody = request;
      forgotConfirmationCodeService.resendConfimationCode().subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('/guest/forgotConfCode', request);
    });
  });

});
