import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PropertiesService } from 'shared/services/properties.service';

@Component({
  selector: 'as-confirmation-mobile-banner',
  templateUrl: './as-confirmation-mobile-banner.component.html',
  styleUrls: ['./as-confirmation-mobile-banner.component.scss']
})
export class AsConfirmationMobileBannerComponent implements OnInit {

  @Output() bannerStateOpen = new EventEmitter<string>();

  ctcConnectUrl: string;

  constructor(private propertiesService: PropertiesService) { }

  ngOnInit(): void {
    this.propertiesService.getCtcConnectUrl().subscribe(url => this.ctcConnectUrl = url);
  }

  openBanner() {
    this.bannerStateOpen.emit('out');
  }
  redirectToEloqua() {
    window.open(this.ctcConnectUrl, '_blank');
  }

}
