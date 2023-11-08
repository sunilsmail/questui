import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'as-psc-time-slot',
  templateUrl: './as-psc-time-slot.component.html',
  styleUrls: ['./as-psc-time-slot.component.scss']
})
export class AsPscTimeSlotComponent implements OnInit {
  @Output() selectedTime = new EventEmitter();
  @Output() enableContinue = new EventEmitter();

  @Input() set timeSlots(timeSlots: Array<any>) {
    this._timeSlots = timeSlots;
    this.availableSlots = timeSlots && timeSlots.filter((slots) => {
      return slots.available === true;
    });
  }
  @Input() set active(active) {
    if (!active.active) {
      this.timeSelected = active.active;
    }
  }

  @Input() set existingAppointmentTime(existingAppointmentTime) {
    if(existingAppointmentTime) {
      this.timeSelected = existingAppointmentTime;
    }
  }
  _timeSlots: any[];
  availableSlots: any[];

  timeSelected = null;
  show: boolean;

  constructor() { }

  ngOnInit() {
    if(this.timeSelected) { // time is set due to existing appointment
      this.enableContinue.emit(true);
    }
  }

  selectTime(timeSlot) {
    this.timeSelected = this.timeSelected === timeSlot ? null : timeSlot;
    if (this.timeSelected) {
      this.selectedTime.emit(timeSlot);
    } else {
      this.selectedTime.emit(null);
    }
  }

  showmore() {
    this.show = !this.show;
  }

}
