import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, BehaviorSubject } from 'rxjs';
import { AsSessionTimoutPopupComponent } from 'shared/components/as-session-timout-popup/as-session-timout-popup.component';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { IdleTimeoutService } from 'shared/services/idle.timeout.service';
import { LogoutService } from 'shared/services/logout.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { MockPscDetailsService } from 'shared/specs/mocks';
import { MockEorderDataService } from 'shared/specs/mocks/mock-eorder-data.service';
import { MockIdleTimeoutService } from 'shared/specs/mocks/mock-idleTimeout.service';
import { MockLogoutService } from 'shared/specs/mocks/mock-logout.service';
import { mockUiProperties, MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsToolbarComponent } from './as-toolbar.component';

describe('AsToolbarComponent', () => {
  let component: AsToolbarComponent;
  let fixture: ComponentFixture<AsToolbarComponent>;
  let propertiesService: PropertiesService;
  let idleTimeoutService: IdleTimeoutService;
  let logoutService: LogoutService;
  let sanitizer: DomSanitizer;
  let eOrderDataService: EorderDataService;
  let eOrderFlowActivatedSubject: BehaviorSubject<boolean>;
  let router: Router;
  let pscDetailsService: PscDetailsService;

  // tslint:disable-next-line: max-line-length


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsToolbarComponent, AsSessionTimoutPopupComponent],
      imports: [BrowserAnimationsModule, RouterTestingModule, MatDialogModule],
      providers: [
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: IdleTimeoutService, useClass: MockIdleTimeoutService },
        { provide: EorderDataService, useClass: MockEorderDataService },
        { provide: LogoutService, useClass: MockLogoutService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        {provide: ActivatedRoute, useValue: {queryParams: of({ token: 'xxxxx' })}},
        { provide : PscDetailsService,useClass: MockPscDetailsService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [AsSessionTimoutPopupComponent],
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsToolbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
    logoutService = TestBed.inject(LogoutService);
    spyOn(logoutService, 'logout').and.callThrough();
    propertiesService = TestBed.inject(PropertiesService);
    pscDetailsService = TestBed.inject(PscDetailsService);
    spyOn(propertiesService, 'getIdleTimeout').and.callThrough();
    spyOn(propertiesService, 'getContactUsLink').and.callThrough();
    spyOn(propertiesService, 'getFAQLink').and.callThrough();
    spyOn(propertiesService, 'enableQualtrics').and.callThrough();
    spyOn(router, 'navigate').and.stub();

    sanitizer = TestBed.inject(DomSanitizer);

    // Idle Timeout Service
    idleTimeoutService = TestBed.inject(IdleTimeoutService);
    spyOn(idleTimeoutService, 'startWatching').and.callThrough();

    // Eorder Data Service
    eOrderDataService = TestBed.inject(EorderDataService);
    eOrderFlowActivatedSubject = new BehaviorSubject<boolean>(false);
    eOrderDataService.eOrderFlowActivatedSubject$ = eOrderFlowActivatedSubject.asObservable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get enableMQQualtrics', () => {
    fixture.detectChanges();
    propertiesService.enableQualtrics().subscribe(enable => {
      expect(enable).toEqual(mockUiProperties.enableASQualtrics);
      const script = document.createElement('script');
      if(enable === 'true'){
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
    expect(propertiesService.enableQualtrics).toHaveBeenCalled();
  });
  it('should set the active tab', () => {
    const event = new NavigationEnd(1, '/schedule-appointment', '/home');

    component.checkActiveUrl(event);
    expect(component.activeTab).toEqual('scheduleAppointment');
  });
  it('should set the active tab', () => {
    const event = new NavigationEnd(1, '/as-find-a-location', '/home');

    component.checkActiveUrl(event);
    expect(component.activeTab).toEqual('findLocation');
  });
  it('should set the active tab', () => {
    const event = new NavigationEnd(1, '/find-locationn', '/home');

    component.checkActiveUrl(event);
    expect(component.activeTab).toEqual('findLocation');
  });
  // it('should set the active tab', () => {
  //   const event = new NavigationEnd(1, 'contactUs', '/home');

  //   component.checkActiveUrl(event);
  //   expect(component.activeTab).toEqual('contactUs');
  // });
  it('should set the active tab', () => {
    const event = new NavigationEnd(1, '/as-create-account', '/home');

    component.checkActiveUrl(event);
    expect(component.activeTab).toEqual('createAccount');
  });
  it('should set the active tab', () => {
    const event = new NavigationEnd(1, '/as-sign-in', '/home');

    component.checkActiveUrl(event);
    expect(component.activeTab).toEqual('signIn');
  });
  it('should set the active tab', () => {
    const event = new NavigationEnd(1, '', '/home');

    component.checkActiveUrl(event);
    expect(component.activeTab).not.toEqual('scheduleAppointment');
  });
  it('should set Idle Timeout Warning', () => {
    fixture.detectChanges();
    propertiesService.getIdleTimeout().subscribe(timeOutWarning => {
      expect(timeOutWarning).toEqual(mockUiProperties.idleTimeOut);
    });
    expect(propertiesService.getIdleTimeout).toHaveBeenCalled();
  });

  it('should set Idle Timeout', () => {
    fixture.detectChanges();
    propertiesService.getIdleTimeout().subscribe(timeOut => {
      expect(timeOut).toEqual(mockUiProperties.idleTimeOut);
    });
    expect(propertiesService.getIdleTimeout).toHaveBeenCalled();
  });

  it('should set contactusLink', () => {
    fixture.detectChanges();
    propertiesService.getContactUsLink().subscribe(uri => {
      expect(uri).toEqual(mockUiProperties.contactUsLink);
    });
    expect(propertiesService.getContactUsLink).toHaveBeenCalled();
  });

  it('should set FAQLink', () => {
    fixture.detectChanges();
    propertiesService.getFAQLink().subscribe(url => {
      expect(url).toEqual(mockUiProperties.myquestASFaqs);
    });
    expect(propertiesService.getFAQLink).toHaveBeenCalled();
  });

  describe('hideSignInLink$', () => {
    const testHideSignInLink = (isActivated, expectedResult) => {
      describe(`when eOrderFlowActivated is ${isActivated} and token is present`, () => {
        beforeEach(() => {
          eOrderFlowActivatedSubject.next(isActivated);
        });

        it(`returns ${expectedResult}`, done => {
          fixture.detectChanges();
          component.hideSignInLink$.subscribe(hideLogInLink => {
            expect(hideLogInLink).toEqual(expectedResult);
            done();
          });
        });
      });
    };

    testHideSignInLink(false, true);
    testHideSignInLink(true, true);
  });

});
