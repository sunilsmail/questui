import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'shared/services/api.service';
import { DateService } from 'shared/services/date.service';
import { PropertiesService } from 'shared/services/properties.service';
import { UserService } from 'shared/services/user.service';
import { CustomValidators } from 'shared/utils/validation/validators';
import { ClinicalTrialDialogComponent } from '../clinical-trial-dialog/clinical-trial-dialog.component';

@Component({
  selector: 'clinical-trial-opt-in',
  templateUrl: './clinical-trial-opt-in.component.html',
  styleUrls: ['./clinical-trial-opt-in.component.scss']
})
export class ClinicalTrialOptInComponent implements OnInit {
  tokenFromQueryParam: String;
  user: any;
  hipaaSignForm: FormGroup;
  loading: boolean;
  rootURL: string;
  questHealthAccountSettingLink: any;
  hipaaContent: any;
  redirectUrl: string;
  mqSite: string;
  constructor(private apiService: ApiService,
    public activatedRoute: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private dateService: DateService,
    private propertiesService: PropertiesService,
    private router: Router) { }

  ngOnInit(): void {
    this.loading = true;

    combineLatest([this.propertiesService.getQuestHealthSite('account'), this.propertiesService.getMyquestSite('')])
      .subscribe(([questHealthLink, mqSite]) => {
        this.questHealthAccountSettingLink = questHealthLink;
        this.mqSite = mqSite;
      });

    this.activatedRoute.queryParamMap
      .pipe(
        switchMap((params) => {
          if (params.get('hipaaToken')) {
            this.tokenFromQueryParam = encodeURIComponent(params.get('hipaaToken')).replace(/%20/g, '%2B');
            return this.userService.isAuthenticated$;
          } else {
            this.errorPopup();
            return EMPTY;
          }
        }),
        switchMap((isAuthenticated) => {
          if (isAuthenticated) {
            return this.userService.getUserdata();
          } else {
            this.errorPopup();
            return EMPTY;
          }
        }),
        switchMap((user: any) => {
          if (user) {
            this.user = user;
            return this.getHipaaContent();
          } else {
            this.errorPopup();
            return EMPTY;
          }
        })).subscribe((hipaaContentResponse: any) => {
          this.loading = false;
          this.hipaaContent = hipaaContentResponse?.hipaaContent ? JSON.parse(hipaaContentResponse?.hipaaContent).data : null;
          this.redirectUrl = hipaaContentResponse ? hipaaContentResponse.redirectURL : null;

          if (this.hipaaContent) {
            this.buildForm();
          } else {
            this.errorPopup();
          }
        },
          () => {
            this.errorPopup();
          });
  }

  buildForm() {
    this.hipaaSignForm = this.fb.group({
      firstName: [null, [CustomValidators.profileNameValidator(this.user.firstName)]],
      lastName: [null, [CustomValidators.profileNameValidator(this.user.lastName)]],
      hipaaAuthorizationDate: [this.datePipe.transform(new Date(), 'MM/dd/yyyy')]
    });
  }

  getHipaaContent(): any {
    return this.apiService.post('/guest/standalone/hipaaContent', {
      hipaaToken: this.tokenFromQueryParam
    });
  }

  onSubmit() {
    if (this.hipaaSignForm.valid) {
      this.submitSignedHipaa(
        this.hipaaSignForm.value.firstName,
        this.hipaaSignForm.value.lastName,
        this.tokenFromQueryParam
      ).subscribe((res) => {
        this.loading = false;
        window.scroll(0, 0);
        this.dialog.open(ClinicalTrialDialogComponent,
          {
            disableClose: true,
            data: {
              title: 'Success!',
              message: 'A signed copy has been emailed to you.',
              buttonTitle: this.getButtonName(),
              redirectUrl: this.redirectUrlWithStatus('submitted')
            },
            panelClass: ['ds-modal', 'ds-grid--12', 'ds-elevation--l3']
          });
      },
        () => {
          window.scroll(0, 0);
          this.errorPopup();
        });
    }

  }

  errorPopup() {
    this.loading = false;
    this.dialog.open(ClinicalTrialDialogComponent,
      {
        disableClose: true,
        data: {
          title: 'Sorry!',
          message: 'We cannot process the request. Please try again later.',
          buttonTitle: this.getButtonName(),
          redirectUrl: this.redirectUrlWithStatus('cancelled') || this.questHealthAccountSettingLink
        },
        panelClass: ['ds-modal', 'ds-grid--12', 'ds-elevation--l3']
      });
  }

  navigateToMain() {
    this.rootURL = this.router.url;
    this.router.navigateByUrl(this.rootURL + '#skip-to-main');
    const element = document.getElementById('logoRef');
    if (element) {
      element.blur();
    }
  }


  submitSignedHipaa(firstName, lastName, tokenFromQueryParam) {
    this.loading = true;
    const requestBody = {
      firstName: firstName,
      lastName: lastName,
      hipaaAuthorizationDate: new Date().toISOString().split('.')[0] + 'Z',
      token: tokenFromQueryParam,
      subDateAndTime: this.dateService.getCurrentDateWithTimeZoneForStandAloneHipaa()
    };

    return this.apiService.post('/api/hippaAuthorization', requestBody);
  }

  onCancel() {
    window.location.href = this.redirectUrlWithStatus('cancelled');
  }

  redirectUrlWithStatus(status) {
    if (this.redirectUrl) {
      return this.redirectUrl.includes('?') ? this.redirectUrl + `&status=${status}` : this.redirectUrl + `?status=${status}`;
    } else {
      return null;
    }

  }

  getButtonName() {
      return this.redirectUrl && this.redirectUrl.includes(this.mqSite) ? 'Return to Activity Page' : 'Return to Accounts Page';
  }

}
