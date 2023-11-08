import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { serviceRequestorEnum, ReasonCategory } from 'shared/models/reason-category';
import { DataService } from '../data.service';
import { DeeplinkService } from '../deeplink.service';
import { SkipInsuranceService } from '../skip-insurance.service';

@Injectable({
  providedIn: 'root'
})
export class DeeplinkReasonService {
  reasonsListArray = []; // np
  hasChildDeepLink: any[]; // np
  // reasonForVisit: ReasonCategory; // only problem - need to update componet about default value
  private defaultReason = new ReplaySubject<ReasonCategory>(1);
  defaultReasonSubject$ = this.defaultReason.asObservable();
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private deeplinkSerive: DeeplinkService,
    private skipInsuranceService: SkipInsuranceService,) { }

  newReasonDeeplink() {
    this.route.queryParamMap.pipe(take(2)).subscribe(params => {
      if (params.get('reason')) {
        this.dataService.setDeepLinkReasonFlag(true);
        const value = params.get('reason').toUpperCase();
        // if Reason has multiple test
        // http://localhost:4202/find-location?reasonForVisit=ORAL FLUID COLLECTIONS,ELECTRONIC CFF
        if (value.includes(',') && this.deeplinkSerive.isMultiselectDeeplink(value)) {
          this.deeplinkHasMultiTest(value);
        }
        // if reason has single test
        else {
          this.deeplinkReasonHasSingleTest(this.deeplinkSerive.getDeeplinkReason(value));
        }
      } else {
        this.dataService.setDeepLinkReasonFlag(false);
        this.resetDeepLinkValues();
      }
    });
  }

  deeplinkReasonHasSingleTest(value: string) {
    this.resetDeepLinkValues();
    this.hasChildDeepLink = [];
    // calling service types
    if (this.reasonsListArray.length > 0) {
      let mainFilter = null;
      const [Main, Glucose, Employer] = this.reasonsListArray;
      mainFilter = Main.filter(x => x.deeplinkReason.toUpperCase() === value.toUpperCase() && x.serviceRequestor === null);
      // check test with main service and test not in 'employer health and wellness'
      this.setValueDeepLinkHasSingleTest(mainFilter, Glucose, value, Main, Employer);
      // }​​​​​​);
    }
  }

  deeplinkHasMultiTest(value: string) {
    this.resetDeepLinkValues();
    // clear  service type
    this.hasChildDeepLink = [];
    const splitStringArr = value.split(',');
    // calling service types
    if (this.reasonsListArray.length > 0) {
      const [Main, Glucose, Employer] = this.reasonsListArray;
      this.prepareTestListFromStringArray(splitStringArr, Glucose, Employer);
      // checking all test under which service type
      const unique = this.hasChildDeepLink.filter((c, index, a) => a.indexOf(c) === index);
      if (unique.length === 1) {
        this.setValueDeepLinkHasMultiTest(Main, unique);
      } else {
        this.setDefaultTest(Main);
      }
    }
  }
  resetDeepLinkValues() {
    this.dataService.deepLinkReasonParam = '';
    this.dataService.deepLinkTestList = [];
    this.dataService.defaultDeepLinkTest = new ReasonCategory();
  }

  prepareTestListFromStringArray(
    splitStrArr: string[],
    Glucose: ReasonCategory[],
    Employer: ReasonCategory[]
  ) {
    for (let i = 0; i < splitStrArr.length; i++) {
      // check value with glucose
      const glucoseFilterValue = Glucose.filter(y => y.deeplinkReason.toUpperCase() === splitStrArr[i]);
      if (glucoseFilterValue.length > 0) {
        // storing service type
        this.hasChildDeepLink.push(serviceRequestorEnum.glucose);
        // storing tests in service
        this.dataService.deepLinkTestList.push(glucoseFilterValue[0]);
      } else {
        // check value with Employer
        const employerFilterValue = Employer.filter(z => z.deeplinkReason.toUpperCase() === splitStrArr[i]);
        if (employerFilterValue.length > 0) {
          this.hasChildDeepLink.push(serviceRequestorEnum.employer);
          this.dataService.deepLinkTestList.push(employerFilterValue[0]);
        }
      }
    }
  }

  setDefaultTest(Main: ReasonCategory[]) {
    this.resetDeepLinkValues();
    this.hasChildDeepLink = [];
    // For all othere test
    const defaultResult = Main.filter(x => x.facilityServiceId === 1);
    if (defaultResult.length > 0) {
      // this.dataService.setTestsData(defaultResult);
      this.dataService.setfindLocationReason(defaultResult[0]);
      this.dataService.setReasonData(defaultResult[0]);
      // for facilityServiceId
      // this.reasonForVisit = defaultResult[0];
      this.defaultReason.next(defaultResult[0]);
      this.dataService.defaultDeepLinkTest = defaultResult[0];
      this.skipInsuranceService.setSkipInsurance(defaultResult[0].skipInsurance);
      this.deeplinkSerive.setFlagFordisableReason(true);
    }
  }
  setValueDeepLinkHasMultiTest(Main: ReasonCategory[], unique: any[]) {
    const index = Main.findIndex(x => x.serviceRequestor === unique[0].toUpperCase());
    if (index) {
      this.dataService.setReasonData(Main[index]);
      if (this.dataService.deepLinkTestList.length > 0) {
        this.dataService.setTestsData(this.dataService.deepLinkTestList);
        this.skipInsuranceService.setSkipInsurance(Main[index].skipInsurance);
        unique[0].toUpperCase() === serviceRequestorEnum.employer
          ? this.dataService.setReasonType(true)
          : this.dataService.setReasonType(false);
        this.deeplinkSerive.setFlagFordisableReason(true);
      }
    }
  }
  setValueDeepLinkHasSingleTest(
    mainFilter: ReasonCategory[],
    Glucose: ReasonCategory[],
    value: string,
    Main: ReasonCategory[],
    Employer: ReasonCategory[]
  ) {
    if (mainFilter && mainFilter.length > 0 && mainFilter[0].facilityServiceId !== 3) {
      this.dataService.setfindLocationReason(mainFilter[0]);
      this.dataService.setReasonData(mainFilter[0]);
      this.dataService.defaultDeepLinkTest = mainFilter[0];

      this.skipInsuranceService.setSkipInsurance(mainFilter[0].skipInsurance);
      this.deeplinkSerive.setFlagFordisableReason(true);
    } else {
      // check test with GLUCOSE service
      const glucoseFilter = Glucose.filter(x => x.deeplinkReason.toUpperCase() === value.toUpperCase());
      if (glucoseFilter.length > 0) {
        // set reason and test data
        this.setParentChildValues(serviceRequestorEnum.glucose, Main, glucoseFilter);
      }
      // check test with EMPLOYER service
      else {
        const employerFilter = Employer.filter(x => x.deeplinkReason.toUpperCase() === value.toUpperCase());
        if (employerFilter.length > 0) {
          // set reason and test data
          this.setParentChildValues(serviceRequestorEnum.employer, Main, employerFilter);
        }
      }
    }
  }

  setParentChildValues(serviceType: string, mainResult: ReasonCategory[], childFilter: ReasonCategory[]) {
    this.dataService.defaultDeepLinkTest = new ReasonCategory();
    const filterData = mainResult.filter(x => x.serviceRequestor === serviceType);
    if (filterData && filterData.length > 0) {
      const index = mainResult.findIndex(x => x.serviceRequestor === serviceType);
      this.resetDeepLinkValues();
      this.dataService.deepLinkReasonParam = serviceType;
      this.dataService.setReasonData(mainResult[index]);
      this.dataService.deepLinkTestList.push(childFilter[0]);
      this.dataService.setTestsData(this.dataService.deepLinkTestList);
      this.dataService.deepLinkReasonParam === serviceRequestorEnum.employer
        ? this.dataService.setReasonType(true)
        : this.dataService.setReasonType(false);
      this.skipInsuranceService.setSkipInsurance(mainResult[index].skipInsurance);
      this.deeplinkSerive.setFlagFordisableReason(true);
    }
  }

  getDefaultReason(): Observable<ReasonCategory> {
    return this.defaultReasonSubject$;
  }
}
