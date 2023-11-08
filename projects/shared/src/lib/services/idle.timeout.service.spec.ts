import { waitForAsync, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IdleTimeoutService } from './idle.timeout.service';

describe('IdleTimeOutService', () => {
  let service: IdleTimeoutService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        IdleTimeoutService,
      ]
    });
    service = TestBed.inject(IdleTimeoutService);
  }));

  describe('#startWatching', () => {
    it('Should call startWatching', () => {
      spyOn(service, 'startWatching').and.returnValue(of(true));
      service.startWatching(0).subscribe(value => {
        expect(value).toEqual(true);
      });
    });
  });
  describe('#sessionWatching', () => {
    it('Should call sessionWatching', () => {
      spyOn(service, 'sessionWatching').and.returnValue(of(true));
      service.sessionWatching(0).subscribe(value => {
        expect(value).toEqual(true);
      });
    });
  });
  describe('#stopTimer', () => {
    it('calls Stop Timer', () => {
      const spy = spyOn(service, 'stopTimer').and.callThrough();
      expect(spy).toBeTruthy();
    });
  });
  describe('#sessionStopTimer', () => {
    it('calls Stop Timer', () => {
      const spy = spyOn(service, 'sessionStopTimer').and.callThrough();
      expect(spy).toBeTruthy();
    });
  });
});
