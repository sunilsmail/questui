import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PropertiesService } from 'shared/services/properties.service';

@Component({
  selector: 'as-secondary-insurance-container',
  templateUrl: './as-secondary-insurance-container.component.html',
  styleUrls: ['./as-secondary-insurance-container.component.scss']
})
export class AsSecondaryInsuranceContainerComponent implements OnInit {

  mandatoryAddressF1687$: Observable<boolean>;

  constructor(private propertiesService: PropertiesService) {
  }

  ngOnInit() {
    this.mandatoryAddressF1687$ = this.propertiesService.getMandatoryAddressf1687();
  }

}
