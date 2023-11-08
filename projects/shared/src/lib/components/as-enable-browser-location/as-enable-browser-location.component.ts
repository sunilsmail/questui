import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { UserLocation } from 'shared/models';
import { UserCurrentLocationService } from 'shared/services/user-current-location.service';

@Component({
  selector: 'as-enable-browser-location',
  templateUrl: './as-enable-browser-location.component.html',
  styleUrls: ['./as-enable-browser-location.component.scss']
})
export class AsEnableBrowserLocationComponent implements OnInit {
  loading = false;
  showError = false;
  @Input() useDefaultOnError = true;
  @Output() locationChanged = new EventEmitter<UserLocation>();

  constructor(private currentLocationService: UserCurrentLocationService) { }

  ngOnInit() {
  }

  getUserLocation() {
    this.loading = true;
    this.currentLocationService.getCurrentPosition(this.useDefaultOnError).subscribe(value => {
      this.loading = false;
      this.showError = !value;
      if (value) {
        this.locationChanged.emit(value);
      }
    });
  }

}
