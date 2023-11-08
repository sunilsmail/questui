import { of } from 'rxjs';

export const MockCancelAppointmentResponse = {
    'data': 'success'
};


export class MockCancelAppointmentService {
   cancelAppointment() {
       return of(MockCancelAppointmentResponse);
   }
}
