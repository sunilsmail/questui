import { of } from 'rxjs';
import { ExpiryStatus } from 'shared/models';


export class MockEorderDataService {

    expiryType = ExpiryStatus.orderHasExpired;
    eOrderFlowActivatedSubject$= of(true);
    getReasonData() {
        return of({
            facilityServiceId: 3,
            facilityTestTypeValue: 'Employer Drug and Alcohol',
            testDesc: 'Select this option if your employer ordered a drug and alcohol test for you.',
            precedence: 3,
            serviceRequestor: 'EMPLOYER'
        });
    }
    getEorderNewapptData() {
        return of({
            confirmationCode: 'OEXWHC',
            token: 'Tj_gEjTyLX9tOh3f-4xdrQ1o1yOn7FEpjF6ohGdBMyU4jIlIUltgBJO92H3eTib5dhwyEEg_ypkE-Ae9tS8isg',
            // tslint:disable-next-line: max-line-length
            qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUoAAAFKAQAAAABTUiuoAAAChklEQVR4Xu2ZO3LDMAxE4Unh0kfQUXQ08Wg6io7gUoXHCHZBypSczLjMRMsiGhKPzQZf2vzTNdvx5NclVKhQoUL/CLoY1s29PO2KgwuNxX2l5Utoh47xZ70tYzP6w2Ln9rXGfX8K3aFlOw00Lj6CH8sF982E/oDydLVhniqzHQp9Q32eYnMPQZ+5E/oj6oxYCyPQcMIrch7k9WPEnh41LKQ3CLr70CK0Q9uam5KXB8tobxPa6UoJp2T8CZXDJe16Z7IT+kLjk1FZ8In4jRs2YBeVgYDQF+roK7IW0AhdHb4YurofI/bk6DxFl18rJgRFSxYfFs6xtv5CN9RSSd5g/UQYwxdjERHao9CVvphMuKSFL1JloT3qHIKcwUlfRC2o3jcfugyhhR0rjExvoTImAO4OhfP0KJisBfhEewGmJTv0aUJ3KCMWE2Pt8h29GJLdwNlS6IbCCXOMbE9faYOgi71F7MnRJi8EZaiyFyuGLGdT9rZCN+YCXUe8E4axtRdE8dIj9IU6WlVWTDohbjBiHfLu05tQxxhJXbfOjE9fWIEeIvbsKILzGjtUTNyAEw7RbLBwTokIbbpONVShK40rJ/Da8+/+BWdHg2kzdyY0RGyNX14U2qHs8mMyCiMY5w2UhNqnCe3REJSTUaKFvug4xNPXvtkXGkYGJ/Nahmoe8tdZoR1a15KNK+x0OzxXQOx9Q3J2dIGVMdryWnYZWSCmvssQylBlqeTvQSwJtY1Nm9AeLfkyT2bAywTQgr/2VguEEo1j6uoABm/1E4jQIzpiJIr01mpB5DWMkfuIFeqI2CVfU4cqaLgkkx0DV+iGwungbwjVeoM9h6dLCu3Qj5ZQoUKFCv2v6DcvDtJUnzJPEgAAAABJRU5ErkJggg=='
        });
    }
    getPersonalInformation() {
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

    getAlternateFlow() {
        return of({
            value: true
        });
    }
    getPriceEstimation() {
        return of('25');
    }
    getFacilityServiceId () {
        return of([1]);
    }

    setPriceEstimate(input: any){}

    isEorderFlowActivated(value: any){}
    setEorderFlow(value: any){}
}
