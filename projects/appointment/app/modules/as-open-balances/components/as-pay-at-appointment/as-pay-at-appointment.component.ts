import { Component, OnInit } from '@angular/core';
import { default as homeContent } from '../../../../../assets/content.json';

@Component({
  selector: 'as-pay-at-appointment',
  templateUrl: './as-pay-at-appointment.component.html',
  styleUrls: ['./as-pay-at-appointment.component.scss'],
})
export class AsPayAtAppointmentComponent implements OnInit {
  content = homeContent;

  constructor() { }

  ngOnInit() {}

  returnToHome() {
    location.href = '/as-home';
  }
}
