import { TestBed } from '@angular/core/testing';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { AnalyticsService } from './analytics.service';

class MockAngulartics2 {
  eventTrack = {
    next: () => {}
  };
}

const createMockEvent = (action, properties) => ({
  action,
  properties
});

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let angulartics: Angulartics2GoogleTagManager;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticsService, { provide: Angulartics2GoogleTagManager, useClass: MockAngulartics2 }]
    });
    service = TestBed.inject(AnalyticsService);
    angulartics = TestBed.inject(Angulartics2GoogleTagManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
