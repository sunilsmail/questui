import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { PscFullDaySlots, SlotAvailableType } from 'shared/models';
import { PropertiesService } from 'shared/services/properties.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { AsPscTimeSlotNewComponent } from './as-psc-time-slot-new.component';


describe('AsPscTimeSlotNewComponent', () => {
  let component: AsPscTimeSlotNewComponent;
  let fixture: ComponentFixture<AsPscTimeSlotNewComponent>;
  let propertiesService: PropertiesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CustomPipesModule, MockI18nModule],
      declarations: [AsPscTimeSlotNewComponent],
      providers:[{ provide: PropertiesService, useClass: MockPropertiesService },],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    propertiesService = TestBed.inject(PropertiesService);
    fixture = TestBed.createComponent(AsPscTimeSlotNewComponent);
    component = fixture.componentInstance;

    component.timeSlots = {
      pscMorningTime: [
        { time: '07:30', available: false },
        { time: '07:45', available: false },
        { time: '08:00', available: false },
        { time: '08:15', available: false },
        { time: '08:30', available: false },
        { time: '08:45', available: false },
        { time: '09:00', available: true },
        { time: '09:15', available: true },
        { time: '09:30', available: true },
        { time: '09:45', available: true }
      ],
      pscAfternoonTime: [
        { time: '13:00', available: true },
        { time: '13:15', available: true },
        { time: '13:30', available: true },
        { time: '13:45', available: true },
        { time: '14:00', available: true },
        { time: '14:15', available: true },
        { time: '14:30', available: true },
        { time: '14:45', available: true },
        { time: '15:00', available: true },
        { time: '15:15', available: true }
      ]
    };
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#selectTime', () => {
    const mockEvent = jasmine.createSpyObj('Event', ['preventDefault', 'stopPropagation']);
    it('should set timeSelected to timeSlot when other than timeSlot', () => {
      component.selectTime('8:00', mockEvent);
      expect(component.timeSelected).toBe('8:00');
    });
    it('should set timeSelected to null when already equals to timeSlot', () => {
      component.timeSelected = '8:00';
      component.selectTime('8:00', mockEvent);
      expect(component.timeSelected).toBe(null);
    });

    it('should set timeSelected to null when already equals to timeSlot', () => {
      spyOn(component.selectedTime, 'emit');
      component.selectTime('8:00', mockEvent);
      expect(component.selectedTime.emit).toHaveBeenCalledWith('8:00');
    });

    it('emit time slot', () => {
      spyOn(component.enableContinue, 'emit');
      component.timeSelected = '07:00';
      component.ngOnInit();
      expect(component.enableContinue.emit).toHaveBeenCalled();
    });

  });

  describe('#setAvailableSlots', () => {
    it('both Morning and Afternoon Available time Slots with no slots', () => {
      component.morningSlots = [];
      component.afternoonSlots = [];
      component.setAvailableSlots();
      expect(component.morningAvailableSlots).toEqual(0);
      expect(component.afternoonAvailableSlots).toEqual(0);
      expect(component.bothMorningAfternoonAvailableSlots).toEqual(0);
    });
    it('Morning Available time Slots', () => {
      component.morningSlots = [
        { time: '07:30', available: SlotAvailableType.unAvailable },
        { time: '07:45', available: SlotAvailableType.unAvailable },
        { time: '08:00', available: SlotAvailableType.unAvailable },
        { time: '08:15', available: SlotAvailableType.unAvailable },
        { time: '08:30', available: SlotAvailableType.unAvailable },
        { time: '08:45', available: SlotAvailableType.unAvailable },
        { time: '09:00', available: SlotAvailableType.available },
        { time: '09:15', available: SlotAvailableType.available },
        { time: '09:30', available: SlotAvailableType.available },
        { time: '09:45', available: SlotAvailableType.available }
      ];
      component.afternoonSlots = [];
      component.setAvailableSlots();
      expect(component.morningAvailableSlots).toEqual(4);
      expect(component.afternoonAvailableSlots).toEqual(0);
      expect(component.bothMorningAfternoonAvailableSlots).toEqual(4);
    });
    it('Afternoon Available time Slots', () => {
      component.morningSlots = [];
      component.afternoonSlots = [
        { time: '13:00', available: SlotAvailableType.available },
        { time: '13:15', available: SlotAvailableType.available },
        { time: '13:30', available: SlotAvailableType.available },
        { time: '13:45', available: SlotAvailableType.available },
        { time: '14:00', available: SlotAvailableType.available },
        { time: '14:15', available: SlotAvailableType.available },
        { time: '14:30', available: SlotAvailableType.available },
        { time: '14:45', available: SlotAvailableType.available },
        { time: '15:00', available: SlotAvailableType.available },
        { time: '15:15', available: SlotAvailableType.available }
      ];
      component.setAvailableSlots();
      expect(component.morningAvailableSlots).toEqual(0);
      expect(component.afternoonAvailableSlots).toEqual(10);
      expect(component.bothMorningAfternoonAvailableSlots).toEqual(10);
    });
    it('both Morning and Afternoon Available time Slots', () => {
      component.morningSlots = [
        { time: '07:30', available: SlotAvailableType.unAvailable },
        { time: '07:45', available: SlotAvailableType.unAvailable },
        { time: '08:00', available: SlotAvailableType.unAvailable },
        { time: '08:15', available: SlotAvailableType.unAvailable },
        { time: '08:30', available: SlotAvailableType.unAvailable },
        { time: '08:45', available: SlotAvailableType.unAvailable },
        { time: '09:00', available: SlotAvailableType.available },
        { time: '09:15', available: SlotAvailableType.available },
        { time: '09:30', available: SlotAvailableType.available },
        { time: '09:45', available: SlotAvailableType.available }
      ];
      component.afternoonSlots = [
        { time: '13:00', available: SlotAvailableType.available },
        { time: '13:15', available: SlotAvailableType.available },
        { time: '13:30', available: SlotAvailableType.available },
        { time: '13:45', available: SlotAvailableType.available },
        { time: '14:00', available: SlotAvailableType.available },
        { time: '14:15', available: SlotAvailableType.available },
        { time: '14:30', available: SlotAvailableType.available },
        { time: '14:45', available: SlotAvailableType.available },
        { time: '15:00', available: SlotAvailableType.available },
        { time: '15:15', available: SlotAvailableType.available }
      ];
      component.setAvailableSlots();
      expect(component.morningAvailableSlots).toEqual(4);
      expect(component.afternoonAvailableSlots).toEqual(10);
      expect(component.bothMorningAfternoonAvailableSlots).toEqual(14);
    });
  });

  describe('#calculateSlotInterval', () => {
    it('no time slots', () => {
      const reqParam = new PscFullDaySlots();
      component.calculateSlotInterval(reqParam);
      expect(component.noTimeslots).toEqual(true);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('.noTimeslots').length).toBeGreaterThanOrEqual(1);
    });

    it('morning slot interval', () => {
      const reqParam: PscFullDaySlots = {
        pscMorningTime: [
          { time: '07:30', available: false },
          { time: '07:45', available: false },
          { time: '08:00', available: false },
          { time: '08:15', available: false },
          { time: '08:30', available: false },
          { time: '08:45', available: false },
          { time: '09:00', available: true },
          { time: '09:15', available: true },
          { time: '09:30', available: true },
          { time: '09:45', available: true }
        ],
        pscAfternoonTime: []
      };
      component.calculateSlotInterval(reqParam);
      expect(component.noTimeslots).toEqual(false);
      expect(component.slotInterval).toEqual(15);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('#noTimeslots').length).toBeLessThanOrEqual(0);
    });
    it('afternoon slot interval', () => {
      const reqParam: PscFullDaySlots = {
        pscMorningTime: [],
        pscAfternoonTime: [
          { time: '13:00', available: true },
          { time: '13:15', available: true },
          { time: '13:30', available: true },
          { time: '13:45', available: true },
          { time: '14:00', available: true },
          { time: '14:15', available: true },
          { time: '14:30', available: true },
          { time: '14:45', available: true },
          { time: '15:00', available: true },
          { time: '15:15', available: true }
        ]
      };
      component.calculateSlotInterval(reqParam);
      expect(component.noTimeslots).toEqual(false);
      expect(component.slotInterval).toEqual(15);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('#noTimeslots').length).toBeLessThanOrEqual(1);
    });
  });


  // describe('#active', () => {
  //   beforeEach(() => {
  //     component.timeSelected = null;
  //   });
  //   it('no active slot', () => {
  //     component.active = {};
  //     expect(component.timeSelected).toBeFalsy();
  //   });
  //   it('with active slot', () => {
  //     component.active = { active: false, index: 0 };
  //     expect(component.timeSelected).toEqual(false);
  //   });
  //   it('with active slot', () => {
  //     component.active = { active: true, index: 0 };
  //     expect(component.timeSelected).toBeFalsy();
  //   });
  // });

  describe('#existingApptTime', () => {
    beforeEach(() => {
      component.timeSelected = null;
    });
    it('no active slot', () => {
      component.existingAppointmentTime = null;
      expect(component.timeSelected).toBeFalsy();
    });
    it('with active slot', () => {
      component.existingAppointmentTime = '07:00';
      expect(component.timeSelected).toEqual('07:00');
    });
  });

  describe('#onResize', () => {
    it('on window resize desktop', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(760);
      component.onResize();
      expect(component.currentWindowWidth).toEqual(760);
    });
    it('on window resize mobile', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(380);
      component.onResize();
      expect(component.currentWindowWidth).toEqual(380);
    });
  });

  describe('#isShowAll', () => {
    it('display the show-more-times button if showAll is false', () => {
      component.showAll = true;
      component.isShowAll();
      expect(component.showAll).toBeFalsy();
    });
    it('display the show-less-times button if showAll is true', () => {
      component.showAll = false;
      component.isShowAll();
      expect(component.showAll).toBeTruthy();
    });
  });
});
