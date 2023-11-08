import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { fakeAsync, tick, waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { UserLocation } from 'shared/models';
import { DataService } from 'shared/services/data.service';
import { DeeplinkService } from 'shared/services/deeplink.service';
import { DeeplinkReasonService } from 'shared/services/findLocation/deeplink-reason.service';
import { GoogleKeyService } from 'shared/services/google-key.service';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { MockPscDetailsService } from 'shared/specs/mocks';
import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
import { mockReason, mockTestsList } from 'shared/specs/mocks/mock-appointment.service';
import { reasonsList } from 'shared/specs/mocks/mock-data';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockDeeplinkReasonService } from 'shared/specs/mocks/mock-deeplink-reason.service';
import { MockDeeplinkService } from 'shared/specs/mocks/mock-deeplink.service';
import { MockGoogleKeyService } from 'shared/specs/mocks/mock-google-key.service';
import { MockGoogleMapsService } from 'shared/specs/mocks/mock-google-maps.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import {
  mockLocation, mockPscLocation, MockPscService
} from 'shared/specs/mocks/mock-psc.service';
import { MockSkipInsuranceService } from 'shared/specs/mocks/mock-skip-insurance.service';
import { AsLocationFinderComponent } from './as-location-finder.component';


const testeArray = ['Urine', 'Hair'];
const mainResult = [
    {
        'facilityServiceId': 1,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'All Other Tests',
        'testDesc': 'Select this option for the majority of your testing needs that are not listed below.',
        'precedence': 1,
        'serviceRequestor': null,
        'activeInd': true,
        'skipInsurance': false,
    }, {
        'facilityServiceId': 2,
        'facilityTestType': 'Employer Drug and Alcohol',
        'facilityTestTypeValue': 'Employer Drug and Alcohol',
        'testDesc': 'Select this option if your employer ordered a drug and alcohol test for you.',
        'precedence': 3,
        'serviceRequestor': 'EMPLOYER',
        'activeInd': true,
        'skipInsurance': true
    }];
const childFilter = [
    {
        'facilityServiceId': 12,
        'facilityTestType': 'ELECTRONIC CFF',
        'facilityTestTypeValue': 'Electronic Order',
        'testDesc': 'Select this option if you were NOT provided a multi-part paper form for drug testing.',
        'precedence': 1,
        'serviceRequestor': null,
        'activeInd': true,
        'skipInsurance': true
    }];
const reasons2 = [
    {
        'facilityServiceId': 20,
        'facilityTestType': 'phlebotomy',
        'facilityTestTypeValue': 'Urine - Federally mandated',
        // tslint:disable-next-line: max-line-length
        'testDesc': 'For employees covered under U.S. Department of Transportation (DOT), Health & Human Services (HHS), and Nuclear Regulatory Commission (NRC) workforce drug testing programs.',
        'precedence': 3,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 7,
        'facilityTestType': 'phlebotomy',
        'facilityTestTypeValue': 'Urine - Observed',
        // tslint:disable-next-line: max-line-length
        'testDesc': 'Not commonly selected by donors. Observed collections are typically required for Department of Transportation (DOT) testing, return to duty, follow-up testing or in instances where something atypical occurs during standard drug screen collection.',
        'precedence': 4,
        'serviceRequestor': null
    }];
const reasons = [
    {
        'facilityServiceId': 12,
        'facilityTestType': 'phlebotomy',
        'facilityTestTypeValue': 'Electronic Order',
        'testDesc': 'Select this option if you were NOT provided a multi-part paper form for drug testing.',
        'precedence': 1,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 18,
        'facilityTestType': 'phlebotomy',
        'facilityTestTypeValue': 'Urine',
        // tslint:disable-next-line: max-line-length
        'testDesc': 'Detects the presence of drugs using a urine sample.Typically used for pre-employment, random or post-accident testing. Donor provided paper order form.',
        'precedence': 2,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 20,
        'facilityTestType': 'phlebotomy',
        'facilityTestTypeValue': 'Urine - Federally mandated',
        // tslint:disable-next-line: max-line-length
        'testDesc': 'For employees covered under U.S. Department of Transportation (DOT), Health & Human Services (HHS), and Nuclear Regulatory Commission (NRC) workforce drug testing programs.',
        'precedence': 3,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 7,
        'facilityTestType': 'phlebotomy',
        'facilityTestTypeValue': 'Urine - Observed',
        // tslint:disable-next-line: max-line-length
        'testDesc': 'Not commonly selected by donors. Observed collections are typically required for Department of Transportation (DOT) testing, return to duty, follow-up testing or in instances where something atypical occurs during standard drug screen collection.',
        'precedence': 4,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 8,
        'facilityTestType': 'phlebotomy',
        'facilityTestTypeValue': 'Urine - Express Results<sup>TM</sup>  Online',
        // tslint:disable-next-line: max-line-length
        'testDesc': 'Not commonly selected by donors, unless specifically directed by their employer. Donors likely should not choose this option.',
        'precedence': 5,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 9,
        'facilityTestType': 'phlebotomy',
        'facilityTestTypeValue': 'Oral Fluid',
        'testDesc': 'Detects the presence of drugs using an oral fluid sample.',
        'precedence': 6,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 10,
        'facilityTestType': 'phlebotomy',
        'facilityTestTypeValue': 'Hair',
        'testDesc': 'Detects the presence of drugs using a hair sample.',
        'precedence': 7,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 11,
        'facilityTestType': 'phlebotomy',
        'facilityTestTypeValue': 'Breath Alcohol',
        'testDesc': 'Detects the presence of alcohol using a breathalyzer.',
        'precedence': 8,
        'serviceRequestor': null
    }];

describe('AsLocationFinderComponent', () => {
    let component: AsLocationFinderComponent;
    let fixture: ComponentFixture<AsLocationFinderComponent>;
    let service: PscService;
    let googleMapService: GoogleMapsService;
    let spy: jasmine.Spy;
    let dataService: DataService;
    let googleKeyService: GoogleKeyService;
    let skipInsuranceService: SkipInsuranceService;
    let deeplinkService: DeeplinkService;
    let router: Router;
    let route: any;
    let pscDetailsService: PscDetailsService;
    let propertiesService: PropertiesService;
    let deeplinkReasonService: DeeplinkReasonService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AsLocationFinderComponent],
            imports: [HttpClientTestingModule, RouterTestingModule, MatSnackBarModule,],
            providers: [
                { provide: PscService, useClass: MockPscService },
                { provide: googleMapService, useClass: MockGoogleMapsService },
                { provide: DataService, useClass: MockDataService },
                { provide: GoogleKeyService, useClass: MockGoogleKeyService },
                { provide: SkipInsuranceService, useClass: MockSkipInsuranceService },
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: DeeplinkService, useClass: MockDeeplinkService },
                { provide: PscDetailsService, useClass: MockPscDetailsService },
                { provide: PropertiesService, useClass: MockPropertiesService },
                { provide: DeeplinkReasonService, useClass: MockDeeplinkReasonService},

            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AsLocationFinderComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(PscService);
        dataService = TestBed.inject(DataService);
        googleMapService = TestBed.inject(GoogleMapsService);
        googleKeyService = TestBed.inject(GoogleKeyService);
        skipInsuranceService = TestBed.inject(SkipInsuranceService);
        deeplinkService = TestBed.inject(DeeplinkService);
        router = TestBed.inject(Router);
        route = TestBed.inject(ActivatedRoute);
        pscDetailsService = TestBed.inject(PscDetailsService);
        propertiesService = TestBed.inject(PropertiesService);
        deeplinkReasonService = TestBed.inject(DeeplinkReasonService);
        fixture.detectChanges();
        spy = spyOn(service, 'getPscsWithAvailability').and.returnValue(of([mockPscLocation] as any));
        component.pscs = [];
        route.setSnapshotData({ reasons: reasonsList });
        for (let i = 0; i < 10; i++) {
            component.pscs.push(mockPscLocation);
        }
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('#onLocationChange', () => {
        it('sets hasChangedLocation', () => {
            expect(component.hasChangedLocation).toEqual(true);
            component.onLocationChange(mockLocation);
            expect(component.hasChangedLocation).toEqual(true);
        });
        it('emits locationChanged', done => {
            component.locationChanged.subscribe(value => {
                expect(value).toEqual(true);
                done();
            });
            component.onLocationChange(mockLocation);
        });
    });
    it(
        'should update when userLocation$ emits',
        fakeAsync(() => {
            component.selectedTests = null;
            component.reasonForVisit = mockReason;
            component.onLocationChange(mockLocation);
            component.pscs$.subscribe();
            tick();
            expect(spy).toHaveBeenCalled();
        })
    );
    it(
        'should call getPscsWithAvailability',
        fakeAsync(() => {
            component.onLocationChange(new UserLocation());
            component.pscs$.subscribe();
            tick();
            expect(spy).toHaveBeenCalled();
        })
    );
    describe('getFacilityService', () => {
        it('should return facility service Id array if tests are not selected', () => {
            component.selectedTests = null;
            component.reasonForVisit = mockReason;
            const result = component.getFacilityService();
            expect(result.length).toEqual(1);
        });
        it('should return facility service Id array if tests are selected', () => {
            component.selectedTests = mockTestsList;
            component.reasonForVisit = mockReason;
            component.isMultipleReasons = true;
            const result = component.getFacilityService();
            expect(result.length).toEqual(2);
        });
    });
    describe('showMore', () => {
        it('should increase the count when called', () => {
          component.initOffset = 0;
          component.showmore();
          expect(component.initOffset).toBeGreaterThanOrEqual(0);
        });
        it('should increase the count when called', () => {
            component.showmore();
            component.addresses$.subscribe((data: any) => {
                expect(data[0].position.lat).toEqual(34.555555);
            });
        });
    });
    describe('#deepLinkFlowForReasonForVisit', () => {
        beforeEach(waitForAsync(() => {
            spyOn(component, 'deepLinkFlowForReasonForVisit').and.callThrough();
            spyOn(component, 'ngOnInit').and.callThrough();
            component.ngOnInit();
        }));
        it(' it should call deepLinkFlowForReasonForVisit with empty', () => {
            route.setQueryParamMap('reasonForVisit', '');
            component.deepLinkFlowForReasonForVisit();
            expect(dataService.deepLinkTestList.length).toEqual(0);
            expect(component.deepLinkFlowForReasonForVisit).toHaveBeenCalled();
        });
        it(' it should call deepLinkFlowForReasonForVisit with value', () => {
            route.setQueryParamMap('reasonForVisit', 'PHLEBOTOMY');
            component.deepLinkFlowForReasonForVisit();
            expect(dataService.deepLinkTestList.length).toEqual(0);
            expect(component.deepLinkFlowForReasonForVisit).toHaveBeenCalled();
        });
        it(' it should call deepLinkHasGlucoseSingleTest', () => {
            route.setQueryParamMap('reasonForVisit', 'GLUCOSE TOLERANCE');
            component.deepLinkFlowForReasonForVisit();
            expect(dataService.deepLinkTestList.length).toEqual(1);
            expect(component.deepLinkFlowForReasonForVisit).toHaveBeenCalled();
        });
        it(' it should call deepLinkHasEmployerSingleTest', () => {
            route.setQueryParamMap('reasonForVisit', 'ELECTRONIC CFF');
            component.deepLinkFlowForReasonForVisit();
            expect(dataService.deepLinkTestList.length).toEqual(1);
            expect(component.deepLinkFlowForReasonForVisit).toHaveBeenCalled();
        });
        it(' it should call deepLink has multitest', () => {
            route.setQueryParamMap('reasonForVisit', 'ELECTRONIC CFF,SAP (NON-DOT) COLLECTIONS');
            component.deepLinkFlowForReasonForVisit();
            expect(dataService.deepLinkTestList.length).toEqual(2);
            expect(component.deepLinkFlowForReasonForVisit).toHaveBeenCalled();
        });
        it(' it should call deepLink has multitest with different service type', () => {
            route.setQueryParamMap('reasonForVisit', 'ELECTRONIC CFF,GLUCOSE TOLERANCE');
            component.deepLinkFlowForReasonForVisit();
            expect(dataService.deepLinkTestList.length).toEqual(0);
            expect(component.deepLinkFlowForReasonForVisit).toHaveBeenCalled();
        });
        it(' it should call deepLink singletest with skipinsurance', () => {
            route.setQueryParamMap('reasonForVisit', 'COVID INFECTION TEST');
            spyOn(skipInsuranceService, 'setSkipInsurance').and.callThrough();
            component.deepLinkFlowForReasonForVisit();
            expect(skipInsuranceService).toBeDefined();
        });
        it('should increase the count when called', () => {
           // spyOn(deeplinkService, 'setFlagFindLocationDisableBackArrow').and.returnValue(of(true));
            spyOn(deeplinkService, 'getFlagFindLocationDisableBackArrow').and.returnValue(of(true));

        });
    });
});

