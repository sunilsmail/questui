// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { of } from 'rxjs';
// import { CustomPipesModule } from 'shared/custom-pipes.module';
// import { DataService } from 'shared/services/data.service';
// import { PropertiesService } from 'shared/services/properties.service';
// import { MockDataService } from 'shared/specs/mocks/mock-data.service';
// import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
// import { AsConfirmationComponent } from './as-confirmation.component';

// const MockActivatedRoute = {
//     params: of({ confirmationCode: 'confirm' })
// };

// fdescribe('AsConfirmationComponent', () => {
//     let component: AsConfirmationComponent;
//     let fixture: ComponentFixture<AsConfirmationComponent>;
//     let dataService: DataService;
//     let route: ActivatedRoute;
//     let router: Router;
//     let propertyService: PropertiesService;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [AsConfirmationComponent],
//             imports: [CustomPipesModule,
//                 RouterTestingModule,
//                 HttpClientTestingModule],
//             providers: [
//                 { provide: DataService, useClass: MockDataService },
//                 { provide: ActivatedRoute, useValue: MockActivatedRoute },
//                 { provide: PropertiesService, useValue: MockPropertiesService },
//             ],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         propertyService = TestBed.inject(PropertiesService);
//         router = TestBed.inject(Router);
//         fixture = TestBed.createComponent(AsConfirmationComponent);
//         dataService = TestBed.inject(DataService);
//         route = TestBed.inject(ActivatedRoute);
//         component = fixture.componentInstance;
//         spyOn(window, 'print').and.stub();
//         spyOn(router, 'navigate').and.stub();
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should get personalData', () => {
//         expect(component.personalData.firstName).toBe('sayed');
//     });
//     it('should get appointmentData', () => {
//         expect(component.appointmentData.siteCode).toBe('T2O');
//     });
//     it('should set message according to email preference', () => {
//         expect(component.message).toBe('Your confirmation email is on its way.');
//     });
//     it('should set the confirmation cco', () => {
//         expect(component.confirmationCode).toEqual('confirm');
//     });
//     it('should set message according to mobile preference', () => {
//         spyOn(window, 'open').and.callFake(function () {
//             return true;
//         });
//         const spy = spyOn(dataService, 'getPersonalData').and.callFake(() => {
//             return of(
//                 {
//                     address1: '',
//                     address2: '',
//                     city: '',
//                     createAccount: '',
//                     dateOfBirth: new Date,
//                     email: 'sayedsohel@gmail.com',
//                     firstName: 'sayed',
//                     gender: 'male',
//                     insuranceInfo: 'insurance-no',
//                     isMobile: 'yes',
//                     lastName: 'sohel',
//                     password: '',
//                     phone: '2222222222',
//                     preferences: {
//                         preference_email: false,
//                         preference_mobile: true
//                     },
//                     state: '',
//                     termsOfService: false,
//                     zipCode: ''
//                 }
//             );
//         });
//         fixture = TestBed.createComponent(AsConfirmationComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//         expect(spy).toHaveBeenCalled();
//         expect(component.message).toBe('Your confirmation text is on its way.');
//     });

//     it('should set message if both preferences are selected', () => {
//         spyOn(window, 'open').and.callFake(function () {
//             return true;
//         });
//         const spy = spyOn(dataService, 'getPersonalData').and.callFake(() => {
//             return of(
//                 {
//                     address1: '',
//                     address2: '',
//                     city: '',
//                     createAccount: '',
//                     dateOfBirth: new Date,
//                     email: 'sayedsohel@gmail.com',
//                     firstName: 'sayed',
//                     gender: 'male',
//                     insuranceInfo: 'insurance-no',
//                     isMobile: 'yes',
//                     lastName: 'sohel',
//                     password: '',
//                     phone: '2222222222',
//                     preferences: {
//                         preference_email: true,
//                         preference_mobile: true
//                     },
//                     state: '',
//                     termsOfService: false,
//                     zipCode: ''
//                 }
//             );
//         });
//         fixture = TestBed.createComponent(AsConfirmationComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//         expect(spy).toHaveBeenCalled();
//         expect(component.message).toBe('Your confirmation email and text are on the way.');
//     });

//     describe('userLocation', () => {
//         beforeEach(() => {
//             spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
//                 const position = { coords: { latitude: 0, longitude: 0 } };
//                 arguments[0](position);
//             });
//         });
//         it('should get the user location and set userLocation', () => {
//             component.ngOnInit();
//             expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
//             expect(component.userLocation).toEqual('0+0');
//         });
//     });

//     it('should open googlemaps without starting address if  no userlocation found', () => {
//         spyOn(window, 'open').and.callFake(function () {
//             return true;
//         });
//         component.openDirection();
//         expect(window.open).toHaveBeenCalledWith('http://maps.google.com/maps?daddr=160 W 26Th St  New York NY 10001-6975'
//             + 'Quest Diagnostics - NYC-26th St PSC - Employer Drug Testing Not Offered', '_blank');
//     });
//     it('should open googlemaps with starting address if userlocation found', () => {
//         component.userLocation = 'new jersey';
//         spyOn(window, 'open').and.callFake(function () {
//             return true;
//         });
//         component.openDirection();
//         expect(window.open)
//             .toHaveBeenCalledWith('http://maps.google.com/maps?saddr=new jersey&daddr=160 W 26Th St  New York NY 10001-6975'
//                 + 'Quest Diagnostics - NYC-26th St PSC - Employer Drug Testing Not Offered', '_blank');
//     });
//     it('should print to confirmation print page', () => {
//         component.printConfirmation();
//         expect(window.print).toHaveBeenCalled();
//     });

//   describe('navigateToSummary', () => {
//     beforeEach(() => {
//       component.confirmationCode = null;
//     });
//     it('should able to navigate to summary', () => {
//       component.confirmationCode = 'ASDFGH';
//       component.navigateToSummary();
//       expect(router.navigate).toHaveBeenCalledWith(['/find-appointment/as-find-appointment-summary'], {
//         queryParams: { confirmationCode: component.confirmationCode }
//       });
//     });
//     it('should not able to navigate to summary', () => {
//       component.navigateToSummary();
//       expect(component.confirmationCode).toBe(null);
//     });
//   });

// });


