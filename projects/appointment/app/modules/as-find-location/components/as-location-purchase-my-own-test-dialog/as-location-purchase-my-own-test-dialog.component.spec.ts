import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropertiesService } from 'shared/services/properties.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import {
  mockAllTestsReasoncategory,
  mockCovidActiveInfectionReasonCategory,
  mockCovidAntiBodyReasonCategory
} from 'shared/specs/mocks/mock-reasons-category';
import { AsLocationPurchaseMyOwnTestDialogComponent } from './as-location-purchase-my-own-test-dialog.component';


const mockMatDialogRef = {
  updateSize: (size: string) => {},
  close: () => {}
};
describe('AsPurchaseMyOwnTestDialogComponent', () => {
  let component: AsLocationPurchaseMyOwnTestDialogComponent;
  let fixture: ComponentFixture<AsLocationPurchaseMyOwnTestDialogComponent>;
  let propertiesService: PropertiesService;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: mockMatDialogRef},
        { provide: PropertiesService, useClass: MockPropertiesService }],
      declarations: [ AsLocationPurchaseMyOwnTestDialogComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsLocationPurchaseMyOwnTestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    propertiesService = TestBed.inject(PropertiesService);
    spyOn(propertiesService, 'getViewOfferingUrl').and.callThrough();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onInit', () => {
    it('should call viewOfferings', () => {
        spyOn(component, 'viewOfferings').and.callThrough();
        component.ngOnInit();
        expect(component.viewOfferings).toHaveBeenCalled();
    });
  });

  describe('#onNoClick', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close').and.callThrough();
    });
      it(
        'should be called', () => {
          component.onNoClick();
          expect(component.dialogRef.close).toHaveBeenCalled();
        });
  });

  describe('#showOwnDialog', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close').and.callThrough();
    });
      it(
        'should be called', () => {
          component.showOwnDialog();
          expect(component.dialogRef.close).toHaveBeenCalled();
        });
  });

  describe('#closeDialog', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close').and.callThrough();
    });
      it(
        'should be called', () => {
          component.closeDialog();
          expect(component.dialogRef.close).toHaveBeenCalled();
        });
  });

  describe('#viewOfferings - set viewOfferingLink based on ReasonCategory', () => {

    it('when reasonServiceType is 25 -> CovidAnitBodyTest, should return viewOfferingLink from propertierService', () => {
        component.data = mockCovidAntiBodyReasonCategory;
        spyOn(propertiesService, 'getViewOfferingAntiBodyUrl').and.callThrough();

        component.viewOfferings();

        expect(propertiesService.getViewOfferingAntiBodyUrl).toHaveBeenCalled();
        expect(component.viewOfferingLink).toBe('cit.com/products/covid-19-antibody-test');
    });

    // tslint:disable-next-line: max-line-length
    it('when reasonServiceType is 26 -> CovidActiveInfection, should return viewOfferingCovidActiveinfection from propertierService', () => {
        component.data = mockCovidActiveInfectionReasonCategory;
        spyOn(propertiesService, 'getViewOfferingActiveInfectionUrl').and.callThrough();

        component.viewOfferings();

        expect(propertiesService.getViewOfferingActiveInfectionUrl).toHaveBeenCalled();
        expect(component.viewOfferingLink).toBe('cit.com/products/covid-19-active-infection');
    });

    it('when reasonServiceType is 1 -> AllOtherTests, should return viewOfferingAllOtherTest from propertierService', () => {
        component.data = mockAllTestsReasoncategory;
        spyOn(propertiesService, 'getViewOfferingAllOtherTestUrl').and.callThrough();

        component.viewOfferings();

        expect(propertiesService.getViewOfferingAllOtherTestUrl).toHaveBeenCalled();
        expect(component.viewOfferingLink).toBe('cit.com/products?category=All');
    });
  });
});
