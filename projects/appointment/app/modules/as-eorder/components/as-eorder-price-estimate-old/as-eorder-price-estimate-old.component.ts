import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { editSummaryDetails } from 'shared/models/eOrder-state-navigation';
import { EorderEasypay } from 'shared/models/eorder';
import { CostEstimateService } from 'shared/services/eorder/easy-pay/cost-estimate.service';
import { EorderEasyPayOldService } from 'shared/services/eorder/easy-pay/easy-pay-old.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { PropertiesService } from 'shared/services/properties.service';
import { CustomValidators } from 'shared/utils/validation/validators';
import { default as homeContent } from '../../../../../assets/content.json';
import { AsPriceEstimateDialogComponent } from '../as-price-estimate-dialog/as-price-estimate-dialog.component';

@Component({
  selector: 'as-eorder-price-estimate-old',
  templateUrl: './as-eorder-price-estimate-old.component.html',
  styleUrls: ['./as-eorder-price-estimate-old.component.scss']
})
export class AsEorderPriceEstimateOldComponent implements OnInit, OnDestroy {
  content = homeContent;
  previousUrl: string;
  isAlternateFlow: boolean;
  estimatedPrice: number;
  SpinnerLoading = false;
  loading$: Observable<boolean>;
  enableEasypay$: Observable<boolean>;
  sdkLoading$: Observable<boolean>;

  form: FormGroup;
  BillingSinglePayment: FormGroup;
  SinglePaymentSubmited = false;
  singleSelectItems: any;
  MultiPaymentSubmited = false;
  creditCard: any;
  billingSelector: FormGroup;
  skipPayment = new FormControl();
  SkipPaymentSubmited = false;
  skipPaymentSelect: { id: number; name: string }[];
  DisableAll: any;

  // Multiple Payment Methods
  billingSelectorOption = new FormControl();
  multiPaymentMethod = true;
  enableEasypayButton = false;
  destroy$ = new Subject<void>();
  skipReasons = new FormControl('0', CustomValidators.selectSkipReason());
  reasonList = [
    { id: 0, name: 'Select' },
    { id: 1, name: 'I prefer to be billed later' },
    { id: 2, name: 'My insurance plan covers lab services in full' },
    { id: 3, name: 'I have secondary insurance that will cover the balance' },
    { id: 4, name: 'I don’t have a credit or debit card' }
  ];
  enableContinue = true;
  easypayEnhancement$: Observable<boolean>;
  easypayEnhancementF411$: Observable<boolean>;
  // verifyIentityTokenEnabled: boolean;

  constructor(
    private location: Location,
    private router: Router,
    private eorderDataService: EorderDataService,
    public dialog: MatDialog,
    private eorderService: EorderService,
    private eOrderStateNavigationService: EorderStateNavigationService,
    private eOrderEasyPayService: EorderEasyPayOldService,
    private propertiesService: PropertiesService,
    private fb: FormBuilder,
    private costEstimateService: CostEstimateService,
  ) {
    this.loading$ = this.eOrderStateNavigationService.getLoadingSpinner();
    this.sdkLoading$ = this.eOrderEasyPayService.getLoadingSpinner();
    this.buildBW();
  }

  ngOnInit() {
    this.enableEasypay$ = this.propertiesService.getEnableEasyPay().pipe(map((enableEasyPay) => {
      return enableEasyPay && this.costEstimateService.verifyIdentityTokenEnabled;
    }));
    // todo need to remove below method and call in price estimate response
    // this.loadSDK();
    this.easypayEnhancementF411$ = this.propertiesService.getASClesF589();
    this.easypayEnhancement$ = this.propertiesService.getEaypayEnhancementF89();
    this.previousUrl = '/eorder/as-eorder-review-details';
    this.getAlternateFlowStatus();
    // set the price value once you get form service
    // Now just save hard coded value
    this.getPriceEstimate();
    this.getSuccessResponseFromEasyPay();
    this.hideEasyPayOnError();
    this.setCCStatus();
  }
  public loadSDK() {
    // this.enableEasypay$.pipe(tap((value: boolean) => {
    //   if (value) {
    //     this.loadPaymentCard();
    //   }
    // }));
    this.enableEasypay$.subscribe((value: boolean) => {
      // this.verifyIentityTokenEnabled = this.costEstimateService.verifyIentityTokenEnabled;
      // if (value && this.costEstimateService.verifyIentityTokenEnabled) {
      if (value) {
        this.enableEasyPayButtonFn(true);
        this.loadPaymentCard();
      } else {
        this.enableEasyPayButtonFn(false);
      }
    });
  }

  getAlternateFlowStatus() {
    this.eorderDataService.getAlternateFlow().subscribe(res => {
      this.isAlternateFlow = res;
    });
  }
  goToPrevious() {
    this.location.back();
    this.router.navigate(['/eorder/as-eorder-review-details']);
  }
  onContinue() {
    if (!this.enableEasypayButton && this.skipReasons.value && +this.skipReasons.value !== 0) {
      this.eOrderEasyPayService.noPayment(this.reasonList[+this.skipReasons.value].name).subscribe();
    }
    this.saveEncounter();
    this.router.navigate(['/eorder/as-eorder-confirmation']);
  }
  openDialog() {
    this.dialog.open(AsPriceEstimateDialogComponent, { height: 'auto', maxWidth: '100vw', disableClose: true });
  }
  getPriceEstimate() {
    this.SpinnerLoading = true;
    this.eorderService.getPricingInfo().subscribe(
      (data: any) => {
        try {
          this.SpinnerLoading = false;
          this.estimatedPrice = data.responseBody.price;
          if (+this.estimatedPrice === 0) {
            this.estimatedPrice = null;
            this.enableEasyPayButtonFn(false);
          } else {
            this.loadSDK();
          }
          this.eorderDataService.setPriceEstimate(this.estimatedPrice);
        } catch (ex) {
          this.estimatedPrice = null;
          this.eorderDataService.setPriceEstimate(null);
        }
      },
      error => {
        this.estimatedPrice = null;
        this.SpinnerLoading = false;
      }
    );
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    window.location.href = `${window.location.origin}/as-home`;
  }

  saveEncounter() {
    this.eorderService.saveEncounter({ stateNavigation: editSummaryDetails.summaryDetails }).subscribe();
  }

  public loadPaymentCard() {
    this.eOrderEasyPayService.setLoadingSpinner(true);
    this.eOrderEasyPayService.getEasyPayInit().subscribe(
      (res: EorderEasypay) => {
        this.eOrderEasyPayService.initialiseUI(res);
      },
      () => {
        this.errorHandling();
        // for showing message in confirmation page
        this.eOrderEasyPayService.setWithPriceEstimateAndNoCC(true);
      }
    );
  }

  private errorHandling() {
    this.enableEasypay$ = of(false);
    this.enableEasyPayButtonFn(false);
    this.eOrderEasyPayService.setLoadingSpinner(false);
  }

  buildBW() {
    this.billingSelector = this.fb.group({
      billingSelectorOption: ['']
    });
    this.billingSelectorOption.patchValue('creditCard');
  }

  getSuccessResponseFromEasyPay() {
    this.eOrderEasyPayService.componentMethodCalled$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.onContinue();
    });
  }

  enableEasyPayButtonFn(value: boolean) {
    this.enableEasypayButton = value;
  }

  changeOption(event) {
    if (event === 'creditCard') {
      this.enableEasyPayButtonFn(true);
    } else if (event === 'skipPayment') {
      /** enable show summary button **/
      if (+this.skipReasons.value === 0) {
        this.enableContinue = false;
      } else {
        this.enableContinue = true;
      }
      this.enableEasyPayButtonFn(false);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectedOption() {
    if (this.skipReasons.value && +this.skipReasons.value !== 0) {
      this.skipReasons.markAsTouched();
      this.enableContinue = true;
    } else {
      this.enableContinue = false;
    }
  }

  hideEasyPayOnError() {
    this.eOrderEasyPayService.getHideEasyPay().subscribe(() => {
      this.enableEasypay$ = of(false);
    });

    this.eOrderEasyPayService.getFallbackUI().subscribe(() => {
      this.errorHandling();
    });
  }
  setCCStatus() {
    this.eOrderEasyPayService.getWithPriceEstimateAndNoCC().subscribe((value) => {
      this.costEstimateService.setWithPriceEstimateAndNoCC(value);
    });
  }
}
