import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InsuranceError, InsuranceVerificationRequest,
  InsuranceVerificationResponseVersion2, SecondaryInsurance } from 'shared/models';
import { InsuranceValidation } from 'shared/models/create-appointment-data';
import { InsuranceService } from './insurance.service';

@Injectable({
  providedIn: 'root'
})
export class InsuranceValidationService {

  insurance: InsuranceValidation;

  constructor(private insuranceService: InsuranceService) { }

  verifyInsuranceV2(insuranceInfo: InsuranceVerificationRequest): Observable<InsuranceVerificationResponseVersion2> {
    try {
      return this.insuranceService.verifyInsuranceV2(insuranceInfo)
        .pipe(
          map((response: InsuranceVerificationResponseVersion2) => {
            if (response.valid) {
              return { ...response, errorType: null } as InsuranceVerificationResponseVersion2;
            } else if (!response.memberIDValid &&
              response?.memberIDvalidPatterns &&
              response?.memberIDvalidPatterns.length > 0) {
              return { ...response, errorType: InsuranceError.memberIdError } as InsuranceVerificationResponseVersion2;
            } else if (response.groupIdRequired && !response.gropuIdValid &&
              response?.groupIdvalidPattern &&
              response?.groupIdvalidPattern.length > 0) {
              return { ...response, errorType: InsuranceError.groupIdError } as InsuranceVerificationResponseVersion2;
            } else if (response.groupIdRequired && !response.gropuIdValid) {
              return { ...response, errorType: InsuranceError.groupIdRequired } as InsuranceVerificationResponseVersion2;
            } else if (response.eligiblityValid) {
              return { ...response, errorType: InsuranceError.eligiblityError } as InsuranceVerificationResponseVersion2;
            }
            return { valid: false } as InsuranceVerificationResponseVersion2;
          }));
    } catch (ex) {

    }
  }
  verifySecondaryInsuranceV2(insuranceInfo: SecondaryInsurance): Observable<InsuranceVerificationResponseVersion2> {
    try {
      return this.insuranceService.verifySecondaryInsuranceV2(insuranceInfo)
        .pipe(
          map((response: InsuranceVerificationResponseVersion2) => {
            if (response.valid) {
              return { ...response, errorType: null } as InsuranceVerificationResponseVersion2;
            } else if (!response.memberIDValid &&
              response?.memberIDvalidPatterns &&
              response?.memberIDvalidPatterns.length > 0) {
              return { ...response, errorType: InsuranceError.memberIdError } as InsuranceVerificationResponseVersion2;
            } else if (response.groupIdRequired && !response.gropuIdValid &&
              response?.groupIdvalidPattern &&
              response?.groupIdvalidPattern.length > 0) {
              return { ...response, errorType: InsuranceError.groupIdError } as InsuranceVerificationResponseVersion2;
            } else if (response.groupIdRequired && !response.gropuIdValid) {
              return { ...response, errorType: InsuranceError.groupIdRequired } as InsuranceVerificationResponseVersion2;
            } else if (response.eligiblityValid) {
              return { ...response, errorType: InsuranceError.eligiblityError } as InsuranceVerificationResponseVersion2;
            }
            return { valid: false } as InsuranceVerificationResponseVersion2;
          }));
    } catch (ex) {

    }
  }

}


