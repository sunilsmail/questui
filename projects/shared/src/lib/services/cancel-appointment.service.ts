import { Injectable } from '@angular/core';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class CancelAppointmentService {

  constructor(private apiService: ApiService) { }

  cancelAppointment(request: any) {
    return this.apiService.post('guest/cancelAppointment', request);
  }
}
