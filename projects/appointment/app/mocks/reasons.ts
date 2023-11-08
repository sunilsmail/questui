import { ReasonCategory } from 'shared/models/reason-category';

export const REASONS: ReasonCategory[] = [
    {
        'facilityServiceId': 1,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'All Other Tests',
        'testDesc': 'Select this option if your tests are not one of the prior options.',
        'precedence': 1,
        'serviceRequestor': null,
    },
    {
        'facilityServiceId': 2,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Employer Drug and Alcohol',
        'testDesc': 'Select this option if your employer ordered a drug and alcohol test for you.',
        'precedence': 2,
        'serviceRequestor': 'EMPLOYER',
    },
    {
        'facilityServiceId': 3,
        'facilityTestType': 'PHLEBOTOMY',

        'facilityTestTypeValue': 'Health and Wellness Screening',
        'testDesc': 'Employer or health plan sponsored Health -- Wellness screening.',
        'precedence': 3,
        'serviceRequestor': null,
    },
    {
        'facilityServiceId': 4,
        'facilityTestTypeValue': 'Glucose',
        'facilityTestType': 'PHLEBOTOMY',
        'testDesc': 'Select this option to let us know your specific glucose testing need.',
        'precedence': 4,
        'serviceRequestor': 'GLUCOSE',
    },
    {
        'facilityServiceId': 5,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'T-SPOT.<i>TB</i> test',
        'testDesc': 'T-SPOT.TB test is a blood test for tuberculosis (TB) screening performed in one visit,'
        +'using one blood collection tube.',
        'precedence': 5,
        'serviceRequestor': null,
    },
    {
        'facilityServiceId': 6,
        'facilityTestType': 'PHLEBOTOMY',
        'facilityTestTypeValue': 'Quest Order',
        'testDesc': 'Select this option if you have purchased a test from Quest.',
        'precedence': 6,
        'serviceRequestor': null,
    }
];
