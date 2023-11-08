// import { TestBed } from '@angular/core/testing';
// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';
// import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
// import { MockApiService } from 'shared/specs/mocks/mock-api.service';
// import { MockUserService } from 'shared/specs/mocks/mock-user.service';
// import { ApiService } from '../api.service';
// import { UserService } from '../user.service';
// import { PscDetailsService } from './psc-details.service';

// describe('PscDetailsService', () => {
//   let service: PscDetailsService;
//   let apiMock: any;
//   let route: any;
//   let userService: UserService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         PscDetailsService,
//         { provide: ApiService, useClass: MockApiService },
//         { provide: ActivatedRoute, useClass: MockActivatedRoute },
//         { provide: UserService, useClass: MockUserService },
//       ]
//     });
//     service = TestBed.inject(PscDetailsService);
//     userService = TestBed.inject(UserService);
//     apiMock = TestBed.inject(ApiService);
//     route = TestBed.inject(ActivatedRoute);
//   });

//   it('can load instance', () => {
//     expect(service).toBeTruthy();
//   });

//   describe('#enableNewUI', () => {
//     beforeEach(() => {
//       spyOn(apiMock, 'get').and.returnValue(of(true));
//     });
//     it('makes expected calls', () => {
//       service.enableNewUI().subscribe();
//       expect(apiMock.get).toHaveBeenCalledWith('/guest/redirectAMPMSlots');
//     });
//   });

//   describe('#enableSiteCodeWithQueryParams', () => {
//     beforeEach(() => {
//       service.enableSitecodeinFindLocationFlow = false;
//     });

//     it('when sitecode value is true', () => {
//       route.setQueryParam('showsitecode', 'true');
//       service.enableSiteCodeWithQueryParams();
//       expect(service.enableSitecodeinFindLocationFlow).toBe(true);
//     });

//     it('when sitecode value is not true', () => {
//       route.setQueryParam('showsitecode', 'something');
//       service.enableSiteCodeWithQueryParams();
//       expect(service.enableSitecodeinFindLocationFlow).toBe(false);
//     });
//   });

// });
