import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed  } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ExpiryStatus } from 'shared/models';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { PropertiesService } from 'shared/services/properties.service';
import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
import { MockEorderDataService } from 'shared/specs/mocks/mock-eorder-data.service';
import { MockEorderService } from 'shared/specs/mocks/mock-eorder.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsEorderOrderExpiryComponent } from './as-eorder-order-expiry.component';

describe('AsEorderOrderExpiryComponent', () => {
  let component: AsEorderOrderExpiryComponent;
  let fixture: ComponentFixture<AsEorderOrderExpiryComponent>;
  let eorderDataService: EorderDataService;
  let propertiesService: PropertiesService;
  let route: any;
  let eorderService: EorderService;
  let router: Router;
  const mockUrl = 'as-sample-already-taken';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [AsEorderOrderExpiryComponent],
      providers: [
        { provide: EorderDataService, useClass: MockEorderDataService },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: EorderService, useClass: MockEorderService },
        {
          provide: Router,
          useValue: {
            url: mockUrl
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsEorderOrderExpiryComponent);
    route = TestBed.inject(ActivatedRoute);
    eorderDataService = TestBed.inject(EorderDataService);
    propertiesService = TestBed.inject(PropertiesService);
    eorderService = TestBed.inject(EorderService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
    route.setQueryParam('token', null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getDialogData', () => {
    it('user Confirms Test ToCompleted', () => {
      component.eorderDataService.expiryType = ExpiryStatus.userConfirmsTestToCompleted;
      component.getDialogData();
      expect(component.dialogData.icon).toBe('done');
      expect(component.dialogData.hasQuestLoginButton).toBe(true);
      expect(component.dialogData.dialogTopColorClass).toBe('green');
    });
    it('order Test Already Completed', () => {
      component.eorderDataService.expiryType = ExpiryStatus.orderTestAlreadyCompleted;
      component.getDialogData();
      expect(component.dialogData.icon).toBe('done');
      expect(component.dialogData.hasQuestLoginButton).toBe(true);
      expect(component.dialogData.dialogTopColorClass).toBe('green');
    });
    it('order Has Expired', () => {
      component.eorderDataService.expiryType = ExpiryStatus.orderHasExpired;
      component.getDialogData();
      expect(component.dialogData.icon).toBe('warning');
      expect(component.dialogData.hasQuestLoginButton).toBe(false);
      expect(component.dialogData.dialogTopColorClass).toBe('red');
    });
    it('order NotFound', () => {
      component.eorderDataService.expiryType = ExpiryStatus.orderNotFound;
      component.getDialogData();
      expect(component.dialogData.icon).toBe('warning');
      expect(component.dialogData.hasQuestLoginButton).toBe(false);
      expect(component.dialogData.dialogTopColorClass).toBe('red');
    });
    it('already Accessed From Another Account', () => {
      component.eorderDataService.expiryType = ExpiryStatus.alreadyAccessedFromAnotherAccount;
      component.getDialogData();
      expect(component.dialogData.icon).toBe('done');
      expect(component.dialogData.hasQuestLoginButton).toBe(false);
      expect(component.dialogData.dialogTopColorClass).toBe('green');
    });
    it('unsubscribe email', () => {
      component.eorderDataService.expiryType = ExpiryStatus.emailUnsubscribe;
      component.getDialogData();
      expect(component.dialogData.icon).toBe('done');
      expect(component.dialogData.hasQuestLoginButton).toBe(false);
      expect(component.dialogData.dialogTopColorClass).toBe('green');
    });
    it('unsubscribe email failure', () => {
      component.eorderDataService.expiryType = ExpiryStatus.emailUnsubscribeFailed;
      component.getDialogData();
      expect(component.dialogData.icon).toBe('warning');
      expect(component.dialogData.hasQuestLoginButton).toBe(false);
      expect(component.dialogData.dialogTopColorClass).toBe('red');
    });
  });

  describe('Sample Already Taken', () => {
    beforeEach(() => {
      route.setQueryParam('token', '1234567890');
      component.ngOnInit();
    });
    it('success response', () => {
      expect(component.eorderDataService.expiryType).toEqual(ExpiryStatus.userConfirmsTestToCompleted);
    });
    it('error response', () => {
      component.eorderDataService.expiryType = null;
      spyOn(eorderService, 'getSampleAlreadyTakenByToken').and.returnValue(
        of(throwError({ error: { statusCode: 400 } }))
      );
      expect(component.eorderDataService.expiryType).toEqual(null);
    });
  });
  describe('#emailUnsubscribe', () => {
    const params = {
      token: 'aTxhrACYTcGBABQL1JKoA-LZmlCGxeRTXhWVNyyujIY_CdMBzW301UtztasTNc05YKt9LBVZV1JbFQp-6kLSbg',
      metricsType: 14
    };
    it('success response', () => {
      spyOn(eorderService, 'emailUnsubscribe').and.returnValue(of({
        responseCode: 200,
        responseMessage: ''
      }));
      component.emailUnsubscribe(params);
      expect(component.eorderDataService.expiryType).toEqual(ExpiryStatus.emailUnsubscribe);
    });
    it('error response', () => {
      spyOn(eorderService, 'emailUnsubscribe').and.returnValue(of({
        responseCode: 400,
        responseMessage: 'Invalid Token'
      }));
      component.emailUnsubscribe(params);
      expect(component.eorderDataService.expiryType).toEqual(ExpiryStatus.emailUnsubscribeFailed);
    });
  });
});
