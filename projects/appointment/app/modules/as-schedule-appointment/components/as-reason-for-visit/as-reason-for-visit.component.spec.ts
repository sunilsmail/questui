import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpyLocation } from '@angular/common/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
import { MockAppointmentService } from 'shared/specs/mocks/mock-appointment.service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockEorderStateNavigationService } from 'shared/specs/mocks/mock-eorder-state-navigation.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockPscService } from 'shared/specs/mocks/mock-psc.service';
import { AsBfaRedirectDialogComponent } from '../as-bfa-redirect-dialog/as-bfa-redirect-dialog.component';
import { AsReasonForVisitComponent } from './as-reason-for-visit.component';



class MockRouteComponent { }
const routes = [
  { path: 'schedule-appointment/as-review-details', component: MockRouteComponent },
  { path: 'schedule-appointment/as-appt-scheduler', component: MockRouteComponent }
];

describe('AsReasonForVisitComponent', () => {
    let component: AsReasonForVisitComponent;
    let fixture: ComponentFixture<AsReasonForVisitComponent>;
    let dataService: DataService;
    let router: Router;
    let route: any;
    let location: Location;
    let eOrderStateNavigationService: EorderStateNavigationService;
    let propertiesService: PropertiesService;
    const selectedItem = {
        facilityServiceId: 1,
        facilityTestType: 'PHLEBOTOMY',
        facilityTestTypeValue: 'All Other Tests',
        testDesc: 'Select this option for the majority of your testing needs that are not listed below.',
        precedence: 1,
        serviceRequestor: null
    };
    const selectedReason = {
        facilityServiceId: 3,
        facilityTestType: 'PHLEBOTOMY',
        facilityTestTypeValue: 'Employer Drug and Alcohol',
        testDesc: 'Select this option if your employer ordered a drug and alcohol test for you.',
        precedence: 3,
        serviceRequestor: 'EMPLOYER'
    };
    const multiselectItems = [
        {
            facilityServiceId: 7,
            facilityTestType: 'PHLEBOTOMY',
            facilityTestTypeValue: 'Electronic Order',
            testDesc: 'Select this option if you were NOT provided a multi-part paper form for drug testing.',
            precedence: 1,
            serviceRequestor: null
        },
        {
            facilityServiceId: 8,
            facilityTestType: 'PHLEBOTOMY',
            facilityTestTypeValue: 'Urine',
            testDesc: 'Detects the presence of drugs using a urine sample. der form.',
            precedence: 2,
            serviceRequestor: null
        }
    ];
    const purchaseMyOwnTest = {
        facilityServiceId: 6,
        facilityTestType: 'PHLEBOTOMY',
        facilityTestTypeValue: 'Purchased My Own Test',
        precedence: 6,
        serviceRequestor: 'PURCHASETEST',
        testDesc: 'Select this option if you have purchased a test from Quest.'
    };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule,
                      RouterTestingModule.withRoutes(routes),
                      MatSnackBarModule,
                      MatDialogModule,
                      BrowserAnimationsModule
                    ],
            providers: [
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: AppointmentService, useClass: MockAppointmentService },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                { provide: PscService, useClass: MockPscService },
                { provide: DataService, useClass: MockDataService },
                { provide: location, useClass: SpyLocation },
                { provide: PropertiesService, useClass: MockPropertiesService },
                { provide: EorderStateNavigationService, useClass: MockEorderStateNavigationService },
                Renderer2
            ],
            declarations: [AsReasonForVisitComponent, AsBfaRedirectDialogComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
        .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [AsBfaRedirectDialogComponent] } });
    }));

    beforeEach(() => {
        router = TestBed.inject(Router);
        dataService = TestBed.inject(DataService);
        fixture = TestBed.createComponent(AsReasonForVisitComponent);
        route = TestBed.inject(ActivatedRoute);
        location =  TestBed.inject(Location);
        eOrderStateNavigationService = TestBed.inject(EorderStateNavigationService);
        propertiesService = TestBed.inject(PropertiesService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('onInit', () => {
        beforeEach(() => {
            component.ngOnInit();
        });
    });

    describe('#onItemSelected', () => {
        it('selected reason should be empty', () => {
            component.selectedMainReason = null;
            component.isTests = true;
            component.multiSelect = false;
            component.onItemSelected(selectedItem);
            expect(component.selectedMainReason).toEqual(null);
        });

        it('selected test should be greater than one', () => {
            component.selectedTests = [selectedItem];
            component.isTests = true;
            component.multiSelect = false;
            component.onItemSelected(selectedItem);
            expect(component.selectedTests.length).toEqual(1);
        });

        it('checking reason', () => {
            component.selectedMainReason = selectedReason;
            component.isTests = false;
            component.multiSelect = false;
            component.onItemSelected(selectedReason);
            expect(component.selectedMainReason).not.toEqual(null);
            expect(component.selectedMainReason.serviceRequestor).toEqual('EMPLOYER');
        });

        it('checking for multi-select with reason', () => {
            component.selectedMainReason = selectedReason;
            component.selectedTests = multiselectItems;
            component.isTests = true;
            component.multiSelect = true;
            component.onItemSelected(multiselectItems[0]);
            expect(component.selectedMainReason).not.toEqual(null);
            expect(component.selectedMainReason.serviceRequestor).toEqual('EMPLOYER');
            expect(component.selectedTests.length).toEqual(1);
        });

        it('navigating to multi-select', () => {
            route.setParamMap('reason', 'GLUCOSE');
            expect(component.isTests).toEqual(true);
            expect(component.isReasons).toEqual(false);
        });
    });

    describe('enable/disable continue', () => {
        it('enable continue', () => {
            component.selectedTests = [selectedItem];
            expect(component.selectedTests.length).toEqual(1);
        });
        it('disable continue', () => {
            component.selectedTests = [];
            expect(component.selectedTests.length).toEqual(0);
        });
    });

    describe('#setTestsBeforeNavigation', () => {
        it('when edit is enabled and slot is available', () => {
            spyOn(router, 'navigate').and.callThrough();
            component.destination = '/schedule-appointment/as-review-details';
            component.selectedTests = multiselectItems;
            component.isEdit = true;
            component.selectedAppointment = {
                data: {
                    siteCode: 'BNCKJ',
                    appointmentDate: '12/29/2019',
                    appointmentTime: '12:30'
                }
            };
            component.setTestsBeforeNavigation();
            expect(router.navigate).toHaveBeenCalledWith(['/schedule-appointment/as-review-details']);
        });
        it('when edit is enabled and slot is not available', () => {
            spyOn(router, 'navigate').and.callThrough();
            component.selectedTests = multiselectItems;
            component.isEdit = true;
            component.selectedAppointment = {
                data: {
                    siteCode: 'BNCKJ',
                    appointmentDate: '12/29/2019',
                    appointmentTime: null
                }
            };
            component.setTestsBeforeNavigation();
            expect(router.navigate).toHaveBeenCalledWith(['/schedule-appointment/as-appt-scheduler']);
        });

        it('when edit is disabled', () => {
            spyOn(router, 'navigate').and.callThrough();
            component.isEdit = false;
            component.setTestsBeforeNavigation();
            expect(router.navigate).toHaveBeenCalledWith(['/schedule-appointment/as-appt-scheduler']);
        });
    });
    describe('#purchasedByOwnTestFlow',() =>{
        beforeEach(() => {
            spyOn(component,'purchasedByOwnTestFlow').and.callThrough();
            dataService.isSelectedPurchasedMyOwnTest = true;
        });
        it('clear data in home screen if test selected in purchase my own test', () => {
            dataService.reasonCategory = 'MAIN';
            component.purchasedByOwnTestFlow();
          });
        it('set data in PURCHASETEST screen if test selected in purchase my own test', () => {
            dataService.reasonCategory = 'PURCHASETEST';
            component.purchasedByOwnTestFlow();
        });
    });
    describe('#setPurchasedByOwnTest',() =>{
        beforeEach(() => {
            spyOn(component,'setPurchasedByOwnTest').and.callThrough();
        });
        it('when purchaseyowntest selected', () => {
            dataService.reasonCategory = 'MAIN';
            component.setPurchasedByOwnTest(purchaseMyOwnTest);
            expect(dataService.isSelectedPurchasedMyOwnTest).toBeTruthy();
          });
        it('when purchaseyowntest not selected', () => {
          component.setPurchasedByOwnTest(purchaseMyOwnTest);
          expect(dataService.isSelectedPurchasedMyOwnTest).toBeFalsy();
        });
    });
    describe('#resetPurchasedByOwnTest',() =>{
        beforeEach(() => {
            spyOn(component,'resetPurchasedByOwnTest').and.callThrough();
        });
        it('when not in purchaseyowntest page', () => {
            dataService.reasonCategory = 'MAIN';
            component.resetPurchasedByOwnTest(purchaseMyOwnTest);
            expect(dataService.isSelectedPurchasedMyOwnTest).toBeFalsy();
          });
        it('when purchaseyowntest page', () => {
          dataService.reasonCategory = 'PURCHASETEST';
          component.resetPurchasedByOwnTest(purchaseMyOwnTest);
          expect(dataService.isSelectedPurchasedMyOwnTest).toBeTruthy();
        });
    });

  describe('getPreviousRoute', () => {
    it('if reason is not selected', () => {
      component.isReasons = false;
      expect(component.getPreviousRoute()).toEqual('schedule-appointment/as-reason-for-visit');
    });
    it('if reason is selected and ', () => {
      component.isReasons = true;
      eOrderStateNavigationService.blnSkippedOpenEorder = false;
      expect(component.getPreviousRoute()).toEqual('/as-home');
    });
    it('if reason is not selected', () => {
      component.isReasons = true;
      eOrderStateNavigationService.blnSkippedOpenEorder = true;
      expect(component.getPreviousRoute()).toEqual('/schedule-appointment/as-open-eorders');
    });
  });

});
