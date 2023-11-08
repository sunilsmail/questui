import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { combineLatest, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { AsSessionTimoutPopupComponent } from 'shared/components/as-session-timout-popup/as-session-timout-popup.component';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { IdleTimeoutService } from 'shared/services/idle.timeout.service';
import { LogoutService } from 'shared/services/logout.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { default as homeContent } from '../../../../../appointment/assets/content.json';

@Component({
  selector: 'as-toolbar',
  templateUrl: './as-toolbar.component.html',
  styleUrls: ['./as-toolbar.component.scss']
})
export class AsToolbarComponent implements OnInit, OnDestroy {
  rootURL = '/';
  @ViewChild('closeBtn') closeBtn: ElementRef<any>;
  activeTab: string;
  routerSubscription: Subscription;
  ds_nav_mobile_menu_active: boolean;
  data: { message: string; header: string, logout: boolean; };
  public dialogRef: MatDialogRef<AsSessionTimoutPopupComponent, any>;
  contactUs: SafeResourceUrl;
  contactUsLink$: Observable<String>;
  signInLink$: Observable<String>;
  redirectLink$ = new BehaviorSubject<string>(`${environment.loginPath}/as-home`);
  FAQLink$: Observable<String>;
  user_menu_active: any;
  showAsButton = true;
  isEorderFlowActivated$: Observable<boolean>;
  hideSignInLink$: Observable<boolean>;
  qualtricsUrl: string;
  qualtricsId: string;
  scriptValue: string;
  content = homeContent;

  constructor(private router: Router,
    private propertiesService: PropertiesService,
    private idleTimeoutService: IdleTimeoutService,
    private logoutService: LogoutService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private eOrderDataService: EorderDataService,
    private route: ActivatedRoute,
    private pscDetailsService: PscDetailsService,
  ) {
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

    this.isEorderFlowActivated$ = this.eOrderDataService.eOrderFlowActivatedSubject$;
    // Hide SignIn Link for Eorder Flow's
    this.hideSignInLink$ = combineLatest(this.route.queryParams, this.isEorderFlowActivated$).pipe(
      map(([params, eOrderActivated]) => (eOrderActivated || this.isTokenPresent(params))
      ));
  }

  ngOnInit() {
    this.selectingTabonAppLoad();
    this.contactUsLink$ = this.propertiesService.getContactUsLink();
    this.signInLink$ = this.propertiesService.getSignInLink();
    this.FAQLink$ = this.propertiesService.getFAQLink();
    this.addQualtricSrcipts();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
  openLoginDialog(data) {
    this.dialogRef = this.dialog.open(AsSessionTimoutPopupComponent, {
      data: data,
      // maxWidth:'40%',
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
    if (this.pscDetailsService.enableSitecodeinScheduleApptFlow ||
      this.pscDetailsService.enableSitecodeinFindLocationFlow) {
      location.href = '/schedule-appointment?showsitecode=true';
    } else {
      location.href = '/schedule-appointment';
    }
  }

  navigate() {
    this.rootURL = this.router.url;
    if (this.rootURL.indexOf('#') > -1) {
      this.rootURL = this.rootURL.split('#')[0];
      document.getElementById('skip-to-main').focus();
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

  isTokenPresent(params): boolean {
    return params['token'] ? true : false;
  }
  reloadLocationSearch() {
    if (this.pscDetailsService.enableSitecodeinScheduleApptFlow ||
      this.pscDetailsService.enableSitecodeinFindLocationFlow) {
      location.href = '/find-location/as-location-finder?showsitecode=true';
    } else {
      location.href = '/find-location/as-location-finder';
    }
  }
  addQualtricSrcipts() {
    // tslint:disable-next-line: max-line-length
    combineLatest(this.propertiesService.enableQualtrics(), this.propertiesService.getQualtricsASScriptValue(), this.propertiesService.getQualtricUrl(), this.propertiesService.getQualtricProperties()).subscribe(
      ([enable, value, url, id]) => {
        this.qualtricsUrl = url;
        this.qualtricsId = id;
        this.scriptValue = value;
        const script = document.createElement('script');
        script.type = `text/javascript`;
        script.text = `
        (function(){var g=function(e,h,f,g){
          this.get=function(a){
            for(var a=a+"=",c=document.cookie.split(";"),b=0,e=c.length;b<e;b++){
              for(var d=c[b];" "==d.charAt(0);)d=d.substring(1,d.length);
              if(0==d.indexOf(a))return d.substring(a.length,d.length)}return null};
          this.set=function(a,c){
            var b="",b=new Date;b.setTime(b.getTime()+6048E5);
            b=";expires="+b.toGMTString();document.cookie=a+"="+c+b+"; path=/; "};
          this.check=function(){
            var a=this.get(f);
            if(a)a=a.split(":");
            else if(100!=e)"v"==h&&(e=Math.random()>=e/100?0:100),a=[h,e,0],this.set(f,a.join(":"));
            else return!0;var c=a[1];
            if(100==c)return!0;switch(a[0]){
              case "v":return!1;case "r":return c=a[2]%Math.floor(100/c),a[2]++,this.set(f,a.join(":")),!c}
              return!0};
          this.go=function(){
            if(this.check()){var a=document.createElement("script");
            a.type="text/javascript";a.src=g;document.body&&document.body.appendChild(a)}};
          this.start=function(){
            var t=this;"complete"!==document.readyState?window.addEventListener?window.addEventListener("load",function(){
              t.go()},!1):window.attachEvent&&window.attachEvent("onload",function(){t.go()}):t.go()};};
          try{(new g(100,"r","${this.qualtricsId}","${this.qualtricsUrl}${this.scriptValue}")).start()}catch(i){}})();
          `;
        if (enable === 'true') {
          document.getElementsByTagName('head')[0].appendChild(script);
        }
      }
    );
  }

  signIn() {
    location.href = `${environment.loginPath}/as-home`;
  }

  selectingTabonAppLoad() {
    if (window.location.href.indexOf('/schedule-appointment') !== -1) {
      this.activeTab = 'scheduleAppointment';
    } else if (window.location.href.indexOf('/find-location') !== -1) {
      this.activeTab = 'findLocation';
    }
  }

}
