import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiService } from 'shared/services/api.service';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { mockReasonList } from 'shared/specs/mocks/mock-appointment.service';
import { MockFindAppointmentService } from 'shared/specs/mocks/mock-find-appointment';
import { AppointmentService } from './appointment.service';
import { DataService } from './data.service';
import { FindAppointmentService } from './find-appointment.service';



describe('AppointmentService', () => {
  let service: AppointmentService;
  let apiMock: any;
  let findAppointmentService: FindAppointmentService;
  const mockReasonData = [
    {
      facilityServiceId: 1,
      facilityTestType: 'PHLEBOTOMY',
      facilityTestTypeValue: 'All Other Tests',
      testDesc: 'Select this option for the majority of your testing needs that are not listed below.',
      precedence: 1,
      serviceRequestor: null,
      activeInd: true,
      skipInsurance: false
    },
    {
      facilityServiceId: 4,
      facilityTestType: 'Glucose',
      facilityTestTypeValue: 'Glucose',
      testDesc: 'Select this option to let us know your specific glucose testing need.',
      precedence: 2,
      serviceRequestor: 'GLUCOSE',
      activeInd: true,
      skipInsurance: false
    },
    {
      facilityServiceId: 28,
      facilityTestType: 'ASYMPTOMATIC COVID TEST',
      facilityTestTypeValue: 'Asymptomatic Covid Test',
      testDesc: 'Asymptomatic Covid Testing tool tip',
      precedence: 9,
      serviceRequestor: null,
      activeInd: false,
      skipInsurance: false
    },
    {
      facilityServiceId: 29,
      facilityTestType: 'ASYMPTOMATIC PCR TEST',
      facilityTestTypeValue: 'Asymptomatic PCR Test',
      testDesc: 'Asymptomatic PCR Testing tool tip',
      precedence: 10,
      serviceRequestor: null,
      activeInd: false,
      skipInsurance: false
    },
    {
      facilityServiceId: 2,
      facilityTestType: 'Employer Drug and Alcohol',
      facilityTestTypeValue: 'Employer Drug and Alcohol',
      testDesc: 'Select this option if your employer ordered a drug and alcohol test for you.',
      precedence: 1,
      serviceRequestor: 'EMPLOYER',
      activeInd: true,
      skipInsurance: false
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppointmentService,
        DataService,
        { provide: ApiService, useClass: MockApiService },
        { provide: FindAppointmentService, useClass: MockFindAppointmentService }
      ]
    });

    service = TestBed.inject(AppointmentService);
    apiMock = TestBed.inject(ApiService);
    findAppointmentService = TestBed.inject(FindAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getReasons', () => {

    beforeEach(() => {
      spyOn(apiMock, 'get').and.returnValue(of(mockReasonData));
    });


    it('gets the list of reasons', () => {
      service.getReasons('MAIN', mockReasonData[0]).subscribe(reasons => {
        expect(reasons.length).toEqual(3);
        expect(apiMock.get).toHaveBeenCalledWith('/guest/getReasons/MAIN');
      });
    });

    it('calling api with serviceRequestor as Employer', () => {
      service.getReasons('EMPLOYER').subscribe();
      expect(apiMock.get).toHaveBeenCalledWith('/guest/getReasons/EMPLOYER');
    });

    it('calling api with serviceRequestor as GLUCOSE', () => {
      service.getReasons('GLUCOSE').subscribe();
      expect(apiMock.get).toHaveBeenCalledWith('/guest/getReasons/GLUCOSE');
    });

    it('calling api with serviceRequestor as PURCHASETEST', () => {
      service.getReasons('PURCHASETEST').subscribe();
      expect(apiMock.get).toHaveBeenCalledWith('/guest/getReasons/PURCHASETEST');
    });

    it('it should call with selected category', () => {
      service.getReasons('EMPLOYER', mockReasonData[0]).subscribe(res => {
        expect(res.filter(item => item.serviceRequestor === 'EMPLOYER').length).toEqual(1);
      });
    });

    it('gets the list of reasons in deeplink flow', () => {
      service.getReasons('MAIN', mockReasonData[0],true).subscribe(reasons => {
        expect(reasons.length).toEqual(5);
      });
    });

    it('gets the list of reasons with out deeplink flow', () => {
      service.getReasons('MAIN', mockReasonData[0],false).subscribe(res => {
        expect(res.length).toEqual(3);
      });
    });
  });


  describe('#getSkipInsurance', () => {

    it('it should call getSkipInsurance', () => {
      const result = service.getSkipInsurance('PURCHASETEST');
      expect(result).toEqual(false);
    });

    it('getSkipInsurance return true', () => {
      mockReasonList[0].skipInsurance = true;
      const result = service.getSkipInsurance('PURCHASETEST', mockReasonList[0]);
      expect(result).toEqual(true);
    });

    it('getSkipInsurance return false', () => {
      mockReasonList[0].skipInsurance = false;
      const result = service.getSkipInsurance('PURCHASETEST', mockReasonList[0]);
      expect(result).toEqual(false);
    });

  });

  describe('#getVisitCategory', () => {
    it('it should retun Quest if category has PURCHASETEST', () => {
      expect(service.getVisitCategory('PURCHASETEST')).toEqual('QuestDirect');
    });
    it('it should return null', () => {
      expect(service.getVisitCategory('')).toBeNull();
    });
  });

});
