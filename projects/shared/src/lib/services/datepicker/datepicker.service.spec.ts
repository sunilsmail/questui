import { TestBed } from '@angular/core/testing';
import { DatepickerService } from './datepicker.service';

describe('DatepickerService', () => {
  let service: DatepickerService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DatepickerService] });
    service = TestBed.inject(DatepickerService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  it('should return getDayNames', () => {
    spyOn(service, 'getDayNames').and.callThrough();
    const result = service.getDayNames(2021, 6, 195);
    expect(result.length).toEqual(30);
  });
  it('should return dateRange', () => {
    // tslint:disable-next-line: max-line-length
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    spyOn(service, 'dateRange').and.callThrough();
    const result = service.dateRange('2021-6', '2021-12', months);
    expect(result.length).toEqual(7);
  });
});
