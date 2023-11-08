import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { EcheckinInsuranceInformation, EcheckinPersonalInformation } from 'shared/models/echeckin';

@Injectable({
  providedIn: 'root'
})
export class EcheckinDataService {
  private encounterInfoSubject = new ReplaySubject(1);
  encounterInfo$ = this.encounterInfoSubject.asObservable();
  private personalInformationSubject = new ReplaySubject<EcheckinPersonalInformation>(1);
  personalData$ = this.personalInformationSubject.asObservable();
  private insuranceInformationSubject = new ReplaySubject<EcheckinInsuranceInformation>(1);
  insuranceData$ = this.insuranceInformationSubject.asObservable();
  private insuranceUpdate = new ReplaySubject<boolean>(1);
  insuranceUpdate$ = this.insuranceUpdate.asObservable();
  private tokenNotFound = new ReplaySubject(1);
  tokenNotFound$ = this.tokenNotFound.asObservable();
  token: string;

  constructor() { }
  isEcheckinFLow = false;
  ispreviousUrlForDemographics = false;

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }
  setEncounterInfo(info: any) {
    this.isEcheckinFLow = true;
    this.encounterInfoSubject.next(info);
  }

  getEncounterInfo() {
    return this.encounterInfo$;
  }

  setEorderFlow(status: boolean) {
    this.isEcheckinFLow = status;
  }

  setPersonalInformation(personaldata: EcheckinPersonalInformation) {
    this.isEcheckinFLow = true;
    this.personalInformationSubject.next(personaldata);
  }
  getPersonalInformation(): Observable<EcheckinPersonalInformation> {
    return this.personalData$;
  }
  setPreviousUrlDemographic(status:boolean)  {
    this.ispreviousUrlForDemographics = status;
  }
  setInsuranceInformation(insuranceData: EcheckinInsuranceInformation) {
    this.isEcheckinFLow = true;
    this.insuranceInformationSubject.next(insuranceData);
  }
  getInsuranceInformation(): Observable<EcheckinInsuranceInformation> {
    return this.insuranceData$;
  }
  setInsuranceUpdate(status: boolean) {
    this.insuranceUpdate.next(status);
  }
  getInsuranceUpdate() {
    return this.insuranceUpdate$;
  }
  setTokenNotFound(status: boolean) {
    this.tokenNotFound.next(status);
  }
  getTokenNotFound() {
    return this.tokenNotFound$;
  }
}
