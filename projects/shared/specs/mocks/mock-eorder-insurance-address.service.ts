import { of } from 'rxjs';
import { EorderInsuranceInformation, EorderPersonalInformation } from 'shared/models/eorder';

export class MockEorderInsuranceAddressService {
  /** eorder appointment flow start */
  geteOrderAddressFields(insuranceData: EorderInsuranceInformation, personalInfo: EorderPersonalInformation) {
  }

  // if someone else radio button is not selected then below fields
  eOrderDefaultInsuranceAddress(insuranceData: EorderInsuranceInformation, personalInfo: EorderPersonalInformation) {
  }

  // if someone else radio button is selected then below fields
  eOrderWhenSomeoneElseSelected(insuranceData: EorderInsuranceInformation, personalInfo: EorderPersonalInformation) {
  }

  // if someone else radio button is selected and personal address diff checkbox checked then below fields
  eOrderWhenSomeoneElseAndPersonalAddressDifferent(insuranceData: EorderInsuranceInformation, personalInfo: EorderPersonalInformation) { }

  getSaveEncounterEorderAddressFields(insuranceData: EorderInsuranceInformation, personalInfo: EorderPersonalInformation) {
  }
  // if someone else radio button is not selected then below fields
  saveEncounterEorderDefaultInsuranceAddress(insuranceData: EorderInsuranceInformation, personalInfo: EorderPersonalInformation) {
  }
  // if someone else radio button is selected and personal address diff checkbox checked then below fields
  // tslint:disable-next-line: max-line-length
  saveEncountereOrderWhenSomeoneElseAndPersonalAddressDifferent(insuranceData: EorderInsuranceInformation, personalInfo: EorderPersonalInformation) {
  }
  // if someone else radio button is selected then below fields
  saveEnContereOrderWhenSomeoneElseSelected(insuranceData: EorderInsuranceInformation, personalInfo: EorderPersonalInformation) {
  }

  getSecondaryInsuranceSelection() {
    return of(true);
  }
  setSecondaryInsuranceSelection(value: any) {
  }
}
