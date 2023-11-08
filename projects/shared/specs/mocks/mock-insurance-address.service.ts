import { InsuranceData } from 'shared/models';

export class MockInsuranceAddressService {
  getAddressFields(insuranceData: InsuranceData) {
  }

  // if someone else radio button is not selected then below fields
  defaultInsuranceAddress(insuranceData: InsuranceData) {
  }
  // if someone else radio button is selected then below fields
  whenSomeoneElseSelected(insuranceData: InsuranceData) {
  }

  // if someone else radio button is selected and personal address diff checkbox checked then below fields
  whenSomeoneElseAndPersonalAddressDifferent(insuranceData: InsuranceData) {
  }

  /** schedule appointment flow end */
  }
