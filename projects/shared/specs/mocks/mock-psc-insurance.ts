export const PrimaryAndSecondaryInsurance = {
  'primaryInsurance': {
    'insuranceProfileId': '1906771',
    'insuranceMnemonic': 'AUSHC',
    'insuranceType': 'PRIMARY',
    'insuranceCompanyName': 'AETNA',
    'insuranceMemberId': 'W987654321',
    'effectiveStartYYYYMM': null,
    'effectiveEndYYYYMM': null,
    'employerName': null,
    'insuranceBillType': 'Private Ins',
    'insuranceGroup': null,
    'insuranceGroupNumber': null,
    'activeInd': null,
    'relation': 'Dependent',
    'demographics': {
      'firstName': 'SelligaD',
      'lastName': 'ManiS',
      'gender': 'M',
      'dob': '2000-01-01',
      'phone': '8341664720'
    },
    'addressInfo': {
      'address1': '45040 Lightsway Drive',
      'address2': null,
      'city': 'Novi',
      'zip': '48375',
      'state': 'MI'
    }
  },
  'secondaryInsurance': {
    'insuranceProfileId': '1906772',
    'insuranceMnemonic': 'CGM',
    'insuranceType': 'SECONDARY',
    'insuranceCompanyName': 'CIGNA',
    'insuranceMemberId': 'W987654321',
    'effectiveStartYYYYMM': null,
    'effectiveEndYYYYMM': null,
    'employerName': null,
    'insuranceBillType': 'Private Ins',
    'insuranceGroup': null,
    'insuranceGroupNumber': null,
    'activeInd': null,
    'relation': 'Dependent',
    'demographics': {
      'firstName': 'SunilKumar',
      'lastName': 'Amujuri',
      'gender': 'M',
      'dob': '2000-01-01',
      'phone': '8341667400'
    },
    'addressInfo': {
      'address1': '45040 Corte Rosa',
      'address2': null,
      'city': 'Novi',
      'zip': '48375',
      'state': 'MI'
    }
  }
};


export const FormattedPrimaryInsurance = {
  'data': {
    'sameas': true,
    'provider': {
      'insuranceCompanyName': 'AETNA',
      'insuranceMnemonic': 'AUSHC',
      'genericCarrier': false,
      'billType': undefined
    },
    'memberId': 'W987654321',
    'groupId': null,
    'relationship': 'Dependent',
    'isPrimaryInsuranceHolder': 'false',
    'labCard': 'false',
    'firstName': 'SelligaD',
    'lastName': 'ManiS',
    'dateOfBirth': '01/01/2000',
    'gender': 'Male',
    'phone': '8341664720',
    'secondaryInsurance': 'true',
    'addressInfo': {
      'address1': '45040 Lightsway Drive',
      'address2': null,
      'city': 'Novi',
      'state': 'MI',
      'zipCode': '48375'
    }
  },
  'bringCarderror': false,
  'isValidMemberId':true
};

export const FormattedSecondaryInsurance = {
  'sameas': true,
  'provider': {
    'insuranceCompanyName': 'CIGNA',
    'insuranceMnemonic': 'CGM',
    'genericCarrier': false,
    'billType': undefined
  },
  'memberId': 'W987654321',
  'groupId': null,
  'isPrimaryInsuranceHolder': 'false',
  'userInfo': {
    'firstName': 'SunilKumar',
    'lastName': 'Amujuri',
    'dateOfBirth': '01/01/2000',
    'gender': 'Male',
    'phone': '8341667400',
    'relationship': 'Dependent'
  },
  'addressInfo': {
    'address1': '45040 Corte Rosa',
    'address2': null,
    'city': 'Novi',
    'state': 'MI',
    'zipCode': '48375'
  },
  'bringCarderror': false,
  'isValidMemberId': true
};
