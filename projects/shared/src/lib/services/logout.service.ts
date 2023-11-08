import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { PropertiesService } from './properties.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  constructor(private propertiesService: PropertiesService) { }

  logout() {
    return combineLatest(
      this.propertiesService.getCITSite(''),
      this.propertiesService.getMyquestSite(''),
      this.propertiesService.getAppointmentLogoutLink()
    ).subscribe(url => {
      url.forEach(el => {
        const iframe = document.createElement('iframe');
        iframe.src = `${el}logout`;
        iframe.hidden = true;
        document.body.appendChild(iframe);
      });
      setTimeout(() => {
        window.location.href = `${window.location.origin}/logout`;
      }, 300);
    });
  }
}
