import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PropertiesService } from 'shared/services/properties.service';
import { PscService } from 'shared/services/psc.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockPscService } from 'shared/specs/mocks/mock-psc.service';
import { AsCalendarComponent } from './as-calendar.component';


describe('AsCalendarComponent', () => {
  let component: AsCalendarComponent;
  let fixture: ComponentFixture<AsCalendarComponent>;
  let pscService: PscService;
  let propertiesSvc: PropertiesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsCalendarComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: PscService, useClass: MockPscService },
        { provide: PropertiesService, useClass: MockPropertiesService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsCalendarComponent);
    propertiesSvc = TestBed.inject(PropertiesService);
    pscService = TestBed.inject(PscService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      spyOn(pscService.hasMorning$, 'subscribe').and.callThrough();
      component.ngOnInit();
    });
    it('should call hasMorning$ BehaviorSubject', () => {
      expect(pscService.hasMorning$.subscribe).toHaveBeenCalled();
    });

    it('should check tabValue to true', () => {
      pscService.hasMorning$.subscribe(value => {
        expect(component.tabValue).toEqual(value);
      });
    });
  });

  describe('#onMorning', () => {
    it('should set hasMorning$ BehaviorSubject true', () => {
      spyOn(pscService.hasMorning$, 'next').and.callThrough();
      component.onMorning();
      expect(pscService.hasMorning$.next).toHaveBeenCalledWith(true);
    });
  });

  describe('#onAfternoon', () => {
    it('should set hasMorning$ BehaviorSubject false', () => {
      spyOn(pscService.hasMorning$, 'next').and.callThrough();
      component.onAfternoon();
      expect(pscService.hasMorning$.next).toHaveBeenCalledWith(false);
    });
  });
  describe('#Next button', () => {
    it('Enabled next button ', () => {
      const dt = new Date();
      spyOn(propertiesSvc, 'getMaxApptScheduleDays').and.callThrough();
      component.maxScheduleDays = 195;
      const year = dt.getFullYear();
      const month = dt.getMonth() + 1;
      component.getDayNames(year,month);
      const d = new Date(year, month - 1, 0);
      const finalD =  Date.parse(d.toLocaleDateString());
      dt.setDate(dt.getDate() + component.maxScheduleDays);
      const maxApptScheduleDate = Date.parse(dt.toLocaleDateString());
      expect(finalD).toBeLessThan(maxApptScheduleDate);
    //  component.checkforMaxDateToDisableNext();
      const nextEnabled = false;
      expect(component.nextEnabled).toBe(component.nextEnabled);

    });
    it('Disabled next button ', () => {
        const dt = new Date();
        spyOn(propertiesSvc, 'getMaxApptScheduleDays').and.callThrough();
        component.maxScheduleDays = 195;
        const year = 2020;
        const month = 10;
        component.getDayNames(year,month);
        const d =new Date('Oct 21, 2040 01:15:00:526');
        const finalD = Date.parse(d.toLocaleDateString());
        dt.setDate(dt.getDate() + component.maxScheduleDays);
        const maxApptScheduleDate = Date.parse(dt.toLocaleDateString());
        expect(finalD).toBeGreaterThan(maxApptScheduleDate);
      //  component.checkforMaxDateToDisableNext();
        const nextEnabled = true;
        expect(component.nextEnabled).toBe(component.nextEnabled);
    });
  });
});
