import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { GtrDemographics, PatientAddressInfo, SecondaryInsuranceData } from 'shared/models';
import {
  ModifyAppointment, SecondaryGtrAddress, SecondaryGtrDemographics,
  SecondaryInsuranceResponse
} from 'shared/models/create-appointment-data';
import { getBooleanFromString, getValueByKeys } from 'shared/utils/util';
import { regex } from 'shared/utils/validation/regex-patterns';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class SecondaryInsuranceService {

  constructor(private dateService: DateService) { }

  modifyAppointmentInfo: ModifyAppointment;
  private insuranceDataSubject = new ReplaySubject<SecondaryInsuranceData>(1);
  insuranceData$ = this.insuranceDataSubject.asObservable();
  patientAddressInfo: PatientAddressInfo;

  setInsuranceData(data: SecondaryInsuranceData) {
    this.insuranceDataSubject.next(data);
  }

  getInsuranceData(): Observable<SecondaryInsuranceData> {
    return this.insuranceData$;
  }

  addGtrControls(form: FormGroup) {
    try {
      form.addControl('address1', new FormControl('',
        [Validators.minLength(3), Validators.maxLength(75), Validators.pattern(regex.address1), Validators.required]));
      form.addControl('address2', new FormControl('',
        [Validators.minLength(1), Validators.maxLength(75), Validators.pattern(regex.address1)]));
      form.addControl('city', new FormControl('',
        [Validators.minLength(3), Validators.maxLength(30), Validators.pattern(regex.city), Validators.required]));
      form.addControl('state', new FormControl('',
        [Validators.required, Validators.pattern(regex.state)]));
      form.addControl('zipCode', new FormControl('',
        [Validators.minLength(5), Validators.maxLength(10), Validators.pattern(regex.zipCode), Validators.required]));
    }
    catch (ex) {
      console.log('error from addGtrControls');
    }
  }

  removeGtrControls(form: FormGroup) {
    try {
      form.removeControl('userInfo');
      // form.removeControl('address');
      form.removeControl('address1');
      form.removeControl('address2');
      form.removeControl('city');
      form.removeControl('state');
      form.removeControl('zipCode');
    } catch (ex) {
      console.log('error from addGtrControls');
    }
  }

  formatSecondaryInsuranceToApiRequest(secondaryIns: SecondaryInsuranceData, mandatoryAddressf1687 = false): SecondaryInsuranceResponse {
    let response: SecondaryInsuranceResponse = new SecondaryInsuranceResponse();
    try {

      if (secondaryIns && secondaryIns.isPrimaryInsuranceHolder === 'true') {
        response = {
          primaryInsuranceHolder: getBooleanFromString(secondaryIns.isPrimaryInsuranceHolder),
          secondaryInsMemberId: secondaryIns.memberId,
          secondaryInsGroupNumber: secondaryIns.groupId,
          secondaryInsCompanyName: this.insCompanyName(secondaryIns),
          secondaryInsMnemonic: getValueByKeys(secondaryIns, ['provider', 'insuranceMnemonic']),
          secondaryInsBillType: getValueByKeys(secondaryIns, ['provider', 'billType']),
          isValidMemberId: secondaryIns.isValidMemberId ? 'Y' : 'N'
        };
      } else if (secondaryIns && secondaryIns.isPrimaryInsuranceHolder === 'false' && mandatoryAddressf1687 === false) {
        response = {
          primaryInsuranceHolder: getBooleanFromString(secondaryIns.isPrimaryInsuranceHolder),
          secondaryInsMemberId: secondaryIns.memberId,
          secondaryInsGroupNumber: secondaryIns.groupId,
          secondaryInsCompanyName: this.insCompanyName(secondaryIns),
          secondaryInsMnemonic: getValueByKeys(secondaryIns, ['provider', 'insuranceMnemonic']),
          secondaryGtrAddress: this.getAddress(secondaryIns),
          secondaryGtrDemographics: this.getDemographics(secondaryIns.userInfo),
          secondaryInsBillType: getValueByKeys(secondaryIns, ['provider', 'billType']),
          isValidMemberId: secondaryIns.isValidMemberId ? 'Y' : 'N'
        };
      } else if (secondaryIns && secondaryIns.isPrimaryInsuranceHolder === 'false' && mandatoryAddressf1687 === true) {
        response = {
          primaryInsuranceHolder: getBooleanFromString(secondaryIns.isPrimaryInsuranceHolder),
          secondaryInsMemberId: secondaryIns.memberId,
          secondaryInsGroupNumber: secondaryIns.groupId,
          secondaryInsCompanyName: this.insCompanyName(secondaryIns),
          secondaryInsMnemonic: getValueByKeys(secondaryIns, ['provider', 'insuranceMnemonic']),
          secondaryGtrAddress: this.getAddressFieldsByAddressInfo(secondaryIns),
          secondaryGtrDemographics: this.getDemographics(secondaryIns.userInfo),
          secondaryInsBillType: getValueByKeys(secondaryIns, ['provider', 'billType']),
          isValidMemberId: secondaryIns.isValidMemberId ? 'Y' : 'N'
        };
      }

      return response;
    }
    catch (ex) {
      return null;
    }
  }
  insCompanyName(secondaryIns: SecondaryInsuranceData) {
    if (typeof secondaryIns.provider === 'string') {
      return secondaryIns.provider;
    } else {
      return getValueByKeys(secondaryIns, ['provider', 'insuranceCompanyName']);
    }
  }

  getAddress(secondaryIns: SecondaryInsuranceData) {
    try {
      const address: SecondaryGtrAddress = {
        address1: secondaryIns.address1,
        address2: secondaryIns.address2,
        city: secondaryIns.city,
        state: secondaryIns.state,
        zipCode: secondaryIns.zipCode
      };
      return address;
    }
    catch (ex) {
      return null;
    }
  }
  getDemographics(user: GtrDemographics) {
    try {
      const demographics: SecondaryGtrDemographics = {
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: this.dateService.toDate(user.dateOfBirth),
        gender: user.gender,
        phone: this.getPhoneNumber(user.phone),
        relationship: user.relationship
      };
      return demographics;
    }
    catch (ex) {
      return null;
    }
  }

  getPhoneNumber(phone: string) {
    return phone.replace(/-/g, '');
  }

  formatSecondaryInsuranceForControls(secondaryIns: SecondaryInsuranceResponse, mandatoryAddressf1687 = false): SecondaryInsuranceData {
    let response: SecondaryInsuranceData = new SecondaryInsuranceData();
    try {
      if (secondaryIns && secondaryIns.primaryInsuranceHolder === true && mandatoryAddressf1687 === false) {
        response = {
          isPrimaryInsuranceHolder: secondaryIns.primaryInsuranceHolder.toString(),
          memberId: secondaryIns.secondaryInsMemberId,
          groupId: secondaryIns.secondaryInsGroupNumber,
          provider: {
            insuranceCompanyName: secondaryIns.secondaryInsCompanyName,
            insuranceMnemonic: secondaryIns.secondaryInsMnemonic
          }
        };
      }
      else if (secondaryIns && secondaryIns.primaryInsuranceHolder === true && mandatoryAddressf1687 === true) {
        response = {
          isPrimaryInsuranceHolder: secondaryIns.primaryInsuranceHolder.toString(),
          memberId: secondaryIns.secondaryInsMemberId,
          groupId: secondaryIns.secondaryInsGroupNumber,
          provider: {
            insuranceCompanyName: secondaryIns.secondaryInsCompanyName,
            insuranceMnemonic: secondaryIns.secondaryInsMnemonic
          },
          sameas: false,
        };
      } else if (secondaryIns && secondaryIns.primaryInsuranceHolder === false && mandatoryAddressf1687 === false) {
        response = {
          isPrimaryInsuranceHolder: secondaryIns.primaryInsuranceHolder.toString(),
          memberId: secondaryIns.secondaryInsMemberId,
          groupId: secondaryIns.secondaryInsGroupNumber,
          provider: {
            insuranceCompanyName: secondaryIns.secondaryInsCompanyName,
            insuranceMnemonic: secondaryIns.secondaryInsMnemonic
          },
          ...this.getAddressFiledsForUi(secondaryIns),
          userInfo: this.getUserInfoFiledsForUi(secondaryIns)
        };
      }
      else if (secondaryIns && secondaryIns.primaryInsuranceHolder === false && mandatoryAddressf1687 === true) {
        response = {
          isPrimaryInsuranceHolder: secondaryIns.primaryInsuranceHolder.toString(),
          memberId: secondaryIns.secondaryInsMemberId,
          groupId: secondaryIns.secondaryInsGroupNumber,
          provider: {
            insuranceCompanyName: secondaryIns.secondaryInsCompanyName,
            insuranceMnemonic: secondaryIns.secondaryInsMnemonic
          },
          addressInfo: this.getAddressFiledsForUi(secondaryIns),
          userInfo: this.getUserInfoFiledsForUi(secondaryIns),
          sameas: !secondaryIns.secondaryGtrAddressSame
        };
      }
      return response;
    }
    catch (ex) {
      return null;
    }
  }

  getAddressFiledsForUi(secondaryIns: SecondaryInsuranceResponse) {
    try {
      return {
        address1: getValueByKeys(secondaryIns, ['secondaryGtrAddress', 'address1']),
        address2: getValueByKeys(secondaryIns, ['secondaryGtrAddress', 'address2']),
        city: getValueByKeys(secondaryIns, ['secondaryGtrAddress', 'city']),
        state: getValueByKeys(secondaryIns, ['secondaryGtrAddress', 'state']),
        zipCode: getValueByKeys(secondaryIns, ['secondaryGtrAddress', 'zipCode']),
      };
    }
    catch (ex) {
      return null;
    }
  }

  getUserInfoFiledsForUi(secondaryIns: SecondaryInsuranceResponse) {
    try {
      return {
        firstName: getValueByKeys(secondaryIns, ['secondaryGtrDemographics', 'firstName']),
        lastName: getValueByKeys(secondaryIns, ['secondaryGtrDemographics', 'lastName']),
        dateOfBirth: getValueByKeys(secondaryIns, ['secondaryGtrDemographics', 'dateOfBirth']),
        gender: getValueByKeys(secondaryIns, ['secondaryGtrDemographics', 'gender']),
        phone: getValueByKeys(secondaryIns, ['secondaryGtrDemographics', 'phone']),
        relationship: getValueByKeys(secondaryIns, ['secondaryGtrDemographics', 'relationship']),
      };
    }
    catch (ex) {
      return null;
    }
  }

  getAddressFieldsByAddressInfo(secondaryIns: SecondaryInsuranceData) {
    try {
      const address: SecondaryGtrAddress = {
        address1: secondaryIns.addressInfo.address1,
        address2: secondaryIns.addressInfo.address2,
        city: secondaryIns.addressInfo.city,
        state: secondaryIns.addressInfo.state,
        zipCode: secondaryIns.addressInfo.zipCode
      };
      return address;
    }
    catch (ex) {
      return null;
    }
  }

}


