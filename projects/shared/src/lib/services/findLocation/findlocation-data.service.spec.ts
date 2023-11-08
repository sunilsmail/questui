import { TestBed } from '@angular/core/testing';
import { FindlocationDataService } from './findlocation-data.service';

describe('FindlocationDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FindlocationDataService = TestBed.inject(FindlocationDataService);
    expect(service).toBeTruthy();
  });
});
