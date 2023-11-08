import { Injectable } from '@angular/core';
import { of, BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { PersonalData } from 'shared/models';
import {
  ActionName, AppName,
  ClinicalTrailsSignupRequest,
  HipaaAuthorizationMetricsRequest, ViewName
} from 'shared/models/clinical-trails-signup-req';
import { formatPhone, getClinicalTrailsFormatGender, getValueIfNull } from 'shared/utils/util';
import { ApiService } from '../api.service';
import { DateService } from '../date.service';

@Injectable({
  providedIn: 'root'
})
export class ClinicalTrailsService {

  serverUrl = '/guest';
  showReviewSection = false;
  signedUser = {
    firstName: null,
    lastName: null
  };

  trackClinicalTrails = new HipaaAuthorizationMetricsRequest();
  signedHipaa = false;

  constructor(private api: ApiService,
    private dateService: DateService) {

  }

  /** Variable declaration START*/
  private enableClinicalTrails = new ReplaySubject<boolean>(1);
  enableClinicalTrails$ = this.enableClinicalTrails.asObservable();

  private clinicalTrailsSelection = new ReplaySubject<boolean>(1);
  clinicalTrailsSelection$ = this.clinicalTrailsSelection.asObservable();

  private showReview = new BehaviorSubject<boolean>(false);
  showReview$ = this.showReview.asObservable();

  private disableClinicalTrails = new ReplaySubject<boolean>();
  disableClinicalTrails$ = this.disableClinicalTrails.asObservable();

  /** Variable declaration END*/

  /** Method declaration START*/

  setShowReview(value: boolean) {
    this.showReview.next(value);
  }
  getShowReview(): Observable<boolean> {
    return this.showReview$;
  }

  setDisableClinicalTrails(value: boolean) {
    this.disableClinicalTrails.next(value);
  }

  getDisableClinicalTrails(): Observable<boolean> {
    return this.disableClinicalTrails$;
  }

  setClinicalTrails(value: boolean) {
    this.trackClinicalTrails.showHipaaDialog = value;
    this.enableClinicalTrails.next(value);
  }
  getClinicalTrails(): Observable<boolean> {
    return this.enableClinicalTrails$;
  }

  setClinicalTrailsSelection(value: boolean) {
    // this.trackClinicalTrails.selfAppointment = value;
    this.trackClinicalTrails.hipaaOptin = value;
    this.clinicalTrailsSelection.next(value);
  }

  getClinicalTrailsSelection(): Observable<boolean> {
    return this.clinicalTrailsSelection$;
  }

  getClinicalTrailsApi(): Observable<boolean> {
    return this.api.get<boolean>(`${this.serverUrl}/enableClinicalTrails`);
  }

  signClinicalTrails(requestBody: PersonalData) {
    this.signedHipaa = true;
    return this.api.post(`${this.serverUrl}/hipaaAuthorization`, this.formatRequest(requestBody));
  }

  formatRequest(data: PersonalData): ClinicalTrailsSignupRequest {
    try {
      const req: ClinicalTrailsSignupRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: this.dateService.toDate(data.dateOfBirth),
        email: data.email,
        gender: getClinicalTrailsFormatGender(data?.gender?.toLowerCase()),
        city: data?.patientAddressInfo.city,
        state: data?.patientAddressInfo.state,
        zipCode: data?.patientAddressInfo?.zipCode?.slice(0, 5),
        primaryPhoneNumber: data.isMobile === 'Landline' ? formatPhone(data.phone) : null,
        mobilePhoneNumber: data.isMobile === 'Mobile' ? formatPhone(data.phone) : null,
        hipaaAuthorizationDate: null,
        addressLine1: data?.patientAddressInfo.address1,
        addressLine2: data?.patientAddressInfo.address2,
        empiId: null,
        raceDesc: data.race,
        ethnicityDesc: data.ethnicity,
        channel: AppName.ApptSchedular,
        ...this.signedUser,
        subDateAndTime: this.dateService.getCurrentDateWithTimeZoneForStandAloneHipaa()
      };
      return req;
    } catch (ex) {
      return null;
    }
  }

  logClinicalTrailsMetrics() {
    if (this.trackClinicalTrails.showHipaaDialog) {
      return this.api.post<boolean>(`${this.serverUrl}/hipaaAuthorizationMetrics`, this.getMetricsData());
    }
    return of(null);
  }


  getMetricsData() {
    const request: HipaaAuthorizationMetricsRequest = {
      viewName: ViewName.whoIsVisiting,
      showHipaaDialog: getValueIfNull(this.trackClinicalTrails.showHipaaDialog),
      selfAppointment: this.trackClinicalTrails.someoneElse ?
        !this.trackClinicalTrails.someoneElse : this.trackClinicalTrails.selfAppointment,
      hipaaOptin: getValueIfNull(this.trackClinicalTrails.hipaaOptin),
      firstName: this.signedUser.firstName,
      lastName: this.signedUser.lastName,
      someoneElse: getValueIfNull(this.trackClinicalTrails.someoneElse)
    };
    return request;
  }


  /** Method declaration END*/
}
