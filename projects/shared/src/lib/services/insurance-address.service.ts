import { Injectable } from '@angular/core';
import { InsuranceData } from 'shared/models';
import { getValueByKeys } from 'shared/utils/util';

@Injectable({
  providedIn: 'root'
})
export class InsuranceAddressService {

  /** schedule appointment flow start */
  getAddressFields(insuranceData: InsuranceData, mandatoryAddress1687 = false) {
    if (mandatoryAddress1687) {
      return this.getAddressFieldsGtr(insuranceData);
    } else {
      if (insuranceData && insuranceData.data) {
        if (insuranceData.data.isPrimaryInsuranceHolder === 'true') {
          return this.defaultInsuranceAddress(insuranceData);
        } else {
          if (insuranceData.data.sameas) {
            return this.whenSomeoneElseAndPersonalAddressDifferent(insuranceData);
          } else {
            return this.whenSomeoneElseSelected(insuranceData);
          }
        }
      }
      else {
        return null;
      }
    }

  }
  getAddressFieldsGtr(insuranceData: InsuranceData) {
    if (insuranceData && insuranceData.data && insuranceData.data.addressInfo) {
      return {
        guarantorAddress: getValueByKeys(insuranceData, ['data', 'addressInfo', 'address1']),
        guarantorAddress2: getValueByKeys(insuranceData, ['data', 'addressInfo', 'address2']),
        guarantorCity: getValueByKeys(insuranceData, ['data', 'addressInfo', 'city']),
        guarantorState: getValueByKeys(insuranceData, ['data', 'addressInfo', 'state']),
        guarantorZip: getValueByKeys(insuranceData, ['data', 'addressInfo', 'zipCode']),
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

  // if someone else radio button is not selected then below fields
  defaultInsuranceAddress(insuranceData: InsuranceData) {
    if (insuranceData) {
      return {
        address: null,
        address2: null,
        city: null,
        state: null,
        zip: null,
        preregAddress: getValueByKeys(insuranceData, ['data', 'address1']),
        preregAddress2: getValueByKeys(insuranceData, ['data', 'address2']),
        preregCity: getValueByKeys(insuranceData, ['data', 'city']),
        preregState: getValueByKeys(insuranceData, ['data', 'state']),
        preregZip: getValueByKeys(insuranceData, ['data', 'zipCode']),
        guarantorAddress: null,
        guarantorAddress2: null,
        guarantorCity: null,
        guarantorState: null,
        guarantorZip: null,
      };
    }
  }
  // if someone else radio button is selected then below fields
  whenSomeoneElseSelected(insuranceData: InsuranceData) {
    return {
      address: null,
      address2: null,
      city: null,
      state: null,
      zip: null,
      preregAddress: getValueByKeys(insuranceData, ['data', 'address1']),
      preregAddress2: getValueByKeys(insuranceData, ['data', 'address2']),
      preregCity: getValueByKeys(insuranceData, ['data', 'city']),
      preregState: getValueByKeys(insuranceData, ['data', 'state']),
      preregZip: getValueByKeys(insuranceData, ['data', 'zipCode']),
      guarantorAddress: getValueByKeys(insuranceData, ['data', 'address1']),
      guarantorAddress2: getValueByKeys(insuranceData, ['data', 'address2']),
      guarantorCity: getValueByKeys(insuranceData, ['data', 'city']),
      guarantorState: getValueByKeys(insuranceData, ['data', 'state']),
      guarantorZip: getValueByKeys(insuranceData, ['data', 'zipCode']),
    };
  }

  // if someone else radio button is selected and personal address diff checkbox checked then below fields
  whenSomeoneElseAndPersonalAddressDifferent(insuranceData: InsuranceData) {
    return {
      address: null,
      address2: null,
      city: null,
      state: null,
      zip: null,
      preregAddress: getValueByKeys(insuranceData, ['data', 'differentPersonalAddress', 'address1']),
      preregAddress2: getValueByKeys(insuranceData, ['data', 'differentPersonalAddress', 'address2']),
      preregCity: getValueByKeys(insuranceData, ['data', 'differentPersonalAddress', 'city']),
      preregState: getValueByKeys(insuranceData, ['data', 'differentPersonalAddress', 'state']),
      preregZip: getValueByKeys(insuranceData, ['data', 'differentPersonalAddress', 'zipCode']),
      guarantorAddress: getValueByKeys(insuranceData, ['data', 'address1']),
      guarantorAddress2: getValueByKeys(insuranceData, ['data', 'address2']),
      guarantorCity: getValueByKeys(insuranceData, ['data', 'city']),
      guarantorState: getValueByKeys(insuranceData, ['data', 'state']),
      guarantorZip: getValueByKeys(insuranceData, ['data', 'zipCode']),
    };
  }
  /** schedule appointment flow end */
}


