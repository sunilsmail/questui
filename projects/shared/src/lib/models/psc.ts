export class PSC {
  zipCode: string;
  siteCode: string;
  locationFax: string;
  pscName: string;
  address2: string;
  city: string;
  address1: string;
  locationPhone: string;
  locationParking: string;
  closeTime: string;
  locationTestsOfferred: string[];
  state: string;
  openTime: string;
  landmark: string;
  timeZone: string;
}

export class UserLocation {
  latitude: any;
  longitude: any;
}

class PscAddressQuery {
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export class PscLocationQuery extends UserLocation {
  maxReturn?: number;
  miles?: number;
  address?: PscAddressQuery;
}

export class PscLocation {
  zip: string;
  siteCode: string;
  address2: string;
  city: string;
  address1: string;
  name: string;
  state: string;
  phone: number;
  fax: number;
  distance?: string;
  waitTime: number;
  siteHoursStatus: string;
  siteType: string;
  customMessage: string;
  labCard: string;
  latitude: number;
  longitude: number;
  pscTimings?: string;
  scheduleAppt?: boolean;
  buCode: string;
  pscClosureComments?: string[];
  appointmentsOnly?: boolean;
}

export class PscAvailabilityQuery {
  siteCode: string;
  date: string;
  serviceType?: string;
  facilityServiceId?: number[];
  fromDate?: string;
  toDate?: string;
}
export class PscAvailability extends PscLocation {
  availability: { date: string, slots: { time: string, available: boolean }[] }[];
}

export class PscLocationAvailabilityQuery extends PscLocationQuery {
  toDate: string;
  fromDate: string;
  serviceType?: string;
  facilityServiceId: number[];
  firstPscToReturn: number;
  filterForAvailability?: boolean;
  includeWaitTime: boolean;
  onlyAvailableSlots: boolean;
  sendSlots?: boolean;
  labCard?: boolean;
  accessType?: string;
  siteType?: string;
  offset?: number;
}

export class PscLocationAvailability extends PscLocation {
  availability: {
    date: string,
    slots: { time: string, available: boolean }[]
  }[];
}

export class PscDetails extends PscLocation {
  landmark: string;
  parking?: string;
  timeZone?: string;
  regularHours: {};
  glucoseHours: {};
  drugHours?: {};
  services?: [];
  servicesNotOffered?: string[];
  popularHours: {};
  saturdayHoursByAppt?: any;
  siteInfo?: string;
  newSiteAddress?: any;
  echeckIn?: any;
  tspotHours?: any;
  scheduleAppt?: boolean;
  dynamicApptSchedule?: boolean;
}

export class PscTimeSlot {
  time: string;
  available: string | boolean;
  hour?: any;
}

export enum SlotAvailableType {
  available = 'available',
  unAvailable = 'unAvailable',
  noSlot = 'noSlot'
}

export class PscFullDaySlots {
  pscMorningTime: Array<PscTimeSlot>;
  pscAfternoonTime: Array<PscTimeSlot>;
}

export class GroupedSlots {
  [key: string]: PscTimeSlot[]
}
export class GetlabsLocationRequest {
  facilityServiceId: number;
  zipCode: string;
  city: string;
  userdefinedZip?: string;
  state: string;
}
export class GetlabsResponse {
  homeCollectMetricsId: number;
  getLabsEnabled: boolean;
  supportedPartner: any[];
}
