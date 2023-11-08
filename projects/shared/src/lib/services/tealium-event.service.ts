import { Injectable } from '@angular/core';
import { UserDemographic } from 'shared/models';
import { Appointment, AppointmentDetails, ModifyAppointmentData, ModifyCancelAppointmentData } from 'shared/models/appointment';
import { CreateModifyAppointmentTeliumEvent, ErrorOnCreate, UserStatus } from 'shared/models/appt-tealium';

@Injectable({
  providedIn: 'root'
})

export class TealiumEventService {
  constructor() { }


  createAppointment(data: any, demodata: UserDemographic, loginId: any, isAuthenticated: boolean, location_enabled_flag ):
    CreateModifyAppointmentTeliumEvent {
      let fullYear;
    if (data&&demodata) {
        fullYear = new Date(demodata.dateOfBirth).getFullYear();
    }
    if (data) {
      const returnData: CreateModifyAppointmentTeliumEvent = {
        ...data,
        appointment_status: 'Confirmed',
        appointment_type: 'Testing',
        customer_account_type: isAuthenticated ? 'Existing' : 'New',
        customer_email: isAuthenticated ? demodata.email : null,
        // customer_id: isAuthenticated ? loginId : null,
        customer_login_status: isAuthenticated ? UserStatus.authUser : UserStatus.guestUser,
        customer_postal_code: isAuthenticated ? demodata.zipCode : null,
        customer_gender: isAuthenticated ? demodata.genderPreference : null,
        customer_sex: isAuthenticated ? demodata.sex : null,
        customer_year_of_birth: JSON.stringify(fullYear) ? JSON.stringify(fullYear): null,
        location_enabled_flag: location_enabled_flag,
        customer_segment: 'Patient',
        tealium_event: 'appointment_scheduled'
      };
      return returnData;
    }
    return null;
  }

  modifyAppointment(data: any, demodata: UserDemographic, loginId: any, isAuthenticated: boolean, location_enabled_flag):
    CreateModifyAppointmentTeliumEvent {
      let fullYear;
    if (data&&demodata) {
        fullYear = new Date(demodata.dateOfBirth).getFullYear();
    }
    const returnData: CreateModifyAppointmentTeliumEvent = {
       ...data,
      appointment_status: 'Confirmed',
      appointment_type: 'Testing',
      customer_email: isAuthenticated ? demodata.email : null,
      // customer_id: isAuthenticated ? loginId : null,
      customer_login_status: isAuthenticated ? UserStatus.authUser : UserStatus.guestUser,
      customer_postal_code: isAuthenticated ? demodata.zipCode : null,
      customer_gender: isAuthenticated ? demodata.genderPreference : null,
      customer_sex: isAuthenticated ? demodata.sex : null,
      customer_year_of_birth: JSON.stringify(fullYear) ? JSON.stringify(fullYear): null,
      location_enabled_flag: location_enabled_flag,
      customer_segment: 'Patient',
      tealium_event: 'schedule_change_appointment'
    };
    return returnData;
  }

  eventError(err: any, loginId: any, isAuthenticated: boolean): ErrorOnCreate {
    // need to update below fields
    const retValue: ErrorOnCreate = {
      // customer_id: isAuthenticated ? loginId : null,
      customer_login_status: isAuthenticated ? 'logged in' : 'guest',
      customer_segment: 'Patient',
      error_code: '404',
      error_name: 'inactive account',
      error_type: 'user',
      tealium_event: 'error'
    };
    return retValue;
  }



}
