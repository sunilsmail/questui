import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { EasyPayStatus } from 'shared/models/eorder';
import { CostEstimateService } from 'shared/services/eorder/easy-pay/cost-estimate.service';
import { EorderEasyPayService } from 'shared/services/eorder/easy-pay/easy-pay.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { PropertiesService } from 'shared/services/properties.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockCostEstimateService } from 'shared/specs/mocks/mock-cost-estimate.service';
import { MockEorderEasyPayService } from 'shared/specs/mocks/mock-easy-pay.service';
import { MockEorderDataService } from 'shared/specs/mocks/mock-eorder-data.service';
import { MockEorderStateNavigationService } from 'shared/specs/mocks/mock-eorder-state-navigation.service';
import { MockEorderService } from 'shared/specs/mocks/mock-eorder.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsEorderPriceEstimateComponent } from '../as-eorder-price-estimate/as-eorder-price-estimate.component';
import { AsPriceEstimateDialogComponent } from '../as-price-estimate-dialog/as-price-estimate-dialog.component';

class MockRouteComponent { }
const routes = [
  { path: 'eorder/as-eorder-confirmation', component: MockRouteComponent },
  { path: 'eorder/as-eorder-price-estimate', component: MockRouteComponent }
];

describe('AsEorderPriceEstimateComponent', () => {
  let component: AsEorderPriceEstimateComponent;
  let fixture: ComponentFixture<AsEorderPriceEstimateComponent>;
  let debugElement: DebugElement;
  let router: Router;
  let dialog: MatDialog;
  let eorderDataService: EorderDataService;
  let eorderService: EorderService;
  let eOrderEasyPayService: EorderEasyPayService;
  let eOrderStateNavigationService: EorderStateNavigationService;
  let costEstimateService: CostEstimateService;
  let propertiesService: PropertiesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsEorderPriceEstimateComponent, AsPriceEstimateDialogComponent],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        CustomPipesModule,
        MockI18nModule
      ],
      providers: [
        { provide: EorderDataService, useClass: MockEorderDataService },
        { provide: EorderStateNavigationService, useClass: MockEorderStateNavigationService },
        { provide: EorderService, useClass: MockEorderService },
        { provide: EorderEasyPayService, useClass: MockEorderEasyPayService },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: MAT_DIALOG_DATA, useValue: {},
       },
       { provide: CostEstimateService, useClass: MockCostEstimateService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [AsPriceEstimateDialogComponent],
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsEorderPriceEstimateComponent);
    dialog = TestBed.inject(MatDialog);
    eorderDataService = TestBed.inject(EorderDataService);
    eorderService = TestBed.inject(EorderService);
    eOrderEasyPayService = TestBed.inject(EorderEasyPayService);
    eOrderStateNavigationService = TestBed.inject(EorderStateNavigationService);
    costEstimateService = TestBed.inject(CostEstimateService);
    propertiesService = TestBed.inject(PropertiesService);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
    //
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    describe('#goToPrevious', () => {
      beforeEach(() => {
        spyOn(component, 'goToPrevious').and.callThrough();
        component.goToPrevious();
      });
      it('should call', () => {
        expect(component.goToPrevious).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/eorder/as-eorder-review-details']);
      });
    });
  });
  describe('#onContinue', () => {
    beforeEach(() => {
      spyOn(component, 'onContinue').and.callThrough();
      component.onContinue();
    });
    it('should call', () => {
      expect(component.onContinue).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/eorder/as-eorder-confirmation']);
    });
  });
  describe('#openDialog', () => {
    beforeEach(() => {
      spyOn(component.dialog, 'open');
      spyOn(component, 'openDialog').and.callThrough();
      component.openDialog();
    });
    it('should call', () => {
      expect(component.openDialog).toHaveBeenCalled();
    });
  });
  describe('#getPriceEstimate', () => {
    beforeEach(() => {
      component.estimatedPrice = null;
    });
    it('should get estimated price if valid primary insurance holder', () => {
      // spyOn(component, 'getPriceEstimate').and.callThrough();
      eorderService.getPricingInfo().subscribe(res => {
        component.estimatedPrice = res.responseBody.price;
        expect(+component.estimatedPrice).toBe(25);
      });

    });
    it('should not get estimated price if it is client bill and if no lab card', () => {
      expect(component.estimatedPrice).toEqual(null);
    });
  });

  describe('#enable sdk', () => {
    /** test cases for user story US490 */
    beforeEach(() => {
      component.estimatedPrice = null;
    });

    it('enable button', () => {
      component.enableEasypay$ = of(true);
      component.loadSDK();
      expect(component.enableEasypayButton).toBeTruthy();
    });

    it('disbale button', () => {
      component.enableEasypay$ = of(false);
      component.loadSDK();
      expect(component.enableEasypayButton).toBeFalsy();
    });

    it('error scenario in getPriceEstimate', () => {
      spyOn(eorderService, 'getPricingInfo').and.returnValue(of({
        status: 'success',
        responseBody: null
      }));
      component.getPriceEstimate();
      fixture.detectChanges();
      expect(component.estimatedPrice).toBe(null);
    });

    it('error scenario in getPriceEstimate', () => {
      spyOn(eorderService, 'getPricingInfo').and.returnValue(throwError('error'));
      component.getPriceEstimate();
      fixture.detectChanges();
      expect(component.estimatedPrice).toBe(null);
    });

    it('error scenario in loadPaymentCard', () => {
      spyOn(eOrderEasyPayService, 'getEasyPayInit').and.returnValue(throwError('error'));
      component.loadPaymentCard();
      fixture.detectChanges();
      component.enableEasypay$.subscribe(value => {
        expect(value).toEqual(false);
      });
    });

  });

  describe('#no price estimate verbiage', () => {
    /** test cases for user story US490 */
    beforeEach(() => {
      component.estimatedPrice = null;
    });

    it('with price estimate', () => {
      spyOn(eorderService, 'getPricingInfo').and.returnValue(of({
        status: 'success',
        responseBody: {
          price: 25
        }
      }));
      component.getPriceEstimate();
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelectorAll('a').length).toBeGreaterThanOrEqual(1);
      expect(component.estimatedPrice).not.toEqual(null);
    });

    it('without price estimate', () => {
      spyOn(eorderService, 'getPricingInfo').and.returnValue(of({
        status: 'failed',
        responseBody: {
          price: null
        }
      }));
      component.getPriceEstimate();
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('a').length).toBeLessThanOrEqual(0);
      expect(component.estimatedPrice).toEqual(null);
    });


    it('show disclaimer text when price estimate is greater than 0', () => {
      spyOn(eorderService, 'getPricingInfo').and.returnValue(of({
        status: 'success',
        responseBody: {
          price: 25
        }
      }));
      component.getPriceEstimate();
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('#disclaimer_text').length).toBeGreaterThanOrEqual(1);
    });

    it('hide disclaimer text when price estimate is less than 0', () => {
      spyOn(eorderService, 'getPricingInfo').and.returnValue(of({
        status: 'success',
        responseBody: {
          price: null
        }
      }));
      component.getPriceEstimate();
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('#disclaimer_text').length).toBeLessThanOrEqual(0);
    });
  });
  describe('#getASClesF589', () => {
    it('calls the getASClesF589 method', () => {
      spyOn(propertiesService, 'getASClesF589').and.callThrough();
      component.ngOnInit();
      expect(propertiesService.getASClesF589).toHaveBeenCalled();
    });
    it('hide disclaimer text when price estimate is less than 0', () => {
      spyOn(eorderService, 'getPricingInfo').and.returnValue(of({
        status: 'success',
        responseBody: {
          price: null
        }
      }));
      spyOn(propertiesService, 'getASClesF589').and.returnValue(of(false));
      component.getPriceEstimate();
      component.ngOnInit();
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('#disclaimer_text1').length).toBeLessThanOrEqual(0);
    });
    it('show disclaimer text when price estimate is greater than 0', () => {
      spyOn(eorderService, 'getPricingInfo').and.returnValue(of({
        status: 'success',
        responseBody: {
          price: 25
        }
      }));
      spyOn(propertiesService, 'getASClesF589').and.returnValue(of(true));
      component.getPriceEstimate();
      component.ngOnInit();
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('#disclaimer_text1').length).toBeGreaterThanOrEqual(1);
    });
  });
  describe('#updateMessage', () => {
    beforeEach(() => {
      component.toggleSkippaymentMessage = false;
      component.toggleErrorMessage = false;
      component.toggleCreditCardMessage = false;
    });
    it('when error occured', () => {
      const response: EasyPayStatus = {
        status: false,
        isSkippayment: false
      };
      component.updateMessage(response);
      expect(component.toggleSkippaymentMessage).toEqual(false);
      expect(component.toggleCreditCardMessage).toEqual(false);
      expect(component.toggleErrorMessage).toEqual(true);
    });
    it('message when credit card selected', () => {
      const response: EasyPayStatus = {
        status: true,
        isSkippayment: false
      };
      component.updateMessage(response);
      expect(component.toggleSkippaymentMessage).toEqual(false);
      expect(component.toggleErrorMessage).toEqual(false);
      expect(component.toggleCreditCardMessage).toEqual(true);
    });
    it('message when skippayment selected', () => {
      const response: EasyPayStatus = {
        status: true,
        isSkippayment: true
      };
      component.updateMessage(response);
      expect(component.toggleSkippaymentMessage).toEqual(true);
      expect(component.toggleErrorMessage).toEqual(false);
      expect(component.toggleCreditCardMessage).toEqual(false);
    });
  });
});
