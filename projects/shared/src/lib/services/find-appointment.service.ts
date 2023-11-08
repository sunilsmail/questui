import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentDetails } from 'shared/models/appointment';
import { VerifyIdentity } from 'shared/models/verify-Identity';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FindAppointmentService {
  appointmentDetails: AppointmentDetails;
  filterCovidTest = false;
  covidIds = [];

  constructor(private api: ApiService) {
  }
  verifyAppointmentId(appointmentId: string, isAuthenticated: boolean): Observable<AppointmentDetails> {
    this.api.clearCache();
    if (isAuthenticated) {
      return this.api.get(`/api/getAppointment/${appointmentId}`);
    } else {
      return this.api.get(`/guest/getAppointment/${appointmentId}`);
    }
  }

  verifyIdentity(object: VerifyIdentity): Observable<any> {
    return this.api.post('/guest/verifyAppointmentPhone', object);
  }
  // getAppointmentWithInsurance(confirmation: string) {
  //   return this.api.get('/api/getAppointment' + '/'+confirmation);
  // }
}
