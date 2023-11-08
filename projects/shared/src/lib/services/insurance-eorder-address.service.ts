import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { EorderInsuranceInformation, EorderPersonalInformation } from 'shared/models/eorder';
import { getValueByKeys } from 'shared/utils/util';

@Injectable({
  providedIn: 'root'
})
export class InsuranceEorderAddressService {

  private secondaryInsurance = new ReplaySubject<any>(1);
  secondaryInsurance$ = this.secondaryInsurance.asObservable();

  getSecondaryInsuranceSelection() {
    return this.secondaryInsurance$;
  }
  setSecondaryInsuranceSelection(value: any) {
    this.secondaryInsurance.next(value);
  }

  /** eorder appointment flow start */
  geteOrderAddressFields(insuranceData: EorderInsuranceInformation, personalInfo: EorderPersonalInformation, mandatoryAddress1687 = false) {
    if (mandatoryAddress1687) {
      return this.getAddressFieldsGtrCreateAppt(insuranceData, personalInfo);
    } else {
      if (insuranceData && insuranceData.insuranceData && personalInfo) {
        if (insuranceData.insuranceData.primary === 'true') {
          return this.eOrderDefaultInsuranceAddress(personalInfo);
        } else {
          if (insuranceData.insuranceData.sameas) {
            return this.eOrderWhenSomeoneElseAndPersonalAddressDifferent(insuranceData, personalInfo);
          } else {
            return this.eOrderWhenSomeoneElseSelected(insuranceData, personalInfo);
          }
        }
      } else if (personalInfo) {
        return this.eOrderDefaultInsuranceAddress(personalInfo);
      }
      else {
        return null;
      }
    }
  }

  // if someone else radio button is not selected then below fields
  eOrderDefaultInsuranceAddress(personalInfo: EorderPersonalInformation) {
    if (personalInfo) {
      return {
        address: getValueByKeys(personalInfo, ['address']),
        address2: getValueByKeys(personalInfo, ['address2']),
        city: getValueByKeys(personalInfo, ['city']),
        state: getValueByKeys(personalInfo, ['state']),
        zip: getValueByKeys(personalInfo, ['zip']),
        preregAddress: getValueByKeys(personalInfo, ['address']),
        preregAddress2: getValueByKeys(personalInfo, ['address2']),
        preregCity: getValueByKeys(personalInfo, ['city']),
        preregState: getValueByKeys(personalInfo, ['state']),
        preregZip: getValueByKeys(personalInfo, ['zip']),
        guarantorAddress: null,
        guarantorAddress2: null,
        guarantorCity: null,
        guarantorState: null,
        guarantorZip: null,
      };
    }
  }

  // if someone else radio button is selected then below fields
  eOrderWhenSomeoneElseSelected(insuranceData: EorderInsuranceInformation, personalInfo: EorderPersonalInformation) {
    return {
      address: getValueByKeys(personalInfo, ['address']),
      address2: getValueByKeys(personalInfo, ['address2']),
      city: getValueByKeys(personalInfo, ['city']),
      state: getValueByKeys(personalInfo, ['state']),
      zip: getValueByKeys(personalInfo, ['zipCode1']),
      preregAddress: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'address1']),
      preregAddress2: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'address2']),
      preregCity: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'city']),
      preregState: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'state']),
      preregZip: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'zipCode']),
      guarantorAddress: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'address1']),
      guarantorAddress2: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'address2']),
      guarantorCity: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'city']),
      guarantorState: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'state']),
      guarantorZip: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'zipCode']),
    };
  }

  // if someone else radio button is selected and personal address diff checkbox checked then below fields
  eOrderWhenSomeoneElseAndPersonalAddressDifferent(insuranceData: EorderInsuranceInformation, personalInfo: EorderPersonalInformation) {
    return {
      address: getValueByKeys(personalInfo, ['address']),
      address2: getValueByKeys(personalInfo, ['address2']),
      city: getValueByKeys(personalInfo, ['city']),
      state: getValueByKeys(personalInfo, ['state']),
      zip: getValueByKeys(personalInfo, ['zipCode1']),
      preregAddress: getValueByKeys(insuranceData, ['insuranceData', 'differentPersonalAddress', 'address1']),
      preregAddress2: getValueByKeys(insuranceData, ['insuranceData', 'differentPersonalAddress', 'address2']),
      preregCity: getValueByKeys(insuranceData, ['insuranceData', 'differentPersonalAddress', 'city']),
      preregState: getValueByKeys(insuranceData, ['insuranceData', 'differentPersonalAddress', 'state']),
      preregZip: getValueByKeys(insuranceData, ['insuranceData', 'differentPersonalAddress', 'zipCode']),
      guarantorAddress: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'address1']),
      guarantorAddress2: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'address2']),
      guarantorCity: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'city']),
      guarantorState: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'state']),
      guarantorZip: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'zipCode']),
    };
  }
  /** eorder appointment flow end */

  // save encounter start
  getSaveEncounterEorderAddressFields(insuranceData: EorderInsuranceInformation,
    personalInfo: EorderPersonalInformation, mandatoryAddress1687 = false) {
    if (mandatoryAddress1687) {
      return this.getAddressFieldsGtr(insuranceData);
    } else {
      if (insuranceData && insuranceData.insuranceData && personalInfo) {
        if (insuranceData.insuranceData.primary === 'true') {
          return this.saveEncounterEorderDefaultInsuranceAddress(personalInfo);
        } else {
          if (insuranceData.insuranceData.sameas) {
            return this.saveEncountereOrderWhenSomeoneElseAndPersonalAddressDifferent(insuranceData);
          } else {
            return this.saveEnContereOrderWhenSomeoneElseSelected(insuranceData);
          }
        }
      } else if (personalInfo) {
        return this.saveEncounterEorderDefaultInsuranceAddress(personalInfo);
      }
      else {
        return null;
      }
    }
  }
  // if someone else radio button is not selected then below fields
  saveEncounterEorderDefaultInsuranceAddress(personalInfo: EorderPersonalInformation) {
    if (personalInfo) {
      return {
        preregAddress: getValueByKeys(personalInfo, ['address']),
        preregAddress2: getValueByKeys(personalInfo, ['address2']),
        preregCity: getValueByKeys(personalInfo, ['city']),
        preregState: getValueByKeys(personalInfo, ['state']),
        preregZip: getValueByKeys(personalInfo, ['zip']),
      };
    }
  }
  // if someone else radio button is selected and personal address diff checkbox checked then below fields
  saveEncountereOrderWhenSomeoneElseAndPersonalAddressDifferent(insuranceData: EorderInsuranceInformation) {
    return {
      preregAddress: getValueByKeys(insuranceData, ['insuranceData', 'differentPersonalAddress', 'address1']),
      preregAddress2: getValueByKeys(insuranceData, ['insuranceData', 'differentPersonalAddress', 'address2']),
      preregCity: getValueByKeys(insuranceData, ['insuranceData', 'differentPersonalAddress', 'city']),
      preregState: getValueByKeys(insuranceData, ['insuranceData', 'differentPersonalAddress', 'state']),
      preregZip: getValueByKeys(insuranceData, ['insuranceData', 'differentPersonalAddress', 'zipCode']),
    };
  }
  // if someone else radio button is selected then below fields
  saveEnContereOrderWhenSomeoneElseSelected(insuranceData: EorderInsuranceInformation) {
    return {
      preregAddress: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'address1']),
      preregAddress2: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'address2']),
      preregCity: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'city']),
      preregState: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'state']),
      preregZip: getValueByKeys(insuranceData, ['insuranceData', 'PersonalAddress', 'zipCode']),
    };
  }

  // save encounter start

  getAddressFieldsGtr(insuranceData: EorderInsuranceInformation) {
    if (insuranceData && insuranceData.insuranceData && insuranceData.insuranceData.addressInfo) {
      return {
        guarantorAddress: getValueByKeys(insuranceData, ['insuranceData', 'addressInfo', 'address1']),
        guarantorAddress2: getValueByKeys(insuranceData, ['insuranceData', 'addressInfo', 'address2']),
        guarantorCity: getValueByKeys(insuranceData, ['insuranceData', 'addressInfo', 'city']),
        guarantorState: getValueByKeys(insuranceData, ['insuranceData', 'addressInfo', 'state']),
        guarantorZip: getValueByKeys(insuranceData, ['insuranceData', 'addressInfo', 'zipCode']),
        address: null,
        address2: null,
        city: null,
        state: null,
        zip: null,
        preregAddress: null,
        preregAddress2: null,
        preregCity: null,
        preregState: null,
        preregZip: null
      };
    } else {
      return {
        guarantorAddress: null,
        guarantorAddress2: null,
        guarantorCity: null,
        guarantorState: null,
        guarantorZip: null,
        address: null,
        address2: null,
        city: null,
        state: null,
        zip: null,
        preregAddress: null,
        preregAddress2: null,
        preregCity: null,
        preregState: null,
        preregZip: null
      };
    }
  }


  getAddressFieldsGtrCreateAppt(insuranceData: EorderInsuranceInformation, personalInfo: EorderPersonalInformation) {
    if (insuranceData && insuranceData.insuranceData && insuranceData.insuranceData.addressInfo) {
      return {
        guarantorAddress: getValueByKeys(insuranceData, ['insuranceData', 'addressInfo', 'address1']),
        guarantorAddress2: getValueByKeys(insuranceData, ['insuranceData', 'addressInfo', 'address2']),
        guarantorCity: getValueByKeys(insuranceData, ['insuranceData', 'addressInfo', 'city']),
        guarantorState: getValueByKeys(insuranceData, ['insuranceData', 'addressInfo', 'state']),
        guarantorZip: getValueByKeys(insuranceData, ['insuranceData', 'addressInfo', 'zipCode']),
        address: getValueByKeys(personalInfo, ['address']),
        address2: getValueByKeys(personalInfo, ['address2']),
        city: getValueByKeys(personalInfo, ['city']),
        state: getValueByKeys(personalInfo, ['state']),
        zip: getValueByKeys(personalInfo, ['zip']),
        preregAddress: null,
        preregAddress2: null,
        preregCity: null,
        preregState: null,
        preregZip: null
      };
    } else {
      return {
        guarantorAddress: null,
        guarantorAddress2: null,
        guarantorCity: null,
        guarantorState: null,
        guarantorZip: null,
        address: getValueByKeys(personalInfo, ['address']),
        address2: getValueByKeys(personalInfo, ['address2']),
        city: getValueByKeys(personalInfo, ['city']),
        state: getValueByKeys(personalInfo, ['state']),
        zip: getValueByKeys(personalInfo, ['zip']),
        preregAddress: null,
        preregAddress2: null,
        preregCity: null,
        preregState: null,
        preregZip: null
      };
    }
  }

}


