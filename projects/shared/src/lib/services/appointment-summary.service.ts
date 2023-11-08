import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentSummaryService {
  mockSummaryUrl = '/assets/summary.json';

  constructor(private api: ApiService) { }

  getAppointmentSummary() {
    return this.api.get(this.mockSummaryUrl);
  }
}
