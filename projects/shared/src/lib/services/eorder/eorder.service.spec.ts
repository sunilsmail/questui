import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';

import { ApiService } from 'shared/services/api.service';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { MockCacheInterceptor } from 'shared/specs/mocks/mock-api.service';
import { PropertiesService } from '../properties.service';
import { EorderService } from './eorder.service';

describe('EorderService', () => {
  let service: EorderService;
  let apiMock: any;
  let propertiesService: PropertiesService;
  let interceptor: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EorderService,
        { provide: ApiService, useClass: MockApiService },
        { provide: HTTP_INTERCEPTORS, useClass: MockCacheInterceptor, multi: true },
        { provide: PropertiesService, useClass: MockPropertiesService}
      ]
    });
    service = TestBed.inject(EorderService);
    apiMock = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    const service1: EorderService = TestBed.inject(EorderService);
    propertiesService = TestBed.inject(PropertiesService);
    expect(service).toBeTruthy();
  });
  describe( '#getEncounterInfoWithoutCahce', () =>{
    beforeEach(() => {
      spyOn(apiMock, 'get').and.returnValue(of(null));
    });
    it('should get encounter object with type', () => {
      interceptor = TestBed.inject(HTTP_INTERCEPTORS).find(i => i instanceof MockCacheInterceptor);
      spyOn(interceptor, 'clearCache');
      apiMock.clearCache();
      service.getEncounterInfoWithoutCahce('appointment').subscribe();
      expect(apiMock.get).toHaveBeenCalledWith('/guest/getEncounterInfo/appointment');
    });
  });
});
