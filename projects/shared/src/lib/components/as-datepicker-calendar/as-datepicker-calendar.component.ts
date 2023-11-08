import { Component, ElementRef, HostListener, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { DatepickerService } from 'shared/services/datepicker/datepicker.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';

@Component({
  selector: 'as-datepicker-calendar',
  templateUrl: './as-datepicker-calendar.component.html',
  styleUrls: ['./as-datepicker-calendar.component.scss']
})
export class AsDatepickerCalendarComponent implements OnInit {
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
  // datePicker
  datePickerMonthList = [];
  viewMonthMenu = false;
  defaultIndexForDatePickerMonth = 0;
  enableNewUI$ = new Observable<boolean>();
  constructor(private pscService: PscService, private propertiesService: PropertiesService
    , private datePickerService: DatepickerService, private pscDetailsService: PscDetailsService,
    private _eref: ElementRef) { }

  ngOnInit() {
    this.enableNewUI$ = this.pscDetailsService.getEnableNewUi();
    this.propertiesService.getMaxApptScheduleDays().subscribe((maxDays: number) => {
      this.maxScheduleDays = maxDays;
      this.prepareDatePickerMonthList();
      this.calSize = window.outerWidth > 432 ? 12 : 5;
      this.existingAppt ? this.initWithExistingAppt() : this.init();
      this.selectedDate = this.showCalMap[this.itemChecked];
    });
    this.pscService.hasMorning$.subscribe(value => {
      this.tabValue = value;
    });
    setTimeout(() => {
      document.getElementById('selectToggle').removeAttribute('aria-labelledby');
    }, 100);
  }
  init() {
    this.startIndex = this.today.getDate() - 1;
    this.endIndex = this.startIndex + this.calSize;
    this.currentMonth = this.months[this.today.getMonth()];
    this.currentYear = this.today.getFullYear();
    this.currentMonthCalMap = this.datePickerService.getDayNames(this.today.getFullYear(), this.today.getMonth() + 1, this.maxScheduleDays);
    if (this.endIndex >= this.currentMonthCalMap.length) {
      if (this.today.getMonth() + 2 > 12) {
        this.nextMonthCalMap = this.datePickerService.getDayNames(this.today.getFullYear() + 1, 1, this.maxScheduleDays);
      } else {
        this.nextMonthCalMap = this.datePickerService.getDayNames(
          this.today.getFullYear(), this.today.getMonth() + 2, this.maxScheduleDays);
      }
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
    const date = this.getDateFormate(this.existingAppt);
    this.startIndex = date.getDate() - 1;
    this.endIndex = this.startIndex + this.calSize;
    this.currentMonth = this.months[date.getMonth()];
    this.currentYear = date.getFullYear();
    this.currentMonthCalMap = this.datePickerService.getDayNames(date.getFullYear(), date.getMonth() + 1, this.maxScheduleDays);
    this.prepareDatesFromExistingAppt();
    this.itemChecked = this.showCalMap.findIndex(item => item.date === date.getDate() &&
      item.year === date.getFullYear() && item.month === date.getMonth() + 1);
    this.previousEnabled = this.showCalMap.findIndex(item => item.date === this.today.getDate() &&
      item.year === this.today.getFullYear() && item.month === this.today.getMonth() + 1) !== -1 ? false : true;
    this.nextEnabled = this.showCalMap.findIndex(item => item.disabled === true) !== -1 ? false : true;
  }
  public prepareDatesFromExistingAppt() {
    if (this.endIndex >= this.currentMonthCalMap.length) {
      this.nextMonthCalMap = (this.currentMonthCalMap[0]['month'] === 12) ?
        this.datePickerService.getDayNames(this.currentYear + 1, 1, this.maxScheduleDays) :
        this.datePickerService.getDayNames(this.currentYear, this.currentMonthCalMap[0]['month'] + 1, this.maxScheduleDays);
      // append both calendars to final calendar
      const extrasRequired = this.endIndex - this.currentMonthCalMap.length;
      this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.currentMonthCalMap.length);
      this.showCalMap.push(...this.nextMonthCalMap.slice(0, extrasRequired));
      this.nextMonthCalMap = null;
    } else {
      this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.endIndex);
    }
  }

  onPrevious() {
    this.nextMonthCalMap = null;
    this.endIndex = this.startIndex;  // 0
    this.startIndex = this.startIndex - this.calSize; // -12
    if (this.startIndex < 0) {
      // showPrevMonthAndCurrentMonth
      this.showDatesBetweenTwoMonthsOnPrev();
    } else {
      // showOneMonth
      this.showDatesWithInMonthOnPrev();
    }
    // index of doesn't work here because object reference changes
    this.itemChecked = this.showCalMap.findIndex(item => item.date === this.selectedDate.date && item.day === this.selectedDate.day &&
      item.year === this.selectedDate.year && item.month === this.selectedDate.month);
    if (this.itemChecked !== -1) {
      this.currentMonth = this.months[this.selectedDate.month - 1];
      this.currentYear = this.selectedDate.year;
      this.datePickerMonthChange({ month: this.currentMonth, year: this.currentYear });
    }
    this.previousEnabled = this.showCalMap.findIndex(item => item.date === this.today.getDate() &&
      item.year === this.today.getFullYear() && item.month === this.today.getMonth() + 1) !== -1 ? false : true;
    this.nextEnabled = this.showCalMap.findIndex(item => item.disabled === false) === -1 ? false : true;
    // for aria label
    setTimeout(() => {
      this.blnAriaLabelPrev = true;
    }, 100);
  }

  public showDatesWithInMonthOnPrev() {
    if (this.prevMonthCalMap) { // immediately after showing prev month and current month and then showing only current month
      this.currentMonthCalMap = this.prevMonthCalMap;
      this.prevMonthCalMap = null;
      if ((this.showCalMap[0]['month']) === 12) {
        this.currentYear--;
        this.currentMonth = this.months[11];
        this.datePickerMonthChange({ month: this.currentMonth, year: this.currentYear });
      } else {
        this.currentMonth = this.months[this.showCalMap[0]['month'] - 1];
        this.datePickerMonthChange({ month: this.currentMonth, year: this.currentYear });
      }
    }
    this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.endIndex);
    this.currentMonth = this.months[this.showCalMap[0]['month'] - 1];
    this.currentYear = this.showCalMap[0]['year'];
    this.datePickerMonthChange({ month: this.currentMonth, year: this.currentYear });
  }

  public showDatesBetweenTwoMonthsOnPrev() {
    this.prevMonthCalMap = (this.currentMonthCalMap[0]['month'] === 1) ?
      this.datePickerService.getDayNames(this.currentYear - 1, 12, this.maxScheduleDays) :
      this.datePickerService.getDayNames(this.currentYear, this.currentMonthCalMap[0]['month'] - 1, this.maxScheduleDays);
    const extrasRequired = this.startIndex * -1;
    this.startIndex = this.prevMonthCalMap.length - extrasRequired;
    this.showCalMap = this.prevMonthCalMap.slice(this.startIndex, this.prevMonthCalMap.length);
    this.showCalMap.push(...this.currentMonthCalMap.slice(0, this.endIndex));
    if (this.endIndex === 0) { // month changed
      this.currentMonth = this.months[this.showCalMap[0]['month'] - 1];
      this.currentYear = this.showCalMap[0]['year'];
      this.datePickerMonthChange({ month: this.currentMonth, year: this.currentYear });
    }
  }
  onNext() {
    this.prevMonthCalMap = null;
    this.startIndex = this.endIndex;
    this.endIndex = this.endIndex + this.calSize;
    if (this.endIndex > this.currentMonthCalMap.length) {
      // showTwoMonths
      this.showDatesBetweenTwoMonthsOnNext();
    } else {
      // showing only one month
      this.showDatesWithInMonthOnNext();
    }
    this.itemChecked = this.showCalMap.findIndex(item => item.date === this.selectedDate.date && item.day === this.selectedDate.day &&
      item.year === this.selectedDate.year && item.month === this.selectedDate.month);
    if (this.itemChecked !== -1) {
      this.currentMonth = this.months[this.selectedDate.month - 1];
      this.currentYear = this.selectedDate.year;
      this.datePickerMonthChange({ month: this.currentMonth, year: this.currentYear });
    }
    this.previousEnabled = this.showCalMap.findIndex(item => item.date === this.today.getDate() &&
      item.year === this.today.getFullYear() && item.month === this.today.getMonth() + 1) !== -1 ? false : true;
    this.nextEnabled = this.showCalMap.findIndex(item => item.disabled === true) !== -1 ? false : true;

    const dateAfterAddMaxDays = new Date();
    // adding 195 days which is reading from ui properties.
    dateAfterAddMaxDays.setDate(dateAfterAddMaxDays.getDate() +
      this.maxScheduleDays
    );
    const getlastMonth = dateAfterAddMaxDays.getMonth() + 1;
    const getYear = dateAfterAddMaxDays.getFullYear();
    const getdate = dateAfterAddMaxDays.getDate();
    const maxDate = this.showCalMap.filter(x => (x.date === getdate &&
      x.month === getlastMonth && x.year === getYear));
    this.nextEnabled = (maxDate && maxDate.length > 0) ? false : this.nextEnabled;
    // for aria label
    setTimeout(() => {
      this.blnAriaLabelNext = true;
    }, 100);
  }
  public showDatesWithInMonthOnNext() {
    if (this.nextMonthCalMap) { // immediately after showing current month and next month and then showing only current month
      this.currentMonthCalMap = this.nextMonthCalMap;
      this.nextMonthCalMap = null;
    }
    this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.endIndex);
    this.currentMonth = this.months[this.showCalMap[0]['month'] - 1];
    this.currentYear = this.showCalMap[0]['year'];
    this.datePickerMonthChange({ month: this.currentMonth, year: this.currentYear });
  }

  public showDatesBetweenTwoMonthsOnNext() {
    let nextMonth = false;
    if (this.startIndex > (this.currentMonthCalMap.length - 1)) { // showNextMonthOnly and next month becomes current month
      this.startIndex = this.startIndex - this.currentMonthCalMap.length;
      this.endIndex = this.endIndex - this.currentMonthCalMap.length;
      nextMonth = true;
    }
    this.nextMonthCalMap = (this.currentMonthCalMap[0]['month'] === 12) ?
      this.datePickerService.getDayNames(this.currentMonthCalMap[0]['year'] + 1, 1, this.maxScheduleDays) :
      this.datePickerService.getDayNames(this.currentMonthCalMap[0]['year'], this.currentMonthCalMap[0]['month'] + 1, this.maxScheduleDays);
    if (nextMonth) { // showNextMonthOnly and next month becomes current month
      this.showCalMap = this.nextMonthCalMap.slice(this.startIndex, this.endIndex);
      this.currentMonthCalMap = this.nextMonthCalMap;
      this.currentMonth = this.months[this.currentMonthCalMap[0]['month'] - 1];
      this.currentYear = this.currentMonthCalMap[0]['year'];
      this.datePickerMonthChange({ month: this.currentMonth, year: this.currentYear });
    }
    else { // showTwoMonths
      this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.currentMonthCalMap.length);
      const extrasRequired = this.endIndex - this.currentMonthCalMap.length;
      this.showCalMap.push(...this.nextMonthCalMap.slice(0, extrasRequired));
    }
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
    this.datePickerMonthChange({ month: this.currentMonth, year: this.currentYear });
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
  // for aria label next button
  get getNextLabelData() {
    if (this.blnAriaLabelNext) {
      setTimeout(() => {
        this.blnAriaLabelNext = false;
      }, 3000);
      if (this.showCalMap.length > 1) {
        return `dates loaded from ${this.showCalMap[0].date} ${this.months[this.showCalMap[0].month - 1]}
        to ${this.showCalMap[this.showCalMap.length - 1].date} ${this.months[this.showCalMap[this.showCalMap.length - 1].month - 1]}`;
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
        return `dates loaded from ${this.showCalMap[0].date} ${this.months[this.showCalMap[0].month - 1]}
        to ${this.showCalMap[this.showCalMap.length - 1].date} ${this.months[this.showCalMap[this.showCalMap.length - 1].month - 1]}`;
      }
      return 'choose previous set of dates';
    }
    return 'choose previous set of dates';
  }
  // New DatePicker block
  closeUserMenu() {
    this.viewMonthMenu = false;
  }
  prepareDatePickerMonthList() {
    const monthIndex = this.today.getMonth() + 1;
    const maxApptScheduleMonthForDatePicker = new Date();
    // adding 195 days which is reading from ui properties.
    maxApptScheduleMonthForDatePicker.setDate(maxApptScheduleMonthForDatePicker.getDate() +
      this.maxScheduleDays
    );
    const newMontIndex = maxApptScheduleMonthForDatePicker.getMonth() + 1;
    const getYearafterAddingDays = maxApptScheduleMonthForDatePicker.getFullYear();
    // tslint:disable-next-line: max-line-length
    this.datePickerMonthList = this.datePickerService.dateRange(this.today.getFullYear() + '-' + monthIndex, getYearafterAddingDays + '-' + newMontIndex, this.months);
    if (this.existingAppt) {
      this.setDefaultIndexForDatePicker();
    }
    else {
      this.defaultIndexForDatePickerMonth = 0;
    }
  }
  private setDefaultIndexForDatePicker() {
    const existingDate = this.getDateFormate(this.existingAppt);
    const slectedMonth = this.months[existingDate.getMonth()];
    const selectedYear = existingDate.getFullYear();
    this.defaultIndexForDatePickerMonth = this.datePickerMonthList.findIndex(x => x.month === slectedMonth && x.year === selectedYear);
  }
  getDateFormate(data) {
    return new Date(data.appointmentDate.substring(0, 4),
      data.appointmentDate.substring(5, 7) - 1,
      data.appointmentDate.substring(8, 10));
  }
  datePickerMonthChange(month, datePickerChange = false) {
    this.currentMonth = month.month;
    this.defaultIndexForDatePickerMonth = this.datePickerMonthList.findIndex(x => x.month === month.month && x.year === month.year);
    if (month && datePickerChange) {
      this.prepareDataOnDatePickerChange(month);
    }
  }
  private prepareDataOnDatePickerChange(month: any) {
    let nextMonthCalMap;
    // tslint:disable-next-line: max-line-length
    (this.months.indexOf(month.month) === this.today.getMonth() && month.year === this.today.getFullYear()) ? this.startIndex = this.today.getDate() - 1 : this.startIndex = 0;
    this.endIndex = this.startIndex + this.calSize;
    this.currentMonthCalMap = this.datePickerService.getDayNames(month.year, month.index + 1, this.maxScheduleDays);
    this.showCalMap = this.currentMonthCalMap.slice(this.startIndex, this.endIndex);
    if (month.index === this.today.getMonth() && this.showCalMap && this.showCalMap.length < this.calSize) {
      if (this.currentMonthCalMap[0]['month'] + 1 > 12) {
        // tslint:disable-next-line: max-line-length
        nextMonthCalMap = this.datePickerService.getDayNames(month.year + 1, 1, this.maxScheduleDays);
      } else {
        // tslint:disable-next-line: max-line-length
        nextMonthCalMap = this.datePickerService.getDayNames(month.year, this.currentMonthCalMap[0]['month'] + 1, this.maxScheduleDays);
      }
      const extrasRequired = this.endIndex - this.currentMonthCalMap.length;
      this.showCalMap.push(...nextMonthCalMap.slice(0, extrasRequired));
    }
    this.onDateSelected(this.showCalMap[0]);
    this.disableLeftArrow();
    this.disableRightArrow();
  }
  disableLeftArrow() {
    this.previousEnabled = this.showCalMap.findIndex(item => item.date === this.today.getDate() &&
      item.year === this.today.getFullYear() && item.month === this.today.getMonth() + 1) !== -1 ? false : true;
  }
  disableRightArrow() {
    this.nextEnabled = this.showCalMap.findIndex(item => item.disabled === true) !== -1 ? false : true;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this._eref.nativeElement.contains(event.target)){
      this.closeUserMenu();
    }
  }
  setPostion() {
    setTimeout(() => {
      const ele = document.querySelectorAll('.--current-selection');
      if (ele && ele.length > 0) {
        const target = ele[0];
        (target as HTMLElement).focus();
        // for entire screen scroll
        // (ele[0] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        // for particular control scroll
        target.parentNode['scrollTop'] = target['offsetTop'];
      }
    }, 0);
  }
  // end of datePicker

  onkeyDownButton(event: KeyboardEvent, id: number) {
    const controls = document.getElementById(`cal_lbl_${id}`);
    if (controls) {
      controls.focus();
    }
  }
}

