import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {
  GoogleAutocompleteResponse,
  GoogleCityStateObject,
  GoogleCityStateZipObject,
  GoogleGeocodeResultObject,
  GoogleLocationAddressResponseObject,
  GoogleLocationObject,
  GoogleLocationResponseObject,
} from 'shared/models';
const CITY_KEY = 'locality';
const STATE_KEY = 'administrative_area_level_1';
const CITY_KEY_1 = 'political';
const STATE_KEY_1 = 'administrative_area_level_2';
const ZIP_KEY = 'postal_code';
const PR_state = 'country';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  AutocompleteService: google.maps.places.AutocompleteService;
  private sessionToken: google.maps.places.AutocompleteSessionToken;
  geocoder: google.maps.Geocoder;


  constructor(private ngZone: NgZone) {
  }

  getGoogleAutocomplete(input: string, types = ['address']): Observable<GoogleAutocompleteResponse> {
    const autocompleteResultSubject = new Subject<GoogleAutocompleteResponse>();
    const autocompleteResults$ = autocompleteResultSubject.asObservable();
    types.forEach(type => {
      this.AutocompleteService.getPlacePredictions(
        {
          input: input,
          sessionToken: this.sessionToken,
          types: [type],
          componentRestrictions: { country: ['us', 'pr'] }
        },
        (predictions: google.maps.places.AutocompletePrediction[], status: google.maps.places.PlacesServiceStatus) => {
          this.ngZone.run(() => {
            autocompleteResultSubject.next({
              predictions,
              status
            });
          });
        }
      );
    });
    return autocompleteResults$;
  }

  getGooglePlaceDetails(placeid: string): Observable<GoogleLocationObject> {
    const placeDetailsResultSubject = new Subject<GoogleLocationObject>();
    const placeDetailsResults$ = placeDetailsResultSubject.asObservable();
    const mapInit = new google.maps.Map(document.createElement('div'));
    const placeService = new google.maps.places.PlacesService(mapInit);
    const request = {
      placeId: placeid,
      fields: ['geometry'],
      sessionToken: this.sessionToken
    };
    placeService.getDetails(request, (place: google.maps.places.PlaceResult, status: google.maps.places.PlacesServiceStatus) => {
      this.ngZone.run(() => {
        placeDetailsResultSubject.next({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      });
    });
    this.sessionToken = new google.maps.places.AutocompleteSessionToken();
    return placeDetailsResults$;
  }

  getGoogleCityState(zipCode: string, country = 'us'): Observable<GoogleCityStateObject> {
    const geocoderZipSubject = new Subject<GoogleCityStateObject>();
    const geocoderZipResults$ = geocoderZipSubject.asObservable();
    this.geocoder.geocode(
      {
        address: zipCode,
        // componentRestrictions: { country: 'us' },
        componentRestrictions: { country: country }
      } as google.maps.GeocoderRequest,
      (res: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        geocoderZipSubject.next(this.getCityStateFromAddressResponse({ results: res }));
      }
    );
    return geocoderZipResults$;
  }

  getGoogleCityStateZipCode(address: string): Observable<GoogleCityStateZipObject> {
    const geocoderSubject = new Subject<GoogleCityStateZipObject>();
    const geocoderResults$ = geocoderSubject.asObservable();
    this.geocoder.geocode(
      {
        address: address
      } as google.maps.GeocoderRequest,
      (res: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        geocoderSubject.next(this.getCityStateZipFromAddressResponse({ results: res }));
      }
    );
    return geocoderResults$;
  }

  private getCityStateZipFromAddressResponse(response: GoogleGeocodeResultObject): GoogleCityStateZipObject {
    let city;
    let state;
    let zip;
    // if we have results
    if (response && response.results.length > 0) {
      const addressComponents = response.results[0].address_components;

      // if we have address_components
      if (addressComponents) {
        city = this.findAddressComponentByKey(addressComponents, CITY_KEY);
        state = this.checkforPrState(addressComponents);
        // state = this.findAddressComponentByKey(addressComponents, STATE_KEY);
        zip = this.findAddressComponentByKey(addressComponents, ZIP_KEY);
      }
      if (!city) {
        city = this.findAddressComponentByKey(addressComponents, CITY_KEY_1);
      }
      if (!state) {
        state = this.findAddressComponentByKey(addressComponents, STATE_KEY_1);
      }
      if (!state) {
        state = this.findAddressComponentByKey(addressComponents, PR_state);
      }

    }

    return {
      city: city ? city.long_name : null,
      state: state ? state.short_name : null,
      zip: zip ? zip.short_name : null
    };
  }

  checkforPrState(address) {
    for (let i = 0; i <= address.length - 1; i++) {
      if ((address[i]?.short_name)?.toUpperCase() === 'PR'
        && address[i].types.includes(PR_state)) {
        return address[i];
      }
    }
    return this.findAddressComponentByKey(address, STATE_KEY);
  }

  getCityStateFromAddressResponse(response: GoogleGeocodeResultObject): GoogleCityStateObject {
    let city;
    let state;
    let postCodeLocalities = [];
    if (response && response.results.length > 0) {
      const addressComponents = response.results[0].address_components;
      postCodeLocalities = response.results[0].postcode_localities;
      // if we have address_components
      if (addressComponents) {
        city = this.findAddressComponentByKey(addressComponents, CITY_KEY);
        state = this.checkforPrState(addressComponents);
        // state = this.findAddressComponentByKey(addressComponents, STATE_KEY);
        if (!city) {
          city = this.findAddressComponentByKey(addressComponents, CITY_KEY_1);
        }
        if (!state) {
          state = this.findAddressComponentByKey(addressComponents, STATE_KEY_1);
        }

      }
    }

    return { city: city ? city.long_name : null, state: state ? state.short_name : null, multiCity: postCodeLocalities };
  }

  getLatLngByZipcode(zipCode: string): Observable<GoogleLocationResponseObject> {
    const geocoderZipSubject = new Subject<GoogleLocationResponseObject>();
    const geocoderZipResults$ = geocoderZipSubject.asObservable();
    this.geocoder.geocode(
      { address: zipCode } as google.maps.GeocoderRequest,
      (res: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        geocoderZipSubject.next(this.getLatLongFromZipResponse({ results: res }));
      }
    );
    return geocoderZipResults$;
  }

  private getLatLongFromZipResponse(response: GoogleGeocodeResultObject): GoogleLocationResponseObject {
    let latitude;
    let longitude;
    if (response && response?.results?.length > 0) {
      latitude = response.results[0].geometry.location.lat();
      longitude = response.results[0].geometry.location.lng();
    }

    return { latitude, longitude };
  }

  getLatLngByCityStateZipcode(address: string): Observable<GoogleLocationAddressResponseObject> {
    const geocoderaddressSubject = new Subject<GoogleLocationAddressResponseObject>();
    const geocoderaddressResults$ = geocoderaddressSubject.asObservable();
    this.geocoder.geocode(
      { address: address } as google.maps.GeocoderRequest,
      (res: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        geocoderaddressSubject.next(this.getLatLongFromCityStateZipCodeResponse({ results: res }));
      }
    );
    return geocoderaddressResults$;
  }

  private getLatLongFromCityStateZipCodeResponse(response: GoogleGeocodeResultObject): GoogleLocationAddressResponseObject {
    let latitude;
    let longitude;
    let fullAddress;
    if (response && response.results.length > 0) {
      latitude = response.results[0].geometry.location.lat();
      longitude = response.results[0].geometry.location.lng();
      fullAddress = response.results[0].formatted_address;
    }

    return { latitude, longitude, fullAddress };
  }

  private findAddressComponentByKey(addressComponents: google.maps.GeocoderAddressComponent[], key: string) {
    return addressComponents.find(addressComponent => addressComponent.types.includes(key));
  }

  addMapsScript(googleMapsUrl) {
    if (!document.querySelectorAll(`[src="${googleMapsUrl}"]`).length) {
      document.body.appendChild(
        Object.assign(document.createElement('script'), {
          type: 'text/javascript',
          src: googleMapsUrl,
          onload: () => {
            this.geocoder = new google.maps.Geocoder();
            this.AutocompleteService = new google.maps.places.AutocompleteService();
            this.sessionToken = new google.maps.places.AutocompleteSessionToken();
          }
        })
      );
    } else {
      this.geocoder = new google.maps.Geocoder();
      this.AutocompleteService = new google.maps.places.AutocompleteService();
      this.sessionToken = new google.maps.places.AutocompleteSessionToken();
    }
  }
  restGoogleGeoCoder() {
    if (!this.geocoder) {
      this.geocoder = new google.maps.Geocoder();
      this.AutocompleteService = new google.maps.places.AutocompleteService();
    }
  }

  getZipcodeByLatLong(latitude, longitude) {
    const latlng = new google.maps.LatLng(latitude, longitude);
    const geocoderZipSubject = new Subject<GoogleCityStateZipObject>();
    const geocoderZipResults$ = geocoderZipSubject.asObservable();
    this.geocoder.geocode(
      { latLng: latlng } as google.maps.GeocoderRequest,
      (res: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        geocoderZipSubject.next(this.getCityStateZipFromAddressResponse({ results: res }));
      }
    );
    return geocoderZipResults$;
  }

}
