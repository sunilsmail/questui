import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { AsVerifyIdentityDialogComponent } from 'app/modules/as-eorder/components/as-verify-identity-dialog/as-verify-identity-dialog.component';
// tslint:disable-next-line: max-line-length
import { AsFindAppointmentDialogComponent } from 'app/modules/as-find-appointment/components/as-find-appointment-dialog/as-find-appointment-dialog.component';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ExpiryStatus } from 'shared/models';
import { DataService } from 'shared/services/data.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { FindAppointmentService } from 'shared/services/find-appointment.service';
import { MaintainService } from 'shared/services/maintenace.service';
import { PropertiesService } from 'shared/services/properties.service';
import { UserService } from 'shared/services/user.service';
import { default as homeContent } from '../../../../../assets/content.json';
// tslint:disable-next-line: max-line-length
import { AsImportantVisitInfoDialogComponent } from '../as-important-visit-info-dialog/as-important-visit-info-dialog.component';
@Component({
  selector: 'as-home-new',
  templateUrl: './as-home-new.component.html',
  styleUrls: ['./as-home-new.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsHomeNewComponent implements OnInit {
  content = homeContent;
  isEorder: boolean;
  toggleChatbot = true;
  isAuthenticated$: Observable<boolean>;
  createAccountLink$: Observable<String>;
  futureAppointmentsLink$: Observable<string>;
  isEmailVeified$: Observable<boolean>;
  resendLink$: Observable<string>;
  node: any;
  covidInfoBannerFlag = true;
  safetyMeasureLink$: Observable<string>;
  maskPolicyLink$: Observable<string>;
  testingOptionLink$: Observable<string>;
  faqLink$: Observable<string>;
  outOfPocketLink$: Observable<string>;
  enableOpenEordersF221$: Observable<boolean>;
  homepageCovidSection$: Observable<boolean>;
  covidIds: number[] = [];
  covidAlertContent$: Observable<string>;
  covidSectionLink$: Observable<string>;
  covidSectionLink1421$: Observable<string>;
  isEmailVerified = false;
  featureFlag1421$: Observable<boolean>;
  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
    private route: ActivatedRoute,
    private propertiesService: PropertiesService,
    private eorderService: EorderService,
    private router: Router,
    private eorderDataService: EorderDataService,
    private maintainService: MaintainService,
    private userService: UserService,
    private eOrderStateNavigationService: EorderStateNavigationService,
    private findAppointmentService: FindAppointmentService) {
    this.isEmailVeified$ = this.userService.isEmailConfirmSubject$.pipe(tap((val) => {
      this.isEmailVerified = val;
    }));
    this.resendLink$ = this.propertiesService.getLegacyResendEmailLink();
    this.isAuthenticated$ = userService.isAuthenticated$.pipe(
      tap((isLoggedIn) => {
        if (isLoggedIn) {
          // console.log('AsHomeComponent constructor');
          this.maintainService.setMessageClose(false);
        }
      })
    );
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.isEorder = true;
        this.eorderDataService.isEorderFlowActivated(false);
        this.verifyIdentity(token);
        this.toggleChatbot = false;
        // this.setChatbotPadding();
      }
    });
    this.enableOpenEordersF221$ = this.propertiesService.getASOpenEordersF221();
    this.homepageCovidSection$ = this.propertiesService.getHomePageCovidSection();
    this.covidAlertContent$ = this.propertiesService.getcovidAlertContent();
  }

  ngOnInit() {
    this.createAccountLink$ = this.propertiesService.getMqCreateAccountLink();
    this.futureAppointmentsLink$ = this.propertiesService.getMyquestSite()
      .pipe(map(url => url + environment.loginPath.substring(1) + 'appointments'));
    this.dataService.setFindLocationFlow(false);
    this.dataService.setLocationFinderDetailsFlowtoReason(false);
    setTimeout(() => { this.setChatBotPosition(); }, 1000);
    // setTimeout(() => {
    //   if (!this.isEorder) {
    //     this.userService.isAuthenticated$.subscribe((isLoggedIn) => {
    //       // if(!isLoggedIn){
    //       //  // this.openInfoDialog();
    //       // }else{
    //       //   this.toggleChatbot = true;
    //       // }
    //       // this.setChatbotPadding();
    //     });
    //   }
    // }, 1000);
    this.covidSectionLink1421$ = this.propertiesService.getcovidFilterLinkNew();
    this.covidSectionLink$ = this.propertiesService.getCovidFilterLink();
    this.featureFlag1421$ = this.propertiesService.getCITUpdatedLinksFeatureFlag1421();
    this.safetyMeasureLink$ = this.propertiesService.getsafetyMeasureLink();
    this.maskPolicyLink$ = this.propertiesService.getMaskPolicyLink();
    this.testingOptionLink$ = this.propertiesService.getTestingOptionLink();
    this.faqLink$ = this.propertiesService.getFaqLink();
    this.outOfPocketLink$ = this.propertiesService.getOutOfPocketLink();
    this.getCovidIds();
  }

  getCovidIds() {
    this.propertiesService.getLandingPageCovidFacilityIds().subscribe((covidIds: number[]) => {
      this.covidIds = covidIds;
    });
  }

  private setChatbotPadding() {
    // setTimeout(() => {
    // console.log('AsHomeComponent setChatbotPadding');
    // this.maintainService.setMessageClose(false);
    // }, 100);
  }

  private openInfoDialog() {
    this.dialog
      .open(AsImportantVisitInfoDialogComponent, {
        panelClass: 'as-imp-visit-info-dialog-container',
        height: 'auto',
        maxWidth: '100vw',
        disableClose: true
      })
      .afterClosed()
      .subscribe(value => {
        this.toggleChatbot = true;
        if (this.maintainService.isMessageNotAvilable) {
          this.maintainService.setMessageClose(true);
        } else {
          this.maintainService.setMessageClose(false);
        }
      });
  }

  findAppointment(action?: string) {
    this.dialog.open(AsFindAppointmentDialogComponent, {
      height: 'auto', maxWidth: '100vw', disableClose: true,
      data: { actionName: action }
    }).afterClosed().subscribe(value => {
      if (document.getElementById(action)) {
        document.getElementById(action).focus();
      }
    });
  }

  verifyIdentity(token: string) {

    this.eorderService.getEncounterInfo(token).subscribe(
      (encounter: any) => {
        if (
          encounter &&
          encounter.status &&
          (encounter.status === ExpiryStatus.alreadyAccessedFromAnotherAccount ||
            encounter.status === ExpiryStatus.orderHasExpired ||
            encounter.status === ExpiryStatus.orderTestAlreadyCompleted ||
            encounter.status === ExpiryStatus.userConfirmsTestToCompleted)
        ) {
          this.eorderDataService.setEorderFlow(true);
          this.eorderDataService.expiryType = encounter.status;
          this.router.navigate(['/eorder/as-eorder-order-expiry']);
        } else {
          let encounterData = null;
          const nextAllowedVerificationDate = encounter.authentication.nextAllowedVerificationDate;
          if (nextAllowedVerificationDate) {
            encounterData = {
              firstName: encounter.eOrder.firstName,
              token,
              nextAllowedVerificationDate
            };
          } else {
            encounterData = {
              firstName: encounter.eOrder.firstName,
              token
            };
          }
          // this.dialog.open(AsVerifyIdentityDialogComponent, { height: 'auto', maxWidth: '100vw', disableClose: true, data: { token } });
          this.dialog.open(AsVerifyIdentityDialogComponent, {
            height: 'auto',
            maxWidth: '100vw',
            disableClose: true,
            data: { ...encounterData },
            panelClass: ['ds-modal', '--scroll-box', 'ds-grid--12', 'ds-elevation--L3'],
            ariaLabel: 'Verify Identity dialog'
          }).afterClosed()
            .subscribe(value => {
              this.toggleChatbot = true;
              this.maintainService.setMessageClose(false);
            });
        }

      },
      error => {
        if (error && error.status === 400) {
          this.eorderDataService.setEorderFlow(true);
          this.eorderDataService.expiryType = ExpiryStatus.orderNotFound;
          this.router.navigate(['/eorder/as-eorder-order-expiry']);
        }
      }
    );

  }

  findRightTest() {
    this.propertiesService.getFindRightTestLink().subscribe((url: string) => {
      window.open(url, '_self');
    });
  }

  navigateToResendEmailLegacy() {
    this.propertiesService.getMyquestSite().subscribe(url => {
      window.open(url + environment.loginPath.substring(1) + 'web/unverified-prompt', '_blank');
    });
  }
  remove() {
    this.covidInfoBannerFlag = false;
    // this.isEmailVerified = false;
  }
  setChatBotPosition() {
    this.toggleChatbot = true;
    if (this.maintainService.isMessageNotAvilable) {
      this.maintainService.setMessageClose(true);
    } else {
      this.maintainService.setMessageClose(false);
    }
  }

  next() {
    this.filterTests(false);
    if (this.eOrderStateNavigationService.blnOpenEorders) {
      this.eOrderStateNavigationService.setSelectedEorder(null);
      this.router.navigate(['/schedule-appointment/as-open-eorders']);
    } else {
      this.router.navigate(['/schedule-appointment']);
    }
  }

  filterTests(filterCovidTest: boolean) {
    this.findAppointmentService.filterCovidTest = filterCovidTest;
    this.findAppointmentService.covidIds = this.covidIds;
  }

  covidTest() {
    this.filterTests(true);
    this.router.navigate(['/schedule-appointment/as-reason-for-visit']);
  }
}
