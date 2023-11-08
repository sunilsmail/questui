export const reasonsList = [
    [
        {
            'facilityServiceId': 4,
            'facilityTestType': 'Glucose',
            'facilityTestTypeValue': 'Glucose',
            'testDesc': 'Select this option to let us know your specific glucose testing need.',
            'precedence': 1,
            'serviceRequestor': 'GLUCOSE',
            'activeInd': true,
            'skipInsurance': false,
            'visitCategory': null
        },
        {
            'facilityServiceId': 1,
            'facilityTestType': 'PHLEBOTOMY',
            'facilityTestTypeValue': 'All Other Tests',
            'testDesc': 'Select this option for the majority of your testing needs that are not listed below.',
            'precedence': 2,
            'serviceRequestor': null,
            'activeInd': true,
            'skipInsurance': false,
            'visitCategory': null
        },
        {
            'facilityServiceId': 2,
            'facilityTestType': 'Employer Drug and Alcohol',
            'facilityTestTypeValue': 'Employer Drug and Alcohol',
            'testDesc': 'Select this option if your employer ordered a drug and alcohol test for you.',
            'precedence': 3,
            'serviceRequestor': 'EMPLOYER',
            'activeInd': true,
            'skipInsurance': true,
            'visitCategory': null
        }
    ],
    [
        {
            'facilityServiceId': 16,
            'facilityTestType': 'PHLEBOTOMY',
            'facilityTestTypeValue': 'Glucose(most common)',
            'testDesc': 'This is a typical 15-minute draw to determine your blood sugar (glucose) levels.',
            'precedence': 1,
            'serviceRequestor': null,
            'activeInd': true,
            'skipInsurance': false,
            'visitCategory': null
        },
        {
            'facilityServiceId': 15,
            'facilityTestType': 'GLUCOSE TOLERANCE',
            'facilityTestTypeValue': 'Glucose Tolerance(1-3 hours) ',
            'testDesc': 'Determines your blood sugar (glucose) levels taken at timed intervals over 1-3 hours to screen for diabetes,',
            'precedence': 2,
            'serviceRequestor': null,
            'activeInd': true,
            'skipInsurance': false,
            'visitCategory': null
        }
    ],
    [
        {
            'facilityServiceId': 12,
            'facilityTestType': 'ELECTRONIC CFF',
            'facilityTestTypeValue': 'Electronic Order',
            'testDesc': 'Select this option if you were NOT provided a multi-part paper form for drug testing.',
            'precedence': 1,
            'serviceRequestor': null,
            'activeInd': true,
            'skipInsurance': true,
            'visitCategory': null
        },
        {
            'facilityServiceId': 18,
            'facilityTestType': 'SAP (NON-DOT) COLLECTIONS',
            'facilityTestTypeValue': 'Urine',
            'testDesc': 'Detects the presence of drugs using a urine sample. ',
            'precedence': 2,
            'serviceRequestor': null,
            'activeInd': true,
            'skipInsurance': true,
            'visitCategory': null
        },
        {
            'facilityServiceId': 20,
            'facilityTestType': 'NIDA (DOT) COLLECTIONS',
            'facilityTestTypeValue': 'Urine - Federally mandated',
            'testDesc': 'For employees covered under U.S. Department of Transportation (DOT)',
            'precedence': 3,
            'serviceRequestor': null,
            'activeInd': true,
            'skipInsurance': true,
            'visitCategory': null
        }
    ]
];
