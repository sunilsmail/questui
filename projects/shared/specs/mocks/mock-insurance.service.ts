import { of } from 'rxjs';

import { InsuranceProvider, InsuranceVerificationRequest, SecondaryInsurance } from 'shared/models';
import { ReasonCategory } from '../../src/lib/models/reason-category';

const reason = new ReasonCategory();
reason.facilityServiceId = 1;
reason.facilityTestTypeValue = 'All Other Tests';
reason.testDesc = 'Select this option if your tests are not one of the prior options.';
reason.precedence = 1;
reason.serviceRequestor = null;

const reasonList = [reason];

export const mockReasonList = [...reasonList];

export class MockInsuranceService {
  insuranceProviderList: InsuranceProvider[] = [{
    insuranceCompanyName: 'LAB CARD',
    insuranceMnemonic: 'LBCRD'
  }, {
    insuranceCompanyName: 'MEDICARE',
    insuranceMnemonic: '3500'
  }];
  insuranceInfo: InsuranceVerificationRequest;
  getInsuranceProvider(siteCode) {
    return of([{
      insuranceCompanyName: 'LAB CARD',
      insuranceMnemonic: 'LBCRD'
    }, {
      insuranceCompanyName: 'MEDICARE',
      insuranceMnemonic: '3500'
    }, {
      insuranceCompanyName: 'NJ MEDICARE',
      insuranceMnemonic: '3500'
    }, {
      insuranceCompanyName: 'RAILROAD RETIREES MEDICARE',
      insuranceMnemonic: '3700'
    }, {
      insuranceCompanyName: 'TRAVELERS RAILROAD MEDICARE',
      insuranceMnemonic: '3700'
    }, {
      insuranceCompanyName: 'BC/BS OF NEW JERSEY/HORIZON',
      insuranceMnemonic: '4000'
    }, {
      insuranceCompanyName: 'BLUE CROSS & BLUE SHIELD OF NEW JERSEY',
      insuranceMnemonic: '4000'
    }]);
  }
  verifyInsurance(body: InsuranceVerificationRequest) {
    return of({ valid: true });
  }

  verifySecondaryInsurance(body: SecondaryInsurance) {
    return of({ valid: true });
  }

}
