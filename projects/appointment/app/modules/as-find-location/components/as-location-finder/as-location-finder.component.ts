import { Location } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, map, mergeMap, take, takeUntil, tap } from 'rxjs/operators';
import { PscLocation, PscLocationAvailability, PscLocationAvailabilityQuery, UserLocation } from 'shared/models';
import { serviceRequestorEnum, ReasonCategory } from 'shared/models/reason-category';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { DeeplinkService } from 'shared/services/deeplink.service';
import { DeeplinkReasonService } from 'shared/services/findLocation/deeplink-reason.service';
import { GoogleKeyService } from 'shared/services/google-key.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { LocationService } from 'shared/services/maps/location-service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { UserCurrentLocationService } from 'shared/services/user-current-location.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-location-finder',
  templateUrl: './as-location-finder.component.html',
  styleUrls: ['./as-location-finder.component.scss']
})
export class AsLocationFinderComponent implements OnInit, OnDestroy {
  numResults = 5;
  locationsLoading = false;
  mapEnable = false;
  searchEnabled = true;
  existingAppt: any;
  activeIndex = -1;
  appointmentHasValidDate = true;

  @Output() appointment = new EventEmitter<any | null>();
  @Output() locationChanged = new EventEmitter<boolean>();
  loading$ = new Subject<boolean>();
  selectedDate$ = new ReplaySubject<string>(1);
  pscs$: Observable<PscLocation[]>;
  content = homeContent;
  hasChangedLocation = false;
  userLocation$ = new ReplaySubject<UserLocation>(1);
  pscs: PscLocation[] = [];
  addresses: any[] = [];
  addresses$ = new ReplaySubject<string[]>(1);
  today = new Date();
  selectedIndex = -1;
  enableContinue: boolean;
  selectedData: any;
  reasonForVisit: ReasonCategory;
  selectedTests: ReasonCategory[];
  previousUrl: string;
  reqParams: any;
  previousUrlWithParams: string;
  destroy$ = new Subject<void>();
  existingUserLocation: UserLocation;
  selectedDate: string;
  showLocations: number;
  selectedTest: string;
  isSelectedReason: boolean;
  isMultipleReasons: boolean;
  reasonDataForCompare: any;
  selectedZipcode: string;
  loadingMap$: any;
  useDefaultOnError = false;
  hasQueryParams = false;
  moreLocations: string;
  isLabCard = false;
  hasChildDeepLink: any[];
  googleMapsUrl: string;
  reasonsListArray = [];
  enableNewUI$ = new Observable<boolean>();
  disableBackArow$ = new Observable<boolean>();
  disableReason$ = new Observable<boolean>();
  initOffset = 0;
  googlemapsOptimizationF4191 = false;
  private _enableShowMore = false;
  constructor(
    private psc: PscService,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private location: Location,
    private dateService: DateService,
    private dataService: DataService,
    private renderer: Renderer2,
    private router: Router,
    private googleMapService: GoogleMapsService,
    private currentLocationService: UserCurrentLocationService,
    private googleKeyService: GoogleKeyService,
    private skipInsuranceService: SkipInsuranceService,
    private deeplinkSerive: DeeplinkService,
    private pscDetailsService: PscDetailsService,
    private uiPropertyService: PropertiesService,
    private deeplinkReasonService: DeeplinkReasonService,
    private locationService: LocationService,
  ) {
    // this.renderer.addClass(document.body, 'as-find-location');
  }

  get enableShowMore(): boolean {
    return this._enableShowMore;
  }
  set enableShowMore(value: boolean) {
    this._enableShowMore = value;
  }
  ngOnInit() {
    this.enableNewUI$ = this.pscDetailsService.getEnableNewUi();
    this.disableBackArow$ = this.deeplinkSerive.getFlagFindLocationDisableBackArrow();
    this.disableReason$ = this.deeplinkSerive.getFlagFordisableReason();
    if (this.route.snapshot && this.route.snapshot.data) {
      this.reasonsListArray = this.route.snapshot.data.reasons;
      this.googlemapsOptimizationF4191 = this.route.snapshot.data.f4191;
      this.deeplinkReasonService.reasonsListArray = this.route.snapshot.data.reasons;
    }
    ///// deepLinkFlow //////////////
    this.deepLinkFlowForReasonForVisit();
    ///// deepLinkFlow /////////////
    ///// new - deepLinkFlow start //////////////
    this.newReasonDeeplinkChanges();
    ///// new - deepLinkFlow end /////////////
    this.dataService
      .getParams()
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params && (params.zipcode || (params.state && params.city))) {
          this.hasQueryParams = true;
          const address = params.zipcode ? params.zipcode : params.city + ' ' + params.state + ' ';
          this.googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${this.googleKeyService.configKey
            }&libraries=places`;
          this.addMapsScript(this.googleMapsUrl, address);
          this.dataService.setQueryParams({});
        } else if (params.sitecode) {
          this.hasQueryParams = true;
          this.dataService.setQueryParams({});
        }
      });
    this.dataService
      .getfindLocationReason()
      .pipe(takeUntil(this.destroy$))
      .subscribe((reasonData: ReasonCategory) => {
        this.isSelectedReason = reasonData !== null;

        // this.dataService.setReasonData(reasonData);
        this.reasonForVisit = reasonData;
        this.reasonDataForCompare = reasonData;
        this.selectedTest = this.selectedTest !== '' ? this.selectedTest : '';
        this.selectedTest = reasonData ? this.reasonForVisit.facilityTestTypeValue : null;
        if (this.selectedTests && this.selectedTests.length > 1) {
          this.selectedTest = 'Multiple Drug Tests';
        }
      });
    this.dataService
      .getTestsData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((testsData: ReasonCategory[]) => {
        this.isSelectedReason = testsData !== null;
        this.selectedTests = testsData;
        this.selectedTest = this.selectedTest !== '' ? this.selectedTest : '';
        if (this.selectedTests && this.selectedTests.length > 1) {
          this.selectedTest = 'Multiple Drug Tests';
        } else if (this.selectedTests[0]) {
          this.selectedTest = this.selectedTests[0].facilityTestTypeValue;
        }
      });
    this.dataService
      .getReasonType()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isMultiple: boolean) => {
        this.isMultipleReasons = isMultiple;
      });
    this.dataService.getdeepLinkLabcardFlag().subscribe((flag: any) => {
      this.isLabCard = flag;
    });
    this.pscs$ = this.userLocation$.pipe(
      filter(() => this.hasChangedLocation),
      tap(() => this.loading$.next(true)),
      // map(([loc, date]) => ({ loc, date })),
      mergeMap(params => {
        const query: PscLocationAvailabilityQuery = {
          toDate: this.dateService.toDate(this.today.toString()),
          fromDate: this.dateService.toDate(this.today.toString()),
          longitude: params.longitude,
          latitude: params.latitude,
          maxReturn: this.numResults,
          facilityServiceId: this.getFacilityService(), // [ this.reasonForVisit.facilityServiceId ],
          firstPscToReturn: 0,
          miles: 25,
          // filterForAvailability: true,
          includeWaitTime: true,
          onlyAvailableSlots: false,
          sendSlots: false,
          offset: (this.initOffset * 5),
        };
        setTimeout(() => {
          this.enableContinue = false;
        });
        // this.selectedDate = params.date;
        // this.showLocations = 5;
        if (this.isLabCard) {
          query.labCard = true;
        }
        if (!this.isLabCard) {
          query.labCard = false;
        }
        return this.psc.getPscsWithAvailability(query);
      }),
      map((result) => {
        const output = this.getUniqueItemsByProperties([...this.pscs, ...result]);
        this.pscs = output;
        this.enableShowMore = (this.pscs.length < 20 && result.length >= 5);
        this.addresses.length = 0;
        return output;
      }),
      tap(pscs => {
        pscs.forEach((psc, i) => {
          // if (i < (this.initOffset * 5)) {
          const locationData = {
            position: {
              lat: psc.latitude,
              lng: psc.longitude
            },
            psc: psc
          };

          this.addresses.push(locationData);
          // }
        });
        this.addresses$.next(this.addresses);
      }),
      tap(
        () => {
          this.loading$.next(false);
          this.locationsLoading = false;
        },
        () => {
          this.loading$.next(false);
          this.locationsLoading = false;
        }
      )
    );
    // this.pscs$ = this.psc.getPscsWithAvailability(null).pipe(delay(3000));
    /* this.existingAppt? this.selectedDate$.next(this.existingAppt.appointmentDate):
                       this.selectedDate$.next(this.dateService.toDate(this.today.toString())); */
    // this.pscs$ = of(this.pscs);

    this.dataService
      .getUserLocation()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userLocation: UserLocation) => {
        if (this.existingUserLocation !== userLocation) {
          this.existingUserLocation = userLocation;
          this.hasChangedLocation = true;
          this.userLocation$.next(userLocation);
        }
      });

    // ============================ to show map and result on page load ================================
    this.currentLocationService.getCurrentPosition(this.useDefaultOnError).subscribe(userLocation => {
      if (!this.existingUserLocation && userLocation && !this.hasQueryParams) {
        this.onLocationChange(userLocation);
      }
    });
    // =================================================================================================

    this.updateZipCode();

    // for DE23217 defect fix
    setTimeout(() => {
      if (document.getElementById('back-button-location-finder')) {
        document.getElementById('back-button-location-finder').focus();
      }
    }, 100);
  }

  getFacilityService() {
    let facilityServiceId = [];
    if (this.selectedTests && this.selectedTests.length !== 0 && this.isMultipleReasons) {
      this.selectedTests.forEach(selectedTest => facilityServiceId.push(selectedTest.facilityServiceId));
    } else if (
      this.selectedTests &&
      this.selectedTests.length !== 0 &&
      !this.isMultipleReasons &&
      this.reasonDataForCompare &&
      (this.reasonDataForCompare.serviceRequestor === 'GLUCOSE' ||
        this.reasonDataForCompare.serviceRequestor === 'PURCHASETEST')
    ) {
      this.selectedTests.forEach(selectedTest => facilityServiceId.push(selectedTest.facilityServiceId));
    } else if (this.reasonForVisit) {
      facilityServiceId.push(this.reasonForVisit.facilityServiceId);
    } else {
      facilityServiceId = null;
    }
    return facilityServiceId;
  }
  onLocationChange(location: UserLocation) {
    this.pscs.length = 0;
    this.hasChangedLocation = true;
    this.addresses.length = 0;
    this.locationChanged.emit(true);
    this.userLocation$.next(location);
    this.dataService.setUserLocation(location);
  }
  /* onDateChanged(date: any) {
    this.selectedDate$.next(this.dateService.toDate(date));
  } */

  /* newAppt(data, selectedIndex) {
    this.dataService.setappointmentData({data: data, selectedIndex: selectedIndex});
    // this data is the selected appointment data that
    // can be used making the api call
    if (data) {
      this.enableContinue = true;
    } else {
      this.enableContinue = false;
    }
    this.selectedIndex = selectedIndex;
    this.selectedData = data;
  } */
  /* enableContinueButton(data) {
    setTimeout(() => {
      this.enableContinue = data;
    });
  } */

  selectedLocation(data: PscLocationAvailability) {
    this.dataService.setfindLocationSelectedLocation(data);
    this.dataService.setMarkerAddress(this.addresses);
    this.appointmentService.distance = data.distance;
  }
  goToPrevious() {
    // this.dataService.setfindLocationReason(null);
    // const previous =  this.routeService.getPreviousUrl();
    // this.router.navigate([previous]);
    this.router.navigate(['/as-home']);
  }
  navigateToReason() {
    this.dataService.setLocationFinderDetailsFlowtoReason(null);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.renderer.removeClass(document.body, 'as-find-location');
    // this.dataService.setfindLocationReason(null);
  }

  updateZipCode() {
    this.dataService.getfindLocationSelectedLocation().subscribe(data => {
      this.selectedZipcode = data.zip;
    });
  }
  ///////////// start DeeplinkFlow For Find Location us31145/////////////////////
  deepLinkFlowForReasonForVisit() {
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      if (params.get('reasonForVisit')) {
        this.dataService.setDeepLinkReasonFlag(true);
        const value = params.get('reasonForVisit').toUpperCase();
        // if Reason has multiple test
        // http://localhost:4202/find-location?reasonForVisit=ORAL FLUID COLLECTIONS,ELECTRONIC CFF
        if (value.includes(',') && this.deeplinkSerive.isMultiselectDeeplink(value)) {
          this.deeplinkHasMultiTest(value);
        }
        // if reason has single test
        else {
          this.deeplinkHasSingleTest(this.deeplinkSerive.getDeeplinkReason(value));
        }
      } else {
        this.dataService.setDeepLinkReasonFlag(false);
        this.resetDeepLinkValues();
      }
    });
  }
  public deeplinkHasSingleTest(value: string) {
    this.resetDeepLinkValues();
    this.hasChildDeepLink = [];
    // calling service types
    if (this.reasonsListArray.length > 0) {
      let mainFilter = null;
      const [Main, Glucose, Employer] = this.reasonsListArray;
      // this.deeplinkSerive.getReasonItems().subscribe(([Main, Glucose, Employer]) => {​​​​​​
      if (value === 'PHLEBOTOMY') {
        mainFilter = Main.filter(x => x.facilityTestType.toUpperCase() === value.toUpperCase() && x.serviceRequestor === null
          && x.facilityTestTypeValue === 'All Other Tests');
      } else {
        mainFilter = Main.filter(x => x.facilityTestType.toUpperCase() === value.toUpperCase() && x.serviceRequestor === null);
      }
      // check test with main service and test not in 'employer health and wellness'
      this.setValueDeepLinkHasSingleTest(mainFilter, Glucose, value, Main, Employer);
      // }​​​​​​);
    }
  }

  public deeplinkHasMultiTest(value: string) {
    this.resetDeepLinkValues();
    // clear  service type
    this.hasChildDeepLink = [];
    const splitedStringArr = value.split(',');
    // calling service types
    if (this.reasonsListArray.length > 0) {
      const [Main, Glucose, Employer] = this.reasonsListArray;
      // this.deeplinkSerive.getReasonItems().subscribe(([Main, Glucose, Employer]) => {
      this.prepareTestListFromStringArray(splitedStringArr, Glucose, Employer);
      // checking all test under which service type
      const unique = this.hasChildDeepLink.filter((c, index, a) => a.indexOf(c) === index);
      if (unique.length === 1) {
        this.setValueDeepLinkHasMultiTest(Main, unique);
      } else {
        this.setDefaultTest(Main);
      }
      // });
    }

  }

  public setValueDeepLinkHasSingleTest(
    mainFilter: ReasonCategory[],
    Glucose: ReasonCategory[],
    value: string,
    Main: ReasonCategory[],
    Employer: ReasonCategory[]
  ) {
    if (mainFilter && mainFilter.length > 0 && mainFilter[0].facilityServiceId !== 3) {
      this.dataService.setfindLocationReason(mainFilter[0]);
      this.dataService.setReasonData(mainFilter[0]);
      this.dataService.defaultDeepLinkTest = mainFilter[0];

      this.skipInsuranceService.setSkipInsurance(mainFilter[0].skipInsurance);
      this.deeplinkSerive.setFlagFordisableReason(true);
    } else {
      // check test with GLUCOSE service
      const glucoseFilter = Glucose.filter(x => x.facilityTestType.toUpperCase() === value.toUpperCase());
      if (glucoseFilter.length > 0) {
        // set reason and test data
        this.setParentChildValues(serviceRequestorEnum.glucose, Main, glucoseFilter);
      }
      // check test with EMPLOYER service
      else {
        const employerFilter = Employer.filter(x => x.facilityTestType.toUpperCase() === value.toUpperCase());
        if (employerFilter.length > 0) {
          // set reason and test data
          this.setParentChildValues(serviceRequestorEnum.employer, Main, employerFilter);
        }
        // else {
        //   this.setDefaultTest(Main);
        // }
      }
    }
  }
  private setDefaultTest(Main: ReasonCategory[]) {
    this.resetDeepLinkValues();
    this.hasChildDeepLink = [];
    // For all othere test
    const defaultResult = Main.filter(x => x.facilityServiceId === 1);
    if (defaultResult.length > 0) {
      // this.dataService.setTestsData(defaultResult);
      this.dataService.setfindLocationReason(defaultResult[0]);
      this.dataService.setReasonData(defaultResult[0]);
      // for facilityServiceId
      this.reasonForVisit = defaultResult[0];
      this.dataService.defaultDeepLinkTest = defaultResult[0];
      this.skipInsuranceService.setSkipInsurance(defaultResult[0].skipInsurance);
      this.deeplinkSerive.setFlagFordisableReason(true);
    }
  }

  private setValueDeepLinkHasMultiTest(Main: ReasonCategory[], unique: any[]) {
    const index = Main.findIndex(x => x.serviceRequestor === unique[0].toUpperCase());
    if (index) {
      this.dataService.setReasonData(Main[index]);
      if (this.dataService.deepLinkTestList.length > 0) {
        this.dataService.setTestsData(this.dataService.deepLinkTestList);
        this.skipInsuranceService.setSkipInsurance(Main[index].skipInsurance);
        unique[0].toUpperCase() === serviceRequestorEnum.employer
          ? this.dataService.setReasonType(true)
          : this.dataService.setReasonType(false);
        this.deeplinkSerive.setFlagFordisableReason(true);
      }
    }
  }

  private prepareTestListFromStringArray(
    sliptedStringArr: string[],
    Glucose: ReasonCategory[],
    Employer: ReasonCategory[]
  ) {
    for (let i = 0; i < sliptedStringArr.length; i++) {
      // check value with glucose
      const glucoseFilterValue = Glucose.filter(y => y.facilityTestType.toUpperCase() === sliptedStringArr[i]);
      if (glucoseFilterValue.length > 0) {
        // storing service type
        this.hasChildDeepLink.push(serviceRequestorEnum.glucose);
        // storing tests in service
        this.dataService.deepLinkTestList.push(glucoseFilterValue[0]);
      } else {
        // check value with Employer
        const employerFilterValue = Employer.filter(z => z.facilityTestType.toUpperCase() === sliptedStringArr[i]);
        if (employerFilterValue.length > 0) {
          this.hasChildDeepLink.push(serviceRequestorEnum.employer);
          this.dataService.deepLinkTestList.push(employerFilterValue[0]);
        }
      }
    }
  }

  resetDeepLinkValues() {
    this.dataService.deepLinkReasonParam = '';
    this.dataService.deepLinkTestList = [];
    this.dataService.defaultDeepLinkTest = new ReasonCategory();
  }
  setParentChildValues(serviceType, mainResult, childFilter) {
    this.dataService.defaultDeepLinkTest = new ReasonCategory();
    const filterData = mainResult.filter(x => x.serviceRequestor === serviceType);
    if (filterData) {
      const index = mainResult.findIndex(x => x.serviceRequestor === serviceType);
      this.resetDeepLinkValues();
      this.dataService.deepLinkReasonParam = serviceType;
      this.dataService.setReasonData(mainResult[index]);
      this.dataService.deepLinkTestList.push(childFilter[0]);
      this.dataService.setTestsData(this.dataService.deepLinkTestList);
      this.dataService.deepLinkReasonParam === serviceRequestorEnum.employer
        ? this.dataService.setReasonType(true)
        : this.dataService.setReasonType(false);
      this.skipInsuranceService.setSkipInsurance(mainResult[index].skipInsurance);
      this.deeplinkSerive.setFlagFordisableReason(true);
    }
  }

  //////////////////// end DeeplinkFlow For Find Location /////////////////////
  addMapsScript(googleMapsUrl: string, address: any) {
    if (!document.querySelectorAll(`[src="${googleMapsUrl}"]`).length) {
      document.body.appendChild(
        Object.assign(document.createElement('script'), {
          type: 'text/javascript',
          src: googleMapsUrl,
          onload: () => {
            this.mapInit(address);
          }
        })
      );
    } else {
      setTimeout(() => {
        this.mapInit(address);
      }, 800);
    }
  }
  mapInit(address: any) {
    if (!this.googlemapsOptimizationF4191) {
      this.googleMapService.restGoogleGeoCoder();
      this.getLatLngByAddress(address);
    } else {
      this.getLatLngByAddressWithOutGoogleMaps(address);
    }
  }
  getLatLngByAddress(address: any) {
    this.googleMapService
      .getLatLngByCityStateZipcode(address)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.fullAddress) {
          this.selectedZipcode = data.fullAddress;
          const location = {
            latitude: data.latitude,
            longitude: data.longitude
          };
          this.existingUserLocation = location;
          this.onLocationChange(location);
        } else {
          this.router.navigate(['/as-home']);
        }
      });
  }

  getLatLngByAddressWithOutGoogleMaps(address: string) {
    const data = this.locationService.getLatLngByCityStateZipcode(address);
    if (data.fullAddress) {
      this.selectedZipcode = data.fullAddress;
      const location = {
        latitude: data.latitude,
        longitude: data.longitude
      };
      this.existingUserLocation = location;
      this.onLocationChange(location);
    } else {
      this.router.navigate(['/as-home']);
    }
  }

  newReasonDeeplinkChanges() {
    this.deeplinkReasonService.newReasonDeeplink();
    this.deeplinkReasonService.getDefaultReason().subscribe((reason) => {
      this.reasonForVisit = reason;
    });
  }

  trackByFn(index, item: PscLocationAvailability) {
    return item.siteCode;
  }

  showmore() {
    if (this.initOffset < 4) {
      this.initOffset++;
      this.locationsLoading = true;
      this.dataService.getUserLocation().pipe(take(1)).subscribe((userLocation: UserLocation) => {
        this.existingUserLocation = userLocation;
        this.hasChangedLocation = true;
        this.userLocation$.next(userLocation);
      });
    }
    this.loading$.next(false);
  }

  // showmore() {
  //   // showmore location has to be implememted
  //   if (this.showLocations === 5) {
  //     this.numResults = 20;
  //     this.locationsLoading = true;
  //     this.dataService
  //       .getUserLocation()
  //       .pipe(take(1))
  //       .subscribe((userLocation: UserLocation) => {
  //         this.existingUserLocation = userLocation;
  //         this.hasChangedLocation = true;
  //         this.userLocation$.next(userLocation);
  //         this.numResults = 5;
  //       });
  //   }
  //   this.loading$.next(false);
  //   this.showLocations += 5;
  //   this.setGoogleMapsAddress();
  // }

  setGoogleMapsAddress() {
    this.pscs.forEach((psc, i) => {
      if (i > this.showLocations - 6 && i < this.showLocations) {
        const locationData = {
          position: {
            lat: psc.latitude,
            lng: psc.longitude
          },
          psc: psc
        };

        this.addresses.push(locationData);
      }
    });
    this.addresses$.next(this.addresses);
    setTimeout(() => {
      this.moreLocations = 'More locations are loaded';
    }, 5000);
  }

  getUniqueItemsByProperties(items) {
    return items.filter((v, i, a) => a.findIndex(v2 => (v2.siteCode === v.siteCode)) === i);
  }

}

