import { ReasonCategory } from 'shared/models/reason-category';

export const mockCovidAntiBodyReasonCategory: ReasonCategory = {
    facilityServiceId: 25,
    facilityTestType: 'COVID ANTIBODY TEST',
    facilityTestTypeValue: 'COVID-19 Antibody Test',
    precedence: 7,
    serviceRequestor: null,
    testDesc: 'This blood test detects antibodies that are the result of past or recent exposure to COVID-19'
};

export const mockCovidActiveInfectionReasonCategory: ReasonCategory = {
    facilityServiceId: 26,
    facilityTestType: 'COVID INFECTION TEST',
    facilityTestTypeValue: 'COVID-19 Infection Test',
    precedence: 7,
    serviceRequestor: null,
    testDesc: 'This swab test detects whether you currently have an active COVID-19 infection'
};

export const mockAllTestsReasoncategory: ReasonCategory = {
    facilityServiceId: 1,
    facilityTestType: 'PHLEBOTOMY',
    facilityTestTypeValue: 'All Other Tests',
    precedence: 7,
    serviceRequestor: null,
    testDesc: 'This swab test detects whether you currently have an active COVID-19 infection'
};
