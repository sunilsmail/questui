import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ReasonCategory, ReasonEditState } from 'shared/models/reason-category';
import { EorderAppointmentData, EorderCreateAppointmentResponse,
  EorderInsuranceInformation, EorderModifyAppointmentData, EorderPersonalInformation} from '../../models/eorder';

@Injectable({
  providedIn: 'root'
})
export class EorderDataService {
  private VerifyIdentitySubject = new ReplaySubject<any>(1);
  verifyIdentity$ = this.VerifyIdentitySubject.asObservable();
  private appointmentDataSubject = new ReplaySubject<EorderAppointmentData>(1);
  appointmentData$ = this.appointmentDataSubject.asObservable();
  private encounterInfoSubject = new ReplaySubject(1);
  encounterInfo$ = this.encounterInfoSubject.asObservable();
  private personalInformationSubject = new ReplaySubject<EorderPersonalInformation>(1);
  personalData$ = this.personalInformationSubject.asObservable();
  private insuranceInformationSubject = new ReplaySubject<EorderInsuranceInformation>(1);
  insuranceData$ = this.insuranceInformationSubject.asObservable();
  private appointmentNavigationSubject = new ReplaySubject(1);
  appointmentNavigation$ = this.appointmentNavigationSubject.asObservable();
  isInFLow = false;
  private previousPageSubject = new ReplaySubject<any>(1);
  previousPageSubject$ = this.previousPageSubject.asObservable();
  private blnShowLocErrorSubject = new ReplaySubject<boolean>(1);
  blnShowLocErrorSubject$ = this.blnShowLocErrorSubject.asObservable();
  private labCardLocationSearchSubject = new ReplaySubject<boolean | {}>(1);
  labCardLocation$ = this.labCardLocationSearchSubject.asObservable();
  private eorderNewApptDataSubject: Subject<EorderCreateAppointmentResponse> = new ReplaySubject(1);
  eorderNewApptData$: Observable<EorderCreateAppointmentResponse> = this.eorderNewApptDataSubject.asObservable();
  private confirmationCodeSubject = new ReplaySubject<any>(1);
  confirmationCodeSubject$ = this.confirmationCodeSubject.asObservable();
  private priceEstimateSubject = new ReplaySubject<any>(1);
  priceEstimateSubject$ = this.priceEstimateSubject.asObservable();
  private eorderBlnEditReasonSubject = new ReplaySubject<ReasonEditState>(1);
  eorderBlnEditReasonSubject$ = this.eorderBlnEditReasonSubject.asObservable();
  private reasonDataSubject = new ReplaySubject<ReasonCategory>(1);
  reasonData$ = this.reasonDataSubject.asObservable();
  private isAlternateFlowSubject = new ReplaySubject<any>(1);
  alternateFlow$ = this.isAlternateFlowSubject.asObservable();
  private resetValue = new ReplaySubject<any>(1);
  resetValue$ = this.resetValue.asObservable();
  private testsDataSubject: Subject<ReasonCategory[]> = new ReplaySubject(1);
  testsData$: Observable<ReasonCategory[]> = this.testsDataSubject.asObservable();
  private selectedReasonSubject = new ReplaySubject<ReasonCategory>(1);
  selectedReasonEditSubject$ = this.selectedReasonSubject.asObservable();
  private facilityServiceId = new ReplaySubject<any>(1);
  facilityServiceId$ = this.facilityServiceId.asObservable();
  private reasonNotSupportedErrorSubject = new ReplaySubject<boolean>(1);
  reasonNotSupportedErrorSubject$ = this.reasonNotSupportedErrorSubject.asObservable();
  private reasonTypeSubject = new ReplaySubject(1);
  reasonTypeSubject$ = this.reasonTypeSubject.asObservable();
  private facilityServiceTypeSubject = new ReplaySubject();
  facilityServiceTypeSubject$ = this.facilityServiceTypeSubject.asObservable();
  private altFacilityServiceIDSubject = new ReplaySubject();
  altFacilityServiceIDSubject$ = this.altFacilityServiceIDSubject.asObservable();
  private eorderAltEditFlowSubject = new ReplaySubject();
  eorderAltEditFlowSubject$ = this.eorderAltEditFlowSubject.asObservable();
  private eOrderFlowActivatedSubject: ReplaySubject<boolean> = new ReplaySubject(1);
  eOrderFlowActivatedSubject$ = this.eOrderFlowActivatedSubject.asObservable();
  private appointmentDataSubjectForEdit: Subject<EorderModifyAppointmentData> = new ReplaySubject(1);
  appointmentDataForEdit$: Observable<EorderModifyAppointmentData> = this.appointmentDataSubjectForEdit.asObservable();
  isEditFromEorderSummary: boolean;
  public expiryType: string;
  constructor() { }
  isEorderFLow = false;
  ispreviousUrlForDemographics = false;
  setEncounterInfo(info: any) {
    this.isEorderFLow = true;
    this.encounterInfoSubject.next(info);
  }

  getEncounterInfo() {
    return this.encounterInfo$;
  }

  setVerifyIdentityData(data:any) {
    this.VerifyIdentitySubject.next(data);
  }

  getVerifyIdentityData() {
    return this.verifyIdentity$;
  }

  setEorderFlow(status: boolean) {
    this.isEorderFLow = status;
  }

  isEorderFlowActivated(status: boolean) {
    this.eOrderFlowActivatedSubject.next(status);
  }

  setappointmentData(appointment: EorderAppointmentData) {
    this.isEorderFLow = true;
    this.appointmentDataSubject.next(appointment);
  }

  getappointmentData(): Observable<EorderAppointmentData> {
    return this.appointmentData$;
  }
  setPersonalInformation(personaldata: EorderPersonalInformation) {
    this.isEorderFLow = true;
    this.personalInformationSubject.next(personaldata);
  }
  getPersonalInformation(): Observable<EorderPersonalInformation> {
    return this.personalData$;
  }
  setPreviousUrlDemographic(status:boolean)  {
    this.ispreviousUrlForDemographics = status;
  }
  setInsuranceInformation(insuranceData: EorderInsuranceInformation) {
    this.isEorderFLow = true;
    this.insuranceInformationSubject.next(insuranceData);
  }
  getInsuranceInformation(): Observable<EorderInsuranceInformation> {
    return this.insuranceData$;
  }
  setAppointmentNavigation(status: boolean) {
    this.appointmentNavigationSubject.next(status);
  }
  getAppointmentNavigation() {
    return this.appointmentNavigation$;
  }

  setPreviousPage(data: string) {
    this.isInFLow = true;
    this.previousPageSubject.next(data);
  }
  getPreviousPage() {
    return this.previousPageSubject$;
  }
  setblnShowLocError(blnedit: boolean) {
    this.isInFLow = true;
    this.blnShowLocErrorSubject.next(blnedit);
  }

  getblnShowLocError() {
    return this.blnShowLocErrorSubject$;
  }
  setlabCardLocationSearch(labcardData: boolean | {}) {
    this.labCardLocationSearchSubject.next(labcardData);
  }
  getlabCardLocationSearch() {
    return this.labCardLocation$;
  }
  setEorderNewapptData(newAppointment: EorderCreateAppointmentResponse) {
    this.isInFLow = true;
    this.eorderNewApptDataSubject.next(newAppointment);
  }
  getEorderNewapptData(): Observable<EorderCreateAppointmentResponse> {
    return this.eorderNewApptData$;
  }
  setConfirmationCode(data:string){
    this.confirmationCodeSubject.next(data);
  }
  getConfirmationCode() {
    return this.confirmationCodeSubject$;
  }
  setPriceEstimate(data:Number){
    this.priceEstimateSubject.next(data);
  }
  getPriceEstimation() {
    return this.priceEstimateSubject$;
  }
  setblnEditReasonData(blnedit: boolean, route: string = null) {
    this.isEorderFLow = true;
    this.eorderBlnEditReasonSubject.next({ blnedit, route });
  }

  getblnEditReasonData(): Observable<ReasonEditState> {
    return this.eorderBlnEditReasonSubject$;
  }


  setAlternateFlow(value: boolean){
    this.isAlternateFlowSubject.next(value);
  }
  getAlternateFlow(){
    return this.alternateFlow$;
  }
  setReasonData(reason: ReasonCategory) {
    this.isEorderFLow = true;
    this.reasonDataSubject.next(reason);
  }
  getReasonData(): Observable<ReasonCategory> {
    return this.reasonData$;
  }

  setReasonValue(data) {
    this.resetValue.next(data);
  }

  getReasonValue() {
    return this.resetValue$;
  }

  setTestsData(test: ReasonCategory[]) {
    this.isEorderFLow = true;
    this.testsDataSubject.next(test);
  }
  getTestsData(): Observable<ReasonCategory[]> {
    return this.testsData$;
  }
  // Edit Scenario's
  setEditReason(reason: ReasonCategory) {
    this.isEorderFLow = true;
    this.selectedReasonSubject.next(reason);
  }
  getEditReason(): Observable<ReasonCategory> {
    return this.selectedReasonEditSubject$;
  }
  setReasonType(type) {
    this.reasonTypeSubject.next(type);
  }

  getReasonType() {
    return this.reasonTypeSubject$;
  }
  setFacilityServiceId(id:number[]) {
    this.facilityServiceId.next(id);
  }

  getFacilityServiceId() {
    return this.facilityServiceId$;
  }
  setReasonNotSupportedError(lnedit: boolean) {
    this.reasonNotSupportedErrorSubject.next(lnedit);
  }

  getReasonNotSupportedError() {
    return this.reasonNotSupportedErrorSubject$;
  }
  setFacilityServiceType(value) {
    this.facilityServiceTypeSubject.next(value);
  }
  getFacilityServiceType() {
    return this.facilityServiceTypeSubject$;
  }
  setAltFacilityServiceID(value){
    this.altFacilityServiceIDSubject.next(value);
  }
  getAltFacilityServiceID() {
    return this.altFacilityServiceIDSubject$;
  }
  setAltEditFlow(lnedit: boolean) {
    this.eorderAltEditFlowSubject.next(lnedit);
  }

  getAltEditFlow() {
    return this.eorderAltEditFlowSubject$;
  }
  setappointmentDataForEdit(appointment: EorderModifyAppointmentData) {
    this.isInFLow = true;
    this.appointmentDataSubjectForEdit.next(appointment);
  }

  getappointmentDataForEdit(): Observable<EorderModifyAppointmentData> {
    return this.appointmentDataForEdit$;
  }
}
