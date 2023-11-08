import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { kitCollection, KitCollectionEnabler, ReasonCategory } from 'shared/models/reason-category';
import { DataService } from 'shared/services/data.service';
import { DeeplinkService } from 'shared/services/deeplink.service';
import { PscService } from 'shared/services/psc.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { regex } from 'shared/utils/validation/regex-patterns';

@Component({
  selector: 'as-find-location',
  templateUrl: './as-find-location.component.html',
  styleUrls: ['./as-find-location.component.scss']
})
export class AsFindLocationComponent implements OnInit {
  weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  today = this.weekday[new Date().getDay()];
  loading: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private psc: PscService,
    private pscDetailsService: PscDetailsService,
    private deeplinkService: DeeplinkService,
  ) { }

  ngOnInit() {
    this.route.queryParams.pipe(take(1))
      .subscribe(params => {
        this.dataService.setQueryParams(params);
        if (params.zipcode && !this.isValidZipCodeFormat(params.zipcode)) {
          this.router.navigate(['/as-home']);
          return false;
        }
        if (Object.keys(params).length > 0 && (params.labcard || params.zipcode || params.city || params.state
          || params.sitecode || params.reasonForVisit || params.reason)) {
          params.labcard === 'true' ? this.dataService.setdeepLinkLabcardFlag(true) : this.dataService.setdeepLinkLabcardFlag(false);
          this.dataService.isDeepLinkHasLabCard = params.labcard ? params.labcard : false;
          if (params.sitecode) {
            this.loading = true;
            const siteCode = (params.sitecode).toUpperCase();
            this.psc.getPscDetails(siteCode).pipe(take(1)).subscribe((details: any) => {
              this.loading = false;
              details.Location = details;
              details.pscTimings = details.regularHours[this.today];
              const location = {
                latitude: details.latitude, longitude: details.longitude
              };
              this.dataService.setUserLocation(location);
              this.dataService.setfindLocationSelectedLocation(details);
              this.dataService.setSelectedLocationService(details.services);
              // New reason combination functionality
              if (params.reasonForVisit) {
                this.disableFindLoationDetailBackArrow(true);
                this.supportKitCollection(params, true);
              }
              // reason deeplink
              else if (params.reason) {
                this.disableFindLoationDetailBackArrow(true);
                this.router.navigate(['/find-location/as-location-finder-details'],
                  { queryParams: { 'reason': params.reason } });
              }
              // old funcationality
              else {
                if (!details.scheduleAppt) { // when sitecode does not have online scheduling
                  this.disableFindLoationDetailBackArrow(true);
                  //  setTimeout(() => {
                  this.router.navigate(['/find-location/as-location-finder-details', {}]);
                  //  }, 1000);
                } else {
                  // when sitecode have online scheduling
                  this.router.navigate(['/find-location/as-location-finder-reason'], { queryParams: { noApptSchedule: true } });
                }
              }
            }, (err) => {
              if (err.status === 404) { // when sitecode is inactive
                this.loading = false;
                this.router.navigate(['/as-home']);
              }
            });
          } else if (params && (params.labcard || params.zipcode || params.city || params.state)) {
            params.labcard === 'true' ? this.dataService.setdeepLinkLabcardFlag(true) : this.dataService.setdeepLinkLabcardFlag(false);
            this.dataService.isDeepLinkHasLabCard = params.labcard ? params.labcard : false;
            if (params.reasonForVisit) {
              this.disableFindLoationBackArrow(true);
              this.supportKitCollection(params);
            } else if (params.reason) {
              this.disableFindLoationDetailBackArrow(true);
              this.router.navigate(['/find-location/as-location-finder'], { queryParams: { 'reason': params.reason } });
            }
            else {
              this.disableFindLoationBackArrow(true);
              // setTimeout(() => {
              this.router.navigate(['/find-location/as-location-finder', {}]);
              // }, 1000);
            }
          } else if (params && params.reason) {
            this.disableFindLoationBackArrow(true);
            this.router.navigate(['/find-location/as-location-finder'], { queryParams: { 'reason': params.reason } });
          }
          else if (params && params.reasonForVisit) {
            this.disableFindLoationBackArrow(true);
            this.supportKitCollection(params);
          }
        } else {
          combineLatest(this.deeplinkService.getFlagFindLocationDisableBackArrow(),
            this.deeplinkService.getFlagFindLocationDetailDisableBackArrow()).pipe(take(1))
            .subscribe(([result, result1]: [boolean, boolean]) => {
              this.disableFindLoationBackArrow(result || result1);
              this.disableFindLoationDetailBackArrow(result1);
            });
          // setTimeout(() => {
          if (params.showsitecode && params.showsitecode === 'true') {
            this.pscDetailsService.setFindLocationEnableSiteCode(true);
          }
          // this.router.navigate(['/find-location/as-location-finder']);
          // }, 1000);
        }
      });
  }
  isValidZipCodeFormat(zipcode: string) {
    const zipCodeRegex = new RegExp(regex.zipCode);
    return zipcode.match(zipCodeRegex) === null ? false : true;
  }
  disableFindLoationBackArrow(flag: boolean) {
    this.deeplinkService.setFlagFindLocationDisableBackArrow(flag);
  }
  disableFindLoationDetailBackArrow(flag: boolean) {
    this.deeplinkService.setFlgFindLocationDetailDisableBackArrow(flag);
  }
  toLower(value: string) {
    return value.toLowerCase();
  }
  supportKitCollection(params, isDetails = false) {
    if (this.toLower(kitCollection) === this.toLower(params.reasonForVisit)) {
      if (this.route.snapshot && this.route.snapshot.data) {
        const facilityTestId = (new KitCollectionEnabler()).facilityServiceId;
        const ShortCode = this.route.snapshot.data.reasons[0]
          .filter(reason => reason.facilityServiceId === facilityTestId)[0];
        this.navigateToNextFromKitcollection(isDetails, ShortCode);
      }
    } else {
      this.navigateToNext(isDetails, params);
    }
  }

  navigateToNext(isDetails: boolean, params: any) {
    if (isDetails) {
      this.router.navigate(['/find-location/as-location-finder-details'], { queryParams: { 'reasonForVisit': params.reasonForVisit } });
    } else {
      this.router.navigate(['/find-location/as-location-finder'], { queryParams: { 'reasonForVisit': params.reasonForVisit } });
    }
  }

  navigateToNextFromKitcollection(isDetails: boolean, ShortCode: ReasonCategory) {
    if (isDetails) {
      this.router.navigate(['/find-location/as-location-finder-details'], { queryParams: { 'reason': ShortCode.deeplinkReason } });
    } else {
      this.router.navigate(['/find-location/as-location-finder'], { queryParams: { 'reason': ShortCode.deeplinkReason } });
    }
  }
}
