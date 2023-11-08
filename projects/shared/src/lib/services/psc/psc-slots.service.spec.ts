import { TestBed } from '@angular/core/testing';
import { PscFullDaySlots, PscTimeSlot } from 'shared/models';
import { PscSlotService } from './psc-slots.service';

describe('PscSlotService', () => {
  let service: PscSlotService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PscSlotService] });
    service = TestBed.inject(PscSlotService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('getFormattedMorningTimeSlots', () => {
    it('makes expected calls', () => {
      const pscFullDaySlotsStub: PscFullDaySlots = <any>{};
      spyOn(service, 'roundTimeslots').and.callThrough();
      service.getFormattedMorningTimeSlots(pscFullDaySlotsStub);
      expect(service.roundTimeslots).not.toHaveBeenCalled();
    });
  });

  describe('getFormattedAfternoonTimeSlots', () => {
    it('makes expected calls', () => {
      const pscFullDaySlotsStub: PscFullDaySlots = <any>{};
      spyOn(service, 'roundTimeslots').and.callThrough();
      service.getFormattedAfternoonTimeSlots(pscFullDaySlotsStub);
      expect(service.roundTimeslots).not.toHaveBeenCalled();
    });
  });

  describe('#getTimeDifference', () => {
    it('15mins duration', () => {
      const timeslots15: PscTimeSlot[] = [{ 'time': '07:30', 'available': false }, { 'time': '07:45', 'available': false }];
      expect(service.getTimeDifference(timeslots15)).toBe(15);
    });

    it('10mins duration', () => {
      const timeslots15: PscTimeSlot[] = [{ 'time': '07:30', 'available': false }, { 'time': '07:40', 'available': false }];
      expect(service.getTimeDifference(timeslots15)).toBe(10);
    });

    it('with single slot', () => {
      const timeslots15: PscTimeSlot[] = [{ 'time': '07:30', 'available': false }];
      expect(service.getTimeDifference(timeslots15)).toBe(0);
    });
  });

  describe('#getFormattedMorningTimeSlots', () => {

    it('without slots object returns  empty morning slots array', () => {
      spyOn(service, 'roundTimeslots').and.callThrough();
      const formattedTimeSlotsStub: PscTimeSlot[] = [];
      expect(service.getFormattedMorningTimeSlots(new PscFullDaySlots())).toEqual(formattedTimeSlotsStub);
      expect(service.roundTimeslots).not.toHaveBeenCalled();
    });

    // 15mins slots
    it('with slots and rounding the beginning slots by adding two empty slots for 15mins slots', () => {
      const formattedTimeSlotsStub: PscTimeSlot[] = [
        { time: '', available: 'noSlot' },
        { time: '', available: 'noSlot' },
        { time: '07:30', available: 'available' },
        { time: '07:45', available: 'unAvailable' }
      ];
      const request: PscFullDaySlots = {
        pscMorningTime: [{ time: '07:30', available: true }, { time: '07:45', available: false }],
        pscAfternoonTime: [{ time: '16:00', available: false }, { time: '16:15', available: false }]
      };
      expect(service.getFormattedMorningTimeSlots(request)).toEqual(formattedTimeSlotsStub);
    });

    it('with slots and without rounding the beginning slots for 15mins slots', () => {
      const formattedTimeSlotsStub: PscTimeSlot[] = [
        { time: '07:00', available: 'available' },
        { time: '07:15', available: 'unAvailable' },
        { time: '', available: 'noSlot' },
        { time: '', available: 'noSlot' }
      ];
      const request: PscFullDaySlots = {
        pscMorningTime: [{ time: '07:00', available: true }, { time: '07:15', available: false }],
        pscAfternoonTime: [{ time: '16:00', available: false }, { time: '16:15', available: false }]
      };
      expect(service.getFormattedMorningTimeSlots(request)).toEqual(formattedTimeSlotsStub);
    });

    // 10mins slots
    it('with slots and rounding the beginning slots by adding two empty slots for 10mins slots', () => {
      const formattedTimeSlotsStub: PscTimeSlot[] = [
        { time: '', available: 'noSlot' },
        { time: '', available: 'noSlot' },
        { time: '', available: 'noSlot' },
        { time: '', available: 'noSlot' },
        { time: '07:40', available: 'available' },
        { time: '07:50', available: 'unAvailable' }
      ];
      const request: PscFullDaySlots = {
        pscMorningTime: [{ time: '07:40', available: true }, { time: '07:50', available: false }],
        pscAfternoonTime: [{ time: '16:00', available: false }, { time: '16:15', available: false }]
      };
      expect(service.getFormattedMorningTimeSlots(request)).toEqual(formattedTimeSlotsStub);
    });

    it('with slots and without rounding the beginning slots for 10mins slots', () => {
      const formattedTimeSlotsStub: PscTimeSlot[] = [
        { time: '07:00', available: 'available' },
        { time: '07:10', available: 'unAvailable' },
        { time: '', available: 'noSlot' },
        { time: '', available: 'noSlot' },
        { time: '', available: 'noSlot' },
        { time: '', available: 'noSlot' }
      ];
      const request: PscFullDaySlots = {
        pscMorningTime: [{ time: '07:00', available: true }, { time: '07:10', available: false }],
        pscAfternoonTime: [{ time: '16:00', available: false }, { time: '16:15', available: false }]
      };
      expect(service.getFormattedMorningTimeSlots(request)).toEqual(formattedTimeSlotsStub);
    });


  });




  describe('#getFormattedAfternoonTimeSlots', () => {

    it('without slots object returns empty morning slots array', () => {
      spyOn(service, 'roundTimeslots').and.callThrough();
      const formattedTimeSlotsStub: PscTimeSlot[] = [];
      expect(service.getFormattedAfternoonTimeSlots(new PscFullDaySlots())).toEqual(formattedTimeSlotsStub);
      expect(service.roundTimeslots).not.toHaveBeenCalled();
    });

    it('with slots and rounding the beginning slots by adding two empty slots for 15mins slots', () => {
      const formattedTimeSlotsStub: PscTimeSlot[] = [
        { time: '16:00', available: 'unAvailable' },
        { time: '16:15', available: 'available' },
        { time: '', available: 'noSlot' },
        { time: '', available: 'noSlot' }
      ];
      const request: PscFullDaySlots = {
        pscMorningTime: [{ time: '07:30', available: true }, { time: '07:45', available: false }],
        pscAfternoonTime: [{ time: '16:00', available: false }, { time: '16:15', available: true }]
      };
      expect(service.getFormattedAfternoonTimeSlots(request)).toEqual(formattedTimeSlotsStub);
    });

    it('with slots and without rounding the beginning slots for 15mins slots', () => {
      const formattedTimeSlotsStub: PscTimeSlot[] = [
        { time: '16:00', available: 'available' },
        { time: '16:15', available: 'unAvailable' },
        { time: '16:30', available: 'available' },
        { time: '16:45', available: 'unAvailable' }
      ];
      const request: PscFullDaySlots = {
        pscMorningTime: [
          { time: '07:00', available: true }, { time: '07:15', available: false }
        ],
        pscAfternoonTime: [
          { time: '16:00', available: true }, { time: '16:15', available: false },
          { time: '16:30', available: true }, { time: '16:45', available: false }
        ]
      };
      expect(service.getFormattedAfternoonTimeSlots(request)).toEqual(formattedTimeSlotsStub);
    });

    it('with slots and without rounding the beginning and ending slots for 15mins slots', () => {
      const formattedTimeSlotsStub: PscTimeSlot[] = [
        { time: '', available: 'noSlot' },
        { time: '', available: 'noSlot' },
        { time: '13:30', available: 'available' },
        { time: '13:45', available: 'unAvailable' },
        { time: '14:00', available: 'available' },
        { time: '14:15', available: 'unAvailable' },
        { time: '', available: 'noSlot' },
        { time: '', available: 'noSlot' }
      ];
      const request: PscFullDaySlots = {
        pscMorningTime: [
          { time: '07:00', available: true }, { time: '07:15', available: false }
        ],
        pscAfternoonTime: [
          { time: '13:30', available: true }, { time: '13:45', available: false },
          { time: '14:00', available: true }, { time: '14:15', available: false }
        ]
      };
      expect(service.getFormattedAfternoonTimeSlots(request)).toEqual(formattedTimeSlotsStub);
    });

  });

});
