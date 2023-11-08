import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';

@Component({
  selector: 'as-calendar',
  templateUrl: './as-calendar.component.html',
  styleUrls: ['./as-calendar.component.scss']
})
export class AsCalendarComponent implements OnInit {
  dates: boolean;
  tabValue: boolean;
  today = new Date();
  currentMonth: string;
  currentYear: number;
  selectedDate: any;
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentMonthCalMap = [];
  nextMonthCalMap = null;
  prevMonthCalMap = null;
  showCalMap = [];
  itemChecked = 0;
  startIndex = 0;
  endIndex = 12;
  calSize: number;
  _resize$ = new Observable();
  previousEnabled = true;
  nextEnabled = true;
  maxScheduleDays: number;

  @Output()
  dateChanged: EventEmitter<any> = new EventEmitter();

  @Input()
  existingAppt: any;

  blnAriaLabelNext = false;
  blnAriaLabelPrev = false;
  enableNewUI$ = new Observable<boolean>();

  constructor(private pscService: PscService,
    private propertiesService: PropertiesService,
    private pscDetailsService: PscDetailsService) { }

  ngOnInit() {
    this.enableNewUI$ = this.pscDetailsService.getEnableNewUi();
    this.propertiesService.getMaxApptScheduleDays().subscribe((maxDays: number) => {
      this.maxScheduleDays = maxDays;
    });
    this.calSize = window.outerWidth > 432 ? 12 : 6;
    this.existingAppt ? this.initWithExistingAppt() : this.init();

    this.selectedDate = this.showCalMap[this.itemChecked];
    this.pscService.hasMorning$.subscribe(value => {
      this.tabValue = value;
    });
  }

  init() {
    this.startIndex = this.today.getDate() - 1;
    this.endIndex = this.startIndex + this.calSize;
    this.currentMonth = this.months[this.today.getMonth()];
    this.currentYear = this.today.getFullYear();
    this.currentMonthCalMap = this.getDayNames(this.today.getFullYear(), this.today.getMonth() + 1);
    if (this.endIndex >= this.currentMonthCalMap.length) {
      let month;
      let year;
      if(this.today.getMonth() + 2 > 12){
        month = 1;
        year = this.today.getFullYear() + 1;
      }else{
        month = this.today.getMonth() + 2;
        year = this.today.getFullYear();
      }
      this.nextMonthCalMap = this.getDayNames(year, month);
      // this.adjustStartIndexToFillExtras();
      // append both calendars to final calendar
      const extrasRequired = this.endIndex - this.currentMonthCalMap.length;
      this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.currentMonthCalMap.length);
      this.showCalMap.push(...this.nextMonthCalMap.slice(0, extrasRequired));
      this.nextMonthCalMap = null;
    } else {
      this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.endIndex);
    }
    this.itemChecked = this.showCalMap.findIndex(item => item.date === this.today.getDate() &&
      item.year === this.today.getFullYear() && item.month === this.today.getMonth() + 1);
      this.previousEnabled = this.showCalMap.findIndex(item => item.date === this.today.getDate() &&
      item.year === this.today.getFullYear() && item.month === this.today.getMonth() + 1) !== -1 ? false : true;
  }
  initWithExistingAppt() {
    const date = new Date(this.existingAppt.appointmentDate.substring(0, 4),
      this.existingAppt.appointmentDate.substring(5, 7) - 1,
      this.existingAppt.appointmentDate.substring(8, 10));

    this.startIndex = date.getDate() - 1;
    this.endIndex = this.startIndex + this.calSize;
    this.currentMonth = this.months[date.getMonth()];
    this.currentYear = date.getFullYear();
    this.currentMonthCalMap = this.getDayNames(date.getFullYear(), date.getMonth() + 1);
    if (this.endIndex >= this.currentMonthCalMap.length) {
      this.nextMonthCalMap = this.getDayNames(this.today.getFullYear(), this.today.getMonth() + 2);
      // this.adjustStartIndexToFillExtras();
      // append both calendars to final calendar
      const extrasRequired = this.endIndex - this.currentMonthCalMap.length;
      this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.currentMonthCalMap.length);
      this.showCalMap.push(...this.nextMonthCalMap.slice(0, extrasRequired));
      this.nextMonthCalMap = null;
    } else {
      this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.endIndex);
    }
    this.itemChecked = this.showCalMap.findIndex(item => item.date === date.getDate() &&
      item.year === date.getFullYear() && item.month === date.getMonth() + 1);
      this.previousEnabled = this.showCalMap.findIndex(item => item.date === this.today.getDate() &&
      item.year === this.today.getFullYear() && item.month === this.today.getMonth() + 1) !== -1 ? false : true;
  }

  onPrevious() {
    // === works here because object reference is the same
    /* if (this.showCalMap[0] === this.currentMonthCalMap[0]) { // reached first day of month
      this.getPrevMonth();
      return;
    } */
    this.nextMonthCalMap = null;
    this.endIndex = this.startIndex;  // 0
    this.startIndex = this.startIndex - this.calSize; // -12
    if (this.startIndex < 0) { // showPrevMonthAndCurrentMonth
      // this.adjustEndIndexToFillExtras();
      this.prevMonthCalMap = (this.currentMonthCalMap[0]['month'] === 1) ?
        this.getDayNames(this.currentYear - 1, 12) :
        this.getDayNames(this.currentYear, this.currentMonthCalMap[0]['month'] - 1);
      const extrasRequired = this.startIndex * -1;
      this.startIndex = this.prevMonthCalMap.length - extrasRequired;
      this.showCalMap = this.prevMonthCalMap.slice(this.startIndex, this.prevMonthCalMap.length);
      this.showCalMap.push(...this.currentMonthCalMap.slice(0, this.endIndex));
      if (this.endIndex === 0) { // month changed
        this.currentMonth = this.months[this.showCalMap[0]['month'] - 1];
        this.currentYear = this.showCalMap[0]['year'];
      }
    } else { // showOneMonth
      if (this.prevMonthCalMap) { // immediately after showing prev month and current month and then showing only current month
        this.currentMonthCalMap = this.prevMonthCalMap;
        this.prevMonthCalMap = null;
        if ((this.showCalMap[0]['month']) === 12) {
          this.currentYear--;
          this.currentMonth = this.months[11];
        } else {
          this.currentMonth = this.months[this.showCalMap[0]['month'] - 1];
        }
      }
      this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.endIndex);
      this.currentMonth = this.months[this.showCalMap[0]['month'] - 1];
      this.currentYear = this.showCalMap[0]['year'];
    }

    // index of doesn't work here because object reference changes
    this.itemChecked = this.showCalMap.findIndex(item => item.date === this.selectedDate.date && item.day === this.selectedDate.day &&
      item.year === this.selectedDate.year && item.month === this.selectedDate.month);
    if (this.itemChecked !== -1) {
      this.currentMonth = this.months[this.selectedDate.month - 1];
      this.currentYear = this.selectedDate.year;
    }
    this.previousEnabled = this.showCalMap.findIndex(item => item.date === this.today.getDate() &&
      item.year === this.today.getFullYear() && item.month === this.today.getMonth() + 1) !== -1 ? false : true;

   // this.checkforMaxDateToDisableNext();
   this.nextEnabled = this.showCalMap.findIndex(item => item.disabled === false) === -1 ? false : true;
    // for aria label
    setTimeout(() => {
      this.blnAriaLabelPrev = true;
    }, 100);
  }

  onNext() {
    // === works here because object reference is the same
    // reached the last day of month
    /* if (this.showCalMap[this.showCalMap.length - 1] === this.currentMonthCalMap[this.currentMonthCalMap.length - 1]) {
      this.getNextMonth();
      return;
    } */

    this.prevMonthCalMap = null;
    this.startIndex = this.endIndex;
    this.endIndex = this.endIndex + this.calSize;
    if (this.endIndex > this.currentMonthCalMap.length) { // showTwoMonths
      let nextMonth = false;
      if (this.startIndex > (this.currentMonthCalMap.length - 1)) { // showNextMonthOnly and next month becomes current month
        this.startIndex = this.startIndex - this.currentMonthCalMap.length;
        this.endIndex = this.endIndex - this.currentMonthCalMap.length;
        nextMonth = true;
      }
      this.nextMonthCalMap = (this.currentMonthCalMap[0]['month'] === 12) ?
        this.getDayNames(this.currentYear + 1, 1) :
        this.getDayNames(this.currentYear, this.currentMonthCalMap[0]['month'] + 1);
      if (nextMonth) { // showNextMonthOnly and next month becomes current month
        this.showCalMap = this.nextMonthCalMap.slice(this.startIndex, this.endIndex);
        this.currentMonthCalMap = this.nextMonthCalMap;
        this.currentMonth = this.months[this.currentMonthCalMap[0]['month'] - 1];
        this.currentYear = this.currentMonthCalMap[0]['year'];
      } else { // showTwoMonths
        this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.currentMonthCalMap.length);
        const extrasRequired = this.endIndex - this.currentMonthCalMap.length;
        this.showCalMap.push(...this.nextMonthCalMap.slice(0, extrasRequired));
      }

    } else { // showing only one month
      if (this.nextMonthCalMap) { // immediately after showing current month and next month and then showing only current month
        this.currentMonthCalMap = this.nextMonthCalMap;
        this.nextMonthCalMap = null;
      }
      this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.endIndex);
      this.currentMonth = this.months[this.showCalMap[0]['month'] - 1];
      this.currentYear = this.showCalMap[0]['year'];
    }
    this.itemChecked = this.showCalMap.findIndex(item => item.date === this.selectedDate.date && item.day === this.selectedDate.day &&
      item.year === this.selectedDate.year && item.month === this.selectedDate.month);
    if (this.itemChecked !== -1) {
      this.currentMonth = this.months[this.selectedDate.month - 1];
      this.currentYear = this.selectedDate.year;
    }
    this.previousEnabled = this.showCalMap.findIndex(item => item.date === this.today.getDate() &&
      item.year === this.today.getFullYear() && item.month === this.today.getMonth() + 1) !== -1 ? false : true;

   // this.checkforMaxDateToDisableNext();
    this.nextEnabled = this.showCalMap.findIndex(item => item.disabled === true) !== -1 ? false : true;
    // for aria label
    setTimeout(() => {
      this.blnAriaLabelNext = true;
    }, 100);
  }

 /*  checkforMaxDateToDisableNext() {
    this.nextEnabled = this.showCalMap.findIndex(item => item.disabled === true) !== -1 ? false : true;
  } */

  /* adjustEndIndexToFillExtras() {
    const extrasRequired = this.startIndex * -1; // 5
    this.startIndex = 0;
    this.endIndex = this.endIndex + extrasRequired; // 12
  } */

  /* getNextMonth() {
    if (this.months.indexOf(this.currentMonth) + 1 >= 12) {
      this.currentYear++;
    }
    const indexOfNextMonth = (this.months.indexOf(this.currentMonth) + 1) % 12;
    this.currentMonth = this.months[indexOfNextMonth];
    this.currentMonthCalMap = this.getDayNames(this.currentYear, indexOfNextMonth + 1);
    this.startIndex = 0;
    this.endIndex = this.startIndex + this.calSize;
    this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.endIndex);
    // index of doesn't work here because object reference changes
    this.itemChecked = this.showCalMap.findIndex(item => item.date === this.selectedDate.date && item.day === this.selectedDate.day &&
      item.year === this.selectedDate.year && item.month === this.selectedDate.month);
  } */

  /*  getPrevMonth() {
      if (this.months.indexOf(this.currentMonth) - 1 < 0) {
        this.currentYear--;
      }
      const indexOfPrevMonth = (this.months.indexOf(this.currentMonth) - 1) >= 0 ? this.months.indexOf(this.currentMonth) - 1 : 11;
      this.currentMonth = this.months[indexOfPrevMonth];
      this.currentMonthCalMap = this.getDayNames(this.currentYear, indexOfPrevMonth + 1);
      this.startIndex = this.currentMonthCalMap.length - this.calSize;
      this.endIndex = this.currentMonthCalMap.length;
      this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.endIndex);
      // index of doesn't work here because object reference changes
      this.itemChecked = this.showCalMap.findIndex(item => item.date === this.selectedDate.date && item.day === this.selectedDate.day &&
        item.year === this.selectedDate.year && item.month === this.selectedDate.month);
    } */

  adjustStartIndexToFillExtras() {
    const extrasRequired = (this.endIndex - this.currentMonthCalMap.length);
    this.startIndex = this.startIndex - extrasRequired;
    this.endIndex = this.currentMonthCalMap.length;
  }

  onMorning() {
    this.pscService.hasMorning$.next(true);
  }

  onAfternoon() {
    this.pscService.hasMorning$.next(false);
  }

  onDateSelected(date: any) {
    this.selectedDate = date;
    this.currentMonth = this.months[date.month - 1];
    this.currentYear = date.year;
    this.itemChecked = this.showCalMap.indexOf(date); // index of works here because object reference is the same
    this.dateChanged.emit(new Date(this.currentYear, this.months.indexOf(this.currentMonth), date.date));
  }
  onKeyPressed(event, calItem) {
    if (event.keyCode === 13) {
      this.onDateSelected(calItem);
    }
  }
  onKeyPressedArrow(event, arrow) {
    if (event.keyCode === 13) {
      arrow === 'previous' ? this.onPrevious() : this.onNext();
    }
  }
  onKeyPressedTab(event, tabName) {
    if (event.keyCode === 13) {
      tabName === 'afternoon' ? this.onAfternoon() : this.onMorning();
    }
  }
  getDayNames(year: number, month: number) {
    const maxApptScheduleDate = new Date();
    // adding 195 days which is reading from ui properties.
    maxApptScheduleDate.setDate(maxApptScheduleDate.getDate() + this.maxScheduleDays);
    const calMap = [];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month - 1, i);
      const dayName = days[d.getDay()];
      const currentdate = new Date();
      if (d > maxApptScheduleDate) {
        calMap.push({ 'date': i, 'day': dayName, 'month': month, 'year': year, 'disabled': true });
      } else {
        if ((d.setHours(0, 0, 0, 0) < currentdate.setHours(0, 0, 0, 0))) {
          calMap.push({ 'date': i, 'day': dayName, 'month': month, 'year': year, 'disabled': true });
        } else {
          calMap.push({ 'date': i, 'day': dayName, 'month': month, 'year': year, 'disabled': false });
        }

      }
    }
    return calMap;
  }


  // for aria label next button
  get getNextLabelData() {
    if (this.blnAriaLabelNext) {
      setTimeout(() => {
        this.blnAriaLabelNext = false;
      }, 3000);
      if (this.showCalMap.length > 1) {
        return `dates loaded from ${this.showCalMap[0].date} ${this.months[this.showCalMap[0].month -1]}
        to ${this.showCalMap[this.showCalMap.length - 1].date} ${this.months[this.showCalMap[this.showCalMap.length - 1].month -1]}`;
      }
      return 'choose next set of dates';
    }
    return 'choose next set of dates';
  }

  // for aria label previous button
  get getPrevLabelData() {
    if (this.blnAriaLabelPrev) {
      setTimeout(() => {
        this.blnAriaLabelPrev = false;
      }, 3000);
      if (this.showCalMap.length > 1) {
        return `dates loaded from ${this.showCalMap[0].date} ${this.months[this.showCalMap[0].month -1]}
        to ${this.showCalMap[this.showCalMap.length - 1].date} ${this.months[this.showCalMap[this.showCalMap.length - 1].month -1]}`;
      }
      return 'choose previous set of dates';
    }
    return 'choose previous set of dates';
  }


}
