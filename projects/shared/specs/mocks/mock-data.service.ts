import { of } from 'rxjs';
import { UserLocation } from 'shared/models';
import { ReasonCategory } from 'shared/models/reason-category';

export const mockVerifyIdentityData = {
    dob: '11/11/1970',
    lastName: 'verifyUser',
};

export const mockPeronalInfo = {
    address1: '',
    address2: '',
    city: '',
    createAccount: '',
    dateOfBirth: '12/12/2018',
    email: 'sayedsohel@gmail.com',
    firstName: 'sayed',
    gender: 'male',
    insuranceInfo: 'insurance-no',
    isMobile: 'yes',
    lastName: 'sohel',
    password: '',
    phone: '2222222222',
    preferences: {
        preference_email: true,
        preference_mobile: false
    },

    state: '',
    termsOfService: false,
    zipCode: ''
};
export class MockDataService {
    isModifyCancel = false;
    reasonCategory: string;
    isSelectedPurchasedMyOwnTest = false;
    selectedTestForPurchasedMyOwnTest: ReasonCategory[] = [];
    isSelectedLocationPurchasedMyOwnTest = false;
    selectedTestForLocationPurchasedMyOwnTest: ReasonCategory[] = [];
    deepLinkReasonParam:string;
    deepLinkTestList: ReasonCategory[]  = [];
    locationFlowWithScheduleApp = true;
    setSceduleApp = true;
    getTestsData() {
        return of([{
            facilityServiceId: 1,
            facilityTestTypeValue: 'Routine Lab(most common)',
            testDesc: 'Select this option if your tests are not one of the prior options.',
            facServiceId: 'PHLEBOTOMY',
            timeTradeTestingId: 'routine',
            precedence: 1,
            h20TestingId: '1',
            serviceRequestor: null
        }]);
    }


    getReasonData() {
        return of({
            facilityServiceId: 3,
            facilityTestTypeValue: 'Employer Drug and Alcohol',
            testDesc: 'Select this option if your employer ordered a drug and alcohol test for you.',
            precedence: 3,
            serviceRequestor: 'EMPLOYER'
        });
    }
    getNewapptData() {
        return of({
            confirmationCode: 'OEXWHC',
            token: 'Tj_gEjTyLX9tOh3f-4xdrQ1o1yOn7FEpjF6ohGdBMyU4jIlIUltgBJO92H3eTib5dhwyEEg_ypkE-Ae9tS8isg',
            // tslint:disable-next-line: max-line-length
            qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUoAAAFKAQAAAABTUiuoAAAChklEQVR4Xu2ZO3LDMAxE4Unh0kfQUXQ08Wg6io7gUoXHCHZBypSczLjMRMsiGhKPzQZf2vzTNdvx5NclVKhQoUL/CLoY1s29PO2KgwuNxX2l5Utoh47xZ70tYzP6w2Ln9rXGfX8K3aFlOw00Lj6CH8sF982E/oDydLVhniqzHQp9Q32eYnMPQZ+5E/oj6oxYCyPQcMIrch7k9WPEnh41LKQ3CLr70CK0Q9uam5KXB8tobxPa6UoJp2T8CZXDJe16Z7IT+kLjk1FZ8In4jRs2YBeVgYDQF+roK7IW0AhdHb4YurofI/bk6DxFl18rJgRFSxYfFs6xtv5CN9RSSd5g/UQYwxdjERHao9CVvphMuKSFL1JloT3qHIKcwUlfRC2o3jcfugyhhR0rjExvoTImAO4OhfP0KJisBfhEewGmJTv0aUJ3KCMWE2Pt8h29GJLdwNlS6IbCCXOMbE9faYOgi71F7MnRJi8EZaiyFyuGLGdT9rZCN+YCXUe8E4axtRdE8dIj9IU6WlVWTDohbjBiHfLu05tQxxhJXbfOjE9fWIEeIvbsKILzGjtUTNyAEw7RbLBwTokIbbpONVShK40rJ/Da8+/+BWdHg2kzdyY0RGyNX14U2qHs8mMyCiMY5w2UhNqnCe3REJSTUaKFvug4xNPXvtkXGkYGJ/Nahmoe8tdZoR1a15KNK+x0OzxXQOx9Q3J2dIGVMdryWnYZWSCmvssQylBlqeTvQSwJtY1Nm9AeLfkyT2bAywTQgr/2VguEEo1j6uoABm/1E4jQIzpiJIr01mpB5DWMkfuIFeqI2CVfU4cqaLgkkx0DV+iGwungbwjVeoM9h6dLCu3Qj5ZQoUKFCv2v6DcvDtJUnzJPEgAAAABJRU5ErkJggg=='
        });
    }
    getPersonalData() {
        return of({
            address1: '',
            address2: '',
            city: '',
            createAccount: '',
            dateOfBirth: '12/12/2018',
            email: 'sayedsohel@gmail.com',
            firstName: 'sayed',
            gender: 'male',
            insuranceInfo: 'insurance-no',
            isMobile: 'yes',
            lastName: 'sohel',
            password: '',
            phone: '2222222222',
            preferences: {
                preference_email: true,
                preference_mobile: false
            },

            state: '',
            termsOfService: false,
            zipCode: ''
        });
    }

    getappointmentData() {
        return of({
            data: {
                address1: '160 W 26Th St',
                address2: null,
                appointmentDate: '2019-10-24',
                appointmentTime: '12:45',
                city: 'New York',
                name: 'Quest Diagnostics - NYC-26th St PSC - Employer Drug Testing Not Offered',
                phone: '6466468031',
                siteCode: 'T2O',
                state: 'NY',
                zip: '10001-6975',
                labCard: 'true'
            }
        });
    }

    getUserLocation() {
        return of({
            data: {
                latitude: 5,
                longitude: 5
            }
        });
    }

    getIsQuestAccountCreated() {
        return of(null);
    }

    getInsuranceData() {
        return of({
            data: {
                sameas: true,
                provider: 'test',
                memberId: 'test',
                groupId: '',
                relationship: '',
                isPrimaryInsuranceHolder: true,
                firstName: 'ajay',
                lastName: 'anireddy',
                dateOfBirth: '11/22/1986',
                gender: 'male',
                phone: '908-332-1767',
                address1: '',
                address2: '',
                city: '',
                state: '',
                zipCode: '',
                labCard: 'true',
                differentPersonalAddress: {
                    address1: '',
                    address2: '',
                    city: '',
                    state: '',
                    zipCode: ''
                }
            }
        });
    }
    setUserLocation(location: UserLocation) {
    }

    setappointmentData(appointment: any) {
    }

    setInsuranceData(appointment: any) {
    }
    getfindLocationReason() {
        return of({

            facilityServiceId: 1,
            facilityTestTypeValue: 'All Other Tests',
            testDesc: 'Select this option for the majority of your testing needs that are not listed below.',
            precedence: 1,
            serviceRequestor: null,
        });
    }
    setfindLocationReason(reason: any) {
    }

    getReasonType() {
        return of(true);
    }
    setLocationFinderDetailsFlowtoReason(lcnFlow: boolean) {
    }
    getLocationFinderDetailsFlowtoReason() {
        return of(true);
    }
    setReasonType(reason: any) {
    }
    getblnEditReasonData() {
        return of(true, 'some url');
    }
    setblnEditReasonData(blnedit: boolean) {
    }
    getblnShowLocError() {
        return of(false);
    }
    setblnShowLocError(data: any) { }

    setEditReason(reason: any) { }

    getEditReason() {
        return of({
            facilityServiceId: 2,
            facilityTestTypeValue: 'Glucose',
            testDesc: 'Select this option to let us know your specific glucose testing need.',
            precedence: 2,
            serviceRequestor: 'GLUCOSE'
        });
    }

    setReasonData(reason) { }

    setTestsData(reason) { }

    onDateChanged(date: string) {

    }

    getappointmentDataForEdit() {
        return of({
            pscDetails: {
                siteCode: 'BWT',
                name: 'Quest Diagnostics - Bound Brook ',
                address1: '601 W Union Ave',
                address2: null,
                city: 'Bound Brook',
                state: 'NJ',
                zip: '08805-1166',
                phone: '7327321450',
                fax: '7325631242',
                waitTime: 3,
                siteHoursStatus: 'Closed - Reopens at 1:00 P',
                landmark: 'Located in the Shop Rite Shopping Center',
                parking: 'Shared retail lot',
                timeZone: 'America/New_York',
                regularHours: {},
                glucoseHours: {},
                labCard: true,
                drugHours: {},
                services: ['All Other Tests', 'Employer Health and Wellness', 'T-SPOT.<i>TB</i> test (tuberculosis)',
                    'Purchased My Own Test', 'Electronic Order', 'Glucose Tolerance(1-3 hours) ', 'Glucose(most common)',
                    'Urine', 'Urine Drug Test DOT- Electronic', 'Urine - Federally mandated'],
                servicesNotOffered: ['Employer Drug and Alcohol', 'Glucose', 'Urine - Observed',
                    'Urine - Express Results<sup>TM</sup>  Online', 'Oral Fluid',
                    'Hair', 'Breath Alcohol', '<i>All of Us</i> Research Program'],
                popularHours: {},
                saturdayHoursByAppt: null,
                newSiteAddress: null,
                siteType: 'PSC',
                customMessage: null,
                tspotHours: null,
                echeckIn: null
            },
            pscLocationAvailability: {
                availability: [{
                    date: '2020-01-24',
                    slots: [{
                        time: '07:30',
                        available: false
                    },
                    {
                        time: '07:45',
                        available: false
                    },
                    {
                        time: '08:00',
                        available: false
                    },
                    {
                        time: '08:15',
                        available: false
                    },
                    {
                        time: '08:30',
                        available: false
                    },
                    {
                        time: '08:45',
                        available: false
                    },
                    {
                        time: '09:00',
                        available: false
                    },
                    {
                        time: '09:15',
                        available: false
                    },
                    {
                        time: '09:30',
                        available: false
                    },
                    {
                        time: '09:45',
                        available: false
                    },
                    {
                        time: '10:00',
                        available: false
                    },

                    {
                        time: '10:15',
                        available: false
                    },

                    {
                        time: '10:30',
                        available: false
                    },

                    {
                        time: '10:45',
                        available: false
                    },

                    {
                        time: '11:00',
                        available: false
                    },

                    {
                        time: '11:15',
                        available: false
                    },

                    {
                        time: '11:30',
                        available: false
                    },

                    {
                        time: '11:45',
                        available: false
                    },
                    {
                        time: '13:00',
                        available: false
                    },

                    {
                        time: '13:15',
                        available: false
                    },

                    {
                        time: '13:30',
                        available: false
                    },

                    {
                        time: '13:45',
                        available: false
                    },

                    {
                        time: '14:00',
                        available: false
                    },

                    {
                        time: '14:15',
                        available: false
                    },

                    {
                        time: '14:30',
                        available: false
                    },
                    {
                        time: '14:45',
                        available: false
                    },
                    {
                        time: '15:00',
                        available: true
                    },
                    {
                        time: '15:15',
                        available: false
                    },
                    ]

                }]
            },
            appointmentDetails: {
                siteCode: 'BWT',
                firstName: 'ajay',
                facilityServiceId: [1],
                appointmentDate: '2020-01-24',
                appointmentTime: '14:00',
                labCard: false,
                address1: '160 W 26Th St'
            },
            confirmationCode: 'KKIEDI',
            demographicDetails: {
                address: '160 W 26Th St',
                address2: null,
                city: 'New York',
                phone: '6466468031',
                phoneType: 'Mobile',
                state: 'NY',
                zip: '10001-6975',
                firstName: 'STINCHCOMB',
                lastName: 'GREGORY',
                gender: 'M',
                dob: '1964-11-26T18:30:00.000+0000',
                email: 'unit.test@aaabbb.com',
                labCardStatus: false
            }
        });
    }

    getmodifyAppointmentDataForEdit() {
        return of({
            appointmentDetails: {
                siteCode: 'BWT',
                firstName: 'Hello',
                facilityServiceId: [22],
                appointmentDate: '2020-01-24',
                appointmentTime: '14:00',
                labCard: false,
                address1: '160 W 26Th St'
            },
            confirmationCode: 'INSAPPTEDIT',
            demographicData: {
                address: '160 W 26Th St',
                address2: null,
                city: 'New York',
                phone: '6466468031',
                phoneType: 'Mobile',
                state: 'NY',
                zip: '10001-6975',
                firstName: 'Hello',
                lastName: 'World',
                gender: 'M',
                dob: '1964-11-26T18:30:00.000+0000',
                email: 'unit.test@aaabbb.com',
            }
        });
    }

    getVerificationInfo() {
        return of({
            confirmationCode: 'KKIEDI',
            phone: '9083321767'
        });
    }
    setlocationFlowtoSchedule(lcnFlow: boolean) {
    }
    getlocationFlowtoSchedule() {
        return of(false);
    }
    getFindLocationFlow(){
        return of(true);
    }

    setlabCardLocationSearch(lcnFlow: boolean) {
    }
    getlabCardLocationSearch() {
        return of(false);
    }

    setNewapptData(data){
    }

    setReasonDataFindLocation(data) {
    }
    getfindLocationSelectedLocation() {
        return of({
            siteCode: 'CQN',
            name: 'Quest Diagnostics - Los Angeles1127 Wilshire',
            address1: '1127 Wilshire Blvd',
            address2: 'Ste 203 & 204',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90017-3901',
            phone: '2132130164',
            fax: '2139770174',
            distance: '1.07',
            waitTime: 6,
            siteType: 'PSC',
            customMessage: null,
            labCard: true,
            availability: null,
            appointmentsOnly: false,
            echeckin: 'T',
            siteHoursStatus: 'Closed - Opens at 8:00 A'
        });
    }
    getReasonDataFindLocation() {
        return of({
            siteCode: 'T2O',
            zip: '10001-6975',
            facilityServiceId: 1
        });
    }
    setVerificationInfo() {
        return of(null);
    }

    setSelectedLocationService(data: string[]) { }

    getSelectedLocationService() {
        return of(['All Other Tests', 'Employer Health and Wellness',
            'Purchased My Own Test', 'Electronic Order', 'Glucose Tolerance(1-3 hours) ',
            'Glucose(most common)', 'Urine', 'Urine Drug Test DOT- Electronic',
            'Urine - Federally mandated']);
    }

    setPreviousPage(url: string) {

    }

    getPreviousPage() {
        return of(null);
    }
    setAppState(type, value) {

    }

    getAppState() {
        return of({});
    }

    setMarkerAddress(type, value) {

    }

    getMarkerAddress() {
        return of({});
    }

    setfindLocationSelectedLocation(value) {

    }
    clearScheduleAppFlag() {
        return of(false);
    }

    getPeaceOfMindState(){
        return of(null);
    }
    setPeaceOfMindState(data: boolean) {
  }
  setHideInsuranceInfo(data: boolean) {

  }
  getHideInsuranceInfo() {
      return of(true);
  }
  setReasonValue(data: boolean) {
  }
  getReasonValue() {
    return of(true);
  }
  setDeepLinkReasonFlag(data) {
  }
  getDeepLinkReasonFlag() {
    return of(true);
  }
  setQueryParams(data) {
  }
  getParams() {
    return of(true);
  }
  getReasonNotSupportedError() {
    return of(false);
  }
  setReasonNotSupportedError(data: boolean) { }
  setdeepLinkLabcardFlag(data) {
  }
  getdeepLinkLabcardFlag() {
    return of(true);
  }
  setCovidSymptomsData(data) {
  }
  getCovidSymptomsData() {
    return of(null);
  }
}
