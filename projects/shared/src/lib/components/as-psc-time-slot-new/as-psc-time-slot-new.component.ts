import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Observable } from 'rxjs';
import { PscFullDaySlots, PscTimeSlot, SlotAvailableType } from 'shared/models';
import { PropertiesService } from 'shared/services/properties.service';
import { PscSlotService } from 'shared/services/psc/psc-slots.service';

@Component({
  selector: 'as-psc-time-slot-new',
  templateUrl: './as-psc-time-slot-new.component.html',
  styleUrls: ['./as-psc-time-slot-new.component.scss']
})
export class AsPscTimeSlotNewComponent implements OnInit {

  _timeSlots: any[];
  bothMorningAfternoonAvailableSlots = 0;
  morningAvailableSlots = 0;
  afternoonAvailableSlots = 0;
  timeSelected = null;
  showAll: boolean;
  showAllMobileMorning: boolean;
  showAllMobileAfternoon: boolean;
  currentWindowWidth: number;
  morningSlots: Array<PscTimeSlot> = [];
  afternoonSlots: Array<PscTimeSlot> = [];
  noTimeslots = false;
  slotInterval = 15;
  showHideShowAllButton = false;
  showHideAllMobileMorningButton = false;
  showHideAllMobileAfternoonButton = false;
  availApptsAtLocationAria = null;
  @Output() selectedTime = new EventEmitter();
  @Output() enableContinue = new EventEmitter();
  @Input() pscName = '';
  @Input() set timeSlots(timeSlots: PscFullDaySlots) {
    this.calculateSlotInterval(timeSlots);
    this.setSlots(timeSlots);
    this.setAvailableSlots();
  }

  @Input() set active(active) {
    if (!active.active) {
     // this.timeSelected = active.active;
    }
  }

  @Input() set existingAppointmentTime(existingAppointmentTime) {
    if (existingAppointmentTime) {
      this.timeSelected = existingAppointmentTime;
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.currentWindowWidth = window.innerWidth;
  }

  constructor( private i18n: I18n, private pscSlotService: PscSlotService,private uiPropertyService: PropertiesService) { }

  ngOnInit() {
    this.availApptsAtLocationAria = this.i18n('available appointment times at '+ this.pscName);
    this.currentWindowWidth = window.innerWidth;
    if (this.timeSelected) { // time is set due to existing appointment
      this.enableContinue.emit(true);
    }
  }

  selectTime(timeSlot, event) {
    event.stopPropagation();
    event.preventDefault();
    this.timeSelected = this.timeSelected === timeSlot ? null : timeSlot;
    if (this.timeSelected) {
      this.selectedTime.emit(timeSlot);
    } else {
      this.selectedTime.emit(null);
    }
  }

  calculateSlotInterval(timeSlots: PscFullDaySlots) {
    if (timeSlots && timeSlots.pscMorningTime && timeSlots.pscMorningTime.length > 0) {
      if (timeSlots.pscMorningTime.length > 1) {
        this.slotInterval = this.pscSlotService.getTimeDifference(timeSlots.pscMorningTime);
      }
    } else if (timeSlots && timeSlots.pscAfternoonTime && timeSlots.pscAfternoonTime.length > 0) {
      if (timeSlots.pscAfternoonTime.length > 1) {
        this.slotInterval = this.pscSlotService.getTimeDifference(timeSlots.pscAfternoonTime);
      }
    } else {
      this.noTimeslots = true;
    }
  }

  setSlots(timeSlots: PscFullDaySlots) {
    this.morningSlots = this.pscSlotService.getFormattedMorningTimeSlots(timeSlots);
    this.afternoonSlots = this.pscSlotService.getFormattedAfternoonTimeSlots(timeSlots);
  }

  setAvailableSlots() {
    this.showHideButtons();
    this.morningAvailableSlots = (this.morningSlots && this.morningSlots.length > 0)
      ? this.morningSlots.filter(slot => slot.available === SlotAvailableType.available).length : 0;
    this.afternoonAvailableSlots = (this.afternoonSlots && this.afternoonSlots.length > 0)
      ? this.afternoonSlots.filter(slot => slot.available === SlotAvailableType.available).length : 0;
    this.bothMorningAfternoonAvailableSlots = this.morningAvailableSlots + this.afternoonAvailableSlots;
  }


  showHideButtons() {
    // if (this.slotInterval === 15) {
    if (this.slotInterval) {
      const displayCount = (60 / this.slotInterval) * 2;
      this.showHideShowAllButton = (this.morningSlots.length > displayCount || this.afternoonSlots.length > displayCount);
      this.showHideAllMobileMorningButton = this.morningSlots.length > displayCount;
      this.showHideAllMobileAfternoonButton = this.afternoonSlots.length > displayCount;
    }
    // } else {
    //   this.showHideShowAllButton = (this.morningSlots.length > 12 || this.afternoonSlots.length > 12);
    //   this.showHideAllMobileMorningButton = this.morningSlots.length > 8;
    //   this.showHideAllMobileAfternoonButton = this.afternoonSlots.length > 8;
    // }
  }

  isShowAll() {
    this.showAll = !this.showAll;
    if(this.showAll) {
      setTimeout( () => {
        if(document.getElementById(`show-less-timeSlots-button${this.pscName}`)) {
          document.getElementById(`show-less-timeSlots-button${this.pscName}`).focus();
        }
      }, 100);
    } else {
      setTimeout( () => {
        if(document.getElementById(`show-more-timeSlots-button${this.pscName}`)) {
          document.getElementById(`show-more-timeSlots-button${this.pscName}`).focus() ;
        }
      }, 100);

    }
  }
}
