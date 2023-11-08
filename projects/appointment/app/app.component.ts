import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { filter, map, mergeMap, take } from 'rxjs/operators';
import { ApiService } from 'shared/services/api.service';
import { ClinicalTrailsService } from 'shared/services/clinical-trails/clinical-trails.service';
import { GoogleKeyService } from 'shared/services/google-key.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { LocationService } from 'shared/services/maps/location-service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { RouteService } from 'shared/services/route.service';
import { UserCurrentLocationService } from 'shared/services/user-current-location.service';
import { UserService } from 'shared/services/user.service';
import { DateService } from './../../shared/src/lib/services/date.service';
import { TealiumUtagService } from './utag.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = false;
  googleMapsUrl: string;
  headerVisible = false;
  isAuthenticated$: Observable<boolean>;
  // using Angulartics2GoogleTagManager to track the page views
  constructor(
    private routeService: RouteService,
    private propertiesService: PropertiesService,
    angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    private locationService: UserCurrentLocationService,
    private api: ApiService,
    private googleMapService: GoogleMapsService,
    private _router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private userService: UserService,
    private googleKeyService: GoogleKeyService,
    private pscDetailsService: PscDetailsService,
    private tealiumUtagService: TealiumUtagService,
    private clinicalTrailsService: ClinicalTrailsService,
    private locationDataService: LocationService
  ) {
    // console.log(this.date.getCurrentDateWithTimeZoneForStandAloneHipaa());
    // console.log('appt---> ', this.date.getCurrentDateWithTimeZoneForStandAloneHipaa());
    // console.log('appt---> ', this.date.getTimeZone());
    this.isAuthenticated$ = this.userService.isAuthenticated$;
    this.propertiesService.setGoogleTagManager();
    // this.propertiesService.addOneTrustCookie();
    // this.propertiesService.setAsGoogleOptimize();
    angulartics2GoogleTagManager.startTracking();
    this.api.setCsrfToken();
    this.routeService.init();
    this._router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {

          this.headerVisible =
            !this._router.url.includes('/clinical-trial-hipaa') &&
            !this._router.url.includes('/schedule-appointment/as-terms-and-conditions');

          this.tealiumPageEvent();
        }
      }
    );
  }

  ngOnInit() {
    this.loadZipcodeData();
    this.loadingSpinner();
    this.enableNewUI();
    this.enableClinicalTrails();
    this.enableSiteCodeWithQueryParams();
    const frag$ = this.route.fragment;
    const appTitle = this.titleService.getTitle();
    console.log('appComponent3');
    // this.propertiesService.getGoogleApiKey().subscribe(res => {
    // this.googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${res.googleApiKey}&libraries=places`;
    // this.googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB4fgYeb2KIF0HnF8oOdr04m7Sc1jo2RnU&libraries=places`;
    this.googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${this.googleKeyService.configKey}&libraries=places`;
    this.googleMapService.addMapsScript(this.googleMapsUrl);
    // });
    // this.propertiesService.addTealiumScriptHead();
    // this.propertiesService.setTealiumScriptBody();
    // this.propertiesService.loadTealiumScripts();
    this.locationService.getCurrentPosition(false);
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          if (this._router.url.indexOf('#') > -1) {
            this.setFocus('skip-to-main');
          }
          let child = this.route.firstChild;
          while (child.firstChild) {
            child = child.firstChild;
          }
          if (child && child.snapshot && child.snapshot.data && child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return appTitle;
        })
      )
      .subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });

    frag$.subscribe(fragment => {
      if (fragment) {
        this.setFocus(fragment);
      }
    });

    this.getUserDetails();
  }


  enableNewUI() {
    this.pscDetailsService.setEnableNewUi(true);
  }

  enableSiteCodeWithQueryParams() {
    combineLatest(this.route.queryParams,
      this.isAuthenticated$)
      .subscribe(([params, isAuth]) => {
        if (!isAuth && params && params['showsitecode'] === 'true') {
          this.pscDetailsService.setEnableSiteCode(true);
        }
      });
  }

  setFocus(fragment: any) {
    const element = document.getElementById(fragment);
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    if (element) {
      setTimeout(() => {
        element.focus();
        if (isIEOrEdge) {
          element.style.cssText = 'border: 2px solid #7dadd9 !important';
          element.addEventListener('focusout', event => {
            element.style.cssText = 'border: none !important';
          });
        }
      });
    }
  }

  getUserDetails() {
    // this.userService.getUserDemographics().subscribe();
    this.userService.getUserDetails().subscribe();
  }

  tealiumPageEvent() {
    if (this.tealiumUtagService.scriptSrc) {
      this.tealiumUtagService.view({ 'tealium_event': 'page_view', 'page_path': this._router.url });
    } else {
      this.propertiesService.getTealiumScriptEnv().pipe(take(1)).subscribe((env) => {
        this.tealiumUtagService.setConfig({ account: 'questdiagnostics', profile: 'main', environment: env });
        this.tealiumUtagService.view({ 'tealium_event': 'page_view', 'page_path': this._router.url });
      });
    }
  }

  enableClinicalTrails() {
    this.clinicalTrailsService.getClinicalTrailsApi().subscribe((value: boolean) => {
      this.clinicalTrailsService.setClinicalTrails(value);
    });
  }

  loadingSpinner() {
    this._router.events.subscribe((event: any) => {
      if (event?.url?.includes('/schedule-appointment/as-personal-information') ||
        event?.url?.includes('/schedule-appointment/as-insurance-information')) {
        switch (true) {
          case event instanceof NavigationStart: {
            this.loading = true;
            break;
          }

          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError: {
            this.loading = false;
            break;
          }
          default: {
            break;
          }
        }
      }
    });
  }

  loadZipcodeData() {
    this.propertiesService.getGooglemapsOptimizationUrls().pipe(
      mergeMap((urls) => {
        if (urls.enabled) {
          return this.locationDataService.loadZipcodes(urls.usZipsUrl, urls.pscZipsUrl);
        }
        return EMPTY;
      })
    ).subscribe();

  }

}
