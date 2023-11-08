import { TestBed } from '@angular/core/testing';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { MockPscDetailsService } from 'shared/specs/mocks';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { ApiService } from '../api.service';
import { HomeCollectionsService } from './home-collections.service';



describe('HomeCollectionsService', () => {
  let service: HomeCollectionsService;
  let apiMock: any;
  let pscDetailsService: PscDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomeCollectionsService,
        { provide: ApiService, useClass: MockApiService },
        { provide: PscDetailsService, useClass: MockPscDetailsService }
      ]
    });

    service = TestBed.inject(HomeCollectionsService);
    apiMock = TestBed.inject(ApiService);
    pscDetailsService = TestBed.inject(PscDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
