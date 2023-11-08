import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, BehaviorSubject, Observable, Subject } from 'rxjs';
import { delay, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { ReasonCategory } from 'shared/models/reason-category';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { DeeplinkService } from 'shared/services/deeplink.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { default as homeContent } from '../../../../../assets/content.json';
// tslint:disable-next-line: max-line-length
import { AsLocationFinderBfaRedirectDialogComponent } from '../as-location-finder-bfa-redirect-dialog/as-location-finder-bfa-redirect-dialog.component';
// tslint:disable-next-line: max-line-length
import { AsLocationPeaceOfMindTestDialogComponent } from '../as-location-peace-of-mind-test-dialog/as-location-peace-of-mind-test-dialog.component';
// tslint:disable-next-line: max-line-length
import { AsLocationPurchaseMyOwnTestDialogComponent } from '../as-location-purchase-my-own-test-dialog/as-location-purchase-my-own-test-dialog.component';
import { PscLocationAvailability } from './../../../../../../shared/src/lib/models/psc';


@Component({
  selector: 'as-location-finder-reason',
  templateUrl: './as-location-finder-reason.component.html',
  styleUrls: ['./as-location-finder-reason.component.scss']
})
export class AsLocationFinderReasonComponent implements OnInit, OnDestroy {

  items$: Observable<ReasonCategory[]>;
  content = homeContent;
  visitReasons: ReasonCategory[] = [];
  isTests: boolean;
  isReasons: boolean;
  selectedTests: ReasonCategory[] = [];
  multiSelect: boolean;
  loading$ = new Subject<boolean>();
  selectedReason$ = new BehaviorSubject<string>('MAIN');
  selectedReason: ReasonCategory;
  enableContinue: boolean;
  destroy$ = new Subject<void>();
  isConfirmTesting: boolean;
  multiTests: ReasonCategory[] = [];
  isNavigationFromFinderDetails = false;
  today = new Date();
  loading = false;
  selectedLocation: PscLocationAvailability;
  invalidLocationIndex = -1;
  blnLocationSearch = false;
  invalidLocationChildIndex = -1;
  peaceOfMindDialog: boolean;
  covidTestingOptionsUrl: string;
  // need to store selected Reason and Selected test(incase its 'GLUCOSE')
  urlHasPurchaseTest = false;
  noApptScheduleFlag = false;

  constructor(private appointment: AppointmentService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private dataService: DataService,
    private renderer: Renderer2,
    private psc: PscService,
    private location: Location,
    private dateService: DateService,private propertiesService: PropertiesService
    ,private skipInsuranceService: SkipInsuranceService,
    private deeplinkService: DeeplinkService) {
    this.renderer.addClass(document.body, 'as-location-finder-reason');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.renderer.removeClass(document.body, 'as-location-finder-reason');
  }

  ngOnInit() {
    this.appointment.getReasons('EMPLOYER').subscribe(reasons => {
            this.multiTests = reasons;
    });
    this.setNoApptScheduleFlag();
    this.route.paramMap.subscribe(params => {
      this.isConfirmTesting = false;
      this.init(params);
      this.urlHasPurchaseTest = (params.get('reason')) ? (params.get('reason')==='PURCHASETEST') ? true : false : false;
      (params.get('reason')) ? this.getTestsForReason(params.get('reason')) : this.getReasons();
      if((this.selectedReason && this.isReasons) && (this.isTests && this.selectedTests && this.selectedTests.length > 0)){
        this.isConfirmTesting = true;
      }else{
        this.isConfirmTesting = false;
      }
      // enable confirm button in  DeepLinkFlow
      this.dataService.getDeepLinkReasonFlag().pipe(takeUntil(this.destroy$),delay(5)).subscribe(res => {
        if (res) {
          this.enableConfirmationButton(this.dataService.reasonCategory);
        }
      });
      // DeepLinkFlow
    });
    this.items$ = this.selectedReason$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap(id => {
        this.dataService.reasonCategory = id ;
       // this.purchasedByOwnTestFlow();
        return this.appointment.getReasons(id, this.dataService.selectedItemForApiCall);
      }),
      tap(() => this.loading$.next(false))
    );
    this.dataService.getfindLocationSelectedLocation().pipe(takeUntil(this.destroy$)).subscribe((appointment)=>{
        this.selectedLocation = appointment;
    });
  // this.preLoadData();
    this.getCovidTestLearnMoreUrl();
  }
  getCovidTestLearnMoreUrl(){
    this.propertiesService.getCovidTestingOptionsLink().subscribe((url: string) =>{
      this.covidTestingOptionsUrl = url;
    });
  }

  init(params) {
    this.clearSelectedTestsIfReasonChanged(params);

    this.dataService.getTestsData().pipe(takeUntil(this.destroy$)).subscribe((testsData: ReasonCategory[]) => {
      this.selectedTests = [...testsData];
      // this.blnLocationSearch = true;
      this.enableContinue = this.selectedTests && this.selectedTests.length > 0 ? true : false;
    });
    this.dataService.getLocationFinderDetailsFlowtoReason().pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => {
      this.isNavigationFromFinderDetails = val;
      this.blnLocationSearch = val;
    });

  }

  clearSelectedTestsIfReasonChanged(params) {
    this.dataService.getReasonData().pipe(takeUntil(this.destroy$)).subscribe((reasonData: ReasonCategory) => {
      this.selectedReason = reasonData;
      if(this.selectedReason && this.isReasons){
        this.isConfirmTesting = true;
      }
      if (params.get('reason') && reasonData.serviceRequestor !== params.get('reason')) {
        this.selectedTests = [];
        this.dataService.setTestsData([...this.selectedTests]);
      }
    });
  }


  blnGetpurchaseTest(id){
    const exclude = [25, 26, 1];
    return exclude.includes(id);
    }

  onItemSelected(item: ReasonCategory): void {
    this.skipInsuranceService.setSkipInsurance(item.skipInsurance ? item.skipInsurance : false);
    if (this.isReasons && item.serviceRequestor === null  && item.facilityServiceId !== 3 ) {
      this.isConfirmTesting = true;
      this.dataService.setfindLocationReason(item);
    }
    if(this.isTests && item.serviceRequestor === null) {
      this.isConfirmTesting = true;
      if (this.dataService.reasonCategory === 'GLUCOSE') {
        this.dataService.setfindLocationReason(item);
      }
      }
       else {
        this.isConfirmTesting = false;
      }
      if(item.serviceRequestor){
        this.invalidLocationIndex = -1;
      }
    this.multiSelect ? this.onTestSelected(item) :
      item.facilityServiceId === 3 ? this.openDialog() : this.navigateToNext(item);
    if (!this.multiSelect && this.selectedLocation && this.getFacilityServiceIds().length > 0) {
      this.checkAppointmentExist(item);
      this.blnLocationSearch = true;
      this.invalidLocationChildIndex = -1;
    }else if(this.multiSelect && this.selectedLocation && this.getFacilityServiceIds().length > 0){
      this.invalidLocationIndex = -1;
      this.checkAppointmentExist(item);
      this.blnLocationSearch = true;
    }
  }
   // Based on query param differentiate purchased my own test flow('PURCHASETEST')
  purchasedByOwnTestFlow() {
    if (this.dataService.reasonCategory === 'MAIN' && this.dataService.isSelectedLocationPurchasedMyOwnTest) {
       this.selectedTests = [];
    }
    else if (this.dataService.reasonCategory === 'PURCHASETEST' && this.dataService.isSelectedLocationPurchasedMyOwnTest) {
      this.selectedTests = [];
      this.selectedTests = this.dataService.selectedTestForLocationPurchasedMyOwnTest;
    }
  }
  setPurchasedByOwnTest(item){
    if (item.facilityServiceId === 6 && this.dataService.reasonCategory === 'MAIN') {
      this.dataService.isSelectedLocationPurchasedMyOwnTest = true;
      this.selectedTests = [];
    }
    else {
      this.dataService.isSelectedLocationPurchasedMyOwnTest = false;
      this.dataService.selectedTestForLocationPurchasedMyOwnTest = [];
    }
  }
  resetPurchasedByOwnTest(item){
    if (this.dataService.reasonCategory === 'MAIN') {
      this.dataService.isSelectedLocationPurchasedMyOwnTest = false;
      this.dataService.selectedTestForLocationPurchasedMyOwnTest = [];
    }
    else if (item && this.dataService.reasonCategory === 'PURCHASETEST') {
      this.dataService.isSelectedLocationPurchasedMyOwnTest = true;
      this.dataService.selectedTestForLocationPurchasedMyOwnTest = [item];
      this.dataService.setfindLocationReason(item);
    }
  }

  navigateToNext(item: ReasonCategory): void {
    this.isTests ? this.dataService.setTestsData([item]) : this.dataService.setReasonData(item);
    if (!this.isTests) {
      this.selectedReason = item;
    }
    // item.serviceRequestor ? this.navigateToTests(item) : this.navigateToLocations(item);
    if(item.serviceRequestor){
      this.dataService.selectedItemForApiCall = item;
      this.setPurchasedByOwnTest(item);
      this.navigateToTests(item);
    }
    else{
      this.resetPurchasedByOwnTest(item);
      this.navigateToLocations(item);
    }
  }

  navigateToTests(item: ReasonCategory): void {
    this.isConfirmTesting = false;
    this.dataService.setReasonType(true);
    this.router.navigate(['/find-location/as-location-finder-reason', { reason: item.serviceRequestor }]);
  }

  navigateToLocations(item: ReasonCategory) {
    this.dataService.setReasonType(false);
    this.isTests ? this.dataService.setTestsData([item]) : this.dataService.setReasonData(item);
    // this.router.navigate(['/schedule-appointment/as-appt-scheduler']);
  }

  setTestsBeforeNavigation() {
    this.dataService.setTestsData([...this.selectedTests]);
  }

  getTestsForReason(id: string): void {
    this.isTests = true;
    this.isReasons = false;
    this.multiSelect = this.isMultiSelectEnabledForTest(id);
    this.selectedReason$.next(id);
  }

  isMultiSelectEnabledForTest(id: string): boolean {
    return ((id === 'GLUCOSE') || (id === 'PURCHASETEST'))? false : true;
  }

  onTestSelected(selectedTest: ReasonCategory): void {
    if (this.invalidLocationChildIndex >= 0) {
      this.selectedTests.pop();
    }
    (this.selectedTests.findIndex(x => x.facilityServiceId === selectedTest.facilityServiceId) === -1) ?
      this.selectedTests.push(selectedTest) :
      this.selectedTests.splice(this.selectedTests.findIndex(x => x.facilityServiceId === selectedTest.facilityServiceId), 1);
    this.enableContinue = this.selectedTests.length > 0 ? true : false;
    if (this.selectedTests.length === 1) {
      this.dataService.setfindLocationReason(this.selectedTests[0]);
    }
  }

  getReasons(): void {
    this.isReasons = true;
    this.isTests = this.multiSelect = false;
    this.selectedReason$.next('MAIN');
    this.checkAndRemoveSingleTests();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AsLocationFinderBfaRedirectDialogComponent, {
      data: {}, // {name: this.name, animal: this.animal},
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(() => {
      // on close do something here
    });
  }

  onConfirmTestingClicked(item: ReasonCategory): void {
    combineLatest(this.deeplinkService.getFlagFindLocationDisableBackArrow(),
    this.deeplinkService.getFlagFindLocationDetailDisableBackArrow()).pipe(take(1)).subscribe(([result, result1]: [boolean, boolean]) => {
      this.deeplinkService.setFlagFindLocationDisableBackArrow(result || result1);
      this.deeplinkService.setFlgFindLocationDetailDisableBackArrow(result1);
    });
    this.deeplinkService.setFlagFordisableReason(false);
    this.isTests ? this.dataService.setTestsData([...this.selectedTests]) : this.dataService.setReasonData(this.selectedReason);
    if(this.dataService.reasonCategory === 'PURCHASETEST'  && this.dataService.isSelectedLocationPurchasedMyOwnTest){
      this.openLocationPurchaseDialog(this.dataService.selectedTestForLocationPurchasedMyOwnTest[0]);
    }
    this.dataService.facilityServiceIds = [...this.getFacilityServiceIds()];
    // else if(this.selectedReason.facilityTestTypeValue !== 'COVID-19 Active Infection'){
    //   this.openPeaceOfMindDialog();
    // }
    // else if(this.selectedReason.facilityTestTypeValue === 'COVID-19 Antibody Test' && this.dataService.queryParam === 'MAIN'){
    //   this.openAntibodyTestDialog();
    // }
    if (this.isReasons) {
      this.dataService.setTestsData([]);
    }
    // navigate from here
    if(this.blnLocationSearch || (this.selectedLocation && this.selectedLocation.siteCode)){
      const data = {
        // siteCode: this.selectedLocation.siteCode,
        ...this.selectedLocation,
        facilityServiceId: this.getFacilityServiceIds(),
        // zip: this.selectedLocation.zip
      };
      this.dataService.setlocationFlowtoSchedule(true);
      this.dataService.setFindLocationFlow(true);
      this.dataService.setReasonDataFindLocation(data);
      // Purchased my own test
      if(this.dataService.reasonCategory !=='PURCHASETEST'){
        this.dataService.setPreviousPage('/find-location/as-location-finder-reason');
        this.router.navigate(['schedule-appointment/as-find-lcn-appt-scheduler']);
      }
    }else{
      // If pucahse my own test is true
      if(this.dataService.reasonCategory === 'PURCHASETEST' &&
      this.dataService.isSelectedLocationPurchasedMyOwnTest
      && this.dataService.selectedTestForLocationPurchasedMyOwnTest){
        // do changes for purchase my own test
      }
      else{
          this.router.navigate(['/find-location/as-location-finder']);
      }
    }

  }

  goToPrevious() {
    // this.location.back();
    this.noApptScheduleFlag ? this.router.navigate(['/as-home']) :
      this.router.navigate(['/find-location/as-location-finder']);
  }

  checkAndRemoveSingleTests() {
        for (let i = 0; i <= this.selectedTests.length; i++) {
          if (this.multiTests.indexOf(this.selectedTests[i]) === -1) {
            this.selectedTests.splice(i, 1);
          }
        }
      }

  getFacilityServiceIds(): number[] {
    const facilityIds = [];
    if (this.selectedTests && this.selectedTests.length>0) {
      this.selectedTests.forEach(selectedTest => facilityIds.push(selectedTest.facilityServiceId));
    }else{
      if(!this.selectedReason.serviceRequestor){
        facilityIds.push(this.selectedReason.facilityServiceId);
      }
    }
    return facilityIds;
  }

  getFacilityServiceNames(): string[]{
    const facilityNames = [];
    if (this.selectedTests && this.selectedTests.length>0) {
      this.selectedTests.forEach(selectedTest => facilityNames.push(selectedTest.facilityTestTypeValue));
    }else{
      if(!this.selectedReason.serviceRequestor){
        facilityNames.push(this.selectedReason.facilityTestTypeValue);
      }
    }
    return facilityNames;
  }

  checkAppointmentExist(item: ReasonCategory) {
    this.loading = true;
    this.dataService.getSelectedLocationService().subscribe((data) => {
      if (this.getFacilityServiceNames().length > 0) {
        if(!this.multiSelect){
          if (this.checkAvailable(data, this.getFacilityServiceNames())) {
            this.invalidLocationIndex = -1;
          } else {
            this.invalidLocationIndex = item.index;
          }
        }else{
          if (this.checkAvailable(data, this.getFacilityServiceNames())) {
            this.invalidLocationChildIndex = -1;
          } else {
            this.invalidLocationChildIndex = item.index;
          }
        }
      }
      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }


  checkAvailable(source, target){
    return target.every(v => source.includes(v));
  }

  openPeaceOfMindDialog(): void {
    const dialogRef = this.dialog.open(AsLocationPeaceOfMindTestDialogComponent, {
      // height: '251px',
      // width: '328px',
      data: {}, // {name: this.name, animal: this.animal},
      panelClass: 'as-peace-of-mind',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((value) => {
      // on close do something here
      this.peaceOfMindDialog = value;
      this.dataService.setPeaceOfMindState(value);
    });
  }

  openLocationPurchaseDialog(item): void {
    const dialogRef = this.dialog.open(AsLocationPurchaseMyOwnTestDialogComponent, {
      data: item,
      panelClass: ['ds-modal', '--scroll-box', 'ds-grid--12', 'ds-elevation--L3'],
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((value) => {
      // on close do something here
       if(value){
        if(this.blnLocationSearch || (this.selectedLocation && this.selectedLocation.siteCode
          && this.dataService.reasonCategory === 'PURCHASETEST'))
        {
          this.dataService.setPreviousPage('/find-location/as-location-finder-reason');
          this.router.navigate(['schedule-appointment/as-find-lcn-appt-scheduler']);
        }
        else{
          this.router.navigate(['/find-location/as-location-finder']);
        }
      }
      else{
        this.selectedTests = [];
        this.dataService.setTestsData(this.selectedTests);
        this.isConfirmTesting = false;
      }

     });
  }
  // openAntibodyTestDialog(): void {
  //   const dialogRef = this.dialog.open(AsLocationAntibodyDialogComponent, {
  //     panelClass: 'as-peace-of-mind',
  //     autoFocus: false
  //   });
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res === 'Yes') {
  //       this.router.navigate(['/find-location/as-location-finder']);
  //       // this.openPeaceOfMindDialog();
  //     } else if(res === 'No'){
  //       window.open(this.covidTestingOptionsUrl,'_self');
  //     }
  //   });
  // }
  ///////////////////////// deepLinkFlow////////////////////

  // Add service for glucose and purchase my test in future
  checkReasonForVisitParam(item) {
    switch (item) {
      case 'EMPLOYER':
      case 'GLUCOSE':
      case 'PURCHASETEST':
        return true;
      default:
        return false;
    }
  }
  enableConfirmationButton(param) {
    if (this.checkReasonForVisitParam(param) && this.dataService.deepLinkTestList.length > 0) {
      if (this.dataService.isDeepLinkReasonServicesNotOffered) {
        this.selectedTests =[];
        this.onItemSelected(this.dataService.deepLinkTestList[0]);
      }
      else {
        this.isConfirmTesting = true;
      }
    }
    else {
      if (this.dataService.reasonCategory === 'MAIN' && this.dataService.deepLinkTestList.length === 0) {
        if(Object.keys(this.dataService.defaultDeepLinkTest).length > 0 ) {
           this.onItemSelected(this.dataService.defaultDeepLinkTest);
        }
      }
    }
  }
  private setNoApptScheduleFlag() {
    this.route.queryParams.pipe(take(1))
      .subscribe(params => {
        this.noApptScheduleFlag = params.noApptSchedule ? params.noApptSchedule : false;
      });
  }
   ///////////////////////// deepLinkFlow////////////////////
}
