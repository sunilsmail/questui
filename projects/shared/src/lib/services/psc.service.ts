import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { forkJoin, of, BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'shared/services/api.service';
import { DateService } from 'shared/services/date.service';
import {
  PscAvailabilityQuery,
  PscDetails,
  PscLocation,
  PscLocationAvailability,
  PscLocationAvailabilityQuery,
  PscLocationQuery
} from '../models/psc';
import { DataService } from './data.service';

export const DEFAULT_PSC_QUERY: PscLocationQuery = {
  // address: {},
  latitude: 0,
  longitude: 0,
  maxReturn: 20,
  miles: 25,
};

export const DEFAULT_PSC_AVAILABILITY_QUERY: PscAvailabilityQuery = {
  siteCode: '',
  date: ''
};

export const DEFAULT_PSC_LOCATION_AVAILABILITY_QUERY: PscLocationAvailabilityQuery = Object.assign(DEFAULT_PSC_QUERY, {
  fromDate: '',
  toDate: '',
  facilityServiceId: [],
  firstPscToReturn: 0,
  filterForAvailability: false,
  includeWaitTime: false,
  onlyAvailableSlots: false,

  // source: ''
});

const MAPS_BASE_URI = `http://maps.google.com/maps?q=`;
const IOS_MAPS_BASE_URI = `maps://maps.google.com/maps?q=`;

@Injectable({
  providedIn: 'root'
})
export class PscService {
  mockPscsUrl = 'assets/pscs.json';
  public hasMorningSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);
  hasMorning$ = this.hasMorningSubject;
  fromFindMyLocationFlow = false;
  isPurchaseTest = false;
  constructor(private api: ApiService, private sanitizer: DomSanitizer, private dateService: DateService,
    private dataService: DataService) { }

  getPscLocations(location: PscLocationQuery): Observable<PscLocation[]> {
    const params: PscLocationQuery = Object.assign({}, DEFAULT_PSC_QUERY, location);
    return this.api.post<PscLocation[]>('guest/getPscs', params);
  }

  getPscAvailability(request: PscAvailabilityQuery): Observable<PscLocationAvailability> {
    if (this.dataService.searchCovidAppointmentsBy) {
      request.facilityServiceId = [this.dataService.searchCovidAppointmentsBy];
    }
    const params: PscAvailabilityQuery = Object.assign({}, DEFAULT_PSC_AVAILABILITY_QUERY, request);
    return this.api.post<PscLocationAvailability>('guest/getPscAvailability', params);
  }

  getPscsWithAvailability(request: PscLocationAvailabilityQuery): Observable<PscLocationAvailability[]> {
    const params: PscLocationAvailabilityQuery = Object.assign({}, DEFAULT_PSC_LOCATION_AVAILABILITY_QUERY, request);
    return this.api.post<PscLocationAvailability[]>('guest/getPscsWithAvailability', params).pipe(map((data) => {
      return this.filterPscs(data, this.isPurchaseTest);
    }));
    // return this.api.get<PscLocationAvailability[]>(this.mockPscsUrl, params);
  }

  filterPscs(pscs: PscLocationAvailability[], isPurchaseTest = false) {
    if (isPurchaseTest) {
      const pscsfiltered = pscs.filter(psc => psc.availability[0].slots.some((slots) => {
        return slots.available === true;
      }));
      return pscsfiltered;
    }
    return pscs;
  }

  getPscDetails(siteCode: string) {
    return this.api.get<PscDetails>(`guest/getPscDetails/${siteCode}`);
  }

  appointmentIsAvailable(request: PscAvailabilityQuery, appointmentTime: string) {
    const formattedDate = new Date(this.dateService.toDateTime(request.date));
    if (this.dateService.lessThanToday(formattedDate)) {
      return of(false);
    }
    return this.getPscAvailability(request).pipe(
      map(location => !!location.availability[0].slots.find(avail => avail.time === appointmentTime && avail.available === true))
    );
  }

  appointmentWithPscIsAvailable(request, appointmentTime: string) {
    const formattedDate = new Date(this.dateService.toDateTime(request.toDate));
    if (this.dateService.lessThanToday(formattedDate)) {
      return of(false);
    }
    return of(true);
  }

  appointmentIsAvailableForLocation(request: PscAvailabilityQuery) {
    const formattedDate = new Date(this.dateService.toDateTime(request.date));
    if (this.dateService.lessThanToday(formattedDate)) {
      return of(false);
    }
    return this.getPscAvailability(request).pipe(
      map(location => !!location.availability[0].slots.find(avail => avail.available === true))
    );
  }

  getPscMapUri(psc: PscLocation): SafeUrl {
    const iOS =
      navigator.platform.indexOf('iPhone') !== -1 ||
      navigator.platform.indexOf('iPad') !== -1 ||
      navigator.platform.indexOf('iPod') !== -1;

    return this.sanitizer.bypassSecurityTrustUrl(
      (iOS ? IOS_MAPS_BASE_URI : MAPS_BASE_URI) +
      `${psc.address1} ${psc.address2} ${psc.city}, ${psc.state}, ${psc.zip}`
    );
  }

  getPscDetailsWithSlots(query: PscAvailabilityQuery) {
    return forkJoin(this.getPscAvailability(query),
      this.getPscDetails(query.siteCode));
  }
}
