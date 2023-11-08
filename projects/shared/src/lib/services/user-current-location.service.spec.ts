import { TestBed } from '@angular/core/testing';

import { UserCurrentLocationService } from './user-current-location.service';

const CURRENT_POSITION_OPTIONS = {
  timeout: 10000,
  enableHighAccuracy: false,
  maximumAge: 0
};

const QUEST_HEADQUARTERS_LOCATION = {
  longitude: -74.04402809999999,
  latitude: 40.7865504
};

const mockLocation = { longitude: 5, latitude: 5 };
const mockPosition = { coords: mockLocation };

describe('UserCurrentLocationService', () => {
  let service: UserCurrentLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserCurrentLocationService]
    });
    service = TestBed.inject(UserCurrentLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getCurrentPosition', () => {
    beforeEach(() => {
      spyOn(navigator.geolocation, 'getCurrentPosition').and.stub();
      service.getCurrentPosition();
    });

    it('calls navigators getCurrentPosition', () => {
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledWith(
        jasmine.any(Function),
        jasmine.any(Function),
        CURRENT_POSITION_OPTIONS
      );
    });
  });

  describe('#positionSuccess', () => {
    beforeEach(() => {
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success, failure, options) => {
        success(mockPosition as GeolocationPosition);
      });
      service.getCurrentPosition();
    });

    it('calls getCurrentPosition', () => {
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    });

    it('returns the users location', () => {
      service.getCurrentPosition().subscribe(value => {
        expect(value).toEqual(mockLocation);
      });
    });

    it('does not make a second request to getCurrentPosition when called again', () => {
      service.getCurrentPosition();
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    });
  });

  describe('#positionError', () => {
    describe('when useDefaultOnError is true', () => {
      beforeEach(() => {
        spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success, failure, options) => {
          failure(null);
        });
        service.getCurrentPosition(true);
      });

      it('calls getCurrentPosition', () => {
        expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
      });

      it('returns the quest headerquarters location', () => {
        service.getCurrentPosition().subscribe(value => {
          expect(value).toEqual(QUEST_HEADQUARTERS_LOCATION);
        });
      });

      it('does makes additional requests to getCurrentPosition when called again', () => {
        service.getCurrentPosition();
        expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(2);
      });
    });

    describe('when useDefaultOnError is false', () => {
      beforeEach(() => {
        spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success, failure, options) => {
          failure(null);
        });
        service.getCurrentPosition(false);
      });

      it('calls getCurrentPosition', () => {
        expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
      });

      it('returns null', () => {
        service.getCurrentPosition(false).subscribe(value => {
          expect(value).toEqual(null);
        });
      });

      it('does makes additional requests to getCurrentPosition when called again', () => {
        service.getCurrentPosition(false);
        expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(2);
      });
    });
  });
});
