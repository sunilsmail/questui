import { TestBed } from '@angular/core/testing';
import { ApiService } from 'shared/services/api.service';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { EcheckinService } from './echeckin.service';


describe('EorderService', () => {
  let service: EcheckinService;
  let apiMock: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EcheckinService, { provide: ApiService, useClass: MockApiService }]
    });
    service = TestBed.inject(EcheckinService);
    apiMock = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    const service1: EcheckinService = TestBed.inject(EcheckinService);
    expect(service).toBeTruthy();
  });
});
