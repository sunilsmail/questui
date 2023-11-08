import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { default as homeContent } from '../../../../../appointment/assets/content.json';
import { PropertiesService } from '../../services/properties.service';
import { PscDetails, PscLocationAvailability } from './../../models/psc';
import { ReasonCategory } from './../../models/reason-category';
import { AppointmentService } from './../../services/appointment.service';
import { DataService } from './../../services/data.service';
import { DeeplinkService } from './../../services/deeplink.service';
import { PscService } from './../../services/psc.service';
import { PscDetailsService } from './../../services/psc/psc-details.service';

@Component({
  selector: 'as-view-location-details',
  templateUrl: './as-view-location-details.component.html',
  styleUrls: ['./as-view-location-details.component.scss']
})
export class AsViewLocationDetailsComponent implements OnInit, OnDestroy {

  @Input() siteCode = null;
  @Input() distance = null;
  @Input() appointmentsOnly = null;
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
  // appointmentsOnly: string;
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
  showSiteCode$ = new Observable<boolean>();
  siteCodeAria = null;
  disableBackArow$ = new Observable<boolean>();
  toggleView(parameterValue: boolean) { }

  constructor(private renderer: Renderer2,
    private pscService: PscService,
    private dataService: DataService,
    private appointmentService: AppointmentService,
    private deeplinkSerive: DeeplinkService,
    private pscDetailsService: PscDetailsService,
    private i18n: I18n,
    private propertiesService: PropertiesService) {
    this.renderer.addClass(document.body, 'as-find-location');
    this.selectedLocation$ = this.dataService.getfindLocationSelectedLocation();
    this.addresses$ = this.dataService.getMarkerAddress();
    this.disableBackArow$ = this.deeplinkSerive.getFlagFindLocationDetailDisableBackArrow();
  }

  ngOnInit() {
    this.showSiteCode$ = this.pscDetailsService.getFindLocationEnableSiteCode();
    navigator.geolocation.getCurrentPosition((loc) => {
      this.userLocation = loc.coords.latitude + '+' + loc.coords.longitude;
    });
    if (this.siteCode) {
      this.getPscDetails();
    }
  }

  getPscDetails() {
    this.loading = true;
    this.pscService.getPscDetails(this.siteCode).pipe(takeUntil(this.destroy$)).subscribe((details: PscDetails) => {
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
    }, () => {
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

  selectOption(day: string) {
    this.today = day;
    this.popularityPercentage = new Object();
    this.getPopularHoursInPercent(day);
    this.generateTimesForUI(this.today);
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
        this.timeLbl[parseInt(time[0], 10)] = this.getTimeInFormat(item.time) + 'm';
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

}


