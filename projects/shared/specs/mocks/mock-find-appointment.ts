import { of } from 'rxjs';
import { AppointmentDetails } from 'shared/models/appointment';


export const  mockAppointmentdata = {
        'siteCode' : 'QFR',
        'firstName' : 'UPCOMINGPRINT',
        'facilityServiceId' : [ 1 ],
        'appointmentDate' : '2019-15-19',
        'appointmentTime' : '00:15',
        'labCard' : false
    };


export class MockFindAppointmentService {
appointmentId = 'asdfgh';
appointmentDetails: AppointmentDetails = new AppointmentDetails();
verifyAppointmentId() {
    return of(mockAppointmentdata);
}
verifyIdentity() {
    return of(null);
}

}


