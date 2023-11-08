import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { PscService } from 'shared/services/psc.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { MockDataService } from 'shared/specs/mocks/mock-data.service';
import { MockPscService } from 'shared/specs/mocks/mock-psc.service';
import { MockSkipInsuranceService } from 'shared/specs/mocks/mock-skip-insurance.service';
// tslint:disable-next-line: max-line-length
import { AsLocationPeaceOfMindTestDialogComponent } from '../as-location-peace-of-mind-test-dialog/as-location-peace-of-mind-test-dialog.component';
// tslint:disable-next-line: max-line-length
import { AsLocationPurchaseMyOwnTestDialogComponent } from '../as-location-purchase-my-own-test-dialog/as-location-purchase-my-own-test-dialog.component';
import { AsLocationFinderReasonComponent } from './as-location-finder-reason.component';

describe('AsLocationFinderReasonComponent', () => {
  let component: AsLocationFinderReasonComponent;
  let fixture: ComponentFixture<AsLocationFinderReasonComponent>;
  let pscService: PscService;
  let dataService: DataService;
  let skipInsuranceService: SkipInsuranceService;
  const selectedItem = {
    facilityServiceId: 1,
    facilityTestType: 'phlebotomy',
    facilityTestTypeValue: 'T-SPOT.<i>TB</i> test (tuberculosis)',
    testDesc: 'Select this option for the majority of your testing needs that are not listed below.',
    precedence: 1,
    serviceRequestor: null
  };
  const SelectedLocationService = [
    'All Other Tests', 'Employer Health and Wellness',
            'Purchased My Own Test', 'Electronic Order', 'Glucose Tolerance(1-3 hours) ',
            'Glucose(most common)', 'Urine', 'Urine Drug Test DOT- Electronic',
            'Urine - Federally mandated'
  ];
  const selectedReason = {
    facilityServiceId: 3,
    facilityTestType: 'phlebotomy',
    facilityTestTypeValue: 'Employer Drug and Alcohol',
    testDesc: 'Select this option if your employer ordered a drug and alcohol test for you.',
    precedence: 3,
    serviceRequestor: 'EMPLOYER'
  };
  const multiselectItems = [
     {
      facilityServiceId: 7,
      facilityTestType: 'phlebotomy',
      facilityTestTypeValue: 'Urine - Observed',
      testDesc: 'Select this option if you were NOT provided a multi-part paper form for drug testing.',
      precedence: 1,
      serviceRequestor: null
    },
    {
      facilityServiceId: 7,
      facilityTestType: 'phlebotomy',
      facilityTestTypeValue: 'T-SPOT.<i>TB</i> test (tuberculosis)',
      testDesc: 'Select this option if you were NOT provided a multi-part paper form for drug testing.',
      precedence: 1,
      serviceRequestor: null
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatSnackBarModule, MatDialogModule],
      providers: [AppointmentService, {provide: MAT_DIALOG_DATA, useValue: {}},
                  {provide: MatDialogRef, useValue: {}},
                  { provide: PscService, useClass: MockPscService },
                  { provide: DataService, useClass: MockDataService },
                  { provide: SkipInsuranceService, useClass: MockSkipInsuranceService},
                ],
      declarations: [ AsLocationFinderReasonComponent,AsLocationPeaceOfMindTestDialogComponent,AsLocationPurchaseMyOwnTestDialogComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [AsLocationPeaceOfMindTestDialogComponent, AsLocationPurchaseMyOwnTestDialogComponent] }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsLocationFinderReasonComponent);
    component = fixture.componentInstance;
    pscService = TestBed.inject(PscService);
    dataService = TestBed.inject(DataService);
    skipInsuranceService = TestBed.inject(SkipInsuranceService);
    // spyOn(component.dialog, 'open').and.returnValue({afterClosed: () => of(true)});
    spyOn(component.dialog, 'open').and.stub();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
   it('starts loading false', () => {
    expect(component.loading).toEqual(false);
  });
  describe('#onItemSelected', () => {
    it('selected test should be greater than one with multi select false ', () => {
      component.selectedTests = [selectedItem];
      component.isTests = true;
      component.multiSelect = false;
      component.onItemSelected(selectedItem);
      expect(component.selectedLocation).not.toBeNull();
      expect(component.getFacilityServiceIds().length).toBeGreaterThan(0);
      component.checkAppointmentExist(selectedReason);
      component.invalidLocationChildIndex = -1;
    });
    it('checking for multi-select with reason', () => {
      component.selectedTests = multiselectItems;
      component.isTests = true;
      component.multiSelect = true;
      component.onItemSelected(multiselectItems[0]);
      expect(component.selectedLocation).not.toBeNull();
      expect(component.getFacilityServiceIds().length).toBeGreaterThan(0);
      component.checkAppointmentExist(multiselectItems[0]);
      component.invalidLocationChildIndex = -1;
    });
  });

  describe('checkAppointmentExist() called', () => {
      it('should get location services with multiselect', () => {
        component.multiSelect = true;
        component.loading = true;
        component.selectedTests = multiselectItems;
        expect(component.selectedTests.length).toBeGreaterThan(0);
        spyOn(dataService, 'getSelectedLocationService').and.returnValue(SelectedLocationService as any);
        expect(component.checkAvailable).not.toMatch(SelectedLocationService[0],multiselectItems[0]);
        component.invalidLocationChildIndex = -1;
      });
      it('should get location services with single select', () => {
        component.multiSelect = false;
        component.loading = true;
        component.selectedTests = [selectedItem];
        expect(component.selectedTests.length).toBeGreaterThan(0);
        expect(component.selectedReason.serviceRequestor).not.toEqual(null);
        expect(component.selectedReason.serviceRequestor).toEqual('EMPLOYER');
        spyOn(dataService, 'getSelectedLocationService').and.returnValue(SelectedLocationService as any);
        expect(component.checkAvailable).not.toMatch(SelectedLocationService[0],selectedItem);
        component.invalidLocationChildIndex = -1;
      });
  });
});









