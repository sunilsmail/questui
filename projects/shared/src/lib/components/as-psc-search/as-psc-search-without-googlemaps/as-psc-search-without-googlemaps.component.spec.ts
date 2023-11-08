// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { AsAddressWithoutGoogleMapsComponent }
// from 'app/modules/as-schedule-appointment/components/as-address-without-google-maps/as-address-without-google-maps.component';
// import { of } from 'rxjs';
// import { GoogleAutocompletePrediction, GooglePlaceDetailsResponse, GooglePlaceDetailsResult, UserLocation } from 'shared/models';
// import { GoogleMapsService } from 'shared/services/google-maps.service';
// import { UserCurrentLocationService } from 'shared/services/user-current-location.service';
// import { MockGoogleMapsService } from 'shared/specs/mocks/mock-google-maps.service';



// const mockDetailResponse = new GooglePlaceDetailsResponse();
// const mockLocation = { lat: 5, lng: 5 };
// const mockUserLocation: UserLocation = { latitude: 5, longitude: 5 };
// mockDetailResponse.result = {} as GooglePlaceDetailsResult;
// mockDetailResponse.result.geometry = {
//   location: mockLocation,
//   viewport: { northeast: mockLocation, southwest: mockLocation }
// };

// const mockAutocompletePrediction = new GoogleAutocompletePrediction();
// mockAutocompletePrediction.place_id = 'some-id';

// const mockPredictions = new Array(5).fill(new GoogleAutocompletePrediction());

// class MockUserCurrentLocationService {
//   getCurrentPosition() {
//     return of(mockLocation);
//   }
// }

// describe('AsAddressWithoutGoogleMapsComponent', () => {
//   let component: AsAddressWithoutGoogleMapsComponent;
//   let fixture: ComponentFixture<AsAddressWithoutGoogleMapsComponent>;
//   let userLocationService: UserCurrentLocationService;
//   let googleService: GoogleMapsService;

//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       declarations: [AsAddressWithoutGoogleMapsComponent],
//       imports: [MatAutocompleteModule, ReactiveFormsModule],
//       providers: [
//         { provide: UserCurrentLocationService, useClass: MockUserCurrentLocationService },
//         { provide: GoogleMapsService, useClass: MockGoogleMapsService }
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     userLocationService = TestBed.inject(UserCurrentLocationService);
//     googleService = TestBed.inject(GoogleMapsService);

//     fixture = TestBed.createComponent(AsAddressWithoutGoogleMapsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//   it('starts loading false', () => {
//     expect(component.loading).toEqual(false);
//   });

//   describe('#getUserLocation', () => {
//     describe('', () => {
//       beforeEach(() => {
//         spyOn(userLocationService, 'getCurrentPosition').and.returnValue(of());
//         component.searchControl.patchValue('thing', { emitEvent: false });
//         component.getUserLocation();
//       });

//       it('sets loading to true', () => {
//         expect(component.loading).toEqual(true);
//       });

//       it('sets searchControl to empty string', () => {
//         expect(component.searchControl.value).toEqual('thing');
//       });

//       it('calls getCurrentPosition', () => {
//         expect(userLocationService.getCurrentPosition).toHaveBeenCalledWith(false);
//       });
//     });

//     describe('google autocomplete searchControl', () => {
//       describe('when loading is true', () => {
//         beforeEach(() => {
//           spyOn(googleService, 'getGoogleAutocomplete').and.callThrough();
//           component.loading = true;
//           component.searchControl.patchValue('something');
//         });

//         it('does not call getGoogleAutocomplete', () => {
//           expect(googleService.getGoogleAutocomplete).not.toHaveBeenCalled();
//         });
//       });
//     });
//     describe('on getCurrentPosition success', () => {
//       beforeEach(() => {
//         spyOn(userLocationService, 'getCurrentPosition').and.callThrough();
//         spyOn(component.locationChanged, 'emit').and.stub();
//         component.searchControl.patchValue('thing', { emitEvent: false });
//         component.getUserLocation();
//       });

//       it('sets loading to false', () => {
//         expect(component.loading).toEqual(false);
//       });

//       it('emits to locationChanged', () => {
//         expect(component.locationChanged.emit).toHaveBeenCalledWith(mockLocation as any);
//       });
//     });
//   });

//   // describe('#onOptionSelect', () => {
//   //   describe('', () => {
//   //     beforeEach(() => {
//   //       spyOn(googleService, 'getGooglePlaceDetails').and.returnValue(of());
//   //       component.options = [mockAutocompletePrediction];
//   //       component.onOptionSelect(mockAutocompletePrediction);
//   //     });

//   //     it('sets loading to true', () => {
//   //       expect(component.loading).toEqual(true);
//   //     });

//   //     it('calls getGooglePlaceDetails', () => {
//   //       expect(googleService.getGooglePlaceDetails).toHaveBeenCalledWith('some-id');
//   //     });
//   //   });

//   //   describe('on getGooglePlaceDetails success', () => {
//   //     beforeEach(() => {
//   //       spyOn(googleService, 'getGooglePlaceDetails').and.callThrough();
//   //       spyOn(component.locationChanged, 'emit').and.stub();
//   //       spyOn(component.searchInput.nativeElement, 'blur');
//   //       component.options = [mockAutocompletePrediction];
//   //       component.onOptionSelect(mockAutocompletePrediction);
//   //     });

//   //     it('sets loading to false', () => {
//   //       expect(component.loading).toEqual(false);
//   //     });

//   //     it('sets the options to an empty array', () => {
//   //       expect(component.options).toEqual([]);
//   //     });

//   //     it('emits to locationChanged', () => {
//   //       const expected = { latitude: mockLocation.lat, longitude: mockLocation.lng };
//   //       expect(component.locationChanged.emit).toHaveBeenCalled();
//   //     });
//   //   });
//   // });
// });
