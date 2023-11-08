import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { ReasonCategory, ReasonEditState } from 'shared/models/reason-category';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { DeeplinkReasonService } from 'shared/services/findLocation/deeplink-reason.service';
import { PropertiesService } from 'shared/services/properties.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { default as homeContent } from '../../../../../assets/content.json';
import { AsActiveInfectionDialogComponent } from '../as-active-infection-dialog/as-active-infection-dialog.component';
import { AsAntibodyDialogComponent } from '../as-antibody-dialog/as-antibody-dialog.component';
import { AsAntibodyF1269DialogComponent } from '../as-antibody-f1269-dialog/as-antibody-f1269-dialog.component';
import { AsBfaRedirectDialogComponent } from '../as-bfa-redirect-dialog/as-bfa-redirect-dialog.component';
import { AsCovid19DetailsDialogComponent } from '../as-covid19-details-dialog/as-covid19-details-dialog.component';
import { AsCovid19DialogComponent } from '../as-covid19-dialog/as-covid19-dialog.component';
import { AsCovid19ElectronicCommonDialogComponent } from '../as-covid19-electronic-common-dialog/as-covid19-electronic-common-dialog.component';
import { AsPurchaseMyOwnTestDialogComponent } from '../as-purchase-my-own-test-dialog/as-purchase-my-own-test-dialog.component';
import { PscAvailabilityQuery } from './../../../../../../shared/src/lib/models/psc';
import { PscService } from './../../../../../../shared/src/lib/services/psc.service';


@Component({
  selector: 'as-reason-for-visit',
  templateUrl: './as-reason-for-visit.component.html',
  styleUrls: ['./as-reason-for-visit.component.scss']
})
export class AsReasonForVisitComponent implements OnInit, OnDestroy {

  items$: Observable<ReasonCategory[]>;
  content = homeContent;
  visitReasons: ReasonCategory[] = [];
  isTests: boolean;
  isReasons: boolean;
  selectedTests: ReasonCategory[] = [];
  multiSelect: boolean;
  loading$ = new Subject<boolean>();
  selectedReason$ = new BehaviorSubject<string>('MAIN');
  enableContinue: boolean;
  destroy$ = new Subject<void>();
  selectedMainReason: any;
  selectedAppointment: any;
  isEdit = false;
  mainReasons: ReasonCategory[] = [];
  loading = false;
  resetTest = false;
  previousMulSelect = false;
  testItems: ReasonCategory[];
  destination: string;
  URL = 'https://www.questdiagnostics.com/home/Covid-19/Patients/';
  hideInsuranceInfo = true;
  covidTestingOptionsUrl: string;
  // need to store selected Reason and Selected test(incase its 'GLUCOSE')
  urlHasPurchaseTest = false;
  facilityTypeValue: any[] = [];
  enableOpenEordersF221$: Observable<boolean>;
  feature_flag_f1269_rit_aid_locations = false;
  feature_f1421_cit_updates: boolean;
  vm$: any;
  viewOfferingsLink: string;
  covidAntibodyNewCitLink: string;
  reasonsListArray: any;
  paramsSubscription: Subscription;
  isPurchaseTestDeepLink: boolean;
  constructor(private appointment: AppointmentService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private dataService: DataService,
    private renderer: Renderer2,
    private location: Location,
    private psc: PscService,
    private propertiesService: PropertiesService,
    private skipInsuranceService: SkipInsuranceService,
    private deeplinkReasonService: DeeplinkReasonService,
    private eOrderStateNavigationService: EorderStateNavigationService) {
    this.renderer.addClass(document.body, 'as-reason');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    this.renderer.removeClass(document.body, 'as-reason');
  }

  ngOnInit() {
    // this.enableOpenEordersF221$ = this.propertiesService.getASOpenEordersF221();
    this.getFeatureFlags();
    this.setValues();
    if (this.route.snapshot && this.route.snapshot.data) {
      this.reasonsListArray = this.route.snapshot.data.reasons;
      this.deeplinkReasonService.reasonsListArray = this.route.snapshot.data.reasons;
      this.paramsSubscription = this.route.queryParamMap.pipe(take(1)).subscribe(params => {
        this.isPurchaseTestDeepLink = (params.get('reason')) ? (params.get('reason') === 'PQD') ? true : false : false;
        (params.get('reason')) ? this.getTestsForReason(params.get('reason')) : this.getReasons();
        if (this.isPurchaseTestDeepLink) {
          this.selectPurchaseOwnTest(params);
        }
      });
    }
    this.route.paramMap.subscribe(params => {
      const isMultiple = 'EMPLOYER';
      this.enableContinue = false;
      this.init(params);
      this.urlHasPurchaseTest = (params.get('reason')) ? (params.get('reason') === 'PURCHASETEST'
        || params.get('reason')?.toUpperCase() === 'GLUCOSE') ? true : false : false;
      (params.get('reason')) ? this.getTestsForReason(params.get('reason')) : this.getReasons();
      if (params?.get('reason')?.toUpperCase() === isMultiple) {
        this.dataService.setTestsData(this.selectedTests);
        this.dataService.setReasonType(true);
      }
    });
    this.items$ = this.selectedReason$.pipe(
      tap(() => {
        if (this.urlHasPurchaseTest && !this.dataService.selectedItemForApiCall) {
          this.loading$.next(false);
          this.router.navigate(['/schedule-appointment/as-reason-for-visit']);
        }
        this.loading$.next(true);
      }),
      debounceTime(500),
      switchMap(id => {
        this.dataService.reasonCategory = id;
        this.purchasedByOwnTestFlow();
        return this.appointment.getReasons(id, this.dataService.selectedItemForApiCall);
      }),
      tap(() => this.loading$.next(false))
    );
    this.edit();
    // to fix: DE23068
    setTimeout(() => {
      if (document.getElementById('back-button-reason-for-visit')) {
        document.getElementById('back-button-reason-for-visit').focus();
      }
    }, 100);
    this.getCovidTestLearnMoreUrl();
  }
  getCovidTestLearnMoreUrl() {
    combineLatest([this.propertiesService.getCovidTestingOptionsLink(),
    this.propertiesService.getViewOfferingAntiBodyUrl(),
    this.propertiesService.getCovidAntibodyNewCitLink()]).subscribe(([url, url1, covidAntibodyNewCitLink]) => {
      this.covidTestingOptionsUrl = url;
      this.viewOfferingsLink = url1;
      this.covidAntibodyNewCitLink = covidAntibodyNewCitLink;
    });
  }

  selectPurchaseOwnTest(params) {
    const item: ReasonCategory = this.reasonsListArray[0].filter(reason => reason.deeplinkReason.toUpperCase() === params.get('reason'));
    this.dataService.selectedItemForApiCall = item[0];
    this.setPurchasedByOwnTest(item[0]);
    this.dataService.setTestsData(this.selectedTests);
    this.dataService.setReasonData(item[0]);
    this.dataService.setReasonType(true);
    this.router.navigate(['/schedule-appointment/as-reason-for-visit', { reason: item[0].serviceRequestor }],
      { queryParams: {}, replaceUrl: false });
  }

  init(params) {
    // let value = null;
    this.clearSelectedTestsIfReasonChanged(params);

    this.dataService.getTestsData().pipe(takeUntil(this.destroy$)).subscribe((testsData: ReasonCategory[]) => {
      this.selectedTests = testsData;
      this.enableContinue = this.selectedTests && this.selectedTests.length > 0;
      /* if(this.selectedTests.length === 1){
        value = this.mainReasons.find(x => x.facilityServiceId === this.selectedTests[0].facilityServiceId);
        if(value && value.serviceRequestor){
          this.enableContinue = false;
        }else{
          this.enableContinue = true;
        }
      } */
    });
  }

  goToPrevious() {
    // Route to home page, when history is not available for angular's location service
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/as-home']);
    }
  }

  clearSelectedTestsIfReasonChanged(params) {
    this.dataService.getReasonData().pipe(takeUntil(this.destroy$)).subscribe((reasonData: ReasonCategory) => {
      this.selectedMainReason = reasonData;
      if (params.get('reason') && reasonData && reasonData.serviceRequestor !== params.get('reason')) {
        // const value = this.mainReasons.find(x => x.facilityServiceId === reasonData.facilityServiceId);
        // if(value && reasonData.serviceRequestor){
        this.selectedTests = [];
        this.dataService.setTestsData(this.selectedTests);
        // }
      }
    });
  }



  onItemSelected(item: ReasonCategory): void {
    this.skipInsuranceService.setCovidReasonSelected(false);
    if (item.facilityServiceId !== 26 && item.facilityServiceId !== 6) {
      this.dataService.searchCovidAppointmentsBy = null;
      this.dataService.siteType = null;
      this.dataService.isMainCovidActiveInfectionSelected = false;
    }
    this.skipInsuranceService.setSkipInsurance(item.skipInsurance ? item.skipInsurance : false);
    // this.resetTests(item);
    this.multiSelect ? this.onTestSelected(item) :
      item.facilityServiceId === 3 ? this.openDialog() : this.navigateToNext(item);
  }

  // Based on query param differentiate purchased my own test flow('PURCHASETEST')
  purchasedByOwnTestFlow() {
    if (this.dataService.reasonCategory === 'MAIN' && this.dataService.isSelectedPurchasedMyOwnTest) {
      this.selectedTests = [];
      this.dataService.setTestsData(this.selectedTests);
    }
    else if (this.dataService.reasonCategory === 'PURCHASETEST' && this.dataService.isSelectedPurchasedMyOwnTest) {
      this.psc.isPurchaseTest = true;
      this.selectedTests = [];
      this.selectedTests = this.dataService.selectedTestForPurchasedMyOwnTest;
      this.dataService.setTestsData(this.selectedTests);
      if (this.selectedTests && this.selectedTests[0] && this.selectedTests[0].facilityServiceId === 26
        && !this.feature_flag_f1269_rit_aid_locations) {
        this.dataService.isMainCovidActiveInfectionSelected = true;
      } else {
        this.dataService.isMainCovidActiveInfectionSelected = false;
      }
    }
  }
  setPurchasedByOwnTest(item) {
    if (item.facilityServiceId === 6 && this.dataService.reasonCategory === 'MAIN') {
      this.dataService.isSelectedPurchasedMyOwnTest = true;
      this.selectedTests = [];
      this.dataService.setTestsData(this.selectedTests);
    }
    else {
      this.dataService.isSelectedPurchasedMyOwnTest = false;
      this.dataService.selectedTestForPurchasedMyOwnTest = [];
    }
  }
  resetPurchasedByOwnTest(item) {
    if (this.dataService.reasonCategory === 'MAIN') {
      this.dataService.isSelectedPurchasedMyOwnTest = false;
      this.dataService.selectedTestForPurchasedMyOwnTest = [];
    }
    else if (item && this.dataService.reasonCategory === 'PURCHASETEST') {
      this.dataService.isSelectedPurchasedMyOwnTest = true;
      this.dataService.selectedTestForPurchasedMyOwnTest = [item];
    }
  }
  navigateToNext(item: ReasonCategory): void {
    this.psc.isPurchaseTest = false;
    if (item.facilityServiceId === 26 && this.dataService.reasonCategory === 'MAIN') {
      this.covidDialog(item);
    } else if (item.facilityServiceId === 25 && this.dataService.reasonCategory === 'MAIN') {
      if (item.supressDialog) {
        this.antiBodySuccess(item);
      } else {
        this.antibodyTestDialog(item);
      }
    } else {
      this.isTests ? this.dataService.setTestsData([item]) : this.dataService.setReasonData(item);
      if (!this.isTests) {
        this.selectedMainReason = item;
        this.dataService.setEditReason(this.selectedMainReason);
      }
      // item.serviceRequestor ? this.navigateToTests(item) : this.navigateToLocations(item);
      if (item.serviceRequestor) {
        this.dataService.selectedItemForApiCall = item;
        this.setPurchasedByOwnTest(item);
        // this.selectedTests = [];
        this.dataService.setTestsData(this.selectedTests);
        this.dataService.setReasonData(item);
        this.navigateToTests(item);
      }
      else {
        this.resetPurchasedByOwnTest(item);
        this.navigateToLocations(item);
      }
    }

  }

  covidDialog(item: ReasonCategory) {
    if (item.supressDialog) {
      this.activeInfectionSuccess();
    } else {
      this.openCovidDialog(item);
    }
  }

  antibodyTestDialog(item: ReasonCategory): void {
    let dialogRef;
    if (this.feature_flag_f1269_rit_aid_locations) {
      dialogRef = this.dialog.open(AsAntibodyF1269DialogComponent, {
        // panelClass: 'as-peace-of-mind',
        autoFocus: false,
        data: { antiBodyTest: true }
      });
    } else {
      dialogRef = this.dialog.open(AsAntibodyDialogComponent, {
        // panelClass: 'as-peace-of-mind',
        autoFocus: false
      });
    }
    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'Yes') {
        this.antiBodySuccess(item);
      } else if (res === 'No') {
        this.feature_f1421_cit_updates ? window.open(this.covidAntibodyNewCitLink, '_self') :
          window.open(this.viewOfferingsLink, '_self');
      }
    });
  }

  navigateToTests(item: ReasonCategory): void {
    this.dataService.setReasonType(true);
    this.router.navigate(['/schedule-appointment/as-reason-for-visit', { reason: item.serviceRequestor }]);
  }

  navigateToLocations(item: ReasonCategory) {
    this.dataService.setReasonType(false);
    if (this.isTests || !item.serviceRequestor) {
      this.dataService.setTestsData([item]);
    } else {
      this.dataService.setReasonData(item);
    }
    if ((item.facilityServiceId !== 26 || this.dataService.reasonCategory === 'PURCHASETEST')) {
      if (this.dataService.isSelectedPurchasedMyOwnTest && this.dataService.reasonCategory === 'PURCHASETEST') {
        this.openPurchaseOwnDialog(item);
      }
      else {
        if (item.facilityServiceId !== 25) {
          this.checkIsLocationSupported();
        }
      }
      if (!this.isEdit) {
        this.dataService.setblnEditReasonData(false);
      }
      this.dataService.searchCovidAppointmentsBy = null;
      this.dataService.isMainCovidActiveInfectionSelected = false;
    }
  }

  checkIsLocationSupported() {
    if (this.selectedAppointment && this.selectedAppointment.data) {
      this.checkAppointmentExist();
    } else {
      this.dataService.setblnShowLocError(false);
      if (this.dataService.isMainCovidActiveInfectionSelected) {
        this.router.navigate(['/schedule-appointment/as-active-infection-symptoms']);
      } else {
        this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
      }
    }
  }

  setTestsBeforeNavigation() {
    this.checkIsLocationSupported();
    this.dataService.setTestsData(this.selectedTests);
    if (this.selectedTests[0] && this.selectedTests[0].facilityServiceId === 26) {
      this.dataService.searchCovidAppointmentsBy = 29;
    } else {
      this.dataService.searchCovidAppointmentsBy = null;
    }
  }

  getTestsForReason(id: string): void {
    this.isTests = true;
    this.isReasons = false;
    this.multiSelect = this.isMultiSelectEnabledForTest(id);
    this.selectedReason$.next(id);
    // this.dataService.setReasonData(id);  // expecting ReasonCategory object but sending string
  }

  isMultiSelectEnabledForTest(id: string): boolean {
    return ((id === 'GLUCOSE') || (id === 'PURCHASETEST')) ? false : true;
  }

  onTestSelected(selectedTest: ReasonCategory): void {
    /* if(this.resetTest){
      this.selectedTests = [];
      this.dataService.setTestsData(this.selectedTests);
      this.resetTest = false;
    } */
    (this.selectedTests.findIndex(x => x.facilityServiceId === selectedTest.facilityServiceId) === -1) ?
      this.selectedTests.push(selectedTest) :
      this.selectedTests.splice(this.selectedTests.findIndex(x => x.facilityServiceId === selectedTest.facilityServiceId), 1);
    this.enableContinue = this.selectedTests.length > 0 ? true : false;

  }

  getReasons(): void {
    this.isReasons = true;
    this.isTests = this.multiSelect = false;
    this.selectedReason$.next('MAIN');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AsBfaRedirectDialogComponent, {
      height: '251px',
      width: '328px',
      data: {},
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(() => {
      // on close do something here
    });
  }

  openActiveInfectionDialog(item: ReasonCategory): void {
    const dialogRef = this.dialog.open(AsActiveInfectionDialogComponent, {
      panelClass: 'as-active-infection',
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.dataService.isMainCovidActiveInfectionSelected = true;
      if (res === false) {
        this.covid19Success(item);
        if (this.selectedAppointment && this.selectedAppointment.data) {
          this.checkAppointmentExist();
        } else {
          this.router.navigate(['/schedule-appointment/as-active-infection-symptoms']);
        }
      }
    });
  }

  openCovidDialog(item: ReasonCategory): void {
    const dialogRef = this.dialog.open(AsCovid19DialogComponent, {
      // panelClass: 'as-active-infection',
      disableClose: false,
      autoFocus: false,
      maxHeight: '90vh',
      // minWidth:'696px',
      panelClass: ['ds-modal', 'ds-grid--12', 'ds-elevation--L3']
    });
    this.skipInsuranceService.getCovidReasonSelected().pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.covid19Success(item);
      }
    });
  }

  setValues() {
    this.dataService.getReasonValue().subscribe(value => {
      if (value) {
        this.selectedTests = [];
        this.enableContinue = this.selectedTests.length > 0 ? true : false;
        this.dataService.setReasonValue(false);
        this.selectedMainReason = null;
      }
    });
  }

  checkAppointmentExist() {
    const params: PscAvailabilityQuery = {
      siteCode: this.selectedAppointment.data.siteCode,
      date: this.selectedAppointment.data.appointmentDate,
      serviceType: null,
      facilityServiceId: this.getFacilityServiceIds(),
      fromDate: this.selectedAppointment.data.appointmentDate,
      toDate: this.selectedAppointment.data.appointmentDate
    };
    this.getFacilitySeviceTypeValue();
    this.loading = true;
    let showLnNotSupportedError: boolean; // check reason changed supports location
    this.psc.getPscDetails(this.selectedAppointment.data.siteCode).subscribe(details => {
      const servicesNotSupported = details.servicesNotOffered;
      for (let i = 0; i < this.facilityTypeValue.length; i++) {
        if (servicesNotSupported.includes(this.facilityTypeValue[i])) {
          showLnNotSupportedError = true;
          break;
        } else {
          showLnNotSupportedError = false;
        }
      }
      if (!showLnNotSupportedError) {
        this.psc.appointmentIsAvailable(params, this.selectedAppointment.data.appointmentTime).subscribe((data) => {
          this.loading = false;
          this.dataService.setReasonNotSupportedError(false);
          if (data) {
            this.dataService.setblnShowLocError(false);
            this.dataService.setblnEditReasonData(false);
            if (this.dataService.isMainCovidActiveInfectionSelected) {
              this.router.navigate(['/schedule-appointment/as-active-infection-symptoms']);
            } else {
              this.router.navigate([this.destination ? this.destination : '/schedule-appointment/as-appt-scheduler']);
            }
          } else {
            this.dataService.setblnShowLocError(true);
            if (this.dataService.isMainCovidActiveInfectionSelected) {
              this.router.navigate(['/schedule-appointment/as-active-infection-symptoms']);
            } else {
              this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
            }
          }
        }, (error) => {
          // ERROR HANDLING HERE
          this.loading = false;
        });
      } else {
        this.dataService.setReasonNotSupportedError(true);
        if (this.dataService.isMainCovidActiveInfectionSelected) {
          this.router.navigate(['/schedule-appointment/as-active-infection-symptoms']);
        } else {
          this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
        }
      }
    });
  }

  getFacilitySeviceTypeValue() {
    if (!this.selectedTests) {
      this.facilityTypeValue.push(this.selectedMainReason.facilityTestTypeValue);
    } else if (this.selectedTests && this.selectedTests.length === 1) {
      this.facilityTypeValue.push(this.selectedTests[0].facilityTestTypeValue);
    } else if (this.selectedTests && this.selectedTests.length > 1) {
      this.selectedTests.forEach(selectedTest => this.facilityTypeValue.push(selectedTest.facilityTestTypeValue));
    }
    return this.facilityTypeValue;
  }

  getFacilityServiceIds(): number[] {
    const facilityIds = [];
    if (this.selectedTests) {
      this.selectedTests.forEach(selectedTest => facilityIds.push(selectedTest.facilityServiceId));
    }
    return facilityIds;
  }

  edit() {
    this.dataService.getEditReason().pipe(takeUntil(this.destroy$)).subscribe((itemSelected: ReasonCategory) => {
      this.selectedMainReason = itemSelected;
      if (this.selectedMainReason) {
        this.enableContinue = true;
        // this.selectedTests = [itemSelected];
      }
    });
    this.dataService.getappointmentData().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.selectedAppointment = data;
    });

    this.dataService.getblnEditReasonData().pipe(takeUntil(this.destroy$)).subscribe((blnEdit: ReasonEditState) => {
      this.isEdit = blnEdit.blnedit;
      this.destination = blnEdit.route === this.router.url ? '/schedule-appointment/as-review-details' : blnEdit.route;
    });

    this.appointment.getReasons('MAIN').subscribe((reasons) => {
      this.mainReasons = reasons;
    });

    this.route.paramMap.subscribe(params => {
      if (params && params.get('reason')) {
        this.items$.subscribe((items) => {
          this.testItems = items;
          if (items.length !== 6 && this.selectedTests.length === 1 && this.selectedMainReason) {
            const value = this.testItems.filter((ele) => ele.facilityServiceId === this.selectedTests[0].facilityServiceId);
            if (value.length === 0) {
              this.selectedTests.pop();
            }
          }
        });
      }
    });
  }

  resetTests(item: ReasonCategory) {
    const value = this.mainReasons.find(x => x.facilityServiceId === item.facilityServiceId);
    if (value && value.serviceRequestor) {
      this.resetTest = true;
    }
  }
  openPurchaseOwnDialog(item): void {
    let dialogRef;
    if (this.feature_flag_f1269_rit_aid_locations && (item.facilityServiceId === 25 || item.facilityServiceId === 26)) {
      dialogRef = this.dialog.open(AsAntibodyF1269DialogComponent, {
        // panelClass: 'as-peace-of-mind',
        autoFocus: false,
        data: item
      });
    } else {
      dialogRef = this.dialog.open(AsPurchaseMyOwnTestDialogComponent, {
        panelClass: ['ds-modal', '--scroll-box', 'ds-grid--12', 'ds-elevation--L3'],
        autoFocus: false,
        data: item
      });
    }
    dialogRef.afterClosed().subscribe((value) => {
      // on close do something here
      if (value) {
        if (this.feature_flag_f1269_rit_aid_locations) {
          if (value === 'AntiBodyNo') {
            this.feature_f1421_cit_updates ? window.open(this.covidAntibodyNewCitLink, '_self') :
              window.open(this.viewOfferingsLink, '_self');
          } else if (value === 'AntiBodyYes') {
            this.checkIsLocationSupported();
          }
          else if (value === 'CovidNo') {
            this.dialog.open(AsCovid19DetailsDialogComponent, { data: { purchaseMyOwnTestCovid: true } }).afterClosed().subscribe((val) => {
              this.selectedTests = [];
              this.dataService.setTestsData(this.selectedTests);
            });
          } else if (value === 'CovidYes') {
            this.dialog.open(AsCovid19ElectronicCommonDialogComponent, {
              data: { purchaseMyOwnTestCovid: true }
            }).afterClosed().subscribe((val) => {
              if (val) {
                this.checkIsLocationSupported();
              } else {
                this.selectedTests = [];
                this.dataService.setTestsData(this.selectedTests);
                this.dataService.selectedTestForPurchasedMyOwnTest = [];
              }
            });
          } else {
            this.checkIsLocationSupported();
          }
        } else {
          this.checkIsLocationSupported();
        }
      }
      else {
        this.selectedTests = [];
        this.dataService.setTestsData(this.selectedTests);
        this.dataService.selectedTestForPurchasedMyOwnTest = [];
      }
    });
  }

  getPreviousRoute(): string {
    if (this.isReasons) {
      if (this.eOrderStateNavigationService.blnSkippedOpenEorder) {
        return '/schedule-appointment/as-open-eorders';
      } else {
        return '/as-home';
      }
    } else {
      return 'schedule-appointment/as-reason-for-visit';
    }
  }

  antiBodySuccess(item: ReasonCategory) {
    this.selectedTests = [];
    this.selectedTests = [item];
    this.dataService.setTestsData(this.selectedTests);
    this.dataService.setReasonData(null);
    this.selectedMainReason = null;
    this.dataService.setEditReason(this.selectedMainReason);
    this.isTests ? this.dataService.setTestsData([item]) : this.dataService.setReasonData(item);
    this.checkIsLocationSupported();
  }

  covid19Success(item: ReasonCategory) {
    this.selectedTests = [];
    this.selectedTests = [item];
    this.dataService.setTestsData(this.selectedTests);
    this.dataService.setReasonData(null);
    this.selectedMainReason = null;
    this.dataService.setEditReason(this.selectedMainReason);
    this.isTests ? this.dataService.setTestsData([item]) : this.dataService.setReasonData(item);
    this.checkIsLocationSupported();
  }

  activeInfectionSuccess() {
    this.dataService.isMainCovidActiveInfectionSelected = true;
    if (this.selectedAppointment && this.selectedAppointment.data) {
      this.checkAppointmentExist();
    } else {
      this.router.navigate(['/schedule-appointment/as-active-infection-symptoms']);
    }
  }

  getFeatureFlags() {
    this.vm$ = combineLatest([this.propertiesService.getASOpenEordersF221(),
    this.propertiesService.getRitAidLocationsf1269(), this.propertiesService.getCITUpdatedLinksFeatureFlag1421()])
      .pipe(tap(([flag221, flag1269, flag1421]) => {
        this.feature_flag_f1269_rit_aid_locations = flag1269;
        this.feature_f1421_cit_updates = flag1421;
      }));
  }

}
