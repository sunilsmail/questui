import { of, BehaviorSubject } from 'rxjs';
import {
  PscAvailabilityQuery,
  PscLocation,
  PscLocationAvailability,
  PscLocationAvailabilityQuery,
  UserLocation
} from 'shared/models';

export const mockLocations = new Array(5).fill(new PscLocation());

export const mockLocation = { longitude: 5, latitude: 5 };

export const mockLocationAvailabilityQuery: PscLocationAvailabilityQuery = {
  // ...mockLocation,
  toDate: '2019-10-24',
  fromDate: '2019-10-24',
  facilityServiceId: [1],
  firstPscToReturn: 0,
  filterForAvailability: false,
  includeWaitTime: false,
  onlyAvailableSlots: false,
  latitude: 5,
  longitude: 5,
  maxReturn: 5,
  miles: 25,
  offset: 0
};

export const mockLocationsQuery: PscLocationAvailabilityQuery = {
  toDate: '2019-11-08',
  fromDate: '2019-11-08',
  longitude: 5,
  latitude: 5,
  maxReturn: 20,
  facilityServiceId: null,
  firstPscToReturn: 0,
  miles: 25,
  includeWaitTime: true,
  onlyAvailableSlots: false,
  sendSlots: false
};

export const mockPscLocation: PscLocation = {
  zip: '07960-7357',
  siteCode: 'JAE',
  address2: '4Th Floor',
  city: 'Morristown',
  address1: '95 Madison Ave',
  name: 'Quest Diagnostics - Morristown',
  state: 'NJ',
  phone: 9083321767,
  fax: 9083321767,
  distance: '2 miles',
  latitude: 34.555555,
  longitude: -74.556556,
  waitTime: 2,
  siteHoursStatus: 'Closed',
  siteType: '',
  customMessage: '',
  labCard: 'true',
  buCode: 'QTE'
};

export const mockPscLocationAvailability: PscLocationAvailability = {
  ...mockPscLocation,
  distance: '5',
  phone: 8796057357,
  availability: [{
    date: '2019-07-11', slots: [
      {
        time: '9:30',
        available: true
      },
      {
        time: '10:00',
        available: true
      },
      {
        time: '11:30',
        available: true
      },
      {
        time: '12:00',
        available: true
      },
      {
        time: '17:30',
        available: true
      },
      {
        time: '18:00',
        available: true
      },
      {
        time: '18:30',
        available: true
      },
      {
        time: '20:00',
        available: true
      },
      {
        time: '21:00',
        available: true
      },
      {
        time: '22:30',
        available: true
      },
      {
        time: '23:00',
        available: true
      }
    ]
  }],
  fax: 8796057358
};

export const mockPscDetailsWithSlots: PscLocationAvailability = {
  ...mockPscLocation,
  availability: [{
    date: '2019-07-11', slots: [
      {
        time: '9:30',
        available: true
      },
      {
        time: '10:00',
        available: true
      },
      {
        time: '11:30',
        available: true
      },
      {
        time: '12:00',
        available: true
      },
      {
        time: '17:30',
        available: true
      },
      {
        time: '18:00',
        available: true
      },
      {
        time: '18:30',
        available: true
      },
      {
        time: '20:00',
        available: true
      },
      {
        time: '21:00',
        available: true
      },
      {
        time: '22:30',
        available: true
      },
      {
        time: '23:00',
        available: true
      }
    ]
  }],
};

export const PscData = {
  ...mockPscLocation,
  glucoseHours: {
    friday: '6:30 AM - 7:15 AM',
    monday: '6:30 AM - 7:15 AM',
    saturday: '',
    sunday: 'CLOSED',
    thursday: '6:30 AM - 7:15 AM',
    tuesday: '6:30 AM - 7:15 AM',
    wednesday: '6:30 AM - 7:15 AM'
  },
  regularHours: {
    friday: '6:30 AM - 7:15 AM',
    monday: '6:30 AM - 7:15 AM',
    saturday: '',
    sunday: 'CLOSED',
    thursday: '6:30 AM - 7:15 AM',
    tuesday: '6:30 AM - 7:15 AM',
    wednesday: '6:30 AM - 7:15 AM'
  },
  landmark: 'Centerton Sqaure between Jos A Banks and Justice',
  popularHours:
  {
    Friday: [],
    Monday: [],
    Saturday: [],
    Thursday: [],
    Tuesday: [],
    Wednesday: []
  }, servicesNotOffered: ['COVID-19 Active Infection']
};
export class MockPscService {
  hasMorning$ = new BehaviorSubject(true);
  fromFindMyLocationFlow = false;
  isPurchaseTest = false;
  getPscLocations(locations: UserLocation) {
    return of(mockLocations);
  }

  getPscsWithAvailability(request: PscLocationAvailabilityQuery) {
    return of([mockPscLocationAvailability]);
  }

  getPscAvailability(request: PscAvailabilityQuery) {
    return of([mockPscLocationAvailability]);
  }

  getPscDetailsWithSlots(request: PscAvailabilityQuery) {
    return of([mockLocationAvailabilityQuery]);
  }

  getPscMapUri(psc: PscLocation) {
    return null;
  }

  appointmentIsAvailable(request: PscAvailabilityQuery, appointmentTime: string) {
    if (appointmentTime) {
      return of(true);
    } else {
      return of(false);
    }
  }


  getPscDetails(siteCode) {
    return of(PscData);
  }
}
