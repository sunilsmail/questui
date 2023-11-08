import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PropertiesService } from 'shared/services/properties.service';

@Component({
  selector: 'as-eorder-insurance-information-container',
  templateUrl: './as-eorder-insurance-container.component.html',
  styleUrls: ['./as-eorder-insurance-container.component.scss']
})
export class AsEorderInsuranceContainerComponent implements OnInit {

  mandatoryAddressF1687$: Observable<boolean>;

  constructor(private propertiesService: PropertiesService) {
  }

  ngOnInit() {
    this.mandatoryAddressF1687$ = this.propertiesService.getMandatoryAddressf1687();
  }

}
