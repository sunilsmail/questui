import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { InsuranceData, PersonalData, PscLocationAvailability } from 'shared/models';
import { AppState } from 'shared/models/app-state';
// tslint:disable-next-line: max-line-length
import { AppointmentData, CreateAppointmentResponse, ModifyAppointmentData, ModifyCancelAppointmentData } from 'shared/models/appointment';
import { ReasonCategory, ReasonEditState } from 'shared/models/reason-category';
import { VerifyIdentity } from 'shared/models/verify-Identity';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private reasonDataSubject = new ReplaySubject<ReasonCategory>(1);
  reasonData$ = this.reasonDataSubject.asObservable();
  private markerAddressSubject = new ReplaySubject<[]>(1);
  markerAddress$ = this.markerAddressSubject.asObservable();
  private verificationInfoSubject = new ReplaySubject(1);
  verificationInfo$ = this.verificationInfoSubject.asObservable();
  private testsDataSubject: Subject<ReasonCategory[]> = new ReplaySubject(1);
  testsData$: Observable<ReasonCategory[]> = this.testsDataSubject.asObservable();
  private personalDataSubject = new ReplaySubject<PersonalData>(1);
  personalData$ = this.personalDataSubject.asObservable();
  private insuranceDataSubject = new ReplaySubject<InsuranceData>(1);
  insuranceData$ = this.insuranceDataSubject.asObservable();
  private appointmentDataSubject = new ReplaySubject<AppointmentData>(1);
  appointmentData$ = this.appointmentDataSubject.asObservable();
  private newApptDataSubject: Subject<CreateAppointmentResponse> = new ReplaySubject(1);
  newApptData$: Observable<CreateAppointmentResponse> = this.newApptDataSubject.asObservable();
  private creatQuestAccount = new ReplaySubject(1);
  creatQuestAccount$ = this.creatQuestAccount.asObservable();
  private userLocation = new ReplaySubject(1);
  userLocation$ = this.userLocation.asObservable();
  isInFLow = false;
  private findLocationReasonSubject = new ReplaySubject(1);
  findLocationReason$ = this.findLocationReasonSubject.asObservable();
  private findLocationSelectedLocationSubject: Subject<PscLocationAvailability> = new ReplaySubject(1);
  findLocationSelectedLocation$: Observable<PscLocationAvailability> = this.findLocationSelectedLocationSubject.asObservable();
  private reasonTypeSubject = new ReplaySubject(1);
  reasonTypeSubject$ = this.reasonTypeSubject.asObservable();
  private selectedReasonSubject = new ReplaySubject<ReasonCategory>(1);
  selectedReasonEditSubject$ = this.selectedReasonSubject.asObservable();

  private blnEditReasonSubject = new ReplaySubject<ReasonEditState>(1);
  blnEditReasonSubject$ = this.blnEditReasonSubject.asObservable();


  private blnShowLocErrorSubject = new ReplaySubject<boolean>(1);
  blnShowLocErrorSubject$ = this.blnShowLocErrorSubject.asObservable();

  private reasonNotSupportedErrorSubject = new ReplaySubject<boolean>(1);
  reasonNotSupportedErrorSubject$ = this.reasonNotSupportedErrorSubject.asObservable();

  private appointmentDataSubjectForEdit: Subject<ModifyAppointmentData> = new ReplaySubject(1);
  appointmentDataForEdit$: Observable<ModifyAppointmentData> = this.appointmentDataSubjectForEdit.asObservable();

  private modifyAppointmentDataSubjectForEdit: Subject<ModifyCancelAppointmentData> = new ReplaySubject(1);
  modifyAppointmentDataForEdit$: Observable<ModifyCancelAppointmentData> = this.modifyAppointmentDataSubjectForEdit.asObservable();

  private reasonDataFindLocationSubject = new ReplaySubject(1);
  reasonDataFindLocation$ = this.reasonDataFindLocationSubject.asObservable();

  private locationFlowtoScheduleSubject = new ReplaySubject<boolean>(1);
  locationFlowtoScheduleSubject$ = this.locationFlowtoScheduleSubject.asObservable();

  private labCardLocationSearchSubject = new ReplaySubject<boolean>(1);
  labCardLocation$ = this.labCardLocationSearchSubject.asObservable();
  private locationFinderDetailsFlowtoReasonSubject = new ReplaySubject<boolean>(1);
  locationFinderDetailsFlowtoReasonSubject$ = this.locationFinderDetailsFlowtoReasonSubject.asObservable();

  // private fromLocationFinderScreen = new ReplaySubject<ReasonCategory>(1);
  // fromLocationFinderScreenSubject$ = this.fromLocationFinderScreen.asObservable();

  private previousPageSubject = new ReplaySubject<any>(1);
  previousPageSubject$ = this.previousPageSubject.asObservable();

  private findLocationFlowSubject = new ReplaySubject<boolean>(1);
  findLocationFlowSubject$ = this.findLocationFlowSubject.asObservable();


  private selectedLocationService = new ReplaySubject<string[]>(1);
  selectedLocationService$ = this.selectedLocationService.asObservable();

  private appState: AppState = {
    isReviewed: false,
  };

  private appStateSubject = new ReplaySubject<AppState>(1);
  appState$ = this.appStateSubject.asObservable();
  private paramSubject = new ReplaySubject<any>(1);
  paramSubject$ = this.paramSubject.asObservable();

  private resetValue = new ReplaySubject<any>(1);
  resetValue$ = this.resetValue.asObservable();

  private hideInsuranceInfo = new BehaviorSubject<any>(true);
  hideInsuranceInfo$ = this.hideInsuranceInfo.asObservable();

  locationFlowWithScheduleApp = false;
  setSceduleApp: boolean;
  setPeaceOfMindvalue: boolean;
  reasonCategory: string;
  queryParam: string;
  isSelectedPurchasedMyOwnTest = false;
  selectedTestForPurchasedMyOwnTest: ReasonCategory[] = [];
  isSelectedLocationPurchasedMyOwnTest = false;
  selectedTestForLocationPurchasedMyOwnTest: ReasonCategory[] = [];
  facilityServiceIds = [];
  private deepLinkparamSubject = new ReplaySubject<any>(1);
  deepLinkparamSubject$ = this.deepLinkparamSubject.asObservable();
  deepLinkReasonParam: string;
  deepLinkTestList: ReasonCategory[] = [];
  isDeepLinkFlow = false;
  defaultDeepLinkTest: ReasonCategory = new ReasonCategory();
  isDeepLinkHasLabCard = false;
  private deepLinkLabcardparamSubject = new ReplaySubject<any>(1);
  deepLinkLabcardparamSubject$ = this.deepLinkLabcardparamSubject.asObservable();
  isModifyCancel = false;
  isDeepLinkReasonServicesNotOffered = false;
  editScreenName: string;
  searchCovidAppointmentsBy: number;
  siteType: string;
  isMainCovidActiveInfectionSelected: boolean;
  private VerifyIdentitySubject = new ReplaySubject<any>(1);
  verifyIdentity$ = this.VerifyIdentitySubject.asObservable();
  selectedItemForApiCall: ReasonCategory;
  private covidSymptomsSubject = new ReplaySubject<any>(1);
  covidSymptomsSubject$ = this.covidSymptomsSubject.asObservable();

  private modifyInsuranceSubject = new BehaviorSubject<boolean>(false);
  modifyInsurance$ = this.modifyInsuranceSubject.asObservable();


  setdeepLinkLabcardFlag(data) {
    this.deepLinkLabcardparamSubject.next(data);
  }
  getdeepLinkLabcardFlag() {
    return this.deepLinkLabcardparamSubject$;
  }
  setDeepLinkReasonFlag(data) {
    this.isDeepLinkFlow = data;
    this.deepLinkparamSubject.next(data);
  }
  getDeepLinkReasonFlag() {
    return this.deepLinkparamSubject$;
  }
  constructor() {
  }
  setScheduleAppFlag(flag: boolean) {
    this.locationFlowWithScheduleApp = true;
    this.setSceduleApp = flag;
  }
  clearScheduleAppFlag(flag: boolean) {
    this.locationFlowWithScheduleApp = flag;
  }

  setReasonData(reason: ReasonCategory) {
    this.isInFLow = true;
    this.reasonDataSubject.next(reason);
  }

  getReasonData(): Observable<ReasonCategory> {
    return this.reasonData$;
  }

  setMarkerAddress(address: any) {
    this.isInFLow = true;
    this.markerAddressSubject.next(address);
  }

  getMarkerAddress(): Observable<[]> {
    return this.markerAddress$;
  }

  setVerificationInfo(info: VerifyIdentity) {
    this.isInFLow = true;
    this.verificationInfoSubject.next(info);
  }

  getVerificationInfo() {
    return this.verificationInfo$;
  }

  setTestsData(test: ReasonCategory[]) {
    this.isInFLow = true;
    this.testsDataSubject.next(test);
  }

  getTestsData(): Observable<ReasonCategory[]> {
    return this.testsData$;
  }

  setappointmentData(appointment: AppointmentData) {
    this.isInFLow = true;
    this.appointmentDataSubject.next(appointment);
  }

  getappointmentData(): Observable<AppointmentData> {
    return this.appointmentData$;
  }

  setNewapptData(newAppointment: CreateAppointmentResponse) {
    this.isInFLow = true;
    this.newApptDataSubject.next(newAppointment);
  }

  getNewapptData(): Observable<CreateAppointmentResponse> {
    return this.newApptData$;
  }

  setPersonalData(data: PersonalData) {
    this.isInFLow = true;
    this.personalDataSubject.next(data);
  }

  getPersonalData(): Observable<PersonalData> {
    return this.personalData$;
  }

  setVerifyIdentityData(data: any) {
    this.VerifyIdentitySubject.next(data);
  }

  getVerifyIdentityData() {
    return this.verifyIdentity$;
  }

  setInsuranceData(data: InsuranceData) {
    this.isInFLow = true;
    this.insuranceDataSubject.next(data);
  }

  getInsuranceData(): Observable<InsuranceData> {
    return this.insuranceData$;
  }

  setIsQuestAccountCreated(data: any) {
    this.creatQuestAccount.next(data);
  }

  getIsQuestAccountCreated() {
    return this.creatQuestAccount$;
  }

  setUserLocation(data) {
    this.userLocation.next(data);
  }

  getUserLocation() {
    return this.userLocation$;
  }
  clearAllData() {
    this.insuranceDataSubject.next(null);
    this.personalDataSubject.next(null);
    this.reasonDataSubject.next(null);
    this.appointmentDataSubject.next(null);
    this.testsDataSubject.next(null);
    this.findLocationReasonSubject.next(null);

  }
  setfindLocationReason(data) {
    this.isInFLow = true;
    this.findLocationReasonSubject.next(data);
  }

  getfindLocationReason() {
    return this.findLocationReason$;
  }

  setfindLocationSelectedLocation(data) {
    this.isInFLow = true;
    this.findLocationSelectedLocationSubject.next(data);
  }

  getfindLocationSelectedLocation() {
    return this.findLocationSelectedLocation$;
  }
  setReasonDataFindLocation(data) {
    this.isInFLow = true;
    this.reasonDataFindLocationSubject.next(data);
  }

  getReasonDataFindLocation() {
    return this.reasonDataFindLocation$;
  }
  setReasonType(type) {
    this.reasonTypeSubject.next(type);
  }

  getReasonType() {
    return this.reasonTypeSubject$;
  }
  setblnShowLocError(blnedit: boolean) {
    this.isInFLow = true;
    this.blnShowLocErrorSubject.next(blnedit);
  }

  getblnShowLocError() {
    return this.blnShowLocErrorSubject$;
  }


  setblnEditReasonData(blnedit: boolean, route: string = null) {
    this.isInFLow = true;
    this.blnEditReasonSubject.next({ blnedit, route });
  }

  getblnEditReasonData(): Observable<ReasonEditState> {
    return this.blnEditReasonSubject$;
  }

  setEditReason(reason: ReasonCategory) {
    this.isInFLow = true;
    this.selectedReasonSubject.next(reason);
  }

  getEditReason(): Observable<ReasonCategory> {
    return this.selectedReasonEditSubject$;
  }

  setappointmentDataForEdit(appointment: ModifyAppointmentData) {
    this.isInFLow = true;
    this.appointmentDataSubjectForEdit.next(appointment);
  }

  getappointmentDataForEdit(): Observable<ModifyAppointmentData> {
    return this.appointmentDataForEdit$;
  }

  setmodifyAppointmentDataForEdit(appointment: ModifyCancelAppointmentData) {
    this.isInFLow = true;
    this.modifyAppointmentDataSubjectForEdit.next(appointment);
  }

  getmodifyAppointmentDataForEdit(): Observable<ModifyCancelAppointmentData> {
    return this.modifyAppointmentDataForEdit$;
  }

  setlocationFlowtoSchedule(lcnFlow: boolean) {
    this.isInFLow = true;
    this.locationFlowtoScheduleSubject.next(lcnFlow);
  }

  getlocationFlowtoSchedule() {
    return this.locationFlowtoScheduleSubject$;
  }

  setlabCardLocationSearch(labcardData) {
    this.labCardLocationSearchSubject.next(labcardData);
  }

  getlabCardLocationSearch() {
    return this.labCardLocation$;
  }

  setLocationFinderDetailsFlowtoReason(lcnFlow: boolean) {
    this.isInFLow = true;
    this.locationFinderDetailsFlowtoReasonSubject.next(lcnFlow);
  }

  getLocationFinderDetailsFlowtoReason() {
    return this.locationFinderDetailsFlowtoReasonSubject$;
  }

  // setFromLocationFinderScreen(data: ReasonCategory) {
  //   this.isInFLow = true;
  //   this.fromLocationFinderScreen.next(data);
  // }

  // getFromLocationFInderScreen(): Observable<ReasonCategory> {
  //   return this.fromLocationFinderScreenSubject$;
  // }

  setFindLocationFlow(data: boolean) {
    this.isInFLow = true;
    this.findLocationFlowSubject.next(data);
  }

  getFindLocationFlow() {
    return this.findLocationFlowSubject$;
  }

  setPreviousPage(data: string) {
    this.isInFLow = true;
    this.previousPageSubject.next(data);
  }

  getPreviousPage() {
    return this.previousPageSubject$;
  }

  setSelectedLocationService(data: string[]) {
    this.isInFLow = true;
    this.selectedLocationService.next(data);
  }

  getSelectedLocationService(): Observable<string[]> {
    return this.selectedLocationService$;
  }

  setAppState(type, value) {
    this.appState[type] = value;
    this.appStateSubject.next(this.appState);
  }

  getAppState(): Observable<AppState> {
    return this.appState$;
  }
  setPeaceOfMindState(data: boolean) {
    this.setPeaceOfMindvalue = data;
  }
  getPeaceOfMindState() {
    return this.setPeaceOfMindvalue;
  }
  setQueryParams(data) {
    this.paramSubject.next(data);
  }

  getParams() {
    return this.paramSubject$;
  }

  setReasonValue(data) {
    this.resetValue.next(data);
  }

  getReasonValue() {
    return this.resetValue$;
  }

  setHideInsuranceInfo(data) {
    this.hideInsuranceInfo.next(data);
  }

  getHideInsuranceInfo() {
    return this.hideInsuranceInfo$;
  }

  setReasonNotSupportedError(lnedit: boolean) {
    this.reasonNotSupportedErrorSubject.next(lnedit);
  }

  getReasonNotSupportedError() {
    return this.reasonNotSupportedErrorSubject$;
  }
  setCovidSymptomsData(data: any) {
    this.covidSymptomsSubject.next(data);
  }
  getCovidSymptomsData() {
    return this.covidSymptomsSubject$;
  }

  setModifyInsurance(data: boolean) {
    this.modifyInsuranceSubject.next(data);
  }
  getModifyInsurance(): Observable<boolean> {
    return this.modifyInsurance$;
  }
}
