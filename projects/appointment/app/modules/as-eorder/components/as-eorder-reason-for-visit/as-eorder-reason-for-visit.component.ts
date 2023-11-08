import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
// tslint:disable-next-line: max-line-length
import { AsBfaRedirectionDialogComponent } from 'shared/components/as-bfa-redirection-dialog/as-bfa-redirection-dialog.component';
// tslint:disable-next-line: max-line-length
import { AsCovidActiveInfectionDialogComponent } from 'shared/components/as-covid-active-infection-dialog/as-covid-active-infection-dialog.component';
import { AsCovidAntibodyDialogComponent } from 'shared/components/as-covid-antibody-dialog/as-covid-antibody-dialog.component';
import { ReasonCategory } from 'shared/models/reason-category';
import { AppointmentService } from 'shared/services/appointment.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { PropertiesService } from 'shared/services/properties.service';
import { default as homeContent } from '../../../../../assets/content.json';
import { PscService } from './../../../../../../shared/src/lib/services/psc.service';

@Component({
  selector: 'as-eorder-reason-for-visit',
  templateUrl: './as-eorder-reason-for-visit.component.html',
  styleUrls: ['./as-eorder-reason-for-visit.component.scss']
})
export class AsEorderReasonForVisitComponent implements OnInit, OnDestroy {

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
  covidTestingOptionsUrl: string;
  previousUrl: string;
  facilityServiceId: number[] = [];
  facilityTypeValue: any[] = [];

  constructor(private appointment: AppointmentService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private location: Location,
    private psc: PscService,
    private eorderDataService: EorderDataService,
    private eorderService: EorderService,
    private propertiesService: PropertiesService) {
    this.renderer.addClass(document.body, 'as-reason');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.renderer.removeClass(document.body, 'as-reason');
  }

  ngOnInit() {
    this.setValues();
    this.previousUrl = '/eorder/as-eorder-personal-information';
    this.route.paramMap.subscribe(params => {
      this.enableContinue = false;
      this.init(params);
      (params.get('reason')) ? this.getTestsForReason(params.get('reason')) : this.getReasons();
    });
    this.items$ = this.selectedReason$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap(id => {
        return this.appointment.getReasons(id).pipe(
          // hide purchased my own test for eorder
          map(reasons => reasons.filter((reason) => reason.facilityServiceId !== 6)));
      }),
      tap(() => this.loading$.next(false))
    );
    this.edit();
    setTimeout(() => {
      if (document.getElementById('back-button-reason-for-visit')) {
        document.getElementById('back-button-reason-for-visit').focus();
      }
    }, 100);
    this.getCovidTestLearnMoreUrl();
  }

  init(params) {
    this.clearSelectedTestsIfReasonChanged(params);
    this.eorderDataService.getTestsData().pipe(takeUntil(this.destroy$)).subscribe((testsData: ReasonCategory[]) => {
      this.selectedTests = testsData;
      this.enableContinue = this.selectedTests && this.selectedTests.length > 0;
    });
  }

  goToPrevious() {
    // this.router.navigate(['/eorder/as-eorder-personal-information']);
    this.location.back();
  }

  continueClicked() {
    this.saveAndRedirect();
  }

  saveAndRedirect() {
    this.eorderDataService.setTestsData(this.selectedTests);
    this.eorderDataService.setFacilityServiceType(this.getFacilitySeviceTypeValue());
    this.eorderDataService.setAppointmentNavigation(false);
    if (this.selectedTests && this.selectedTests.length > 0) {
      this.selectedTests.forEach(test => this.facilityServiceId.push(test.facilityServiceId));
    }
    const params = {
      reason:{
        visitCategory: this.selectedMainReason && this.selectedMainReason.serviceRequestor ?
        this.selectedMainReason.serviceRequestor: 'Medical',
        visitReason: this.facilityServiceId
     }
    };
    this.eorderDataService.setAltFacilityServiceID(this.facilityServiceId);
    this.eorderService.saveEncounter(params).subscribe(res =>{
      this.router.navigate(['/eorder/as-eorder-appt-scheduler']);
    });
  }

  clearSelectedTestsIfReasonChanged(params) {
    this.eorderDataService.getReasonData().pipe(takeUntil(this.destroy$)).subscribe((reasonData: ReasonCategory) => {
      if (params.get('reason') && reasonData && reasonData.serviceRequestor !== params.get('reason')) {
        this.selectedTests = [];
        this.eorderDataService.setTestsData(this.selectedTests);
      }
    });
  }

  onItemSelected(item: ReasonCategory): void {
    this.multiSelect ? this.onTestSelected(item) :
      item.facilityServiceId === 3 ? this.openDialog() : this.navigateToNext(item);
      if(item.facilityServiceId === 26){
        this.openActiveInfectionDialog();
      } else if (item.facilityServiceId === 25) {
        this.antibodyTestDialog(item);
      }
  }

  navigateToNext(item: ReasonCategory): void {
    this.isTests ? this.eorderDataService.setTestsData([item]) : this.eorderDataService.setReasonData(item);
    if (!this.isTests) {
      this.selectedMainReason = item;
      this.eorderDataService.setEditReason(this.selectedMainReason);
    }
    item.serviceRequestor ? this.navigateToTests(item) : this.navigateToLocations(item);
  }

  navigateToTests(item: ReasonCategory): void {
    this.router.navigate(['/eorder/as-eorder-reason-for-visit', { reason: item.serviceRequestor }]);
  }

  navigateToLocations(item: ReasonCategory) {
    if (this.isTests || !item.serviceRequestor) {
      this.eorderDataService.setTestsData([item]);
    } else {
      this.eorderDataService.setReasonData(item);
    }
    if (!this.isEdit && item.facilityServiceId !== 26 && item.facilityServiceId !== 25) {
      this.saveAndRedirect();
    }
  }

  getTestsForReason(id: string): void {
    this.isTests = true;
    this.isReasons = false;
    this.multiSelect = this.isMultiSelectEnabledForTest(id);
    this.selectedReason$.next(id);
  }

  isMultiSelectEnabledForTest(id: string): boolean {
    return (id === 'GLUCOSE') ? false : true;
  }

  onTestSelected(selectedTest: ReasonCategory): void {
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
    const dialogRef = this.dialog.open(AsBfaRedirectionDialogComponent, {
      height: '251px',
      width: '328px',
      data: {},
      autoFocus: true
    });
  }

  openActiveInfectionDialog(): void {
    const dialogRef = this.dialog.open(AsCovidActiveInfectionDialogComponent, {
      panelClass: 'as-active-infection',
      autoFocus: false,
      maxHeight:'90vh'
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'continue') {
        this.saveAndRedirect();
        window.scroll(0,0);
      }
    });
  }

  antibodyTestDialog(item: ReasonCategory): void {
    const dialogRef = this.dialog.open(AsCovidAntibodyDialogComponent, {
      panelClass: 'as-peace-of-mind',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'Yes') {
        this.selectedTests = [];
        this.selectedTests = [item];
        this.eorderDataService.setTestsData(this.selectedTests);
        // this.eorderDataService.setReasonData(null);
        // this.selectedMainReason = null;
        // this.eorderDataService.setEditReason(this.selectedMainReason);
        this.isTests ? this.eorderDataService.setTestsData([item]) : this.eorderDataService.setReasonData(item);
        this.saveAndRedirect();
      } else if(res === 'No'){
        window.open(this.covidTestingOptionsUrl,'_self');
      }
    });
  }

  getCovidTestLearnMoreUrl(){
    this.propertiesService.getCovidTestingOptionsLink().subscribe((url: string) =>{
      this.covidTestingOptionsUrl = url;
    });
  }

  setValues() {
    this.eorderDataService.getReasonValue().subscribe(value =>{
      if(value){
       this.selectedTests = [];
       this.enableContinue = this.selectedTests.length > 0 ? true : false;
       this.eorderDataService.setReasonValue(false);
       this.eorderDataService.setReasonData(null);
       this.selectedMainReason = null;
       this.eorderDataService.setEditReason(null);
       this.eorderDataService.setTestsData(this.selectedTests);
      }
     });
  }

  edit() {
    this.eorderDataService.getEditReason().pipe(takeUntil(this.destroy$)).subscribe((itemSelected: ReasonCategory) => {
      this.selectedMainReason = itemSelected;
      if (this.selectedMainReason) {
        this.enableContinue = true;
      }
    });
     this.eorderDataService.getappointmentData().pipe(takeUntil(this.destroy$)).subscribe((data) => {
       this.selectedAppointment = data;
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
  getFacilitySeviceTypeValue() {
    if(!this.selectedTests){
      this.facilityTypeValue.push(this.selectedMainReason.facilityTestTypeValue);
    }else if(this.selectedTests && this.selectedTests.length === 1){
      this.facilityTypeValue.push(this.selectedTests[0].facilityTestTypeValue);
    }else if(this.selectedTests && this.selectedTests.length>1){
      this.selectedTests.forEach(selectedTest => this.facilityTypeValue.push(selectedTest.facilityTestTypeValue));
    }
    return this.facilityTypeValue;
  }
}
