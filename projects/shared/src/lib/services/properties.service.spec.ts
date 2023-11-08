import { waitForAsync, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { mockGoogleApiKeyResponse, mockUiProperties } from 'shared/specs/mocks/mock-properties.service';
import { ApiService } from './api.service';
import { PropertiesService } from './properties.service';

describe('PropertiesService', () => {
  let service: PropertiesService;
  let apiMock: ApiService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          PropertiesService,
          { provide: ApiService, useClass: MockApiService },
        ]
      });
      service = TestBed.inject(PropertiesService);
      apiMock = TestBed.inject(ApiService);
    })
  );

  it('properties service should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('properties', () => {
    beforeEach(() => {
      spyOn(apiMock, 'post').and.returnValue(of(mockUiProperties));

    });

    it('properties service should call getUiProperties', () => {
      service.getUiProperties().subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('guest/getUiProperties');
    });

    it('properties service should call getUiProperties', () => {
      spyOn(service, 'getUiProperties').and.returnValue(of(mockUiProperties));
      service.getGoogleApiDelayTime().subscribe((interval) => {
        expect(interval).toEqual(500);
      });
    });
  });


  describe('when there is a google tag manager key', () => {
    let mockScriptElement: any;
    beforeEach(() => {
      mockScriptElement = { type: '', innerHTML: '' };
      spyOn(document, 'createElement').and.returnValue(mockScriptElement);
      spyOn(document.head, 'appendChild').and.stub();
      // spyOn(service, 'getGoogleTagManagerKey').and.returnValue(of('test-key'));
      service.setGoogleTagManager();
    });

    // it('calls getGoogleTagManagerKey', () => {
    //   expect(service.getGoogleTagManagerKey).toHaveBeenCalled();
    // });

    it('sets the script element', () => {
      expect(mockScriptElement.type).toEqual('text/javascript');
      // expect(mockScriptElement.innerHTML).toContain("'test-key'");
    });

    it('appends the script to the head', () => {
      expect(document.head.appendChild).toHaveBeenCalledWith(mockScriptElement);
    });
  });

  describe('#getGoogleApiKey', () => {
    beforeEach(() => {
      spyOn(apiMock, 'get').and.returnValue(of(mockGoogleApiKeyResponse));
    });

    it('it gets the GoogleApiKey', () => {
      service.getGoogleApiKey().subscribe(value => {
        expect(value).toEqual(mockGoogleApiKeyResponse);
      });
    });

    it('calls the correct api route', () => {
      service.getGoogleApiKey().subscribe();
      expect(apiMock.get).toHaveBeenCalledWith('/guest/getGoogleApiKey');
    });
  });
});
