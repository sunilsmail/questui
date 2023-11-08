export class CreateModifyAppointmentTeliumEvent {
    appointment_date: string;
    appointment_location_city: string;
    appointment_location_name: string;
    appointment_location_state: string;
    appointment_location_zip: string;
    appointment_status: string;
    appointment_type: string;
    customer_account_type: string;
    customer_email: string;
    customer_id: string;
    customer_login_status: string;
    customer_postal_code: string;
    customer_segment: string;
    tealium_event: string;
}

export class ErrorOnCreate {
    // customer_id: string;
    customer_login_status: string;
    customer_segment: string;
    error_code: string;
    error_name: string;
    error_type: string;
    tealium_event: string;
}

export enum UserStatus {
    authUser = 'logged in',
    guestUser = 'guest'
}

