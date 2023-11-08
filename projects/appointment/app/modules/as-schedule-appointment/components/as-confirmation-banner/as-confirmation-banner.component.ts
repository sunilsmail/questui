import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PropertiesService } from 'shared/services/properties.service';

@Component({
  selector: 'as-confirmation-banner',
  templateUrl: './as-confirmation-banner.component.html',
  styleUrls: ['./as-confirmation-banner.component.scss']
})
export class AsConfirmationBannerComponent implements OnInit {

  ctcConnectUrl: string;

  constructor(private propertiesService: PropertiesService) { }

  ngOnInit(): void {
    console.log('Created banner component');
    this.propertiesService.getCtcConnectUrl().subscribe(url => this.ctcConnectUrl = url);
  }

  closeBanner(){
    const bannerSection= document.getElementById('clinical-trails-banner');
    if (bannerSection) {
      bannerSection.parentNode.removeChild(bannerSection);
    }
 }

  redirectToEloqua() {
    window.open(this.ctcConnectUrl, '_blank');
}
}
