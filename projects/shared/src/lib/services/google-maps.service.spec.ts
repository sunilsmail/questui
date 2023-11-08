import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { mockGoogle } from 'shared/specs/mocks/mock-google-maps';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { GoogleMapsService } from './google-maps.service';
import { PropertiesService } from './properties.service';

describe('GoogleMapsService', () => {
  let service: GoogleMapsService;
  let propertiesService: PropertiesService;
  let httpMock: HttpTestingController;
  let placeService;
  let addMapsScriptSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GoogleMapsService, { provide: PropertiesService, useClass: MockPropertiesService }]
    });

    propertiesService = TestBed.inject(PropertiesService);
    spyOn(propertiesService, 'getGoogleApiKey').and.returnValue(of('google-key'));
    service = TestBed.inject(GoogleMapsService);
    service.AutocompleteService = {
      getPlacePredictions: () => { },
      getQueryPredictions: () => { }
    };
    service.geocoder = {
      geocode: () => { }
    };
    placeService = {
      getDetails: () => { }
    };
    window['google'] = mockGoogle as any;
    addMapsScriptSpy = spyOn(service, 'addMapsScript').and.stub();
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call AutocompleteService.getPlacePredictions', () => {
    spyOn(service.AutocompleteService, 'getPlacePredictions').and.callThrough();
    service.getGoogleAutocomplete('08091').subscribe(el => {
      expect(service.AutocompleteService.getPlacePredictions).toHaveBeenCalled();
    });
  });

  it('should call geocoder.geocode', () => {
    spyOn(service.geocoder, 'geocode').and.callThrough();
    service.getGoogleCityState('08091').subscribe(el => {
      expect(service.geocoder.geocode).toHaveBeenCalled();
    });
  });

  it('should call geocoder.geocode', () => {
    spyOn(service.geocoder, 'geocode').and.callThrough();
    service.getGoogleCityStateZipCode('309 Hazel').subscribe(el => {
      expect(service.geocoder.geocode).toHaveBeenCalled();
    });
  });

  it('should call geocoder.geocode', () => {
    spyOn(placeService, 'getDetails').and.callThrough();
    service.getGooglePlaceDetails('309 Hazel').subscribe(el => {
      expect(placeService.getDetails).toHaveBeenCalled();
    });
  });

  describe('#addMapsScript', () => {
    const expectedHTML = `<script type="text/javascript" src='test'></script>`;
    const googleMapsUrl = 'test';
    let mockGeocoder: google.maps.Geocoder;
    beforeEach(() => {
      addMapsScriptSpy.and.callThrough();
      mockGeocoder = new google.maps.Geocoder();
      spyOn(window['google'].maps, 'Geocoder').and.returnValue(mockGeocoder);
    });

    it('should add the google maps api script', () => {
      service.addMapsScript(googleMapsUrl);

      expect(document.querySelectorAll(`[src="${googleMapsUrl}"]`).length).toEqual(1);
    });

    // it('should call geocoder', () => {
    //   service.addMapsScript(googleMapsUrl);

    //   expect(window['google'].maps.Geocoder).toHaveBeenCalled();
    //   expect(service.geocoder).toEqual(mockGeocoder);
    // });
  });
});
