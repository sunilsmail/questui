import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { ApiService } from './api.service';
import { CancelAppointmentService } from './cancel-appointment.service';

describe('CancelAppointmentService', () => {
  let cancalAppointmentService: CancelAppointmentService;
  let apiMock: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [CancelAppointmentService, { provide: ApiService, useClass: MockApiService }]
  });
  cancalAppointmentService = TestBed.inject(CancelAppointmentService);
    apiMock = TestBed.inject(ApiService);
  });


  it('should be created', () => {
    const service: CancelAppointmentService = TestBed.inject(CancelAppointmentService);
    expect(service).toBeTruthy();
  });
  describe( '#cancelAppointment', () =>{
    beforeEach(() => {
        spyOn(apiMock, 'post').and.returnValue(of(null));
    });
    const mockObject = {
      'confirmationCode' : 'ASDFGH',
      'phone': '6789012345'
    };
    it('should verify the conformationCode with the phone', () => {
      cancalAppointmentService.cancelAppointment(mockObject).subscribe();
      expect(apiMock.post).toHaveBeenCalledWith('guest/cancelAppointment', mockObject);
    });
  });

});
