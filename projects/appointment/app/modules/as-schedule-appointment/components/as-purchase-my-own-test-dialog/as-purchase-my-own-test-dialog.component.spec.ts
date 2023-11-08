import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockPscService } from 'shared/specs/mocks/mock-psc.service';
import {
  mockAllTestsReasoncategory,
  mockCovidActiveInfectionReasonCategory,
  mockCovidAntiBodyReasonCategory
} from 'shared/specs/mocks/mock-reasons-category';
import { AsPurchaseMyOwnTestDialogComponent } from './as-purchase-my-own-test-dialog.component';


const mockMatDialogRef = {
  updateSize: (size: string) => { },
  close: () => { }
};
describe('AsPurchaseMyOwnTestDialogComponent', () => {
  let component: AsPurchaseMyOwnTestDialogComponent;
  let fixture: ComponentFixture<AsPurchaseMyOwnTestDialogComponent>;
  let propertiesService: PropertiesService;
  let pscService: PscService;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MatDialogRef, useValue: mockMatDialogRef },
      { provide: PropertiesService, useClass: MockPropertiesService },
      { provide: PscService, useClass: MockPscService }
      ],
      declarations: [AsPurchaseMyOwnTestDialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsPurchaseMyOwnTestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    propertiesService = TestBed.inject(PropertiesService);
    pscService = TestBed.inject(PscService);
    spyOn(propertiesService, 'getViewOfferingUrl').and.callThrough();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#onInit', () => {
    it('should call viewOfferings', () => {
      spyOn(propertiesService, 'getCITUpdatedLinksFeatureFlag1421').and.callThrough();
      component.ngOnInit();
      propertiesService.getCITUpdatedLinksFeatureFlag1421().subscribe(value => {
        expect(component.featureFlag1421).toEqual(true);
      });
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

    it(`when reasonServiceType is 25 -> CovidAnitBodyTest, should return viewOfferingLink from
       propertierService and redirected to new CIT link  if featureflag is true`, () => {
      component.data = mockCovidAntiBodyReasonCategory;
      spyOn(propertiesService, 'getviewOfferingAntiBodyLinkNewUrl').and.callThrough();
      component.viewOfferings();
      expect(propertiesService.getviewOfferingAntiBodyLinkNewUrl).toHaveBeenCalled();
      expect(component.viewOfferingLink).toBe('https://www.new-url.com');
    });

    it(`when reasonServiceType is 26 -> Covid Active Infectrion Url, should return viewOfferingLink from
       propertierService and redirected to new CIT link  if featureflag is true`, () => {
      component.data = mockCovidAntiBodyReasonCategory;
      spyOn(propertiesService, 'getviewOfferingCovidActiveinfectionNewUrl').and.callThrough();
      component.viewOfferings();
      propertiesService.getviewOfferingCovidActiveinfectionNewUrl().subscribe(url => {
        expect(component.viewOfferingLink).toBe('https://www.new-url.com');
      });
    });

    it(`when reasonServiceType is 1 -> All other tests, should return viewOfferingLink from
       propertierService and redirected to new CIT link  if featureflag is true`, () => {
      component.data = mockCovidAntiBodyReasonCategory;
      spyOn(propertiesService, 'getViewOfferingAllOtherTestUrl').and.callThrough();
      component.viewOfferings();
      propertiesService.getViewOfferingAllOtherTestUrl().subscribe(url => {
        expect(component.viewOfferingLink).toBe('https://www.new-url.com');
      });
    });
  });
});
