
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
import { mockReasonList, mockTestsList } from 'shared/specs/mocks/mock-appointment.service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockDeeplinkService } from 'shared/specs/mocks/mock-deeplink.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { mockPscLocation, mockPscLocationAvailability, MockPscService, PscData } from 'shared/specs/mocks/mock-psc.service';
import { MockSkipInsuranceService } from 'shared/specs/mocks/mock-skip-insurance.service';
import { MockUserService } from 'shared/specs/mocks/mock-user.service';
import { MockFindLocationDataService } from 'shared/specs/mocks/pact/mock-findLocation.service';
import { AsLocationFinderDetailsComponent } from './as-location-finder-details.component';
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

describe('AsLocationFinderDetailsComponent', () => {
    let component: AsLocationFinderDetailsComponent;
    let fixture: ComponentFixture<AsLocationFinderDetailsComponent>;
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
            declarations: [AsLocationFinderDetailsComponent],
            imports: [RouterTestingModule, FormsModule, HttpClientTestingModule, CustomPipesModule,
                MockI18nModule, ReactiveFormsModule, MatSelectModule, NoopAnimationsModule],
          providers: [
                { provide: PscService, useClass: MockPscService },
                { provide: DataService, useClass: MockDataService },
                { provide: SkipInsuranceService, useClass: MockSkipInsuranceService },
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: DeeplinkService, useClass: MockDeeplinkService },
                { provide: PscDetailsService, useClass: MockPscDetailsService },
                 { provide: UserService, useClass: MockUserService },
                 { provide: FindlocationDataService, useClass: MockFindLocationDataService},
                 { provide: PropertiesService, useClass: MockPropertiesService },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]

        })
            .compileComponents();
    }));

    beforeEach(() => {
        pscService = TestBed.inject(PscService);
        fixture = TestBed.createComponent(AsLocationFinderDetailsComponent);
        pscDetailsService = TestBed.inject(PscDetailsService);
        component = fixture.componentInstance;
        component.locationDetails = PscData;
        component.today= 'Monday';
        dataService = TestBed.inject(DataService);
        skipInsuranceService = TestBed.inject(SkipInsuranceService);
        deeplinkService = TestBed.inject(DeeplinkService);
        route = TestBed.inject(ActivatedRoute);
        userService = TestBed.inject(UserService);
        findlocationService = TestBed.inject(FindlocationDataService);
        propertiesService = TestBed.inject(PropertiesService);
        component.addresses$ = addresses$;
        // spyOn(dataService, 'getfindLocationReason').and.returnValue(of([mockReasonList]));
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
            spyOn(component, 'deepLinkFlowForReasonForVisit').and.callThrough();

        });
        it('should get the user location and set userLocation', () => {
            component.ngOnInit();
            expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
        });
    });

    it('should open googlemaps without starting address if  no userlocation found', () => {
        spyOn(window, 'open').and.stub();
        component.openDirection();
        expect(window.open)
            // tslint:disable-next-line:max-line-length
            .toHaveBeenCalledWith('http://maps.google.com/maps?'
                + 'daddr=95 Madison Ave 4Th Floor Morristown NJ 07960-7357 Quest Diagnostics - Morristown', '_blank');
    });
    it('should open googlemaps with starting address if userlocation found', () => {
        // component.location = mockPscLocationAvailability;
        component.userLocation = 'new jersey';
        spyOn(window, 'open').and.stub();
        component.openDirection();
        expect(window.open)
            .toHaveBeenCalledWith('http://maps.google.com/maps?'
                + 'saddr=new jersey&daddr=95 Madison Ave 4Th Floor Morristown NJ 07960-7357 Quest Diagnostics - Morristown', '_blank');
    });

    it('should call getPscDetails', () => {
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
    describe('#hoursOfOperation', () => {
        it('should call getTestData', () => {
            dataService.getTestsData().subscribe((el: any) => {
                expect(component.selectedTestData).toEqual(el);
            });
        });
        it('should call getReasonData', () => {
            dataService.getReasonData().subscribe((el: any) => {
                expect(component.selectedReason).toEqual(el);
            });
        });
        it('should call Regular hours', () => {
            component.hoursOfOperation();
            expect(component.isRegularhours).toEqual(true);
            expect(component.isselectedReason).toEqual(false);
        });
        it('should call Glucose hours', () => {
            const mock = mockTestsList;
            mock['facilityServiceId'] = 15;
            component.hoursOfOperation();
            expect(component.isGlucosehours).toEqual(undefined);
        });
        it('should call T.spot Tuberculosis', () => {
            const mock = mockReasonList;
            mock['facilityServiceId'] = 5;
            component.hoursOfOperation();
            expect(component.isTuberculosis).toEqual(undefined);
        });
        it('should call Drug hours', () => {
            const mock = mockTestsList;
            mock['facilityServiceId'] = 7;
            component.hoursOfOperation();
            expect(component.isDrughours).toEqual(undefined);
        });
        it('when no reason is selected', () => {
            const mockReason = mockReasonList;
            const mockTest = mockTestsList;
            mockReason['facilityServiceId'] = null;
            mockTest['facilityServiceId'] = null;
            component.hoursOfOperation();
            expect(component.isRegularhours).toEqual(true);
        });
    });

    describe('generateTimesForUI', () => {
        beforeEach(() => {
            component.locationDetails.popularHours = {
                Monday: [{ time: '18:00', count: 10 },
                { time: '06:00', count: 14 },
                { time: '19:00', count: 10 },
                { time: '07:00', count: 10 },
                { time: '08:00', count: 11 },
                { time: '17:00', count: 8 },
                { time: '14:00', count: 6 },
                { time: '13:00', count: 10 },
                { time: '21:00', count: 4 },
                { time: '10:00', count: 13 },
                { time: '09:00', count: 12 },
                { time: '05:00', count: 12 },
                { time: '15:00', count: 1 },
                // {time: '16:00', count: 1},
                { time: '20:00', count: 5 },
                // {time: '12:00', count: 11},
                { time: '11:00', count: 11 },
                // {time: '22:00', count: 11},
                { time: '23:00', count: 6 }]
            };
        });
        it('#getTimeInFormat should get called', () => {
            spyOn(component, 'getTimeInFormat');
            component.generateTimesForUI('Monday');
            expect(component.getTimeInFormat).toHaveBeenCalled();
        });
        it('#should return sorted times', () => {
            component.generateTimesForUI('Monday');
            expect(component.uiTimes).toEqual([5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 17, 18, 19, 20, 21, 23]);
        });
    });

    describe('getTimeInFormat', () => {
        it('should return formatted time', () => {
            const result = component.getTimeInFormat('12:00');
            expect(result).toEqual('12p');
        });
    });
    describe('getPopularHoursInPercent, getStyle', () => {
        beforeEach(() => {
            component.locationDetails.popularHours = {
                Monday: [{ time: '18:00', count: 10 },
                { time: '06:00', count: 14 },
                { time: '19:00', count: 10 },
                { time: '07:00', count: 10 },
                { time: '08:00', count: 11 },
                { time: '17:00', count: 8 },
                { time: '14:00', count: 6 },
                { time: '13:00', count: 10 },
                { time: '21:00', count: 4 },
                { time: '10:00', count: 13 },
                { time: '09:00', count: 12 },
                { time: '05:00', count: 12 },
                { time: '15:00', count: 1 },
                { time: '20:00', count: 5 },
                { time: '11:00', count: 11 },
                { time: '23:00', count: 6 }]
            };
        });

        it('should set popular hours in percentage', () => {
            component.getPopularHoursInPercent('Monday');
            expect(component.popularityPercentage).not.toBeFalsy();
            // expect(component.popularityPercentage).toEqual({
            //     '05:00': 8,
            //     '06:00': 9,
            //     '07:00': 6,
            //     '08:00': 7,
            //     '09:00': 8,
            //     '10:00': 9,
            //     '11:00': 7,
            //     '13:00': 6,
            //     '14:00': 4,
            //     '15:00': 0,
            //     '17:00': 5,
            //     '18:00': 6,
            //     '19:00': 6,
            //     '20:00': 3,
            //     '21:00': 2,
            //     '23:00': 4
            // });
        });

    });

    describe('#getStyle', () => {
        it('should getStyle if value is not zero', () => {
            component.popularityPercentage = {
                '06:00': 9,
                '07:00': 6,
                '08:00': 7,
                '09:00': 8,
                '10:00': 9,
                '11:00': 7,
                '13:00': 6,
                '14:00': 4,
                '15:00': 0,
                '17:00': 5,
                '18:00': 6,
                '19:00': 6,
                '20:00': 3,
                '21:00': 2,
                '23:00': 4
            };
            const result = JSON.stringify(component.getStyle(11));
            expect(result).toEqual('{"height.%":7}');
        });

        it('should be set hidden if value is zero', () => {
            component.popularityPercentage = {
                '06:00': 9,
                '07:00': 6,
                '08:00': 7,
                '09:00': 8,
                '10:00': 9,
                '11:00': 7,
                '13:00': 6,
                '14:00': 4,
                '15:00': 0,
                '17:00': 5,
                '18:00': 6,
                '19:00': 6,
                '20:00': 3,
                '21:00': 2,
                '23:00': 4
            };
            const result = JSON.stringify(component.getStyle(22));
            expect(result).toEqual('{"visibility":"hidden"}');
        });
    });

    describe('#parseTime', () => {
        it('parseTime with AM', () => {
            expect(component.parseTime('7:30 AM')).toEqual(7.5);
        });
        it('parseTime with PM', () => {
            expect(component.parseTime('4:30 PM')).toEqual(16.5);
        });
        it('updateSlotTime with break', () => {
            component.updateSlotTime('7:30 AM - 1:00 PM, 2:00 PM - 4:30 PM');
            expect(component.slotRange).toEqual(2);
        });
        it('updateSlotTime without break diff less than 12hours', () => {
            component.updateSlotTime('7:30 AM - 4:30 PM');
            expect(component.slotRange).toEqual(2);
        });
        it('updateSlotTime without break diff more than 12hours', () => {
            component.updateSlotTime('7:30 AM - 8:30 PM');
            expect(component.slotRange).toEqual(3);
        });
    });

    describe('onMarkerClicked', () => {

        const location = {
            position: {
                lat: 34.555555,
                lng: -74.556556
            }
        };

        it('should call setfindLocationSelectedLocation', () => {
            addresses$.next([{
                position: {
                    lat: 34.555555,
                    lng: -74.556556
                },
                psc: mockPscLocation
            }]);
            component.onMarkerClicked(location);
            expect(component.pscLocation.latitude).toEqual(34.555555);
        });

        it('should call setfindLocationSelectedLocation', () => {
            spyOn(dataService, 'setfindLocationSelectedLocation').and.callThrough();
            component.onMarkerClicked(location);
            expect(dataService.setfindLocationSelectedLocation).toHaveBeenCalled();

        });
        it('should call getPscDetails', () => {
            spyOn(component, 'getPscDetails').and.callThrough();
            component.onMarkerClicked(location);
            expect(component.getPscDetails).toHaveBeenCalled();
        });
    });
    describe('#checkReasonForVisitParam', () => {
        beforeEach(waitForAsync(() => {
            spyOn(component, 'checkReasonForVisitParam').and.callThrough();
        }));
        it('it should call checkReasonForVisitParam if param has service', () => {
            component.checkReasonForVisitParam('EMPLOYER');
            expect(component.checkReasonForVisitParam).toBeTruthy();
        });
        it('it should call checkReasonForVisitParam if param has no service', () => {
            component.checkReasonForVisitParam('abcdf');
            expect(component.checkReasonForVisitParam).toHaveBeenCalled();
        });
    });
    describe('#deepLinkFlowForReasonForVisit', () => {
        beforeEach(waitForAsync(() => {
            spyOn(component, 'deepLinkFlowForReasonForVisit').and.callThrough();
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
        it(' it should call deepLink doesnot supportservice', () => {
            route.setQueryParamMap('reasonForVisit', 'COVID INFECTION TEST,PHLEBOTOMY');
            component.deepLinkFlowForReasonForVisit();
            expect(dataService.deepLinkTestList.length).toEqual(1);
            expect(component.deepLinkFlowForReasonForVisit).toHaveBeenCalled();
        });
        it(' it should call deepLink singletest with skipinsurance', () => {
            route.setQueryParamMap('reasonForVisit', 'COVID INFECTION TEST');
            spyOn(skipInsuranceService, 'setSkipInsurance').and.callThrough();
            component.deepLinkFlowForReasonForVisit();
            expect(skipInsuranceService).toBeDefined();
        });
    });
});
