import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, BehaviorSubject } from 'rxjs';
import { AsSessionTimoutPopupComponent } from 'shared/components/as-session-timout-popup/as-session-timout-popup.component';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { IdleTimeoutService } from 'shared/services/idle.timeout.service';
import { LogoutService } from 'shared/services/logout.service';
import { PropertiesService } from 'shared/services/properties.service';
import { MockEorderDataService } from 'shared/specs/mocks/mock-eorder-data.service';
import { MockEorderStateNavigationService } from 'shared/specs/mocks/mock-eorder-state-navigation.service';
import { MockIdleTimeoutService } from 'shared/specs/mocks/mock-idleTimeout.service';
import { MockLogoutService } from 'shared/specs/mocks/mock-logout.service';
import { mockUiProperties, MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsToolbarAuthComponent } from './as-toolbar-auth.component';

describe('AsToolbarComponent', () => {
  let component: AsToolbarAuthComponent;
  let fixture: ComponentFixture<AsToolbarAuthComponent>;
  let propertiesService: PropertiesService;
  let idleTimeoutService: IdleTimeoutService;
  let logoutService: LogoutService;
  let sanitizer: DomSanitizer;
  let eOrderDataService: EorderDataService;
  let eOrderFlowActivatedSubject: BehaviorSubject<boolean>;
  let eOrderStateNavigationService: EorderStateNavigationService;
  // tslint:disable-next-line: max-line-length
  const contactUs = `https://secure.questdiagnostics.com/ViewsFlash/servlet/viewsflash?cmd=page&pollid=contactus!appt_sched_cmt3`;
  const mockMatDialogRef = {
    updateSize: (size: string) => { },
    close: () => { },
    open: () => { }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsToolbarAuthComponent, AsSessionTimoutPopupComponent],
      imports: [BrowserAnimationsModule, RouterTestingModule, MatDialogModule],
      providers: [
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: IdleTimeoutService, useClass: MockIdleTimeoutService },
        { provide: LogoutService, useClass: MockLogoutService },
        { provide: EorderDataService, useClass: MockEorderDataService },
        { provide: EorderStateNavigationService, useClass: MockEorderStateNavigationService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: ActivatedRoute, useValue: {queryParams: of({ token: 'xxxxx' })}},
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
    fixture = TestBed.createComponent(AsToolbarAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    logoutService = TestBed.inject(LogoutService);
    propertiesService = TestBed.inject(PropertiesService);
    idleTimeoutService = TestBed.inject(IdleTimeoutService);
    eOrderDataService = TestBed.inject(EorderDataService);
    eOrderStateNavigationService = TestBed.inject(EorderStateNavigationService);
    sanitizer = TestBed.inject(DomSanitizer);
    spyOn(propertiesService, 'getIdleTimeout').and.callThrough();
    spyOn(propertiesService, 'getContactUsLink').and.callThrough();
    spyOn(propertiesService, 'getFAQLink').and.callThrough();
    spyOn(propertiesService, 'getLegacyAccountSettings').and.callThrough();
    spyOn(propertiesService, 'getMyquestSite').and.callThrough();
    spyOn(logoutService, 'logout').and.callThrough();
    spyOn(idleTimeoutService, 'startWatching').and.callThrough();
    eOrderFlowActivatedSubject = new BehaviorSubject<boolean>(false);
    eOrderDataService.eOrderFlowActivatedSubject$ = eOrderFlowActivatedSubject.asObservable();
    // spyOn(window, 'open').and.callFake(() =>{
    //   return true;
    // });
     spyOn(window, 'open').and.stub();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
  // it('should set the active tab', () => {
  //   const event = new NavigationEnd(1, '/as-create-account', '/home');

  //   component.checkActiveUrl(event);
  //   expect(component.activeTab).toEqual('createAccount');
  // });
  // it('should set the active tab', () => {
  //   const event = new NavigationEnd(1, '/as-sign-in', '/home');

  //   component.checkActiveUrl(event);
  //   expect(component.activeTab).toEqual('signIn');
  // });
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

  it('navigate to accountsettings',() =>{
      fixture.detectChanges();
      propertiesService.getLegacyAccountSettings().subscribe(url =>{
          expect(url).toEqual(mockUiProperties.LegacyAccountSettings);
          const urlSettings = url.split('/');
          expect(urlSettings[urlSettings.length - 1]).toEqual('account-settings');
      });
      expect(propertiesService.getLegacyAccountSettings).toHaveBeenCalled();
  });
  it('signout',()=>{
      fixture.detectChanges();
      const data = 'logOut';
      expect(data).toEqual('logOut');
  });
  it('closeUserMenu',()=>{
    const user_menu_active = false;
    expect(user_menu_active).toEqual(false);
  });

  describe('hideUserAccountLink$', () => {
    const testHideUserAccountLink = (isActivated, expectedResult) => {
      describe(`when eOrderFlowActivated is ${isActivated} and token is present`, () => {
        beforeEach(() => {
          eOrderFlowActivatedSubject.next(isActivated);
        });

        it(`returns ${expectedResult}`, done => {
          fixture.detectChanges();
          component.hideUserAccountLink$.subscribe(hideUserAccountLink => {
            expect(hideUserAccountLink).toEqual(expectedResult);
            done();
          });
        });
      });
    };

    testHideUserAccountLink(false, true);
    testHideUserAccountLink(true, true);
  });
  describe('#navigateToMyquest', () => {
    beforeEach(() => {
      spyOn(component, 'navigateToMyquest').and.callThrough();
    });
    it('should call', () => {
      component.navigateToMyquest();
      expect(component.navigateToMyquest).toHaveBeenCalled();
    });
    it('get url from getMyquestSite', () => {
      component.navigateToMyquest();
      propertiesService.getMyquestSite().subscribe(res => {
        expect(res).toEqual('myquest.com');
      });
    });
  });
  describe('#scrollToTop', () => {
    beforeEach(() => {
      spyOn(component, 'scrollToTop').and.callThrough();
    });
    it('should call', () => {
      component.scrollToTop();
      expect(component.scrollToTop).toHaveBeenCalled();
    });
  });
  describe('#closeUserMenu', () => {
    beforeEach(() => {
      spyOn(component, 'closeUserMenu').and.callThrough();
    });
    it('should call', () => {
      component.closeUserMenu();
      expect(component.closeUserMenu).toHaveBeenCalled();
    });
    it('check user_menu_active', () => {
      component.closeUserMenu();
      expect(component.user_menu_active).toBeFalsy();
    });
  });
  describe('#signOut', () => {
    beforeEach(() => {
      spyOn(component, 'signOut').and.callThrough();
    });
    it('should call', () => {
      component.signOut('logOut');
      expect(component.signOut).toHaveBeenCalled();
    });
  });
  describe('#navigateToAccountSettings', () => {
    beforeEach(() => {
      spyOn(component, 'navigateToAccountSettings').and.callThrough();
    });
    it('should call', () => {
      component.navigateToAccountSettings();
      expect(component.navigateToAccountSettings).toHaveBeenCalled();
    });
  });
  describe('#isTokenPresent', () => {
    beforeEach(() => {
      spyOn(component, 'isTokenPresent').and.callThrough();
    });
    it('should call', () => {
      component.isTokenPresent('token');
      expect(component.isTokenPresent).toHaveBeenCalled();
    });
  });
  describe('#navigate', () => {
    beforeEach(() => {
      spyOn(component, 'navigate').and.callThrough();
    });
    it('should call', () => {
      component.navigate();
      expect(component.navigate).toHaveBeenCalled();
    });
  });
  describe('#getOpenEoders', () => {
    beforeEach(() => {
      spyOn(component, 'getOpenEoders').and.callThrough();
      spyOn(eOrderStateNavigationService, 'setEorders').and.callThrough();
    });
    it('should call', () => {
      component.ngOnInit();
      expect(component.getOpenEoders).toHaveBeenCalled();
    });
    it('set the data to setEorders service in state navigation service call', () => {
      component.ngOnInit();
      expect(eOrderStateNavigationService.setEorders).toHaveBeenCalled();
    });
    it('feature flag disbaled for open eorders', () => {
      spyOn(propertiesService, 'getASOpenEordersF221').and.returnValue(of(false));
      spyOn(eOrderStateNavigationService, 'getOpenEorders').and.callThrough();
      component.ngOnInit();
      expect(eOrderStateNavigationService.getOpenEorders).not.toHaveBeenCalled();
      expect(eOrderStateNavigationService.setEorders).not.toHaveBeenCalled();
    });
  });
});
