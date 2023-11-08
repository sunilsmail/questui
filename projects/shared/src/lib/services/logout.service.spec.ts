// import { fakeAsync, tick, TestBed } from '@angular/core/testing';

// import { ExpectedConditions } from 'protractor';
// import { of } from 'rxjs';
// import { MockApiService } from 'shared/specs/mocks/mock-api.service';
// import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
// import { ApiService } from './api.service';
// import { LogoutService } from './logout.service';
// import { PropertiesService } from './properties.service';

// describe('LogoutService', () => {
//   const mockWindow = { location: { href: 'http://www.dummy.com', origin: 'http://www.dummy.com' } };
//   let service: LogoutService;
//   let propertiesService: PropertiesService;
//   let window: Window;
//   const mockIFrame1 = { hidden: false, src: '' };
//   const mockIFrame2 = { hidden: false, src: '' };
//   const mockIFrame3 = { hidden: false, src: '' };

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [],
//       providers: [
//         LogoutService,
//         { provide: PropertiesService, useClass: MockPropertiesService },
//         { provide: 'Window', useValue: mockWindow }
//       ]
//     });
//     propertiesService = TestBed.inject(PropertiesService);
//     service = TestBed.inject(LogoutService);
//     window = TestBed.inject('Window');
//   });

//   beforeEach(() => {
//     spyOn(propertiesService, 'getCITSite').and.returnValue(of('http://www.dummy.com/'));
//     spyOn(propertiesService, 'getMyquestSite').and.returnValue(of('http://www.other.com/'));
//     spyOn(propertiesService, 'getAppointmentLogoutLink').and.returnValue(of('http://www.otherdummy.com/'));
//     spyOn(document.body, 'appendChild').and.stub();
//     spyOn(document, 'createElement').and.returnValues(mockIFrame1, mockIFrame2, mockIFrame3);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should create an iFrame for each url', () => {
//     service.logout();
//     expect(document.createElement).toHaveBeenCalledWith('iframe');
//     expect(document.createElement).toHaveBeenCalledTimes(3);
//   });

//   it('should hides all iframe', () => {
//     service.logout();
//     expect(mockIFrame1.hidden).toBeTruthy();
//     expect(mockIFrame2.hidden).toBeTruthy();
//     expect(mockIFrame3.hidden).toBeTruthy();
//   });

//   it('should hides all iframe', () => {
//     service.logout();
//     expect(mockIFrame1.src).toBe('http://www.dummy.com/logout');
//     expect(mockIFrame2.src).toBe('http://www.other.com/logout');
//     expect(mockIFrame3.src).toBe('http://www.otherdummy.com/logout');
//   });

//   it('should appendchild to document body', () => {
//     service.logout();
//     expect(document.body.appendChild).toHaveBeenCalledWith(mockIFrame1);
//     expect(document.body.appendChild).toHaveBeenCalledWith(mockIFrame2);
//     expect(document.body.appendChild).toHaveBeenCalledWith(mockIFrame3);
//     expect(document.body.appendChild).toHaveBeenCalledTimes(3);
//   });

//   it(
//     'should redirect to ',
//     fakeAsync(() => {
//       service.logout();
//       tick(300);
//       expect(window.location.href).toBe('http://www.dummy.com/logout');
//     })
//   );
// });
