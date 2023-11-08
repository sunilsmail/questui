import { TestBed } from '@angular/core/testing';
import { EcheckinDataService } from './echeckin-data.service';

describe('EcheckinDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EcheckinDataService = TestBed.inject(EcheckinDataService);
    expect(service).toBeTruthy();
  });
});
