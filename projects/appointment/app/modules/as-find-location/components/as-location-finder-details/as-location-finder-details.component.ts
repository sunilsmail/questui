import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { PscDetails, PscLocationAvailability } from 'shared/models';
import { serviceRequestorEnum, ReasonCategory } from 'shared/models/reason-category';
import { AppointmentService } from 'shared/services/appointment.service';
import { DataService } from 'shared/services/data.service';
import { DateService } from 'shared/services/date.service';
import { DeeplinkService } from 'shared/services/deeplink.service';
import { FindlocationDataService } from 'shared/services/findLocation/findlocation-data.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { default as homeContent } from '../../../../../assets/content.json';
import { UserService } from './../../../../../../shared/src/lib/services/user.service';


@Component({
  selector: 'as-location-finder-details',
  templateUrl: './as-location-finder-details.component.html',
  styleUrls: ['./as-location-finder-details.component.scss']
})
export class AsLocationFinderDetailsComponent implements OnInit, OnDestroy {
  content = homeContent;
  loading = false;
  DetailsActive: boolean;
  ServicesActive: boolean;
  userLocation: any;
  destroy$ = new Subject<void>();
  selectedReason: ReasonCategory;
  pscLocation: PscLocationAvailability;
  pscAddress = 'Quest Diagnostics - West Chester 7608 Cox Lane West Chester OH 45069';
  locationDetails: PscDetails;
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  timeMap = {};
  timeLbl = {};
  PSC_Hours = [];
  GLUCOSE_Hours = [];
  DRUG_Hours = [];
  uiTimes: Array<number> = [];
  today = this.days[new Date().getDay()];
  popularityPercentage = new Object();
  selectedLocation: any;
  isRegularhours: boolean;
  isTuberculosis: boolean;
  isDrughours: boolean;
  isGlucosehours: boolean;
  isselectedReason: boolean;
  popularClass = 'ds-col--12';
  siteHoursStatusMsg: string;
  siteHoursStatusDuration: string;
  slotRange: number;
  appointmentsOnly: string;
  selectedTestData: ReasonCategory[] = [];
  EmployerDrug = [7, 8, 9, 10, 11, 12, 18, 20];
  Reasons = [1, 3, 6, 16];
  isclosing: boolean;
  siteInfo: string[] = [];
  userLocation$: any;
  addresses$: any;
  selectedLocation$: any;
  URL = 'https://www.sonoraquest.com/';
  storeServiceTypeFromDeeplink: any[];
  distance = null;
  confirmedReason = null;
  showSiteCode$ = new Observable<boolean>();
  siteCodeAria = null;
  isAuthUser$ = new Observable<boolean>();
  disableBackArow$ = new Observable<boolean>();
  toggleView(parameterValue: boolean) { }

  constructor(private renderer: Renderer2, private router: Router, private pscService: PscService,
    private dateService: DateService,
    private location: Location,
    private route: ActivatedRoute,
    private dataService: DataService,
    private appointmentService: AppointmentService,
    private skipInsuranceService: SkipInsuranceService,
    private deeplinkSerive: DeeplinkService,
    private pscDetailsService: PscDetailsService,
    private i18n: I18n,
    private userService: UserService,
    private findLocationService: FindlocationDataService,
    private uiPropertyService: PropertiesService,) {
    // this.renderer.addClass(document.body, 'as-find-location');
    this.selectedLocation$ = this.dataService.getfindLocationSelectedLocation();
    this.isAuthUser$ = this.userService.isAuthenticated$;
    this.userLocation$ = this.dataService.getUserLocation();
    this.addresses$ = this.dataService.getMarkerAddress();
    this.disableBackArow$ = this.deeplinkSerive.getFlagFindLocationDetailDisableBackArrow();
  }

  ngOnInit() {
    this.showSiteCode$ = this.pscDetailsService.getFindLocationEnableSiteCode();
    this.distance = this.appointmentService.distance;
    this.route.data
      .subscribe(
        (pscLocation) => {
          pscLocation ? this.pscLocation = pscLocation.Location : this.router.navigate(['/find-location/']);
        }
      );
    this.loading = true;
    navigator.geolocation.getCurrentPosition((loc) => {
      this.userLocation = loc.coords.latitude + '+' + loc.coords.longitude;
    });
    this.getPscDetails();
    this.deepLinkFlowForReasonForVisit();
    this.getConfirmReason();
  }

  onMarkerClicked(event) {
    if (this.pscLocation.latitude !== event.lat && this.pscLocation.longitude !== event.lng) {
      this.addresses$.subscribe((data) => {
        if (data.length > 0) {
          const pscLocation = data.filter((address) => {
            return address.position.lat === event.lat && address.position.lng === event.lng;
          });
          if (pscLocation.length > 0) {
            this.pscLocation = pscLocation[0].psc;
          }
        }

        // if (data) {
        //   data.filter((address) => {
        //     return address.position.lat === event.lat && address.position.lng === event.lng;
        //   });
        //   console.log(data);

        //   if (data[0].psc) {
        //     this.pscLocation = data[0].psc;
        //   }
        // }
      });
      this.dataService.setfindLocationSelectedLocation(this.pscLocation);
      this.getPscDetails();
      this.popularityPercentage = new Object();

    }
  }

  getPscDetails() {
    this.loading = true;
    this.pscService.getPscDetails(this.pscLocation.siteCode).pipe(takeUntil(this.destroy$)).subscribe((details: PscDetails) => {
      // here goes location services details.services
      this.dataService.setSelectedLocationService(details.services);
      this.locationDetails = details;
      this.siteCodeAria = this.i18n(`Site Code ${this.locationDetails.siteCode}`);
      if (this.locationDetails.siteInfo) {
        this.siteInfo = this.locationDetails.siteInfo.split(':');
        if (this.siteInfo.length > 1) {
          this.siteInfo[0] = this.siteInfo[0].concat(':');
        }
        else {
          this.siteInfo[0] = this.siteInfo[0].concat('.');
        }
      }
      this.regularHours();
      this.hoursOfOperation();
      if (this.locationDetails) {
        if (this.isGlucosehours === true) {
          this.glucoseHours();
        }
        else if (this.isDrughours === true) {
          this.drugHours();
        }
      }
      this.getPopularHoursInPercent(this.today);
      this.generateTimesForUI(this.today);
      const msg = this.locationDetails.siteHoursStatus ? this.locationDetails.siteHoursStatus.split('-') : '';
      this.siteHoursStatusMsg = msg[0].trim();
      this.siteHoursStatusDuration = msg[1];
      this.appointmentsOnly = msg[2];
      this.loading = false;
    });
  }

  hoursOfOperation() {
    this.dataService.getTestsData().pipe(takeUntil(this.destroy$)).subscribe(testData => {
      this.selectedTestData = testData;
      if (this.selectedTestData && this.selectedTestData.length > 0) {
        const index = this.selectedTestData.length - 1;
        if (this.selectedTestData[index] && this.selectedTestData[index].facilityServiceId === 15) {
          this.isGlucosehours = true;
          this.isselectedReason = true;
          this.isTuberculosis = false;
          this.isDrughours = false;
        }
        else if (this.selectedTestData[index] && this.EmployerDrug.includes(this.selectedTestData[index].facilityServiceId)) {
          this.isDrughours = true;
          this.isselectedReason = true;
          this.isGlucosehours = false;
          this.isTuberculosis = false;
        }
      }
    });
    this.dataService.getReasonData().pipe(takeUntil(this.destroy$)).subscribe(reasonData => {
      this.selectedReason = reasonData;
      if (this.selectedReason) {
        if (this.Reasons.includes(this.selectedReason.facilityServiceId)) {
          this.isRegularhours = true;
          this.isselectedReason = false;
        }
        else if (this.selectedReason.facilityServiceId === 5) {
          this.isTuberculosis = true;
          this.isselectedReason = true;
          this.isGlucosehours = false;
          this.isDrughours = false;
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.renderer.removeClass(document.body, 'as-find-location');
  }

  openDirection() {
    // tslint:disable-next-line:max-line-length
    this.pscAddress = this.locationDetails ? `${this.locationDetails.address1} ${this.locationDetails.address2 ? this.locationDetails.address2 : ''} ${this.locationDetails.city} ${this.locationDetails.state} ${this.locationDetails.zip} ${this.locationDetails.name}` : null;

    if (this.userLocation) {
      window.open(`http://maps.google.com/maps?saddr=${this.userLocation}&daddr=${this.pscAddress}`, '_blank');
    } else {
      window.open(`http://maps.google.com/maps?daddr=${this.pscAddress}`, '_blank');
    }
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.router.navigate(['/find-location']);
    }
  }

  selectOption(day: string) {
    this.popularityPercentage = new Object();
    // const startTimeEndTime = this.getRegularHoursStartTimeEndTime(day);
    this.getPopularHoursInPercent(day);
    this.generateTimesForUI(day);
  }

  generateTimesForUI(day: string) {
    this.timeMap = {};
    this.timeLbl = {};
    this.uiTimes = [];
    const popularHours: Array<object> = this.locationDetails.popularHours[day];
    if (popularHours) {
      popularHours.forEach((item: any) => {
        const time = item.time.split(':');
        this.timeMap[parseInt(time[0], 10)] = this.getTimeInFormat(item.time);
        this.timeLbl[parseInt(time[0], 10)] = this.getTimeInFormat(item.time) +'m';
        this.popularityPercentage[parseInt(time[0], 10)] = this.popularityPercentage[item.time] + '%';
        this.uiTimes.push(parseInt(time[0], 10));
      });
      this.uiTimes.sort((a, b) => (a - b));
      this.updateSlotTime(this.locationDetails.regularHours[day.toLocaleLowerCase()]);
    }
  }

  getPopularHoursInPercent(day: string) {
    const popularHours: Array<object> = this.locationDetails.popularHours[day];
    let totalCount = 0;
    if (popularHours) {
      popularHours.forEach((item: any) => {
        totalCount += item.count;
      });

      popularHours.forEach((item: any) => {
        this.popularityPercentage[item.time] = (Math.floor((item.count / totalCount) * 100));
      });
    }

  }

  getTimeInFormat(time: string): string {
    const hoursAndMinutes = time.split(':');
    let formattedTime = 0;
    if (parseInt(hoursAndMinutes[0], 10) >= 12) {
      formattedTime = parseInt(hoursAndMinutes[0], 10);
      return ((formattedTime + 11) % 12 + 1).toString().concat('p'); // 24hrs converted to 12 hrs format
    } else {
      formattedTime = parseInt(hoursAndMinutes[0], 10);
      return formattedTime.toString().concat('a');
    }
  }
  getStyle(time) {
    if (time.toString().length === 1) {
      time = '0' + time.toString() + ':00';
    } else {
      time = time.toString() + ':00';
    }
    if (this.popularityPercentage[time]) {
      return {
        'height.%': this.popularityPercentage[time]
      };
    } else {
      return { 'visibility': 'hidden' };

    }
  }

  regularHours() {
    this.PSC_Hours.length = 0;
    const ObjKeys = Object.keys(this.locationDetails.regularHours);
    for (let i = 0; i < this.Days.length; i++) {
      for (let k = 0; k < ObjKeys.length; k++) {
        if (this.Days[i].toLowerCase() === ObjKeys[k].toLowerCase()) {
          this.PSC_Hours.push({ day: this.Days[i], hours: this.locationDetails.regularHours[ObjKeys[k]] });
        }
      }
    }
    this.PSC_Hours = this.PSC_Hours.slice(new Date().getDay()).concat(this.PSC_Hours.slice(0, new Date().getDay()));
  }

  glucoseHours() {
    this.GLUCOSE_Hours.length = 0;
    const ObjKeys = Object.keys(this.locationDetails.glucoseHours);
    for (let i = 0; i < this.Days.length; i++) {
      for (let k = 0; k < ObjKeys.length; k++) {
        if (this.Days[i].toLowerCase() === ObjKeys[k].toLowerCase()) {
          this.GLUCOSE_Hours.push({ day: this.Days[i], hours: this.locationDetails.glucoseHours[ObjKeys[k]] });
        }
      }
    }
    this.GLUCOSE_Hours = this.GLUCOSE_Hours.slice(new Date().getDay()).concat(this.GLUCOSE_Hours.slice(0, new Date().getDay()));
  }

  drugHours() {
    this.DRUG_Hours.length = 0;
    const ObjKeys = Object.keys(this.locationDetails.drugHours);
    for (let i = 0; i < this.Days.length; i++) {
      for (let k = 0; k < ObjKeys.length; k++) {
        if (this.Days[i].toLowerCase() === ObjKeys[k].toLowerCase()) {
          this.DRUG_Hours.push({ day: this.Days[i], hours: this.locationDetails.drugHours[ObjKeys[k]] });
        }
      }
    }
    this.DRUG_Hours = this.DRUG_Hours.slice(new Date().getDay()).concat(this.DRUG_Hours.slice(0, new Date().getDay()));
  }

  goToPrevious() {
    // this.location.back();
    this.router.navigate(['/find-location/as-location-finder']);
    // this.dataService.setfindLocationReason(null);
  }

  updateSlotTime(data?: string) {
    if (!data) {
      data = this.PSC_Hours[0].hours;
    }

    let dynamic = [];
    let slots = [];
    const slottime = [];
    let diff = null;
    let disable = true;

    if (data.indexOf(',') > -1) {
      dynamic = data.split(',');
      dynamic.forEach((ele, index) => {
        if (ele.indexOf('-') > -1) {
          slots.push(ele.split('-'));
          slots = [].concat.apply([], slots);
        }
      });
    } else {
      if (data.indexOf('-') > -1) {
        slots.push(data.split('-'));
        slots = [].concat.apply([], slots);
      } else {
        disable = false;
      }
    }
    if (disable) {
      slots.forEach((ele, index) => {
        slottime.push(this.parseTime(ele.trim()));
      });
      if (slottime.length > 2) {
        diff = (slottime[1] - slottime[0]) + (slottime[3] - slottime[2]);
      } else {
        diff = (slottime[1] - slottime[0]);
      }
      if (diff > 12) {
        this.slotRange = 3;
      } else {
        this.slotRange = 2;
      }
    }
  }

  parseTime(time) {
    const part = time.match(/(\d+):(\d+)(?: )?(am|pm)?/i);
    let hh = parseInt(part[1], 10);
    const mm = parseInt(part[2], 10);
    const ap = part[3] ? part[3].toUpperCase() : null;
    if (ap === 'AM') {
      if (hh === 12) {
        hh = 0;
      }
    }
    if (ap === 'PM') {
      if (hh !== 12) {
        hh += 12;
      }
    }
    return hh + (mm / 60);
  }
  navigateToScheduleApt() {
    this.dataService.setScheduleAppFlag(this.pscLocation.scheduleAppt);
    if(this.dataService.isDeepLinkReasonServicesNotOffered && this.pscLocation.siteCode ){
      this.loading = true;
      const data = {
        // siteCode: this.location.siteCode,
        ...this.pscLocation,
        facilityServiceId: null,
        // zip: this.location.zip
      };
      // this.dataService.setUserLocation(this.location);
      this.dataService.setReasonDataFindLocation(data);
      this.dataService.setLocationFinderDetailsFlowtoReason(true);
      setTimeout(() => {
        this.loading = false;
        this.checkReasonForVisitParam(this.dataService.deepLinkReasonParam) ?
          this.router.navigate(['/find-location/as-location-finder-reason', { reason: this.dataService.deepLinkReasonParam }]) :
          this.router.navigate(['find-location/as-location-finder-reason']);
      }, 900);
    }
    else if (this.selectedReason && this.pscLocation.siteCode) {
      const data = {
        // siteCode: this.location.siteCode,
        ...this.pscLocation,
        facilityServiceId: this.selectedReason.facilityServiceId,
        // zip: this.location.zip
      };
      // this.dataService.setUserLocation(this.location);
      this.dataService.setlocationFlowtoSchedule(true);
      this.dataService.setFindLocationFlow(true);
      this.dataService.setReasonDataFindLocation(data);
      if(this.selectedReason.serviceRequestor &&  this.selectedTestData.length === 0){
        this.dataService.setReasonData(this.confirmedReason);
      }else{
        this.dataService.setReasonData(this.selectedReason);
        this.dataService.setTestsData(this.selectedTestData);
      }
      this.dataService.setPreviousPage('find-location/as-location-finder-details');
      this.router.navigate(['schedule-appointment/as-find-lcn-appt-scheduler']);
    } else if (this.pscLocation.siteCode) {
      const data = {
        // siteCode: this.location.siteCode,
        ...this.pscLocation,
        facilityServiceId: null,
        // zip: this.location.zip
      };
      // this.dataService.setUserLocation(this.location);
      this.dataService.setReasonDataFindLocation(data);
      this.dataService.setLocationFinderDetailsFlowtoReason(true);
      this.router.navigate(['find-location/as-location-finder-reason']);
    }
    if(this.pscLocation){
      this.findLocationService.setfindLocationDetails(this.pscLocation);
    }
  }
  goToOtherWebsite(): void {
    window.open(this.URL, '_blank');
  }
   ///////////// start DeeplinkFlow For Find Location us31145/////////////////////
  // deeplink url = http://localhost:4202/find-location?labcard=true&reasonForVisit=All Other Tests&sitecode=LGW
  // adding service name when comes other reasons  like (glucose,purchasemyowntest) in future
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
  deepLinkFlowForReasonForVisit() {
    this.route
      .queryParamMap.pipe(take(1))
      .subscribe(params => {
        this.dataService.isDeepLinkReasonServicesNotOffered = false;
        if (params.get('reasonForVisit')) {
          this.dataService.setDeepLinkReasonFlag(true);
          const value = params.get('reasonForVisit').toUpperCase();
          // if Reason has multiple test
          // http://localhost:4201/find-location?reasonForVisit=ORAL FLUID COLLECTIONS,ELECTRONIC CFF
          if (value.includes(',') && this.deeplinkSerive.isMultiselectDeeplink(value)) {
            this.deeplinkHasMultiTest(value);
          }
          // if reason has only one test
          // not supported http://localhost:4201/find-location?labcard=true&reasonForVisit=PHLEBOTOMY&sitecode=W60
          else {
            this.deeplinkHasSingleTest(this.deeplinkSerive.getDeeplinkReason(value));
          }
        }
        else {
          this.dataService.setDeepLinkReasonFlag(false);
          this.resetDeepLinkValues();
        }
      });
  }
  private deeplinkHasSingleTest(value: string) {
    this.resetDeepLinkValues();
    this.storeServiceTypeFromDeeplink = [];
    // calling serivces
    this.deeplinkSerive.getReasonItems().subscribe(([Main, Glucose, Employer]) => {
      let mainFilter = null;
      if (value === 'PHLEBOTOMY') {
        mainFilter = Main.filter(x => x.facilityTestType.toUpperCase() === value.toUpperCase() && x.serviceRequestor === null
          && x.facilityTestTypeValue === 'All Other Tests')[0];
      } else {
        mainFilter = Main.filter(x => x.facilityTestType.toUpperCase() === value.toUpperCase() && x.serviceRequestor === null)[0];
      }
      // check test with main serive and test not in 'employer health and wellness'
      this.setValueDeepLinkHasSingleTest(mainFilter, Main, value, Glucose, Employer);

    }, (error) => {
    });
  }

  private setValueDeepLinkHasSingleTest(mainFilter: ReasonCategory, Main: ReasonCategory[],
    value: string, Glucose: ReasonCategory[], Employer: ReasonCategory[]) {
    if (mainFilter && mainFilter.facilityServiceId !== 3) {
      // check test service not offered
      this.checkDeepLinkServiceNotOffered(mainFilter);
      this.dataService.setfindLocationReason(mainFilter);
      this.dataService.setReasonData(mainFilter);
      let indexValue;
      if (value === 'PHLEBOTOMY') {
        indexValue = Main.findIndex(x => x.facilityTestType.toUpperCase() === value.toUpperCase()
          && x.facilityTestTypeValue === 'All Other Tests');
      } else {
        indexValue = Main.findIndex(x => x.facilityTestType.toUpperCase() === value.toUpperCase());
      }
      this.dataService.defaultDeepLinkTest = mainFilter;
      // assign index to test
      this.dataService.defaultDeepLinkTest.index = indexValue;
      this.skipInsuranceService.setSkipInsurance(mainFilter.skipInsurance);
      this.deeplinkSerive.setFlagFordisableReason(true);
    }
    else {
      // check test with glucose
      const glucoseFilter = Glucose.filter(x => x.facilityTestType.toUpperCase() === value.toUpperCase())[0];
      if (glucoseFilter) {
        const index = Glucose.findIndex(x => x.facilityTestType.toUpperCase() === value.toUpperCase());
        // assign index to test
        glucoseFilter.index = index;
        // check test offered
        this.checkDeepLinkServiceNotOffered(glucoseFilter);
        // set reasondata and testdata  in service
        this.setParentChildValues(serviceRequestorEnum.glucose, Main, glucoseFilter);
      }
      else {
        // check test with employer
        const employerFilter = Employer.filter(x => x.facilityTestType.toUpperCase() === value.toUpperCase())[0];
        if (employerFilter) {
          const index = Employer.findIndex(x => x.facilityTestType.toUpperCase() === value.toUpperCase());
          // assign index to test
          employerFilter.index = index;
          // check test offered
          this.checkDeepLinkServiceNotOffered(employerFilter);
          // set reasondata and testdata  in service
          this.setParentChildValues(serviceRequestorEnum.employer, Main, employerFilter);
        }
      }
    }
  }

  private deeplinkHasMultiTest(value: string) {
    this.resetDeepLinkValues();
    // store  service type
    this.storeServiceTypeFromDeeplink = [];
    const sliptedStringArr = value.split(',');
    // calling service types
    this.deeplinkSerive.getReasonItems().subscribe(([Main, Glucose, Employer]) => {
      this.prepareTestListFromStringArray(sliptedStringArr, Glucose, Employer);
      // checking all test under which service type
      const uniqueServiceType = this.storeServiceTypeFromDeeplink.filter((c, index, a) => a.indexOf(c) === index);
      // if all test under one service type
      if (uniqueServiceType.length === 1) {
        this.setValueDeepLinkHasMultiTest(Main, uniqueServiceType);
      }
      // if all test not under one service type set all other test
      else {
        this.setDefaultTest(Main);
      }
    }, (error) => {
    });
  }

  private setDefaultTest(Main: ReasonCategory[]) {
    this.resetDeepLinkValues();
    this.storeServiceTypeFromDeeplink = [];
    // For all othere test
    const defaultResult = Main.filter(x => x.facilityServiceId === 1);
    if (defaultResult.length > 0) {
      const index = Main.findIndex(x => x.facilityServiceId === 1);
      defaultResult[0].index = index;
      // check test offered
      const notOffered = this.locationDetails.servicesNotOffered
        .filter(x => x === defaultResult[0].facilityTestTypeValue);
      this.dataService.isDeepLinkReasonServicesNotOffered = notOffered.length > 0 ? true : false;
      this.dataService.setTestsData(defaultResult);
      this.dataService.setfindLocationReason(defaultResult[0]);
      this.dataService.setReasonData(defaultResult[0]);
      this.dataService.defaultDeepLinkTest = defaultResult[0];
      this.skipInsuranceService.setSkipInsurance(defaultResult[0].skipInsurance);
      this.deeplinkSerive.setFlagFordisableReason(true);
    }
  }

  private setValueDeepLinkHasMultiTest(Main: ReasonCategory[], uniqueServiceType: any[]) {
    const filterData = Main.filter(x => x.serviceRequestor === uniqueServiceType[0].toUpperCase());
    if (filterData) {
      const index = Main.findIndex(x => x.serviceRequestor === uniqueServiceType[0].toUpperCase());
      this.dataService.setReasonData(Main[index]);
      if (this.dataService.deepLinkTestList.length > 0) {
        this.checkServiceOfferedOrNot(uniqueServiceType, Main, index);
        this.deeplinkSerive.setFlagFordisableReason(true);
      }
    }
  }

  private checkServiceOfferedOrNot(uniqueServiceType: any[], Main: ReasonCategory[], index: number) {
    this.dataService.deepLinkReasonParam = uniqueServiceType[0];
    this.skipInsuranceService.setSkipInsurance(Main[index].skipInsurance);
    // check test not offered
    const notOffered = this.locationDetails.servicesNotOffered
      .filter(x => x === this.dataService.deepLinkTestList[0].facilityTestTypeValue);
    this.dataService.isDeepLinkReasonServicesNotOffered = notOffered.length > 0 ? true : false;
    // if test not offered taking one test from list
    if (this.dataService.isDeepLinkReasonServicesNotOffered) {
      // storing service test list to variable.
      let testList = this.dataService.deepLinkTestList;
      // clearing service testlist
      this.dataService.deepLinkTestList = [];
      // assign variable index 0 data to service testlist
      this.dataService.deepLinkTestList.push(testList[0]);
      // clearing variable data
      testList = [];
      this.dataService.setTestsData(this.dataService.deepLinkTestList);
      // set flag for multiple test if employer service for app-schedule screen
      this.dataService.deepLinkReasonParam === serviceRequestorEnum.employer ? this.dataService.setReasonType(true)
        : this.dataService.setReasonType(false);
    }
    else {
      this.dataService.setTestsData(this.dataService.deepLinkTestList);
    }
  }

  private prepareTestListFromStringArray(sliptedStringArr: string[], Glucose: ReasonCategory[], Employer: ReasonCategory[]) {
    for (let i = 0; i < sliptedStringArr.length; i++) {
      // check value with glucose
      const glucoseFilterValue = Glucose.filter(y => y.facilityTestType.toUpperCase() === sliptedStringArr[i])[0];
      if (glucoseFilterValue) {
        const index = Glucose.findIndex(x => x.facilityTestType.toUpperCase() === sliptedStringArr[i]);
        glucoseFilterValue.index = index;
        // storing service type
        this.storeServiceTypeFromDeeplink.push(serviceRequestorEnum.glucose);
        // storing tests in service
        this.dataService.deepLinkTestList.push(glucoseFilterValue);
      }
      else {
        // check value with Employer
        const employerFilterValue = Employer.filter(z => z.facilityTestType.toUpperCase() === sliptedStringArr[i])[0];
        if (employerFilterValue) {
          const index = Employer.findIndex(x => x.facilityTestType.toUpperCase() === sliptedStringArr[i]);
          employerFilterValue.index = index;
          this.storeServiceTypeFromDeeplink.push(serviceRequestorEnum.employer);
          this.dataService.deepLinkTestList.push(employerFilterValue);
        }
      }
    }
  }

   resetDeepLinkValues(){
    this.dataService.deepLinkReasonParam = '';
    this.dataService.deepLinkTestList = [];
    this.dataService.defaultDeepLinkTest = new ReasonCategory();
   }
   // set reasondata and testdata
   setParentChildValues(serviceType,mainResult,childFilter){
    this.dataService.defaultDeepLinkTest = new ReasonCategory();
    const filterData = mainResult.filter(x => x.serviceRequestor === serviceType);
    if (filterData) {
      const index = mainResult.findIndex(x => x.serviceRequestor === serviceType);
      this.resetDeepLinkValues();
      this.dataService.deepLinkReasonParam = serviceType;
      this.dataService.setReasonData(mainResult[index]);
      this.dataService.deepLinkTestList.push(childFilter);
      this.dataService.setTestsData(this.dataService.deepLinkTestList);
      this.dataService.deepLinkReasonParam === serviceRequestorEnum.employer ?
      this.dataService.setReasonType(true) :this.dataService.setReasonType(false) ;
      this.skipInsuranceService.setSkipInsurance(mainResult[index].skipInsurance);
      this.deeplinkSerive.setFlagFordisableReason(true);
    }
   }
   checkDeepLinkServiceNotOffered(reasonValue){
    const notOffered = this.locationDetails.servicesNotOffered.filter(x=>x === reasonValue.facilityTestTypeValue);
    this.dataService.isDeepLinkReasonServicesNotOffered = notOffered.length > 0 ? true : false;
   }
    //////////////////// end DeeplinkFlow For Find Location /////////////////////
  getConfirmReason() {
    this.dataService
      .getfindLocationReason()
      .pipe(takeUntil(this.destroy$))
      .subscribe((reasonData: ReasonCategory) => {
        this.confirmedReason = reasonData;
      });
  }
}


