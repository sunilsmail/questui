import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { DataService } from 'shared/services/data.service';
import { DeeplinkService } from 'shared/services/deeplink.service';
import { FindlocationDataService } from 'shared/services/findLocation/findlocation-data.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { UserService } from 'shared/services/user.service';
import { MockPscDetailsService } from 'shared/specs/mocks';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockDeeplinkService } from 'shared/specs/mocks/mock-deeplink.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { mockPscLocationAvailability, MockPscService, PscData } from 'shared/specs/mocks/mock-psc.service';
import { MockSkipInsuranceService } from 'shared/specs/mocks/mock-skip-insurance.service';
import { MockUserService } from 'shared/specs/mocks/mock-user.service';
import { MockFindLocationDataService } from 'shared/specs/mocks/pact/mock-findLocation.service';
import { AsViewLocationDetailsComponent } from './as-view-location-details.component';

describe('AsViewLocationDetailsComponent', () => {
    let component: AsViewLocationDetailsComponent;
    let fixture: ComponentFixture<AsViewLocationDetailsComponent>;
    let pscService: PscService;
    let dataService: DataService;
    let skipInsuranceService: SkipInsuranceService;
    let deeplinkService: DeeplinkService;
    const addresses$ = new Subject();
    let route: any;
    let pscDetailsService: PscDetailsService;
    let userService: UserService;
    let findlocationService: FindlocationDataService;
    let propertiesService: PropertiesService;
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AsViewLocationDetailsComponent],
          imports: [RouterTestingModule, FormsModule, HttpClientTestingModule, CustomPipesModule, MockI18nModule],
          providers: [
            { provide: PscService, useClass: MockPscService },
            { provide: DataService, useClass: MockDataService },
            { provide: SkipInsuranceService, useClass: MockSkipInsuranceService },
            { provide: ActivatedRoute, useClass: MockActivatedRoute },
            { provide: DeeplinkService, useClass: MockDeeplinkService },
            { provide: PscDetailsService, useClass: MockPscDetailsService },
            { provide: UserService, useClass: MockUserService },
            { provide: FindlocationDataService, useClass: MockFindLocationDataService },
            { provide: PropertiesService, useClass: MockPropertiesService },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        pscService = TestBed.inject(PscService);
        fixture = TestBed.createComponent(AsViewLocationDetailsComponent);
        pscDetailsService = TestBed.inject(PscDetailsService);
        component = fixture.componentInstance;
        component.locationDetails = PscData;
        component.today = 'Monday';
        dataService = TestBed.inject(DataService);
        skipInsuranceService = TestBed.inject(SkipInsuranceService);
        deeplinkService = TestBed.inject(DeeplinkService);
        route = TestBed.inject(ActivatedRoute);
        userService = TestBed.inject(UserService);
        findlocationService = TestBed.inject(FindlocationDataService);
        propertiesService = TestBed.inject(PropertiesService);
        component.addresses$ = addresses$;
        route.setData({ Location: mockPscLocationAvailability });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('starts loading false', () => {
        expect(component.loading).toEqual(false);
    });

    describe('userLocation', () => {
        beforeEach(() => {
            component.pscAddress = 'Quest Diagnostics - West Chester 7608 Cox Lane West Chester OH 45069';
            spyOn(navigator.geolocation, 'getCurrentPosition').and.callThrough();
        });
        it('should get the user location and set userLocation', () => {
            component.ngOnInit();
            expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
        });
    });

    it('should call getPscDetails if siteCode is true', () => {
        component.ngOnInit();
        spyOn(pscService, 'getPscDetails').and.callThrough();
        pscService.getPscDetails('QY4').subscribe((el: any) => {
            expect(component.locationDetails.siteCode).toEqual(el.siteCode);
        });
        if (component.locationDetails.siteInfo) {
            component.siteInfo = component.locationDetails.siteInfo.split(':');
            if (component.siteInfo.length > 1) {
                component.siteInfo[0] = component.siteInfo[0].concat(':');
            }
            else {
                component.siteInfo[0] = component.siteInfo[0].concat('.');
            }
        }
    });
    it('Go to Service tab to see the offered and not offered test', () => {
        component.toggleView(true);
        spyOn(pscService, 'getPscDetails').and.callThrough();
        pscService.getPscDetails('QY4').subscribe((el: any) => {
            expect(component.locationDetails.services).toEqual(el.services);
            expect(component.locationDetails.servicesNotOffered).toEqual(el.servicesNotOffered);
        });
    });

    describe('getTimeInFormat', () => {
        it('should return formatted time', () => {
            const result = component.getTimeInFormat('12:00');
            expect(result).toEqual('12p');
        });
    });

  describe('#showSiteCode', () => {
    it('should call getFindLocationEnableSiteCode method', () => {
      spyOn(pscDetailsService, 'getFindLocationEnableSiteCode').and.callThrough();
      component.ngOnInit();
      expect(pscDetailsService.getFindLocationEnableSiteCode).toHaveBeenCalled();
    });
  });
});
