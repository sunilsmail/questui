import { TestBed } from '@angular/core/testing';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { ApiService } from './api.service';
import { PscService } from './psc.service';

describe('PscService', () => {
  let service: PscService;
  let api: ApiService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PscService, { provide: ApiService, useClass: MockApiService }]
    });

    service = TestBed.inject(PscService);
    api = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
