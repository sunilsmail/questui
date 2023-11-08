import { inject, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { DateService } from './date.service';

describe('DateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService, DatePipe]
    });
  });

  it(
    'should be created',
    inject([DateService], (service: DateService) => {
      expect(service).toBeTruthy();
    })
  );

  it(
    'should convert a datetime value to date',
    inject([DateService], (service: DateService) => {
      const dateTime = '2018-12-23T00:00:00';
      expect(service.toDate(dateTime)).toEqual('2018-12-23');
    })
  );

  it(
    'should convert a date value to a datetime',
    inject([DateService], (service: DateService) => {
      const dateTime = '2018-12-23';
      expect(service.toDateTime(dateTime)).toEqual('2018-12-23T00:00:00');
    })
  );

  it(
    'should not convert a date with no value',
    inject([DateService], (service: DateService) => {
      const dateTime = '';
      expect(service.toDate(dateTime)).toEqual('');
    })
  );

  it(
    'should not convert a datetime with no value',
    inject([DateService], (service: DateService) => {
      const dateTime = '';
      expect(service.toDateTime(dateTime)).toEqual('');
    })
  );

  describe('#lessThanToday', () => {
    const ONE_DAY = 24 * 60 * 60 * 1000;
    it(
      'returns true if  date is less than today',
      inject([DateService], (service: DateService) => {
        const today = new Date();
        const yesterday = new Date(today.getTime() - ONE_DAY);
        expect(service.lessThanToday(yesterday)).toEqual(true);
      })
    );

    it(
      'returns false when the date is not less than today',
      inject([DateService], (service: DateService) => {
        const today = new Date();
        const tomorrow = new Date(today.getTime() + ONE_DAY);
        const earlierToday = new Date();
        earlierToday.setHours(0, 0, 0, 0);
        expect(service.lessThanToday(today)).toEqual(false);
        expect(service.lessThanToday(tomorrow)).toEqual(false);
        expect(service.lessThanToday(earlierToday)).toEqual(false);
      })
    );
  });

  describe('#getAge', () => {
    it(
      'returns true if  date is less than today',
      inject([DateService], (service: DateService) => {
        const dateOfBirth = '01/01/1990';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        expect(service.getAge(dateOfBirth)).toEqual(age);
      })
    );
  });
});
