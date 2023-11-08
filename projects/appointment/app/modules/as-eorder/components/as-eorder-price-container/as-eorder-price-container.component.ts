import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PropertiesService } from 'shared/services/properties.service';

@Component({
  selector: 'as-eorder-price-container',
  templateUrl: './as-eorder-price-container.component.html',
  styleUrls: ['./as-eorder-price-container.component.scss']
})
export class AsEorderPriceContainerComponent implements OnInit {

  easypayEnhancementF411$: Observable<boolean>;

  constructor(private propertiesService: PropertiesService) {
  }

  ngOnInit() {
    this.easypayEnhancementF411$ = this.propertiesService.getEasyPayEnhancementF411();
  }

}
