import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'as-appt-scheduler-container',
  templateUrl: './as-appt-scheduler-container.component.html',
  styleUrls: ['./as-appt-scheduler-container.component.scss']
})
export class AsApptSchedulerContainerComponent implements OnInit {

  googlemapsOptimizationF4191 = null;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.route.snapshot && this.route.snapshot.data) {
      this.googlemapsOptimizationF4191 = this.route.snapshot.data.f4191;
    }
  }

}
