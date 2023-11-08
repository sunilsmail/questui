import { ReasonCategory } from 'shared/models/reason-category';

export const glucoseTests: ReasonCategory[] = [
    {
        'facilityServiceId': 1,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'All Other Tests',
        'testDesc': 'Select this option if your tests are not one of the prior options.',
        'precedence': 1,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 2,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Employer Drug and Alcohol',
        'testDesc': 'Select this option if your employer ordered a drug and alcohol test for you.',
        'precedence': 2,
        'serviceRequestor': 'EMPLOYER'
    },
    {
        'facilityServiceId': 3,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Health and Wellness Screening',
        'testDesc': 'Employer or health plan sponsored Health -- Wellness screening.',
        'precedence': 3,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 4,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Glucose',
        'testDesc': 'Select this option to let us know your specific glucose testing need.',
        'precedence': 4,
        'serviceRequestor': 'GLUCOSE'
    },
    {
        'facilityServiceId': 5,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'T-SPOT.<i>TB</i>    test',
        'testDesc': 'T-SPOT.TB test is a blood test for tuberculosis (TB) screening performed in one visit,'
        +'using one blood collection tube.',
        'precedence': 5,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 6,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Quest Order',
        'testDesc': 'Select this option if you have purchased a test from Quest.',
        'precedence': 6,
        'serviceRequestor': null
    }
];

export const employerTests: ReasonCategory[] = [
    {
        'facilityServiceId': 7,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Urine Drug Test Electronic',
        'testDesc': 'Detects the presence of drugs using a urine sample. Typically used for pre-employment, '
        +'random or post-accident testing. Order placed electronically by employer.',
        'precedence': 1,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 8,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Urine Drug Test Paper',
        'testDesc': 'Detects the presence of drugs using a urine sample. Typically used for pre-employment, '
        +'random or post-accident testing. Donor provided paper order form.',
        'precedence': 2,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 9,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Urine Drug Test DOT- Paper',
        'testDesc': 'Urine testing for employees covered under Federal Department of Transportation testing guidelines. '
        +'Typically used for pre-employment, random or post-accident testing. Donor provided paper order form.',
        'precedence': 3,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 10,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Urine Drug Test Observed',
        'testDesc': 'Directly observed urine test that detects the presence of drugs using'+
        ' a urine sample and requires a collector to be present while the donor provides a specimen.',
        'precedence': 4,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 11,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Urine Drug Test Express Results Online',
        'testDesc': 'Detects the presence of drugs using a urine sample.',
        'precedence': 5,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 12,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Oral Fluid Drug Test',
        'testDesc': 'Detects the presence of drugs using an oral fluid sample.',
        'precedence': 6,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 13,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Hair Drug Test',
        'testDesc': 'Detects the presence of drugs using a hair sample.',
        'precedence': 7,
        'serviceRequestor': null
    },
    {
        'facilityServiceId': 14,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Breath Alcohol Test',
        'testDesc': 'Detects the presence of alcohol using a breathalyzer.',
        'precedence': 8,
        'serviceRequestor': null
    }
];
