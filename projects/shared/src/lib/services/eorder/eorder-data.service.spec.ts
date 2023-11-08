import { TestBed } from '@angular/core/testing';
import { EorderDataService } from './eorder-data.service';


describe('EorderDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EorderDataService = TestBed.inject(EorderDataService);
    expect(service).toBeTruthy();
  });

  describe('isEorderFlowActivated values', () => {
    it('isEorderFlowActivated$ -> true', () => {
      const service: EorderDataService = TestBed.inject(EorderDataService);
      service.isEorderFlowActivated(true);
      expect(service).toBeTruthy();
      service.eOrderFlowActivatedSubject$.subscribe(isFlowActive => {
        expect(isFlowActive).toBeTruthy();
      });
    });

    it('isEorderFlowActivated$ -> false', () => {
      const service: EorderDataService = TestBed.inject(EorderDataService);
      service.isEorderFlowActivated(false);
      service.eOrderFlowActivatedSubject$.subscribe(isFlowActive => {
        expect(isFlowActive).toBeFalsy();
      });
    });
  });
});
