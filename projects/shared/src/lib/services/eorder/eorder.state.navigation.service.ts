import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of, Observable, ReplaySubject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ExpiryStatus, OpenEorders, PscDetails } from 'shared/models';
import { AppointmentDetails } from 'shared/models/appointment';
import { editSummaryDetails } from 'shared/models/eOrder-state-navigation';
import { ApiService } from 'shared/services/api.service';
import { getValueByKeys } from 'shared/utils/util';
import { DateService } from '../date.service';
import { FindAppointmentService } from '../find-appointment.service';
import { InsuranceValidationService } from '../insurance-validation.service';
import { PscService } from '../psc.service';
import { GenderFieldsService } from '../psc/gender-fields.service';
import { OpenEordersStateNavigation } from './../../models/eOrder-state-navigation';
import { EorderDataService } from './eorder-data.service';
import { EorderService } from './eorder.service';

@Injectable({
  providedIn: 'root'
})
export class EorderStateNavigationService {
  constructor(
    private eOrderService: EorderService,
    private eorderDataService: EorderDataService,
    private findAppointmentService: FindAppointmentService,
    private pscService: PscService,
    private router: Router,
    private api: ApiService,
    private insuranceValidationService: InsuranceValidationService,
    private dateService: DateService,
    private genderFieldsService: GenderFieldsService
  ) { }

  private loadingSpinner = new ReplaySubject<any>(1);
  loadingSpinner$ = this.loadingSpinner.asObservable();

  private openEorders = new ReplaySubject<OpenEorders[]>(1);
  openEorders$ = this.openEorders.asObservable();


  private selectedEorder = new ReplaySubject<OpenEorders>(1);
  selectedEorder$ = this.selectedEorder.asObservable();

  baseUrl = '/api';

  blnOpenEorders = false;

  blnSkippedOpenEorder = false;
  easypayFixesf2100 = false;

  getRoutePathByFlow(flow: string, confCode = null, isOpenOrder = false): void {
    switch (flow) {
      case editSummaryDetails.whoIsVisiting:
        if (isOpenOrder) {
          this.eorderDataService.setAlternateFlow(false);
          this.api.clearCache();
          this.setdemographics(['/eorder/as-eorder-personal-information']);
        } else {
          this.router.navigate(['/eorder/as-eorder-personal-information']);
        }
        break;
      case editSummaryDetails.reasonForVisit:
        this.eorderDataService.setAlternateFlow(true);
        this.setdemographics(['/eorder/as-eorder-reason-for-visit']);
        break;
      case editSummaryDetails.locationDateAndTime:
        this.setdemographics(['/eorder/as-eorder-appt-scheduler']);
        break;
      case editSummaryDetails.insuranceInfo:
        this.setdemographics(['/eorder/as-eorder-insurance-information']);
        break;
      case editSummaryDetails.costEstimate:
        if (this.easypayFixesf2100) {
          this.setDemograhicsAndAppointmentDetailsAndInsurance(confCode, ['/eorder/as-eorder-price-estimate']);
        } else {
          this.setDemograhicsAndAppointmentDetails(confCode, ['/eorder/as-eorder-price-estimate']);
        }
        break;
      case editSummaryDetails.summaryDetails:
        this.setDemograhicsAndAppointmentDetails(confCode, ['/eorder/as-eorder-summary']);
        break;
      case editSummaryDetails.pastDate:
        this.orderNotFound();
        break;
      case editSummaryDetails.maxAttemptsFailed:
        this.router.navigate(['/schedule-appointment/as-reason-for-visit']);
        break;
      default:
        this.router.navigate(['/eorder/as-eorder-personal-information']);
        break;
    }
  }

  setdemographics(route: string[]) {
    this.eOrderService.getBasicEncounterInfo('demographics').subscribe(resdemographics => {

      this.genderFieldsService.userPersonalData = resdemographics.demographics;
      if (resdemographics.demographics && resdemographics.demographics.dob) {
        // const dob = new Date(resdemographics.demographics.dob);
        // dob.setMinutes(dob.getMinutes() + dob.getTimezoneOffset());
        // resdemographics.demographics.dob =  dob;
        resdemographics.demographics.dob = this.dateService.toDateMMDDYYYY(resdemographics.demographics.dob);
      }
      if (resdemographics.demographics) {
        if (!resdemographics?.emailNotify && !resdemographics?.smsNotify) {
          resdemographics.emailNotify = true;
        }
        resdemographics.demographics.preferences = {
          preference_email: resdemographics.emailNotify,
          preference_mobile: resdemographics.smsNotify
        };
      }
      this.eorderDataService.setPersonalInformation(resdemographics.demographics);
      this.router.navigate(route);
    });
  }

  setDemograhicsAndAppointmentDetails(confCode: string, route: string[]) {
    const navigationExtras = {
      queryParams: {
        'confirmationCode': confCode,
      }
    };
    this.setLoadingSpinner(true);
    forkJoin(
      this.findAppointmentService.verifyAppointmentId(confCode, false),
      this.eOrderService.getBasicEncounterInfo('appointment'),
      this.eOrderService.getBasicEncounterInfo('demographics')
    ).subscribe(
      ([resAppointment, resEncounter, resdemographics]) => {
        this.genderFieldsService.userPersonalData = resdemographics.demographics;
        if (resAppointment['message'] === 'cancelled') {
          this.orderNotFound();
        } else {
          this.eorderDataService.setFacilityServiceId(resAppointment.facilityServiceId);
          if (resdemographics.demographics && resdemographics.demographics.dob) {
            // const dob = new Date(resdemographics.demographics.dob);
            // dob.setMinutes(dob.getMinutes() + dob.getTimezoneOffset());
            // resdemographics.demographics.dob = dob;
            resdemographics.demographics.dob = this.dateService.toDateMMDDYYYY(resdemographics.demographics.dob);
          }
          resdemographics.demographics.preferences = {
            preference_email: resdemographics.emailNotify,
            preference_mobile: resdemographics.smsNotify
          };
          this.eorderDataService.setPersonalInformation(resdemographics.demographics);

          const formattedResult = {
            confirmationCode: getValueByKeys(resEncounter, ['appointment', 'confirmation']),
            token: getValueByKeys(resEncounter, ['appointment', 'token']),
            qrCode: 'data:image/png;base64,' + getValueByKeys(resAppointment, ['qrCode']) + ''
          };
          this.pscService.getPscDetails(resAppointment.siteCode).subscribe(
            (pscDetails: PscDetails) => {
              const appointmentDetails = {
                data: {
                  appointmentDate: getValueByKeys(resAppointment, ['appointmentDate']),
                  appointmentTime: getValueByKeys(resAppointment, ['appointmentTime']),
                  siteCode: getValueByKeys(resAppointment, ['siteCode']),
                  name: getValueByKeys(pscDetails, ['name']),
                  address1: getValueByKeys(resEncounter, ['appointment', 'siteDetails', 'siteAddress1']),
                  address2: getValueByKeys(resEncounter, ['appointment', 'siteDetails', 'siteAddress2']),
                  city: getValueByKeys(resEncounter, ['appointment', 'siteDetails', 'siteCity']),
                  state: getValueByKeys(resEncounter, ['appointment', 'siteDetails', 'siteState']),
                  zip: getValueByKeys(resEncounter, ['appointment', 'siteDetails', 'siteZip']),
                  phone: pscDetails.phone,
                  labCard: pscDetails.labCard,
                  latitude: pscDetails.latitude,
                  longitude: pscDetails.longitude
                },
                selectedIndex: -1
              };
              this.eorderDataService.setEorderNewapptData(formattedResult);
              this.eorderDataService.setappointmentData(appointmentDetails);
              this.setLoadingSpinner(false);
            },
            error => {
              this.setLoadingSpinner(false);
            }
          );
          this.router.navigate(
            route,
            navigationExtras
          );
        }
      },
      error => {
        this.setLoadingSpinner(false);
      }
    );
  }

  orderNotFound() {
    this.eorderDataService.setEorderFlow(true);
    this.eorderDataService.expiryType = ExpiryStatus.orderNotFound;
    this.router.navigate(['/eorder/as-eorder-order-expiry']);
  }

  setLoadingSpinner(data: boolean) {
    this.loadingSpinner.next(data);
  }

  getLoadingSpinner() {
    return this.loadingSpinner$;
  }

  getOpenEorders(): Observable<OpenEorders[]> {
    return this.api.post<OpenEorders[]>(`${this.baseUrl}/getOpenEorders`);
  }

  setEorders(eorders: OpenEorders[]) {
    this.openEorders.next(eorders);
  }
  getEorders(): Observable<OpenEorders[]> {
    return this.openEorders$;
  }

  createEorderUserSession(token: string): Observable<OpenEordersStateNavigation> {
    const reqBody = {
      token
    };
    return this.api.post<OpenEordersStateNavigation>(`${this.baseUrl}/createPatienteOrder`, reqBody);
  }

  setSelectedEorder(eorder: OpenEorders) {
    this.selectedEorder.next(eorder);
  }
  getSelectedEorder(): Observable<OpenEorders> {
    return this.selectedEorder$;
  }

  setDemograhicsAndAppointmentDetailsAndInsurance(confCode: string, route: string[]) {
    const navigationExtras = {
      queryParams: {
        'confirmationCode': confCode,
      }
    };
    this.setLoadingSpinner(true);
    forkJoin(
      [this.findAppointmentService.verifyAppointmentId(confCode, false),
      this.eOrderService.getBasicEncounterInfo('appointment'),
      this.eOrderService.getBasicEncounterInfo('demographics'),
      this.eOrderService.getBasicEncounterInfo('insurance')]
    ).pipe(
      mergeMap(([appointment, encounter, demographics, insuranceInfo]) => {
        return this.verifyInsurance(appointment, insuranceInfo, demographics, encounter);
      })
    ).subscribe(
      ([resAppointment, resEncounter, resdemographics, resInsuranceInfo, insvalid]) => {
        this.genderFieldsService.userPersonalData = resdemographics.demographics;
        if (resAppointment['message'] === 'cancelled') {
          this.orderNotFound();
        } else {
          this.eorderDataService.setFacilityServiceId(resAppointment.facilityServiceId);
          if (resdemographics.demographics && resdemographics.demographics.dob) {
            // const dob = new Date(resdemographics.demographics.dob);
            // dob.setMinutes(dob.getMinutes() + dob.getTimezoneOffset());
            // resdemographics.demographics.dob = dob;
            resdemographics.demographics.dob = this.dateService.toDateMMDDYYYY(resdemographics.demographics.dob);
          }
          resdemographics.demographics.preferences = {
            preference_email: resdemographics.emailNotify,
            preference_mobile: resdemographics.smsNotify
          };
          this.eorderDataService.setPersonalInformation(resdemographics.demographics);

          const formattedResult = {
            confirmationCode: getValueByKeys(resEncounter, ['appointment', 'confirmation']),
            token: getValueByKeys(resEncounter, ['appointment', 'token']),
            qrCode: 'data:image/png;base64,' + getValueByKeys(resAppointment, ['qrCode']) + ''
          };
          this.pscService.getPscDetails(resAppointment.siteCode).subscribe(
            (pscDetails: PscDetails) => {
              const appointmentDetails = {
                data: {
                  appointmentDate: getValueByKeys(resAppointment, ['appointmentDate']),
                  appointmentTime: getValueByKeys(resAppointment, ['appointmentTime']),
                  siteCode: getValueByKeys(resAppointment, ['siteCode']),
                  name: getValueByKeys(pscDetails, ['name']),
                  address1: getValueByKeys(resEncounter, ['appointment', 'siteDetails', 'siteAddress1']),
                  address2: getValueByKeys(resEncounter, ['appointment', 'siteDetails', 'siteAddress2']),
                  city: getValueByKeys(resEncounter, ['appointment', 'siteDetails', 'siteCity']),
                  state: getValueByKeys(resEncounter, ['appointment', 'siteDetails', 'siteState']),
                  zip: getValueByKeys(resEncounter, ['appointment', 'siteDetails', 'siteZip']),
                  phone: pscDetails.phone,
                  labCard: pscDetails.labCard,
                  latitude: pscDetails.latitude,
                  longitude: pscDetails.longitude
                },
                selectedIndex: -1
              };
              this.eorderDataService.setEorderNewapptData(formattedResult);
              this.eorderDataService.setappointmentData(appointmentDetails);
              this.setLoadingSpinner(false);
            },
            error => {
              this.setLoadingSpinner(false);
            }
          );
          this.router.navigate(
            route,
            navigationExtras
          );
        }
      },
      error => {
        this.setLoadingSpinner(false);
      }
    );
  }

  verifyInsurance(appointment: AppointmentDetails, insuranceInfo: any, demographics: any, encounter: any) {
    const req = {
      siteCode: appointment?.siteCode,
      insuranceMnemonic: insuranceInfo?.insurance?.insMnemonic,
      insuranceMemberId: insuranceInfo?.insurance?.insMemberId,
      insuranceGroupId: insuranceInfo?.insurance?.insuranceGroupId,
      patientDOB: demographics?.demographics?.dob,
      patientFirstName: demographics?.demographics.firstName,
      patientLastName: demographics?.demographics.lastName,
      serviceDate: appointment.appointmentDate
    };
    if (insuranceInfo?.insurance?.insMnemonic) {
      return this.insuranceValidationService.verifyInsuranceV2(req).pipe(map((data) => {
        if (data.valid) {
          this.eOrderService.mockPriceCall = true;
          this.eOrderService.groupId = insuranceInfo?.insurance?.insuranceGroupId;
        } else {
          this.eOrderService.mockPriceCall = false;
        }
        return [appointment, encounter, demographics, insuranceInfo, data];
      }));
    } else {
      this.eOrderService.mockPriceCall = false;
      return of([appointment, encounter, demographics, insuranceInfo, null]);
    }
  }

}
