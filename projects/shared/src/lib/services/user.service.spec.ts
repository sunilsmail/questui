import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { MockMiantainService } from 'shared/specs/mocks/mock-maintain.service';
import { mockTermsAndConditions, mockUserDemographic, mockUserSummaries } from 'shared/specs/mocks/mock-user.service';
import { ApiService } from './api.service';
import { MaintainService } from './maintenace.service';
import { UserService } from './user.service';
describe('UserService', () => {
  let service: UserService;
  let apiMock: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: ApiService, useClass: MockApiService },
        { provide: MaintainService, useClass: MockMiantainService }
      ]
    });
    service = TestBed.inject(UserService);
    apiMock = TestBed.inject(ApiService);

  });
/*  it('should be created', () => {
    const service: UserService = TestBed.inject(UserService);
    expect(service).toBeTruthy();
  }); */
  describe('#getTermsAndConditions', () => {
    beforeEach(() => {
      spyOn(apiMock, 'post').and.returnValue(of(mockTermsAndConditions));
    });
    it('gets the terms and conditions', () => {
      service.getTermsAndConditions().subscribe(tcs => {
        expect(tcs).toEqual(mockTermsAndConditions);
      });
    });
    it('calls the correct api route', () => {
      service.getTermsAndConditions().subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('guest/getTermsAndConditions');
    });
  });

  describe('#getUserDemographics', () => {
    it('should return getUserDemographics', done => {
      spyOn(apiMock, 'post').and.returnValue(of(mockUserDemographic));

      service.getUserDetails().subscribe(user => {
        expect(user).toEqual(mockUserDemographic);
        done();
      });

      expect(apiMock.post).toHaveBeenCalledWith('api/getUserDemographics');
    });
  });

  describe('#getUserDetails', () => {
    it('should call getUserDemographics & getUserSummaries APIs', done => {
      spyOn(apiMock, 'post').and.returnValues(of(mockUserDemographic), of(mockUserSummaries));
      service.getUserDetails().subscribe(response => {
        expect(response).toBeDefined();
        done();
      });

      expect(apiMock.post).toHaveBeenCalledTimes(2);
    });
  });

  it('checkForEmailVerification$ -> true', () => {
    const userService: UserService = TestBed.inject(UserService);
    userService.checkForEmailVerification(mockUserDemographic, mockUserSummaries);
    expect(userService).toBeTruthy();
    userService.isEmailConfirmSubject$.subscribe(isFlowActive => {
      expect(isFlowActive).toBeTruthy();
    });
  });

});
