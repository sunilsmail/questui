import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { CostEstimateStatus } from 'shared/models/eorder';
import { ReasonCategory } from 'shared/models/reason-category';
import { AppointmentService } from 'shared/services/appointment.service';
import { CostEstimateService } from 'shared/services/eorder/easy-pay/cost-estimate.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { PropertiesService } from 'shared/services/properties.service';
import { MockAppointmentService } from 'shared/specs/mocks/mock-appointment.service';
import { MockCostEstimateService } from 'shared/specs/mocks/mock-cost-estimate.service';
import { MockEorderDataService } from 'shared/specs/mocks/mock-eorder-data.service';
import { MockEorderService } from 'shared/specs/mocks/mock-eorder.service';
import { mockReasonList } from 'shared/specs/mocks/mock-insurance.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsEorderConfirmationComponent } from './as-eorder-confirmation.component';


const MockActivatedRoute = {
  params: of({ confirmationCode: 'confirm' })
};

describe('AsEorderConfirmationComponent', () => {
  let component: AsEorderConfirmationComponent;
  let fixture: ComponentFixture<AsEorderConfirmationComponent>;
  let eorderDataService: EorderDataService;
  let eorderService: EorderService;
  let route: ActivatedRoute;
  // let eOorderEasyPayService: EorderEasyPayService;
  let appointmentService: AppointmentService;
  let propertiesService: PropertiesService;
  let costEstimateService: CostEstimateService;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsEorderConfirmationComponent],
      imports: [CustomPipesModule,
        RouterTestingModule,
        HttpClientTestingModule],
      providers: [
        { provide: EorderDataService, useClass: MockEorderDataService },
        { provide: EorderService, useClass: MockEorderService },
        { provide: ActivatedRoute, useValue: MockActivatedRoute },
        { provide: AppointmentService, useClass: MockAppointmentService },
        //  { provide: EorderEasyPayService, useClass: MockEorderEasyPayService },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: CostEstimateService, useClass: MockCostEstimateService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsEorderConfirmationComponent);
    eorderDataService = TestBed.inject(EorderDataService);
    eorderService = TestBed.inject(EorderService);
    route = TestBed.inject(ActivatedRoute);
    //  eOorderEasyPayService = TestBed.inject(EorderEasyPayService);
    appointmentService = TestBed.inject(AppointmentService);
    propertiesService = TestBed.inject(PropertiesService);
    costEstimateService = TestBed.inject(CostEstimateService);
    component = fixture.componentInstance;
    spyOn(window, 'print').and.stub();
    fixture.detectChanges();
  });
  describe('#getBasicEncounterInfo', () => {
    it('should get demographics Info', () => {
      spyOn(eorderService, 'getBasicEncounterInfo').and.callThrough();
    });
  });

  describe('#getPriceEstimate', () => {

    it('without f89 call getPriceFromCostEstimateScreen', () => {
      const data = new CostEstimateStatus();
      data.quotedCost = 10;
      data.skipCostEstimate = true;
      data.type = 'COMPLETED';
      spyOn(component, 'getPriceFromCostEstimateScreen').and.callThrough();
      spyOn(propertiesService, 'getEaypayEnhancementF89').and.returnValue(of(false));
      spyOn(costEstimateService, 'getCostEstimate').and.returnValue(of(data));
      spyOn(eorderDataService, 'getPriceEstimation').and.returnValue(of(10));
      component.getPriceEstimate();
      expect(costEstimateService.getCostEstimate).not.toHaveBeenCalled();
      expect(component.getPriceFromCostEstimateScreen).toHaveBeenCalled();
      expect(+component.estimatedCost).toBe(10);
    });
    it('with f89 call costEstimateService getCostEstimate', () => {
      const data = new CostEstimateStatus();
      data.quotedCost = 10;
      data.skipCostEstimate = true;
      data.type = 'COMPLETED';
      spyOn(component, 'getPriceFromCostEstimateScreen').and.callThrough();
      spyOn(propertiesService, 'getEaypayEnhancementF89').and.returnValue(of(true));
      spyOn(costEstimateService, 'getCostEstimate').and.returnValue(of(data));
      spyOn(eorderDataService, 'getPriceEstimation').and.returnValue(of(10));
      component.getPriceEstimate();
      expect(costEstimateService.getCostEstimate).toHaveBeenCalled();
      expect(component.getPriceFromCostEstimateScreen).not.toHaveBeenCalled();
      expect(+component.estimatedCost).toBe(10);
    });
    it('with f89 call getPriceFromCostEstimateScreen when skipCostEstimate is false', () => {
      const data = new CostEstimateStatus();
      data.quotedCost = 10;
      data.skipCostEstimate = false;
      data.type = 'PENDING';
      spyOn(component, 'getPriceFromCostEstimateScreen').and.callThrough();
      spyOn(propertiesService, 'getEaypayEnhancementF89').and.returnValue(of(true));
      spyOn(costEstimateService, 'getCostEstimate').and.returnValue(of(data));
      spyOn(eorderDataService, 'getPriceEstimation').and.returnValue(of(10));
      component.getPriceEstimate();
      expect(costEstimateService.getCostEstimate).toHaveBeenCalled();
      expect(component.getPriceFromCostEstimateScreen).toHaveBeenCalled();
      expect(+component.estimatedCost).toBe(10);
    });

  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get personalData', () => {
    expect(component.personalData.firstName).toBe('sayed');
  });
  it('should get appointmentData', () => {
    expect(component.appointmentData.siteCode).toBe('T2O');
  });
  it('should set message according to email preference', () => {
    expect(component.message).toBe('Your confirmation email is on its way.');
  });
  it('should set the confirmation cco', () => {
    expect(component.confirmationCode).toEqual('OEXWHC');
  });
  it('should set message according to mobile preference', () => {
    spyOn(window, 'open').and.stub();
    const spy = spyOn(eorderDataService, 'getPersonalInformation').and.returnValue(of(
      {
        address1: '',
        address2: '',
        city: '',
        createAccount: '',
        dateOfBirth: new Date,
        email: 'sayedsohel@gmail.com',
        firstName: 'sayed',
        gender: 'male',
        insuranceInfo: 'insurance-no',
        isMobile: 'yes',
        lastName: 'sohel',
        password: '',
        phone: '2222222222',
        estimatedCost: '50',
        preferences: {
          preference_email: false,
          preference_mobile: true
        },
        state: '',
        termsOfService: false,
        zipCode: ''
      } as any
    ));
    fixture = TestBed.createComponent(AsEorderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(component.message).toBe('Your confirmation text is on its way.');
  });

  it('should set message if both preferences are selected', () => {
    spyOn(window, 'open').and.stub();
    const spy = spyOn(eorderDataService, 'getPersonalInformation').and.returnValue(of(
      {
        address1: '',
        address2: '',
        city: '',
        createAccount: '',
        dateOfBirth: new Date,
        email: 'sayedsohel@gmail.com',
        firstName: 'sayed',
        gender: 'male',
        insuranceInfo: 'insurance-no',
        isMobile: 'yes',
        lastName: 'sohel',
        password: '',
        phone: '2222222222',
        estimatedCost: '50',
        preferences: {
          preference_email: true,
          preference_mobile: true
        },
        state: '',
        termsOfService: false,
        zipCode: ''
      } as any
    ));
    fixture = TestBed.createComponent(AsEorderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(component.message).toBe('Your confirmation email and text are on the way.');
  });

  describe('getAlternateFlowStatus', () => {
    it('should get whether it is alternate flow or not', () => {
      spyOn(eorderDataService, 'getAlternateFlow').and.callThrough();
    });
  });

  describe('printConfirmation', () => {
    it('should get appointment object', waitForAsync(() => {
      eorderService.getBasicEncounterInfo('appointment').subscribe(res => {
        expect(component.appointmentInfo).toEqual(res.appointment);
      });
    }));
  });

  it('call ReasonData', () => {
    spyOn(eorderDataService, 'getReasonData').and.returnValue(of(mockReasonList as any));
  });

  describe('userLocation', () => {
    beforeEach(() => {
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
        const position = { coords: { latitude: 0, longitude: 0 } };
        arguments[0](position);
      });
    });
    it('should get the user location and set userLocation', () => {
      component.ngOnInit();
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
      expect(component.userLocation).toEqual('0+0');
    });
  });
  it('should open googlemaps without starting address if  no userlocation found', () => {
    spyOn(window, 'open').and.stub();
    component.openDirection();
    expect(window.open).toHaveBeenCalledWith('http://maps.google.com/maps?daddr=160 W 26Th St  New York NY 10001-6975'
      + 'Quest Diagnostics - NYC-26th St PSC - Employer Drug Testing Not Offered', '_blank');
  });
  it('should open googlemaps with starting address if userlocation found', () => {
    component.userLocation = 'new jersey';
    spyOn(window, 'open').and.stub();
    component.openDirection();
    expect(window.open)
      .toHaveBeenCalledWith('http://maps.google.com/maps?saddr=new jersey&daddr=160 W 26Th St  New York NY 10001-6975'
        + 'Quest Diagnostics - NYC-26th St PSC - Employer Drug Testing Not Offered', '_blank');
  });

  // test cases for US491 start
  describe('is CC Not Loaded', () => {
    beforeEach(() => {
    });
    it('cc loaded success', () => {
      component.isCCNotLoaded$ = of(true);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('#cc_not_available_message').length).toBeGreaterThanOrEqual(1);
    });
    it('cc not loaded', () => {
      component.isCCNotLoaded$ = of(false);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('#cc_not_available_message').length).toBeGreaterThanOrEqual(0);
    });
    it('cc not loaded without estimated cost', () => {
      component.isCCNotLoaded$ = of(true);
      component.estimatedCost = null;
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('#cc_not_available_message').length).toBeGreaterThanOrEqual(0);
    });
    it('cc not loaded with estimated cost', () => {
      component.isCCNotLoaded$ = of(true);
      component.estimatedCost = '25';
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('#cc_not_available_message').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('#getReasons', () => {
    beforeEach(() => {
    });

    it('with Main reason', () => {
      const response: ReasonCategory[] = [{
        facilityServiceId: 1,
        facilityTestType: 'All Other Tests',
        facilityTestTypeValue: 'All Other Tests',
        testDesc: 'Select this option if your tests are not one of the prior options.',
        precedence: 1,
        serviceRequestor: 'MAIN',
        index: 1
      }];
      spyOn(appointmentService, 'getReasons').and.returnValue(of(response));
      component.facilityServiceId = [1];
      component.getReasons().subscribe((data: ReasonCategory[]) => {
        expect(data[0].serviceRequestor).toBe('MAIN');
      });
    });

    it('with EMPLOYER reason', () => {
      const response: ReasonCategory[] = [{
        facilityServiceId: 1,
        facilityTestType: 'EMPLOYER DRUG AND ALCOHOL',
        facilityTestTypeValue: 'EMPLOYER DRUG AND ALCOHOL',
        testDesc: 'Select this option if your tests are not one of the prior options.',
        precedence: 2,
        serviceRequestor: 'EMPLOYER',
        index: 1
      }];
      spyOn(appointmentService, 'getReasons').and.returnValue(of(response));
      component.facilityServiceId = [8];
      component.getReasons().subscribe((data: ReasonCategory[]) => {
        expect(data[0].serviceRequestor).toBe('EMPLOYER');
      });
    });

    it('with GLUCOSE reason', () => {
      const response: ReasonCategory[] = [{
        facilityServiceId: 1,
        facilityTestType: 'GLUCOSE',
        facilityTestTypeValue: 'GLUCOSE',
        testDesc: 'Select this option if your tests are not one of the prior options.',
        precedence: 2,
        serviceRequestor: 'GLUCOSE',
        index: 1
      }];
      spyOn(appointmentService, 'getReasons').and.returnValue(of(response));
      component.facilityServiceId = [16];
      component.getReasons().subscribe((data: ReasonCategory[]) => {
        expect(data[0].serviceRequestor).toBe('GLUCOSE');
      });
    });

    it('with Main reason when facilityServiceId not matching', () => {
      const response: ReasonCategory[] = [{
        facilityServiceId: 1,
        facilityTestType: 'All Other Tests',
        facilityTestTypeValue: 'All Other Tests',
        testDesc: 'Select this option if your tests are not one of the prior options.',
        precedence: 1,
        serviceRequestor: 'MAIN',
        index: 1
      }];
      spyOn(appointmentService, 'getReasons').and.returnValue(of(response));
      component.facilityServiceId = [30];
      component.getReasons().subscribe((data: ReasonCategory[]) => {
        expect(data[0].serviceRequestor).toBe('MAIN');
      });
    });

    it('Multiple drug test condition', () => {
      component.facilityServiceId = [1, 2, 3];
      component.setFacilityTestTypeValue(null);
      expect(component.facilityTestTypeValue).toBe('Multiple Drug tests');
    });
  });
  // test cases for US491 end

});
