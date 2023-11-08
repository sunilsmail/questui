import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { combineLatest, of, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { AsSessionTimoutPopupComponent } from 'shared/components/as-session-timout-popup/as-session-timout-popup.component';
import { OpenEorders } from 'shared/models';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { IdleTimeoutService } from 'shared/services/idle.timeout.service';
import { LogoutService } from 'shared/services/logout.service';
import { PropertiesService } from 'shared/services/properties.service';
import { default as homeContent } from '../../../../../../appointment/assets/content.json';

@Component({
  selector: 'as-toolbar-auth',
  templateUrl: './as-toolbar-auth.component.html',
  styleUrls: ['./as-toolbar-auth.component.scss']
})
export class AsToolbarAuthComponent implements OnInit, OnDestroy {
  rootURL = '/';
  @ViewChild('closeBtn') closeBtn: ElementRef<any>;
  activeTab: string;
  routerSubscription: Subscription;
  ds_nav_mobile_menu_active: boolean;
  data: { message: string; logout: boolean; header: string };
  public dialogRef: MatDialogRef<AsSessionTimoutPopupComponent, any>;
  contactUs: SafeResourceUrl;
  contactUsLink$: Observable<String>;
  signInLink$: Observable<String>;
  redirectLink$ = new BehaviorSubject<string>(`${environment.loginPath}${this.router.url}`);
  FAQLink$: Observable<String>;
  user_menu_active: any;
  accountSettings: any;
  isEorderFlowAuthActivated$: Observable<boolean>;
  hideUserAccountLink$: Observable<boolean>;
  content = homeContent;
  currentWindowWidth: number;

  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth;
  }

  constructor(private router: Router,
    private propertiesService: PropertiesService,
    private idleTimeoutService: IdleTimeoutService,
    private logoutService: LogoutService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private eOrderDataService: EorderDataService,
    private route: ActivatedRoute,
    private eOrderStateNavigationService: EorderStateNavigationService
  ) {
    this.isEorderFlowAuthActivated$ = this.eOrderDataService.eOrderFlowActivatedSubject$;
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkActiveUrl(event);
      });
    //// ********************** Time Out warning **********************************/
    // Calling Property Service
    this.propertiesService.getIdleTimeOutWarning().pipe(switchMap(idleTimeOutWarning =>
      // Service returns Time as in Minutes, so here Convert to Seconds.
      this.idleTimeoutService.startWatching(idleTimeOutWarning * 60)), tap(res => {
        if (this.dialogRef) {
          this.dialogRef.close();
        }
        this.data = {
          message: 'We have not received any activity from you in a while.' +
            ' Unless you actively use the application your session will time out shortly.',
          header: `Are you still there?`,
          logout: false
        };
        if (res) {
          this.openLoginDialog(this.data);
          this.idleTimeoutService.stopTimer();
        }
      })
    ).subscribe();

    //// ********************** Idle Time Out Service **********************************/
    // Calling Property Service
    this.propertiesService.getIdleTimeout().pipe(switchMap(idleTimeout =>
      // Service returns Time as in Minutes, so here Convert to Seconds.
      this.idleTimeoutService.sessionWatching(idleTimeout * 60)), tap(res => {
        if (this.dialogRef) {
          this.dialogRef.close();
        }
        this.data = {
          message: 'Your session timed out due to inactivity',
          header: `Session timeout`,
          logout: true
        };
        if (res) {
          this.openLoginDialog(this.data);
          this.idleTimeoutService.sessionStopTimer();
          //  this.logoutService.logout();
        }
      })
    ).subscribe();

    // Hide User Section Button for Eorder Flow's
    this.hideUserAccountLink$ = combineLatest(this.route.queryParams, this.isEorderFlowAuthActivated$).pipe(
      map(([params, eOrderActivated]) => (eOrderActivated || this.isTokenPresent(params))
      ));
  }

  ngOnInit() {
    this.selectingTabonAppLoad();
    this.getOpenEoders();
    this.contactUsLink$ = this.propertiesService.getContactUsLink();
    this.signInLink$ = this.propertiesService.getSignInLink();
    this.FAQLink$ = this.propertiesService.getFAQLink();
    this.currentWindowWidth = window.innerWidth;
  }


  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
  openLoginDialog(data) {
    this.dialogRef = this.dialog.open(AsSessionTimoutPopupComponent, {
      data: data,
      // minWidth:'40%',
      disableClose: true
    });
  }
  checkActiveUrl(event: NavigationEnd) {
    if (event.url.indexOf('/schedule-appointment') !== -1) {
      this.activeTab = 'scheduleAppointment';
    } else if (event.url.indexOf('/as-find-a-location') !== -1) {
      this.activeTab = 'findLocation';
    } else if (event.url.indexOf('/find-location') !== -1) {
      this.activeTab = 'findLocation';
    }
    // else if (event.url.indexOf('contactUs') !== -1) {
    //   this.activeTab = 'contactUs';
    // }
    else if (event.url.indexOf('/as-create-account') !== -1) {
      this.activeTab = 'createAccount';
    } else if (event.url.indexOf('/as-sign-in') !== -1) {
      this.activeTab = 'signIn';
    } else {
      this.activeTab = null;
    }
  }

  isActive(section: string): boolean {
    return section === this.activeTab;
  }

  reload() {
    location.href = '/as-home';
  }
  onScheduleAppointment() {
    location.href = '/schedule-appointment';
  }

  navigate() {
    this.rootURL = this.router.url;
    if (this.rootURL.indexOf('#') > -1) {
      document.getElementById('skip-to-main').focus();
      this.rootURL = this.rootURL.split('#')[0];
    }
    if (this.rootURL.indexOf('?') > -1) {
      this.rootURL = this.rootURL.split('?')[0];
    }
    window.location.hash = 'skip-to-main';
    // this.router.navigate([this.rootURL], { fragment: 'skip-to-main' });
    const element = document.getElementById('logoRef');
    if (element) {
      element.blur();
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.key === 'Escape') {
      const menu = document.getElementsByClassName('ds-header__nav--mobile-menu')[0];
      const activeEle = document.activeElement;
      if (menu && menu.classList.contains('ds_nav_mobile_menu_active')
        && ((!menu.contains(activeEle) && activeEle !== this.closeBtn.nativeElement) || event.key === 'Escape')) {
        // close menu when escaped or tab focused outside menu
        this.closeBtn.nativeElement.click();
      }
    }
  }

  // scroll to page top on tab key focus accessibility
  scrollToTop() {
    window.scrollTo(0, 0);
  }

  closeUserMenu() {
    this.user_menu_active = false;
  }
  // adding code for implemening focus on submenu after enter on UserProfile icon.
  profileClicked(event) {
    if (event.key === 'Enter' && document.getElementById('submenu_one')) {
      setTimeout(() => {
        document.getElementById('submenu_one').focus();
      }, 200);
    }
    if (event.key === 'Escape') {
      this.closeUserMenu();
      document.getElementById('profile_icon').focus();
    }
  }

  signOut(data) {
    if (data === 'logOut') {
      this.logoutService.logout();
    }
  }

  navigateToAccountSettings() {
    this.propertiesService.getLegacyAccountSettings().subscribe(url => {
      const urlSettings = url.split('/');
      urlSettings[urlSettings.length - 1] = 'account-settings';
      window.open(urlSettings.join('/'), '_blank');
    });
  }
  navigateToMyquest() {
    this.propertiesService.getMyquestSite().subscribe(url => {
      window.open(url + environment.loginPath.substring(1) + 'settings', '_blank');
    });
  }
  isTokenPresent(params): boolean {
    return params['token'] ? true : false;
  }
  reloadLocationSearch() {
    location.href = '/find-location/as-location-finder';
  }

  getOpenEoders() {
    this.propertiesService.getASOpenEordersF221().pipe(
      mergeMap((blnF221) => {
        if (blnF221) {
          return this.eOrderStateNavigationService.getOpenEorders();
        } else {
          return of(null);
        }
      })).subscribe((data: OpenEorders[]) => {
        if (data) {
          this.eOrderStateNavigationService.blnOpenEorders = data.length > 1;
          const lastOption: OpenEorders = {
            token: '-1'
          };
          data.push(lastOption);
          this.eOrderStateNavigationService.setEorders(data);
        }
      });
  }

  selectingTabonAppLoad() {
    if (window.location.href.indexOf('/schedule-appointment') !== -1) {
      this.activeTab = 'scheduleAppointment';
    } else if (window.location.href.indexOf('/find-location') !== -1) {
      this.activeTab = 'findLocation';
    }
  }

}
