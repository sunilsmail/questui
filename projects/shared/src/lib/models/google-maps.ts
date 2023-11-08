export class GoogleAutocompleteResponse {
  predictions: google.maps.places.AutocompletePrediction[];
  status: google.maps.places.PlacesServiceStatus;
}

export class GoogleAutocompletePrediction {
  description: string;
  id: string;
  matched_substrings: { length: number; offset: number }[];
  place_id: string;
  reference: string;
  terms: { offset: number; value: string }[];
  types: string[];
  structured_formatting: google.maps.places.AutocompleteStructuredFormatting;
}

export class GooglePlaceDetailsResponse {
  html_attributions: string[];
  result: GooglePlaceDetailsResult;
  status: string;
}

export class GoogleAddressResponse {
  status: string;
  results: GooglePlaceDetailsResult[];
}

export class GooglePlaceDetailsResult {
  address_components: { long_name: string; short_name: string; types: string[] }[];
  geometry: GoogleGeometryObject;
  icon: string;
  id: string;
  name: string;
  photos: { height: number; width: number; html_attributions: string[]; photo_reference: string };
  place_id: string;
  reference: string;
  scope: string;
  types: string[];
  url: string;
  utc_offset: number;
  vicinity: string;
}

export class GoogleGeometryObject {
  location: GoogleLocationObject;
  viewport: { northeast: GoogleLocationObject; southwest: GoogleLocationObject };
}

export class GoogleLocationObject {
  lat: number;
  lng: number;
}

export class GoogleLocationResponseObject {
  latitude: number;
  longitude: number;
}

export class GoogleLocationAddressResponseObject {
  latitude: number;
  longitude: number;
  fullAddress: string;
}

export class GoogleCityStateObject {
  city: string;
  state: string;
  multiCity?: string[];
}

export class GoogleCityStateZipObject {
  city: string;
  state: string;
  zip: string;
}

export class GoogleGeocodeResultObject {
  results: google.maps.GeocoderResult[];
}
