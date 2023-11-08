import { Injectable } from '@angular/core';
import { TealiumUtagService } from 'app/utag.service';

@Injectable({
  providedIn: 'root'
})
export class TealiumAnalyticsService {

  constructor( private tealiumUtagService: TealiumUtagService
    ) { }

  tealiumView(data): void {
    // const data = {'tealium_event': 'account_view', customer_id:'34256'};
    this.tealiumUtagService.view(data);
  }
  tealiumLink(data): void {
    this.tealiumUtagService.link(data);
  }
}
