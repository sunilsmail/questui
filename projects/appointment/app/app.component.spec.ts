import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed  } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2Module } from 'angulartics2';
import { of } from 'rxjs';
import { ApiService } from 'shared/services/api.service';
import { ClinicalTrailsService } from 'shared/services/clinical-trails/clinical-trails.service';
import { GoogleKeyService } from 'shared/services/google-key.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { RouteService } from 'shared/services/route.service';
import { UserCurrentLocationService } from 'shared/services/user-current-location.service';
import { UserService } from 'shared/services/user.service';
import { MockPscDetailsService } from 'shared/specs/mocks';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { MockClinicalTrailsService } from 'shared/specs/mocks/mock-clinical-trails-service';
import { MockGoogleKeyService } from 'shared/specs/mocks/mock-google-key.service';
import { MockGoogleMapsService } from 'shared/specs/mocks/mock-google-maps.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockUserService } from 'shared/specs/mocks/mock-user.service';
import { MockTealiumUtagService } from 'shared/specs/mocks/mock-utag.service';
import { AppComponent } from './app.component';
import { TealiumUtagService } from './utag.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let propertiesService: PropertiesService;
  let googleMapService: GoogleMapsService;
  let userService: UserService;
  let googleKeyService: GoogleKeyService;
  let pscDetailsService: PscDetailsService;
  let route: any;



  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [Angulartics2Module.forRoot(), RouterTestingModule, MockI18nModule, HttpClientTestingModule],
      providers: [
        { provide: ApiService, useClass: MockApiService },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: googleMapService, useClass: MockGoogleMapsService },
        { provide: UserService, useClass: MockUserService },
        { provide: GoogleKeyService, useClass: MockGoogleKeyService },
        { provide: PscDetailsService, useClass: MockPscDetailsService },
        {provide: ActivatedRoute, useClass: MockActivatedRoute},
        { provide: TealiumUtagService, useClass: MockTealiumUtagService},
        { provide: ClinicalTrailsService, useClass: MockClinicalTrailsService},
        RouteService,
        UserCurrentLocationService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));


  beforeEach(() => {
    propertiesService = TestBed.inject(PropertiesService);
    spyOn(propertiesService, 'setGoogleTagManager').and.callThrough();
    googleMapService = TestBed.inject(GoogleMapsService);
    userService = TestBed.inject(UserService);
    pscDetailsService = TestBed.inject(PscDetailsService);
    spyOn(googleMapService, 'addMapsScript').and.callFake(() => { });
    spyOn(propertiesService, 'getGoogleApiKey').and.returnValue(of({ googleApiKey: 'someGoogleMapKey' }));
    googleKeyService = TestBed.inject(GoogleKeyService);
    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('calls setGoogleTagManager', () => {
    expect(propertiesService.setGoogleTagManager).toHaveBeenCalled();
  });

  it('sets googleMapUrl', () => {
    expect(component.googleMapsUrl).toEqual(`https://maps.googleapis.com/maps/api/js?key=someGoogleMapKey&libraries=places`);
  });

  it('calls getGoogleTagManagerKey', () => {
    expect(googleMapService.addMapsScript).toHaveBeenCalled();
  });
  it('calls new api to check new ui traffic', () => {
    spyOn(pscDetailsService, 'setEnableNewUi').and.callThrough();
    component.ngOnInit();
    expect(pscDetailsService.setEnableNewUi).toHaveBeenCalled();
  });

  it('calls the enableNewUI', () => {
    spyOn(component, 'enableNewUI').and.callThrough();
    spyOn(pscDetailsService, 'setEnableNewUi').and.callThrough();
    component.ngOnInit();
    expect(component.enableNewUI).toHaveBeenCalled();
    expect(pscDetailsService.setEnableNewUi).toHaveBeenCalled();
  });

  describe('#enableSiteCodeWithQueryParams', () => {
    it('enable sitecode view', () => {
      route.setQueryParam('showsitecode', 'true');
      component.isAuthenticated$ = of(false);
      spyOn(component, 'enableSiteCodeWithQueryParams').and.callThrough();
      spyOn(pscDetailsService, 'setEnableSiteCode').and.callThrough();
      component.ngOnInit();
      expect(component.enableSiteCodeWithQueryParams).toHaveBeenCalled();
      expect(pscDetailsService.setEnableSiteCode).toHaveBeenCalledWith(true);
    });
    it('disable sitecode view', () => {
      route.setQueryParam('', 'true');
      component.isAuthenticated$ = of(true);
      spyOn(component, 'enableSiteCodeWithQueryParams').and.callThrough();
      spyOn(pscDetailsService, 'setEnableSiteCode').and.callThrough();
      component.ngOnInit();
      expect(component.enableSiteCodeWithQueryParams).toHaveBeenCalled();
      expect(pscDetailsService.setEnableSiteCode).not.toHaveBeenCalled();
    });

    it('disable sitecode view when flag is disabled', () => {
      route.setQueryParam('showsitecode', 'true');
      component.isAuthenticated$ = of(false);
      spyOn(component, 'enableSiteCodeWithQueryParams').and.callThrough();
      spyOn(pscDetailsService, 'setEnableSiteCode').and.callThrough();
      component.ngOnInit();
      expect(component.enableSiteCodeWithQueryParams).toHaveBeenCalled();
      expect(pscDetailsService.setEnableSiteCode).toHaveBeenCalled();
    });
    it('disable sitecode view when sitecode has other value than true', () => {
      route.setQueryParam('showsitecode', 'false');
      component.isAuthenticated$ = of(false);
      spyOn(component, 'enableSiteCodeWithQueryParams').and.callThrough();
      spyOn(pscDetailsService, 'setEnableSiteCode').and.callThrough();
      component.ngOnInit();
      expect(component.enableSiteCodeWithQueryParams).toHaveBeenCalled();
      expect(pscDetailsService.setEnableSiteCode).not.toHaveBeenCalled();
    });
  });

});
