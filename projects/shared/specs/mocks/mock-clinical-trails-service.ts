import { of, Observable } from 'rxjs';
import { PersonalData } from 'shared/models';
import { HipaaAuthorizationMetricsRequest } from 'shared/models/clinical-trails-signup-req';

export class MockClinicalTrailsService {
  showReviewSection = false;
  signedUser = {
    firstName: null,
    lastName: null
  };

  trackClinicalTrails = new HipaaAuthorizationMetricsRequest();
  getClinicalTrailsApi() {
    return of(true);
  }

  setClinicalTrails(value: boolean) {
  }

  getClinicalTrails(): Observable<boolean> {
    return of(true);
  }

  setClinicalTrailsSelection(value: boolean) {
  }

  getClinicalTrailsSelection(): Observable<boolean> {
    return of(true);
  }

  setShowReview(value: boolean) { }

  getShowReview(): Observable<boolean> {
    return of(true);
  }

  setDisableClinicalTrails(value: boolean) { }

  getDisableClinicalTrails(): Observable<boolean> {
    return of(true);
  }

  signClinicalTrails(requestBody: PersonalData) {
    return {
      'sprinttId': '123456',
      'receipt': '1234567890'
    };
  }

  logClinicalTrailsMetrics() {

  }

  formatRequest(data: PersonalData){
    return {
      'firstName': 'james',
      'lastName': 'denny',
      'dateOfBirth': '2000-01-01',
      'email': 'james.x.denny@quest.com',
      'gender': 'M',
      'city': 'Dallas',
      'state': 'TX',
      'zipCode': 75219,
      'primaryPhoneNumber': '201-889-3458',
      'mobilePhoneNumber': null,
      'hipaaAuthorizationDate': null,
      'addressLine1': '3 Rosewood Ave',
      'addressLine2': null,
      'empiId': null,
      'raceDesc': null,
      'ethnicityDesc': null,
      'channel': 'ApptSchedular',
      'date': '01/04/2023',
      'subDateAndTime': '01/04/2023 2:38 PM IST'
  };
  }

  getMetricsData() {
    return {
      'viewName': 'who is visiting',
      'showHipaaDialog': true,
      'selfAppointment': true,
      'someoneElse': false,
      'hipaaOptin': true,
      'firstName': 'james',
      'lastName': 'denny'
    };
  }
}
