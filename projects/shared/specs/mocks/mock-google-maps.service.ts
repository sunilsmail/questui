import { of, Observable } from 'rxjs';
import { GoogleAutocompletePrediction, GooglePlaceDetailsResponse, GooglePlaceDetailsResult } from 'shared/models';

const mockDetailResponse = new GooglePlaceDetailsResponse();
export const mockLocation = { lat: 5, lng: 5 };
mockDetailResponse.result = {} as GooglePlaceDetailsResult;
mockDetailResponse.result.geometry = {
  location: mockLocation,
  viewport: { northeast: mockLocation, southwest: mockLocation }
};

export const mockAutocompletePrediction = new GoogleAutocompletePrediction();
mockAutocompletePrediction.place_id = 'some-id';
mockAutocompletePrediction.description = 'some-id';

export const mockPredictions = new Array(5).fill(new GoogleAutocompletePrediction());

export const mockCityStateResponse = { city: 'Huntsville', state: 'AL' };
export const mockCityNoStateResponse = { city: 'Huntsville', state: 'XX' };

export const mockCityStateZipResponse = { address1: '2 peak st,', city: 'Huntsville', state: 'AL', zip: '45040' };
export const mockCityNoStateZipResponse = { address1: '2 peak st,', city: 'Huntsville', state: 'XX', zip: '45040' };

export class MockUserCurrentLocationService {
  getCurrentPosition() {
    return of(mockLocation);
  }
}

export class MockGoogleMapsService {
  getGooglePlaceDetails(placeid: string) {
    return of(mockDetailResponse);
  }
  getGoogleAutocomplete(input: string) {
    return of({ predictions: mockPredictions });
  }

  getGoogleCityState(zipCode: string): Observable<{ city: string; state: string }> {
    return (zipCode === '45000' ? of(mockCityNoStateResponse) : of(mockCityStateResponse));
  }

  getCityStateFromAddressResponse(val: any) {
    if (!val.city && !val.state) {
      return null;
    }
    return (val.state === 'AL' ? mockCityStateResponse : mockCityNoStateResponse);
  }

  getGoogleCityStateZipCode(place: string): Observable<{ address1: string, city: string; state: string; zip: string }> {
    return (place ? of(mockCityStateZipResponse) : of(mockCityNoStateZipResponse));
  }
  getLatLngByZipcode(zipCode: string): Observable<{latitude: number, longitude: number}>{
    if(zipCode) {
      return of({latitude: 1, longitude: 1});
    }
  }

  addMapsScript() { }

  getZipcodeByLatLong(latitude, longitude) {
    return of({
      city: 'ohio',
      zip: 45040
    });
  }
}
