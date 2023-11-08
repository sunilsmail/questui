import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatepickerService } from 'shared/services/datepicker/datepicker.service';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { MockPscDetailsService } from 'shared/specs/mocks';
import { MockDatePickerService } from 'shared/specs/mocks/mock-datepicker.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockPscService } from 'shared/specs/mocks/mock-psc.service';
import { AsDatepickerCalendarComponent } from './as-datepicker-calendar.component';

describe('AsDatepickerCalendarComponent', () => {
  let component: AsDatepickerCalendarComponent;
  let fixture: ComponentFixture<AsDatepickerCalendarComponent>;
  let propertiesService: PropertiesService;
  let datePickerService: DatepickerService;
  let pscService: PscService;
  let pscDetailsService: PscDetailsService;

  beforeEach(() => {
    const pscServiceStub = () => ({
      hasMorning$: { subscribe: f => f({}), next: () => ({}) }
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AsDatepickerCalendarComponent],
      providers: [
        { provide: DatepickerService, useClass: MockDatePickerService },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: PscService, useClass: MockPscService },
        { provide: PscDetailsService, useClass: MockPscDetailsService }
      ]
    });
    fixture = TestBed.createComponent(AsDatepickerCalendarComponent);
    component = fixture.componentInstance;
  });
  beforeEach(() => {
    propertiesService = TestBed.inject(PropertiesService);
    datePickerService = TestBed.inject(DatepickerService);
    pscService = TestBed.inject(PscService);
    pscDetailsService = TestBed.inject(PscDetailsService);
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`months has default value`, () => {
    expect(component.months).toEqual([
      `January`,
      `February`,
      `March`,
      `April`,
      `May`,
      `June`,
      `July`,
      `August`,
      `September`,
      `October`,
      `November`,
      `December`
    ]);
  });

  it(`currentMonthCalMap has default value`, () => {
    expect(component.currentMonthCalMap).toEqual([]);
  });

  it(`showCalMap has default value`, () => {
    expect(component.showCalMap).toEqual([]);
  });

  it(`itemChecked has default value`, () => {
    expect(component.itemChecked).toEqual(0);
  });

  it(`startIndex has default value`, () => {
    expect(component.startIndex).toEqual(0);
  });

  it(`endIndex has default value`, () => {
    expect(component.endIndex).toEqual(12);
  });

  it(`previousEnabled has default value`, () => {
    expect(component.previousEnabled).toEqual(true);
  });

  it(`nextEnabled has default value`, () => {
    expect(component.nextEnabled).toEqual(true);
  });

  it(`blnAriaLabelNext has default value`, () => {
    expect(component.blnAriaLabelNext).toEqual(false);
  });

  it(`blnAriaLabelPrev has default value`, () => {
    expect(component.blnAriaLabelPrev).toEqual(false);
  });

  it(`datePickerMonthList has default value`, () => {
    expect(component.datePickerMonthList).toEqual([]);
  });

  it(`viewMonthMenu has default value`, () => {
    expect(component.viewMonthMenu).toEqual(false);
  });

  it(`defaultIndexForDatePickerMonth has default value`, () => {
    expect(component.defaultIndexForDatePickerMonth).toEqual(0);
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'init').and.callThrough();
      spyOn(propertiesService, 'getMaxApptScheduleDays').and.callThrough();
      spyOn(component, 'prepareDatesFromExistingAppt').and.callThrough();
      component.ngOnInit();
    });
    it('makes expected calls', () => {
      expect(component.init).toHaveBeenCalled();
      expect(propertiesService.getMaxApptScheduleDays).toHaveBeenCalled();
    });
    it('endIndex greaterthan currentmonthcalMap', () => {
      component.calSize = 18;
      component.init();
      expect(component.showCalMap.length).toBeGreaterThan(0);
    });
    it('should call initWithExistingAppt', () => {
      spyOn(component, 'initWithExistingAppt').and.callThrough();
      component.existingAppt = {
        address1: '7001 Amboy Rd',
        address2: 'Tottenville Square Shopping Center',
        appointmentDate: '2021-12-15',
        appointmentTime: '08:00',
        city: 'Staten Island',
        facilityServiceId: 1,
        labCard: true,
        latitude: 40.516326,
        longitude: -74.234193,
        name: 'Quest Diagnostics - Staten Island Tottenville Square ',
        phone: '7182279961',
        siteCode: 'TNV',
        state: 'NY',
        zip: '10307-1444'
      };
      component.ngOnInit();
      expect(component.initWithExistingAppt).toHaveBeenCalled();
    });
    it('should call prepareDatesFromExistingAppt', () => {
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.endIndex = 34;
      component.startIndex = 0;
      component.calSize = 12;
      component.prepareDatesFromExistingAppt();
      expect(propertiesService.getMaxApptScheduleDays).toHaveBeenCalled();
    });
    it('should call prepareDatesFromExistingAppt if currentMonth is december', () => {
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 12, 195);
      component.endIndex = 34;
      component.startIndex = 0;
      component.calSize = 12;
      component.prepareDatesFromExistingAppt();
      expect(propertiesService.getMaxApptScheduleDays).toHaveBeenCalled();
    });
  });
  describe('#onPrevious', () => {
    beforeEach(() => {
      spyOn(component, 'onPrevious').and.callThrough();
      spyOn(component, 'showDatesWithInMonthOnPrev').and.callThrough();
      spyOn(component, 'showDatesBetweenTwoMonthsOnPrev').and.callThrough();
    });
    it('makes expected call showDatesWithInMonthOnPrev with no prevMonthCalMap value', () => {
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.startIndex = 16;
      component.calSize = 12;
      component.selectedDate = component.currentMonthCalMap[0];
      component.onPrevious();
      expect(component.showDatesWithInMonthOnPrev).toHaveBeenCalled();
    });
    it('makes expected call showDatesWithInMonthOnPrev with  prevMonthCalMap value', () => {
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.showCalMap = component.currentMonthCalMap.slice(0, 11);
      component.currentMonthCalMap = [];
      component.prevMonthCalMap = datePickerService.getDayNames(2021, 6, 195);
      component.startIndex = 16;
      component.calSize = 12;
      component.selectedDate = component.prevMonthCalMap[0];
      component.onPrevious();
      expect(component.showDatesWithInMonthOnPrev).toHaveBeenCalled();
    });
    it('makes expected call showDatesWithInMonthOnPrev with  prevMonthCalMap value on december', () => {
      resetValues(component, datePickerService);
      component.selectedDate = component.prevMonthCalMap[0];
      component.onPrevious();
      expect(component.showDatesWithInMonthOnPrev).toHaveBeenCalled();
    });
    it('makes expected call onPrevious if itemChecked  greaterthan 0', () => {
      resetValues(component, datePickerService);
      component.selectedDate = component.prevMonthCalMap[5];
      component.onPrevious();
      expect(component.onPrevious).toHaveBeenCalled();
    });
    it('makes expected call showDatesBetweenTwoMonthsOnPrev', () => {
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.startIndex = 2;
      component.calSize = 12;
      component.selectedDate = component.currentMonthCalMap[0];
      component.onPrevious();
      expect(component.showDatesBetweenTwoMonthsOnPrev).toHaveBeenCalled();
    });
    it('makes expected call showDatesBetweenTwoMonthsOnPrev with startIndex 0', () => {
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.showCalMap = component.currentMonthCalMap.slice(0, 11);
      component.startIndex = 0;
      component.calSize = 12;
      component.selectedDate = component.currentMonthCalMap[0];
      component.currentYear = 2021;
      component.maxScheduleDays = 195;
      component.onPrevious();
      expect(component.showDatesBetweenTwoMonthsOnPrev).toHaveBeenCalled();
    });
  });
  describe('#onNext', () => {
    beforeEach(() => {
      spyOn(component, 'onNext').and.callThrough();
      spyOn(component, 'showDatesWithInMonthOnNext').and.callThrough();
      spyOn(component, 'showDatesBetweenTwoMonthsOnNext').and.callThrough();
    });
    it('makes expected call onNext', () => {
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.startIndex = 16;
      component.calSize = 12;
      component.selectedDate = component.currentMonthCalMap[12];
      component.onNext();
      expect(component.onNext).toHaveBeenCalled();
    });
    it('makes expected call showDatesWithInMonthOnNext', () => {
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.nextMonthCalMap = datePickerService.getDayNames(2021, 8, 195);
      component.startIndex = 16;
      component.calSize = 12;
      component.selectedDate = component.nextMonthCalMap[12];
      component.onNext();
      expect(component.showDatesWithInMonthOnNext).toHaveBeenCalled();
    });
    it('makes expected call showDatesBetweenTwoMonthsOnNext', () => {
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.endIndex = 22;
      component.calSize = 12;
      component.selectedDate = component.currentMonthCalMap[0];
      component.onNext();
      expect(component.showDatesBetweenTwoMonthsOnNext).toHaveBeenCalled();
    });
    it('makes expected call showDatesBetweenTwoMonthsOnNext if month on december', () => {
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 12, 195);
      component.endIndex = 22;
      component.calSize = 12;
      component.selectedDate = component.currentMonthCalMap[0];
      component.onNext();
      expect(component.showDatesBetweenTwoMonthsOnNext).toHaveBeenCalled();
    });
    it('makes expected call showDatesBetweenTwoMonthsOnNext if startIndex > currentMonthCalMap', () => {
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.endIndex = 32;
      component.calSize = 12;
      component.maxScheduleDays = 195;
      component.currentYear = 2021;
      component.selectedDate = component.currentMonthCalMap[0];
      component.onNext();
      expect(component.showDatesBetweenTwoMonthsOnNext).toHaveBeenCalled();
    });
  });
  describe('#onDateSelected', () => {
    beforeEach(() => {
      spyOn(component, 'onDateSelected').and.callThrough();
    });
    it('makes expected call', () => {
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.showCalMap = component.currentMonthCalMap.slice(0, 11);
      const date = {
        date: 2,
        day: 'Monday',
        disabled: false,
        month: 8,
        year: 2021,
      };
      component.onDateSelected(date);
      expect(component.onDateSelected).toHaveBeenCalled();
    });
  });
  describe('#getNextLabelData', () => {
    beforeEach(() => {
      // spyOn(component, 'getNextLabelData').and.callThrough();
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.showCalMap = component.currentMonthCalMap.slice(0, 11);
    });
    it('should call', () => {
      const result = component.getNextLabelData;
      expect(result).toEqual('choose next set of dates');
    });
    it('should call if blnAriaLabelNext is true', () => {
      component.blnAriaLabelNext = true;
      const result = component.getNextLabelData.replace(/\s+/g, ' ').trim();
      expect(result).toEqual('dates loaded from 1 July to 11 July');
    });
  });
  describe('#getPrevLabelData', () => {
    beforeEach(() => {
      // spyOn(component, 'getPrevLabelData').and.callThrough();
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.showCalMap = component.currentMonthCalMap.slice(0, 11);
    });
    it('should call', () => {
      const result = component.getPrevLabelData;
      expect(result).toEqual('choose previous set of dates');
    });
    it('should call if blnAriaLabelPrev is true', () => {
      component.blnAriaLabelPrev = true;
      const result = component.getPrevLabelData.replace(/\s+/g, ' ').trim();
      expect(result).toEqual('dates loaded from 1 July to 11 July');
    });
  });
  describe('#datePickerMonthChange', () => {
    beforeEach(() => {
      // spyOn(component, 'getPrevLabelData').and.callThrough();
      spyOn(component, 'onDateSelected').and.callThrough();
    });
    it('should call', () => {
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.showCalMap = component.currentMonthCalMap.slice(0, 11);
      component.startIndex = 0;
      component.endIndex = 0;
      component.calSize = 12;
      component.maxScheduleDays = 195;
      component.today = new Date();
      const date = {
        month: 'August',
        year: 2021,
        index: 7,
      };
      // tslint:disable-next-line: max-line-length
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      component.datePickerMonthList = datePickerService.dateRange('2021-6', '2021-12', months);
      component.datePickerMonthChange(date, true);
      expect(component.onDateSelected).toHaveBeenCalled();
    });
  });
  describe('#onKeyPressed', () => {
    it('should call', () => {
      spyOn(component, 'onKeyPressed').and.callThrough();
      const date = {
        date: 2,
        day: 'Monday',
        disabled: false,
        month: 8,
        year: 2021,
      };
      component.onKeyPressed({ keyCode: 13 }, date);
      expect(component.onKeyPressed).toHaveBeenCalled();
    });
  });
  describe('#onKeyPressedArrow', () => {
    beforeEach(() => {
      spyOn(component, 'onKeyPressedArrow').and.callThrough();
      component.currentMonthCalMap = datePickerService.getDayNames(2021, 7, 195);
      component.startIndex = 16;
      component.calSize = 12;
      component.selectedDate = component.currentMonthCalMap[12];
    });
    it('should call if arrow value is empty', () => {
      component.onKeyPressedArrow({ keyCode: 13 }, '');
      expect(component.onKeyPressedArrow).toHaveBeenCalled();
    });
    it('should call if arrow value is empty', () => {
      component.onKeyPressedArrow({ keyCode: 13 }, 'previous');
      expect(component.onKeyPressedArrow).toHaveBeenCalled();
    });
  });
  describe('#onKeyPressedTab', () => {
    beforeEach(() => {
      spyOn(component, 'onKeyPressedTab').and.callThrough();
      spyOn(component, 'onMorning').and.callThrough();
      spyOn(component, 'onAfternoon').and.callThrough();
    });
    it('should call onMorning', () => {
      component.onKeyPressedTab({ keyCode: 13 }, '');
      expect(component.onMorning).toHaveBeenCalled();
    });
    it('should call afternoon', () => {
      component.onKeyPressedTab({ keyCode: 13 }, 'afternoon');
      expect(component.onAfternoon).toHaveBeenCalled();
    });
  });
  describe('#closeUserMenu', () => {
    it('should call', () => {
      spyOn(component, 'closeUserMenu').and.callThrough();
      component.closeUserMenu();
      expect(component.viewMonthMenu).toBeFalsy();
    });
  });
  describe('#onMorning', () => {
    it('should call', () => {
      spyOn(component, 'onMorning').and.callThrough();
      component.onMorning();
      expect(component.onMorning).toHaveBeenCalled();
    });
  });
  describe('#onAfternoon', () => {
    it('should call', () => {
      spyOn(component, 'onAfternoon').and.callThrough();
      component.onAfternoon();
      expect(component.onAfternoon).toHaveBeenCalled();
    });
  });
});

function resetValues(component: AsDatepickerCalendarComponent, datePickerService: DatepickerService) {
  component.currentMonthCalMap = datePickerService.getDayNames(2021, 12, 195);
  component.showCalMap = component.currentMonthCalMap.slice(0, 11);
  component.currentMonthCalMap = [];
  component.prevMonthCalMap = datePickerService.getDayNames(2021, 12, 195);
  component.startIndex = 16;
  component.calSize = 12;
}

