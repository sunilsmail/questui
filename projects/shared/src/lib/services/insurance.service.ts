import { Injectable } from '@angular/core';
import { of, Observable, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InsuranceProvider, InsuranceVerificationRequest, InsuranceVerificationResponseVersion2, SecondaryInsurance } from 'shared/models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {

  insuranceProviderList: InsuranceProvider[] = [];
  insuranceInfo: InsuranceVerificationRequest;

  constructor(private api: ApiService) { }

  getInsuranceProvider(siteCode) {
    return this.api.get(`/guest/getPayorList/${siteCode}`);
  }
  verifyInsurance(body: InsuranceVerificationRequest) {
    this.insuranceInfo = body;
    return this.api.post(`/guest/verifyInsurance`, body);
  }
  verifySecondaryInsurance(body: SecondaryInsurance) {
    this.insuranceInfo = { ...this.insuranceInfo, ...body };
    return this.api.post(`/guest/verifyInsurance`, this.insuranceInfo);
  }

  verifySecondaryInsuranceV2(body: SecondaryInsurance): Observable<InsuranceVerificationResponseVersion2> {
    this.insuranceInfo = { ...this.insuranceInfo, ...body };
    return this.api.post<InsuranceVerificationResponseVersion2>(`/guest/verifyInsurance/V2`, this.insuranceInfo);
  }

  verifyInsuranceV2(body: InsuranceVerificationRequest): Observable<InsuranceVerificationResponseVersion2> {
    this.insuranceInfo = body;
    return this.api.post<InsuranceVerificationResponseVersion2>(`/guest/verifyInsurance/V2`, body)
      .pipe(
        catchError(e => of({
          valid: false
        }))
      );
  }

}
