import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PropertiesService } from 'shared/services/properties.service';

@Component({
  selector: 'as-insurance-information-container',
  templateUrl: './as-insurance-container.component.html',
  styleUrls: ['./as-insurance-container.component.scss']
})
export class AsInsuranceContainerComponent implements OnInit {

  mandatoryAddressF1687 = null;

  constructor(private propertiesService: PropertiesService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.route.snapshot && this.route.snapshot.data) {
      this.mandatoryAddressF1687 = this.route.snapshot.data.f1687;
    }
  }

}
