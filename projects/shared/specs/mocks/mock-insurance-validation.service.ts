import { of, Observable } from 'rxjs';
import { InsuranceVerificationRequest, InsuranceVerificationResponseVersion2 } from 'shared/models';

export class MockInsuranceValidationService {

  verifyInsuranceV2(insuranceInfo: InsuranceVerificationRequest): Observable<InsuranceVerificationResponseVersion2> {
    const obj: InsuranceVerificationResponseVersion2 = {
      valid: true
    };
    return of(obj);
  }

  verifySecondaryInsuranceV2(insuranceInfo: InsuranceVerificationRequest): Observable<InsuranceVerificationResponseVersion2> {
    const obj: InsuranceVerificationResponseVersion2 = {
      valid: true
    };
    return of(obj);
  }
}
