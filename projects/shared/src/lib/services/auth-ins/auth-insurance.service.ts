import { Injectable } from '@angular/core';
import { combineLatest, of, BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { InsuranceData, SecondaryInsurance } from 'shared/models';
import { AuthUserInsurance, InsuranceFromPrs } from 'shared/models/auth-user-ins';
import { DataService } from 'shared/services/data.service';
import { getGender } from 'shared/utils/util';
import { ApiService } from '../api.service';
import { DateService } from '../date.service';
import { GenderFieldsService } from '../psc/gender-fields.service';
import { SecondaryInsuranceService } from '../secondary-insurance.service';
import { UserService } from '../user.service';
import { InsuranceBillType } from './../../models/auth-user-ins';
import { PropertiesService } from './../properties.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInsuranceService {
  private isOpenEorder = new BehaviorSubject<boolean>(false);
  authUrl = '/api';
  isDataFetch = false;
  insuranceData: InsuranceData;
  billType: InsuranceBillType = new InsuranceBillType();
  primaryDataFetch = false;
  secondaryDataFetch = false;
  primaryInsurance = {
    insurance: null,
    address: null
  };
  secondaryInsurance = {
    insurance: null,
    address: null
  };
  isModifyFlow = false;
  isOpenEorderSubject$ = this.isOpenEorder.asObservable();
  selectedInsuranceType = null;
  constructor(private api: ApiService,
    private userService: UserService,
    private propertiesService: PropertiesService,
    private dataService: DataService,
    private dateService: DateService,
    private genderFieldsService: GenderFieldsService,
    private secondaryInsuranceService: SecondaryInsuranceService) {

  }

  /** get insurance START */
  skipAutopopulateInsForEdit() {
    return combineLatest([this.propertiesService.getInsurancePrefillF3904(), this.dataService.getModifyInsurance()]);
  }

  getInsuranceProfile(): Observable<any> {
    return this.skipAutopopulateInsForEdit().pipe(
      switchMap(([active, modify]) => {
        this.isModifyFlow = modify;
        if (active) {
          return this.getPrsInsurance();
        }
        else {
          return of(null);
        }
      })
    );
  }

  getPrsInsurance(): Observable<any> {
    return this.userService.isAuthenticated$.pipe(
      switchMap((isAuth) => {
        if (isAuth) {
          this.api.clearCache();
          return this.api.get<AuthUserInsurance>(`${this.authUrl}/getInsuranceProfile`).pipe(
            map((insuranceData) => {
              this.isDataFetch = true;
              this.setPrimaryInsuranceData(insuranceData);
              return insuranceData;
            }),
            catchError(() => {
              return of(null);
            }));
        } else {
          return of(null);
        }
      })
    );
  }

  setPrimaryInsuranceData(insuranceData: AuthUserInsurance) {
    if (!insuranceData?.primaryInsurance) {
      return true;
    }
    let mappedInsuranceData = null;
    if (insuranceData?.primaryInsurance?.relation.toLowerCase() === 'self') {
      mappedInsuranceData = {
        data: {
          sameas: false,
          provider: {
            insuranceCompanyName: insuranceData?.primaryInsurance?.insuranceCompanyName,
            insuranceMnemonic: insuranceData?.primaryInsurance?.insuranceMnemonic,
            billType: this.billType.prsListToProviderList.get(insuranceData?.primaryInsurance?.insuranceBillType),
            genericCarrier: false
          },
          memberId: insuranceData?.primaryInsurance?.insuranceMemberId,
          groupId: insuranceData?.primaryInsurance?.insuranceGroupNumber,
          relationship: '',
          isPrimaryInsuranceHolder: 'true',
          labCard: 'false',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: '',
          phone: '',
          secondaryInsurance: (insuranceData?.secondaryInsurance?.insuranceCompanyName?.length > 0).toString(),
        },
        bringCarderror: false,
        isValidMemberId: true
      };
    } else {
      mappedInsuranceData = {
        data: {
          sameas: this.getSameas(insuranceData.primaryInsurance),
          provider: {
            insuranceCompanyName: insuranceData?.primaryInsurance?.insuranceCompanyName,
            insuranceMnemonic: insuranceData?.primaryInsurance?.insuranceMnemonic,
            billType: this.billType.prsListToProviderList.get(insuranceData?.primaryInsurance?.insuranceBillType),
            genericCarrier: false
          },
          memberId: insuranceData?.primaryInsurance?.insuranceMemberId,
          groupId: insuranceData?.primaryInsurance?.insuranceGroupNumber,
          relationship: insuranceData?.primaryInsurance?.relation,
          isPrimaryInsuranceHolder: 'false',
          labCard: 'false',
          firstName: insuranceData?.primaryInsurance?.demographics.firstName,
          lastName: insuranceData?.primaryInsurance?.demographics.lastName,
          dateOfBirth: this.dateService.toDateMMDDYYYY(insuranceData?.primaryInsurance?.demographics.dob),
          gender: getGender(insuranceData?.primaryInsurance?.demographics.gender),
          phone: insuranceData?.primaryInsurance?.demographics.phone,
          secondaryInsurance: (insuranceData?.secondaryInsurance?.insuranceCompanyName?.length > 0).toString(),
          addressInfo: {
            address1: insuranceData?.primaryInsurance?.addressInfo?.address1,
            address2: insuranceData?.primaryInsurance?.addressInfo?.address2,
            city: insuranceData?.primaryInsurance?.addressInfo?.city,
            state: insuranceData?.primaryInsurance?.addressInfo?.state,
            zipCode: insuranceData?.primaryInsurance?.addressInfo?.zip
          }
        },
        bringCarderror: false,
        isValidMemberId: true
      };
    }
    if (mappedInsuranceData) {
      this.primaryDataFetch = true;
      if (!this.isModifyFlow) {
        this.dataService.setInsuranceData(mappedInsuranceData);
      }
    }
    this.setSecondaryInsuranceData(insuranceData);
  }

  setSecondaryInsuranceData(insuranceData: AuthUserInsurance) {
    if (!insuranceData.secondaryInsurance) {
      return true;
    }
    let mappedSecondaryInsuranceData = null;
    if (insuranceData?.secondaryInsurance?.relation.toLowerCase() === 'self') {
      mappedSecondaryInsuranceData = {
        provider: {
          insuranceCompanyName: insuranceData?.secondaryInsurance?.insuranceCompanyName,
          insuranceMnemonic: insuranceData?.secondaryInsurance?.insuranceMnemonic,
          billType: this.billType.prsListToProviderList.get(insuranceData?.secondaryInsurance?.insuranceBillType),
          genericCarrier: false
        },
        memberId: insuranceData?.secondaryInsurance?.insuranceMemberId,
        groupId: insuranceData?.secondaryInsurance?.insuranceGroupNumber,
        isPrimaryInsuranceHolder: 'true',
        sameas: false,
        bringCarderror: false,
        isValidMemberId: true
      };
    } else {
      mappedSecondaryInsuranceData = {
        sameas: this.getSameas(insuranceData.secondaryInsurance),
        provider: {
          insuranceCompanyName: insuranceData?.secondaryInsurance?.insuranceCompanyName,
          insuranceMnemonic: insuranceData?.secondaryInsurance?.insuranceMnemonic,
          billType: this.billType.prsListToProviderList.get(insuranceData?.secondaryInsurance?.insuranceBillType),
          genericCarrier: false
        },
        memberId: insuranceData?.secondaryInsurance?.insuranceMemberId,
        groupId: insuranceData?.secondaryInsurance?.insuranceGroupNumber,
        isPrimaryInsuranceHolder: 'false',
        userInfo: {
          firstName: insuranceData?.secondaryInsurance?.demographics.firstName,
          lastName: insuranceData?.secondaryInsurance?.demographics.lastName,
          dateOfBirth: this.dateService.toDateMMDDYYYY(insuranceData?.secondaryInsurance?.demographics.dob),
          gender: getGender(insuranceData?.secondaryInsurance?.demographics.gender),
          phone: insuranceData?.secondaryInsurance?.demographics.phone,
          relationship: insuranceData?.secondaryInsurance?.relation,
        },
        addressInfo: {
          address1: insuranceData?.secondaryInsurance?.addressInfo?.address1,
          address2: insuranceData?.secondaryInsurance?.addressInfo?.address2,
          city: insuranceData?.secondaryInsurance?.addressInfo?.city,
          state: insuranceData?.secondaryInsurance?.addressInfo?.state,
          zipCode: insuranceData?.secondaryInsurance?.addressInfo?.zip
        },
        bringCarderror: false,
        isValidMemberId: true
      };
    }
    if (mappedSecondaryInsuranceData) {
      this.secondaryDataFetch = true;
      if (!this.isModifyFlow) {
        this.secondaryInsuranceService.setInsuranceData(mappedSecondaryInsuranceData);
      }
    }
  }

  /** get insurance END */

  /** save/update insurance START */


  saveValidInsuranceToPrs() {
    this.propertiesService.getInsurancePrefillF3904().pipe(mergeMap((value) => {
      if (value) {
        return this.saveInsuranceProfile();
      }
      return of(null);
    })).subscribe();
  }

  saveValidPrimaryInsuranceToPrs() {
    this.propertiesService.getInsurancePrefillF3904().pipe(mergeMap((value) => {
      if (value) {
        return this.savePrimaryInsuranceProfile();
      }
      return of(null);
    })).subscribe();
  }

  saveValidSecondaryInsuranceToPrs() {
    this.propertiesService.getInsurancePrefillF3904().pipe(mergeMap((value) => {
      if (value) {
        return this.saveSecondaryInsuranceProfile();
      }
      return of(null);
    })).subscribe();
  }

  saveInsuranceProfile() {
    return this.userService.isAuthenticated$.pipe(
      switchMap((isAuth) => {
        const response = this.getFormattedResponse();
        if (isAuth && response?.primaryInsurance?.insuranceBillType) {
          const methodName = this.primaryDataFetch ? 'updateInsuranceProfile' : 'createInsuranceProfile';
          return this.api.post<boolean>(`${this.authUrl}/${methodName}`, this.getFormattedResponse());
        }
        return of(null);
      }));
  }

  savePrimaryInsuranceProfile() {
    return this.userService.isAuthenticated$.pipe(
      switchMap((isAuth) => {
        const response = this.getPrimaryFormattedResponse();
        if (isAuth && response?.primaryInsurance?.insuranceBillType) {
          const methodName = this.primaryDataFetch ? 'updateInsuranceProfile' : 'createInsuranceProfile';
          return this.api.post<boolean>(`${this.authUrl}/${methodName}`, this.getPrimaryFormattedResponse());
        }
        return of(null);
      }));
  }

  saveSecondaryInsuranceProfile() {
    return this.userService.isAuthenticated$.pipe(
      switchMap((isAuth) => {
        const response = this.getSecondaryFormattedResponse();
        if (isAuth && response?.secondaryInsurance?.insuranceBillType) {
          const methodName = this.secondaryDataFetch ? 'updateInsuranceProfile' : 'createInsuranceProfile';
          return this.api.post<boolean>(`${this.authUrl}/${methodName}`, this.getSecondaryFormattedResponse());
        }
        return of(null);
      }));
  }

  getFormattedResponse() {
    const InsuranceSaveObject = {
      primaryInsurance: { ...this.getInsurance(this.primaryInsurance.insurance, this.primaryInsurance.address) },
      secondaryInsurance: {
        ...this.getInsurance({ ...this.secondaryInsurance.insurance, ...this.secondaryInsurance.insurance.userInfo },
          this.secondaryInsurance.address)
      }
    };
    return InsuranceSaveObject;
  }

  getPrimaryFormattedResponse() {
    const InsuranceSaveObject = {
      primaryInsurance: { ...this.getInsurance(this.primaryInsurance.insurance, this.primaryInsurance.address) },
      secondaryInsurance: null
    };
    return InsuranceSaveObject;
  }

  getSecondaryFormattedResponse() {
    const InsuranceSaveObject = {
      primaryInsurance: null,
      secondaryInsurance: {
        ...this.getInsurance({ ...this.secondaryInsurance.insurance, ...this.secondaryInsurance.insurance.userInfo },
          this.secondaryInsurance.address)
      }
    };
    return InsuranceSaveObject;
  }

  getInsurance(insData: any, addressInfo: any) {
    try {
      if (!insData?.relationship) {
        const insuranceWithSelf = {
          insuranceProfileId: '',
          insuranceMnemonic: insData?.provider?.insuranceMnemonic,
          insuranceType: '',
          insuranceCompanyName: insData?.provider?.insuranceCompanyName,
          insuranceMemberId: insData?.memberId,
          effectiveStartYYYYMM: '',
          effectiveEndYYYYMM: '',
          employerName: '',
          insuranceBillType: this.billType.providerListToPrsList.get(insData?.provider?.billType),
          insuranceGroup: '',
          insuranceGroupNumber: insData?.groupId,
          activeInd: '',
          relation: 'Self',
          addressInfo: {
            address1: addressInfo?.address1,
            address2: addressInfo?.address2,
            city: addressInfo?.city,
            state: addressInfo?.state,
            zip: addressInfo?.zipCode,
          }
        };
        return insuranceWithSelf;
      }
      const insurance = {
        insuranceProfileId: '',
        insuranceMnemonic: insData?.provider?.insuranceMnemonic,
        insuranceType: '',
        insuranceCompanyName: insData?.provider?.insuranceCompanyName,
        insuranceMemberId: insData?.memberId,
        effectiveStartYYYYMM: '',
        effectiveEndYYYYMM: '',
        employerName: '',
        insuranceBillType: this.billType.providerListToPrsList.get(insData?.provider?.billType),
        insuranceGroup: '',
        insuranceGroupNumber: insData?.groupId,
        activeInd: '',
        relation: insData?.relationship,
        demographics: {
          firstName: insData?.firstName,
          lastName: insData?.lastName,
          gender: this.getGenderConversion(insData?.gender),
          dob: this.dateService.toDate(insData?.dateOfBirth),
          phone: insData?.phone?.replace(/-/g, '')
        },
        addressInfo: {
          address1: insData?.addressInfo?.address1,
          address2: insData?.addressInfo?.address2,
          city: insData?.addressInfo?.city,
          zip: insData?.addressInfo?.zipCode,
          state: insData?.addressInfo?.state
        }
      };
      return insurance;
    }
    catch (ex) {
      return null;
    }
  }

  getGenderConversion(value) {
    switch (value.toLowerCase()) {
      case 'male': return 'M';
      case 'female': return 'F';
    }
  }

  getSameas(insuranceData: InsuranceFromPrs) {
    try {
      const { patientAddressInfo: personal } = this.genderFieldsService?.userPersonalData;
      const { addressInfo: prs } = insuranceData;
      if (personal.address1 === prs.address1
        && personal.address2 === prs.address2
        && personal.state === prs.state
        && personal.city === prs.city
        && personal.zipCode === prs.zip) {
        return false;
      }
      return true;
    } catch (e) {
      return true;
    }
  }

  /** save/update insurance END */


  geteorderPrsPrimaryInsurance(): Observable<any> {
    return this.userService.isAuthenticated$.pipe(
      switchMap((isAuth) => {
        if (isAuth) {
          return this.api.get<AuthUserInsurance>(`${this.authUrl}/getInsuranceProfile`).pipe(
            map((insuranceData) => {
              if (insuranceData?.primaryInsurance?.relation.toLowerCase() === 'self') {
                return this.getEorderPrimaryInsuranceData(insuranceData);
              } else {
                return this.getEorderPrimaryInsuranceDatawithSomeoneElse(insuranceData);
              }
            }),
            catchError(() => {
              return of(null);
            }));
        } else {
          return of(null);
        }
      })
    );
  }
  geteorderPrsSecInsurance(): Observable<any> {
    return this.userService.isAuthenticated$.pipe(
      switchMap((isAuth) => {
        if (isAuth) {
          return this.api.get<AuthUserInsurance>(`${this.authUrl}/getInsuranceProfile`).pipe(
            map((insuranceData) => {
              return this.getEorderSecondaryInsuranceData(insuranceData);
            }),
            catchError(() => {
              return of(null);
            }));
        } else {
          return of(null);
        }
      })
    );
  }

  getEorderPrimaryInsuranceDatawithSomeoneElse(ins: AuthUserInsurance) {
    this.primaryDataFetch = true;
    return {
      insurance: {
        insMemberId: ins?.primaryInsurance?.insuranceMemberId,
        insMnemonic: ins?.primaryInsurance?.insuranceMnemonic,
        validInsurance: 'T',
        labCard: false,
        insuranceAddress: null,
        insuranceCity: null,
        insuranceZip: null,
        insuranceState: null,
        insuranceName: ins?.primaryInsurance?.insuranceCompanyName,
        insuranceOptOut: false,
        insuranceBillType: null,
        preregAddress: null,
        preregAddress2: null,
        preregCity: null,
        preregState: null,
        preregZip: null,
        insuranceGroupId: ins?.primaryInsurance?.insuranceGroupNumber,
        primary: false,
        eorderValidInsurance: null
      },
      guarantor: {
        firstName: ins?.primaryInsurance?.demographics.firstName,
        lastName: ins?.primaryInsurance?.demographics.lastName,
        address: ins?.primaryInsurance?.addressInfo?.address1,
        city: ins?.primaryInsurance?.addressInfo?.city,
        state: ins?.primaryInsurance?.addressInfo?.state,
        zip: ins?.primaryInsurance?.addressInfo?.zip,
        phone: ins?.primaryInsurance?.demographics.phone,
        relationship: ins?.primaryInsurance?.relation,
        usePreregAddress: false,
        guarantorOptOut: false,
        dateOfBirth: this.dateService.toDateMMDDYYYY(ins?.primaryInsurance?.demographics.dob),
        gender: getGender(ins?.primaryInsurance?.demographics.gender),
        formatedDate: null,
        address2: ins?.primaryInsurance?.addressInfo?.address2,
        primaryInsAddressSame: !this.getEorderSameas(ins.primaryInsurance)
      },
      emailNotify: false,
      smsNotify: false,
      preRegDemographics: {
        preregAddress: null,
        preregAddress2: null,
        preregCity: null,
        preregState: null,
        preregZip: null
      },
      secondaryInsOptOut: !ins?.secondaryInsurance?.insuranceMemberId
    };
  }
  getEorderPrimaryInsuranceData(ins: AuthUserInsurance) {
    this.primaryDataFetch = true;
    return {
      insurance: {
        insCompanyName: null,
        insMemberId: ins?.primaryInsurance?.insuranceMemberId,
        insMnemonic: ins?.primaryInsurance?.insuranceMnemonic,
        validInsurance: null,
        labCard: false,
        insuranceAddress: null,
        insuranceCity: null,
        insuranceZip: null,
        insuranceState: null,
        insuranceName: ins?.primaryInsurance?.insuranceCompanyName,
        insuranceOptOut: false,
        insuranceBillType: null,
        preregAddress: null,
        preregAddress2: null,
        preregCity: null,
        preregState: null,
        preregZip: null,
        insuranceGroupId: null,
        primary: true,
        eorderValidInsurance: null
      },
      guarantor: {
        firstName: null,
        lastName: null,
        address: null,
        city: null,
        state: null,
        zip: null,
        phone: null,
        relationship: null,
        usePreregAddress: false,
        guarantorOptOut: false,
        dateOfBirth: null,
        gender: null,
        formatedDate: null,
        address2: null,
        primaryInsAddressSame: false
      },
      emailNotify: false,
      smsNotify: false,
      preRegDemographics: {
        preregAddress: null,
        preregAddress2: null,
        preregCity: null,
        preregState: null,
        preregZip: null
      },
      secondaryInsOptOut: !ins?.secondaryInsurance?.insuranceMemberId
    };
  }


  getEorderSecondaryInsuranceData(insuranceData: AuthUserInsurance) {
    if (!insuranceData?.secondaryInsurance) {
      return true;
    }
    let mappedSecondaryInsuranceData = null;
    if (insuranceData?.secondaryInsurance?.relation.toLowerCase() === 'self') {
      mappedSecondaryInsuranceData = {
        secondaryInsOptOut: false,
        secondaryInsurance: {
          primaryInsuranceHolder: true,
          secondaryInsMemberId: insuranceData.secondaryInsurance.insuranceMemberId,
          secondaryInsGroupNumber: insuranceData.secondaryInsurance.insuranceGroupNumber,
          secondaryInsCompanyName: insuranceData.secondaryInsurance.insuranceCompanyName,
          secondaryInsMnemonic: insuranceData.secondaryInsurance.insuranceMnemonic,
          secondaryInsBillType: insuranceData.secondaryInsurance.insuranceBillType
        }
      };
    } else {
      mappedSecondaryInsuranceData = {
        secondaryInsOptOut: false,
        secondaryInsurance: {
          sameas: !this.getEorderSameas(insuranceData.secondaryInsurance),
          primaryInsuranceHolder: false,
          secondaryInsMemberId: insuranceData.secondaryInsurance.insuranceMemberId,
          secondaryInsGroupNumber: insuranceData.secondaryInsurance.insuranceGroupNumber,
          secondaryInsCompanyName: insuranceData.secondaryInsurance.insuranceCompanyName,
          secondaryInsMnemonic: insuranceData.secondaryInsurance.insuranceMnemonic,
          secondaryGtrAddress: {
            address1: insuranceData?.secondaryInsurance?.addressInfo?.address1,
            address2: insuranceData?.secondaryInsurance?.addressInfo?.address2,
            city: insuranceData?.secondaryInsurance?.addressInfo?.city,
            state: insuranceData?.secondaryInsurance?.addressInfo?.state,
            zipCode: insuranceData?.secondaryInsurance?.addressInfo?.zip
          },
          secondaryGtrDemographics: {
            firstName: insuranceData?.secondaryInsurance?.demographics.firstName,
            lastName: insuranceData?.secondaryInsurance?.demographics.lastName,
            dateOfBirth: this.dateService.toDateMMDDYYYY(insuranceData?.secondaryInsurance?.demographics.dob),
            gender: getGender(insuranceData?.secondaryInsurance?.demographics.gender),
            phone: insuranceData?.secondaryInsurance?.demographics.phone,
            relationship: insuranceData?.secondaryInsurance?.relation,
          },
          secondaryInsBillType: insuranceData.secondaryInsurance.insuranceBillType
        }
      };
    }
    if (mappedSecondaryInsuranceData) {
      this.secondaryDataFetch = true;
      if (!this.isModifyFlow) {
        return mappedSecondaryInsuranceData;
        // this.secondaryInsuranceService.setInsuranceData(mappedSecondaryInsuranceData);
      }
    }
    return null;
  }

  getEorderSameas(insuranceData: InsuranceFromPrs) {
    try {
      const { address, address2, state, city, zip } = this.genderFieldsService?.userPersonalData as any;
      const { addressInfo: prs } = insuranceData;
      if (address?.toLowerCase() === prs.address1?.toLowerCase()
        && address2?.toLowerCase() === prs.address2?.toLowerCase()
        && state?.toLowerCase() === prs.state?.toLowerCase()
        && city?.toLowerCase() === prs.city?.toLowerCase()
        && zip?.toLowerCase() === prs.zip?.toLowerCase()) {
        return false;
      }
      return true;
    } catch (e) {
      return true;
    }
  }

  setOpenEorder(value: boolean) {
    this.isOpenEorder.next(value);
  }

  getOpenEorder(): Observable<boolean> {
    return this.isOpenEorderSubject$;
  }

}
