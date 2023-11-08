import { Injectable } from '@angular/core';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { AppointmentEvents, LocationSearch } from 'shared/models/analytics';

// how to get custom properties into the data layer
// https://github.com/angulartics/angulartics2/pull/168/files#diff-e1b3d66321ad1390ebaecaeac0c60bfa
interface WindowHack extends Window {
  dataLayer: any;
}
@Injectable({
  providedIn: 'root'
})

export class AnalyticsService {
  constructor(private angulartics2GoogleTagManager: Angulartics2GoogleTagManager) {}
  locationSearch(locationSearch:LocationSearch) {
    ((window as WindowHack & typeof globalThis).dataLayer=(window as WindowHack & typeof globalThis).dataLayer||[]).push({
      event:AppointmentEvents.locationSearch,
      'page.locationSelection':locationSearch
    });
  }
}
