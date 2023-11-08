import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EmailUnsubscribe, EmailUnsubscribeResponse, ExpiryErrorMessage, ExpiryStatus } from 'shared/models';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { PropertiesService } from 'shared/services/properties.service';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-eorder-order-expiry',
  templateUrl: './as-eorder-order-expiry.component.html',
  styleUrls: ['./as-eorder-order-expiry.component.scss']
})
export class AsEorderOrderExpiryComponent implements OnInit, OnDestroy {
  content = homeContent;
  dialogData: ExpiryErrorMessage = new ExpiryErrorMessage();
  private destroy$: Subject<any> = new Subject();
  emailUnsubscribeFailedText = null;
  fontChange = false;

  constructor(
    public eorderDataService: EorderDataService,
    private propertiesService: PropertiesService,
    private route: ActivatedRoute,
    private eorderService: EorderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params.token) {
        if (this.router.url.includes('as-sample-already-taken')) {
          this.sampleAlreadyTaken(params);
        } else {
          this.emailUnsubscribe(params);
        }
      } else {
        this.getDialogData();
      }
    });
  }

  sampleAlreadyTaken(params) {
    this.eorderService
      .getSampleAlreadyTakenByToken(params.token)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.eorderDataService.expiryType = ExpiryStatus.userConfirmsTestToCompleted;
        this.getDialogData();
      }, (error) => {
        if (error.status === 400) {
          this.eorderDataService.expiryType = ExpiryStatus.orderNotFound;
          this.getDialogData();
        }
      });
  }

  emailUnsubscribe(params) {
    const payload: EmailUnsubscribe = {
      token: params.token,
      metricsType: params.metricsType
    };
    this.eorderService
      .emailUnsubscribe(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: EmailUnsubscribeResponse) => {
        this.updateUi(res);
      }, (res) => {
        this.updateUi(res.data);
      });
  }

  updateUi(res: EmailUnsubscribeResponse) {
    if (res && res.responseCode === 200) {
      this.eorderDataService.expiryType = ExpiryStatus.emailUnsubscribe;
      this.getDialogData();
    } else {
      this.emailUnsubscribeFailedText = res.responseMessage;
      this.eorderDataService.expiryType = ExpiryStatus.emailUnsubscribeFailed;
      this.getDialogData();
    }
  }

  public getDialogData() {
    if (this.eorderDataService.expiryType) {
      switch (this.eorderDataService.expiryType) {
        case ExpiryStatus.userConfirmsTestToCompleted:
          if (this.content.as_eorder_expiry_scenarios) {
            this.dialogData.title = this.content.as_eorder_expiry_scenarios.userConfirmsTestToCompleted_title;
            this.dialogData.line1 = this.content.as_eorder_expiry_scenarios.userConfirmsTestToCompleted_line1;
            this.dialogData.line2 = this.content.as_eorder_expiry_scenarios.userConfirmsTestToCompleted_line2;
            this.dialogData.icon = 'done';
            this.dialogData.hasQuestLoginButton = true;
            this.dialogData.dialogTopColorClass = 'green';
          }
          break;
        case ExpiryStatus.orderTestAlreadyCompleted:
          if (this.content.as_eorder_expiry_scenarios) {
            this.dialogData.title = this.content.as_eorder_expiry_scenarios.orderTestAlreadyCompleted_title;
            this.dialogData.line1 = this.content.as_eorder_expiry_scenarios.orderTestAlreadyCompleted_line1;
            this.dialogData.line2 = this.content.as_eorder_expiry_scenarios.orderTestAlreadyCompleted_line2;
            this.dialogData.icon = 'done';
            this.dialogData.hasQuestLoginButton = true;
            this.dialogData.dialogTopColorClass = 'green';
          }
          break;
        case ExpiryStatus.orderHasExpired:
          if (this.content.as_eorder_expiry_scenarios) {
            this.dialogData.title = this.content.as_eorder_expiry_scenarios.orderHasExpired_title;
            this.dialogData.line1 = this.content.as_eorder_expiry_scenarios.orderHasExpired_line1;
            this.dialogData.line2 = this.content.as_eorder_expiry_scenarios.orderHasExpired_line2;
            this.dialogData.line3 = this.content.as_eorder_expiry_scenarios.orderHasExpired_line3;
            this.dialogData.icon = 'warning';
            this.dialogData.hasQuestLoginButton = false;
            this.dialogData.dialogTopColorClass = 'red';
          }
          break;
        case ExpiryStatus.orderNotFound:
          if (this.content.as_eorder_expiry_scenarios) {
            this.dialogData.title = this.content.as_eorder_expiry_scenarios.orderNotFound_title;
            this.dialogData.line1 = this.content.as_eorder_expiry_scenarios.orderNotFound_line1;
            this.dialogData.line2 = this.content.as_eorder_expiry_scenarios.orderNotFound_line2;
            this.dialogData.icon = 'warning';
            this.dialogData.hasQuestLoginButton = false;
            this.dialogData.dialogTopColorClass = 'red';
          }
          break;
        case ExpiryStatus.alreadyAccessedFromAnotherAccount:
          if (this.content.as_eorder_expiry_scenarios) {
            this.dialogData.title = this.content.as_eorder_expiry_scenarios.alreadyAccessedFromAnotherAccount_title;
            this.dialogData.line1 = this.content.as_eorder_expiry_scenarios.alreadyAccessedFromAnotherAccount_line1;
            this.dialogData.icon = 'done';
            this.dialogData.hasQuestLoginButton = false;
            this.dialogData.dialogTopColorClass = 'green';
          }
          break;
        case ExpiryStatus.emailUnsubscribe:
          this.fontChange = true;
          if (this.content.as_eorder_expiry_scenarios) {
            this.dialogData.title = this.content.as_eorder_expiry_scenarios.emailUnsubscribe_title;
            this.dialogData.line1 = this.content.as_eorder_expiry_scenarios.emailUnsubscribe_line1;
            this.dialogData.icon = 'done';
            this.dialogData.hasQuestLoginButton = false;
            this.dialogData.dialogTopColorClass = 'green';
          }
          break;
        case ExpiryStatus.emailUnsubscribeFailed:
          this.fontChange = true;
          if (this.content.as_eorder_expiry_scenarios) {
            this.dialogData.title = this.emailUnsubscribeFailedText;
            this.dialogData.icon = 'warning';
            this.dialogData.hasQuestLoginButton = false;
            this.dialogData.dialogTopColorClass = 'red';
          }
          break;
      }
    }
  }

  onCreateAccount() {
    this.propertiesService.getMqCreateAccountLink().subscribe(link => {
      window.open(link, '_self');
    });
  }

  ngOnDestroy(): any {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
