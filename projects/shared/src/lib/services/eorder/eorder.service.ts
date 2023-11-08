import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EmailUnsubscribe, EmailUnsubscribeResponse, SecondaryInsurance } from 'shared/models';
import { EorderCreateAppointmentData, InsuranceVerificationRequest, PriceEstimate } from 'shared/models/eorder';
import { PropertiesService } from 'shared/services/properties.service';
import { getGender, getValueByKeys } from 'shared/utils/util';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class EorderService {
  serverUrl = '/guest';
  insuranceInfo: InsuranceVerificationRequest;
  mockPriceCall = false;
  groupId = null;
  constructor(private api: ApiService,
    private propertiesService: PropertiesService) { }

  getEncounterInfo(token: String) {
    return this.api.get(this.serverUrl + '/getTokenBasicInfoAPI/' + token).
      pipe(map((data: any) => data.encounter));
  }

  verifyIdentity(params, captcha: string) {
    const options = {
      params: new HttpParams().set('g-recaptcha-response', captcha)
    };
    return this.api.post('guestRecaptcha/verifyIdentity', params, options);
  }
  // getPersonalInfo(type:string){
  //   return this.api.get(this.serverUrl + '/getEncounterInfo/'+ type).
  //   pipe(map((data:any) => data));
  // }
  // getAppointmentInfo(type:string){
  //   return this.api.get(this.serverUrl + '/getEncounterInfo/'+ type).
  //   pipe(map((data:any) => data));
  // }
  // getInsuranceInfo(type:string){
  //   return this.api.get(this.serverUrl + '/getEncounterInfo/'+ type).
  //   pipe(map((data:any) => data));
  // }
  // getBasicEncounterInfo(type:string){
  //   return this.api.get(this.serverUrl + '/getEncounterInfo/'+ type).
  //   pipe(map((data:any) => data));
  // }
  getBasicEncounterInfo(type: string) {
    return this.api.get(this.serverUrl + '/getEncounterInfo/' + type).
      pipe(map((data: any) => {
        if (type === 'demographics') {
          if (data.demographics && data.demographics.gender && data.demographics.gender.length === 1) {
            data.demographics.gender = getGender(data.demographics.gender);
          }
          return data;
        }
        return data;
      }));
  }
  getEncounterInfoWithoutCahce(type: string) {
    this.api.clearCache();
    return this.api.get(this.serverUrl + '/getEncounterInfo/' + type).
      pipe(map((data: any) => data));
  }
  getInsuranceProvider(siteCode) {
    return this.api.get(`/guest/getPayorList/${siteCode}`);
  }
  saveEncounter(params) {
    return this.api.post(this.serverUrl + '/saveEncounterInfo', params);
  }
  verifyInsurance(body: InsuranceVerificationRequest) {
    this.insuranceInfo = body;
    return this.api.post(`/guest/verifyInsurance`, body);
  }
  EordercreateAppointment(body: EorderCreateAppointmentData) {
    return this.api.post(this.serverUrl + '/createAppointment/', body);
  }
  sendEorderMail(params) {
    return this.api.post('/guest/sendAppointmentMail', params);
  }

  getSampleAlreadyTakenByToken(token: String) {
    return this.api.get(this.serverUrl + '/sampleAlreadyTaken/' + token);
  }

  emailUnsubscribe(payload: EmailUnsubscribe): Observable<EmailUnsubscribeResponse> {
    const reqPayload = `token=${payload.token}&metricsType=${payload.metricsType}`;
    return this.api.get<EmailUnsubscribeResponse>(this.serverUrl + '/emailUnsubscribe?' + reqPayload);
    // return of({
    //   responseCode: 400,
    //   responseMessage: 'Invalid Token'
    // });
  }
  // getPricingInfo() {
  //   this.api.clearCache();
  //   return this.api.post(this.serverUrl + '/getPricing').pipe(map((data: PriceEstimate) => data));
  // }

  mockedPriceApiCall() {
    return of({
      responseBody: {
        price: null
      }
    });
  }

  verifySecondaryInsurance(body: SecondaryInsurance) {
    this.insuranceInfo = { ...this.insuranceInfo, ...body };
    return this.api.post(`/guest/verifyInsurance`, this.insuranceInfo);
  }

  getPricingInfo() {
    console.log('mockPriceCall --> ',this.mockPriceCall);
    console.log('group id --> ',this.groupId);
    if (!this.mockPriceCall) {
      return this.mockedPriceApiCall();
    } else {
      return forkJoin(
        this.getEncounterInfoWithoutCahce('insurance'),
        this.propertiesService.getSkipPayors().pipe(catchError(() => of([])))
      ).pipe(
        mergeMap(([insuranceData, payors]: [any, string[]]) => {
          const insMnemonic = getValueByKeys(insuranceData, ['insurance', 'insMnemonic']);
          if (insMnemonic && payors.length > 0 && payors.includes(insMnemonic)) {
            return this.mockedPriceApiCall();
          } else {
            this.api.clearCache();
            return this.api.post(this.serverUrl + '/getPricing').pipe(map((data: PriceEstimate) => data));
          }
        }),
      );
    }
  }

}
