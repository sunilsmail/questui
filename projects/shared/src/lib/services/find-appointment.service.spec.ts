import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { ApiService } from './api.service';
import { FindAppointmentService } from './find-appointment.service';


describe('FindAppointmentService', () => {
    let findAppointmentService: FindAppointmentService;
    let apiMock: any;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FindAppointmentService, { provide: ApiService, useClass: MockApiService }]
        });

        findAppointmentService = TestBed.inject(FindAppointmentService);
        apiMock = TestBed.inject(ApiService);
    });
    it('should be created', () => {
        const service: FindAppointmentService = TestBed.inject(FindAppointmentService);
        expect(service).toBeTruthy();
    });

    describe('#verifyAppointmentId', () => {
        beforeEach(() => {
            spyOn(apiMock, 'get').and.returnValue(of(null));
        });
        const appointmentId = 'asdfgh';
        it('should call guest api', () => {
            spyOn(apiMock, 'clearCache').and.callThrough();
            spyOn(findAppointmentService, 'verifyAppointmentId').and.callThrough();
            findAppointmentService.verifyAppointmentId(appointmentId, false).subscribe();
            expect(apiMock.get).toHaveBeenCalledWith('/guest/getAppointment/asdfgh');
        });
        it('should call authenticated api', () => {
            spyOn(apiMock, 'clearCache').and.callThrough();
            spyOn(findAppointmentService, 'verifyAppointmentId').and.callThrough();
            findAppointmentService.verifyAppointmentId(appointmentId, true).subscribe();
            expect(apiMock.get).toHaveBeenCalledWith('/api/getAppointment/asdfgh');
        });
    });

    describe('#verifyIdentity', () => {
        beforeEach(() => {
            spyOn(apiMock, 'post').and.returnValue(of(null));
        });
        const mockObject = {
            'confirmationCode': 'asdfg',
            'phone': '1234567890'
        };
        it('should verify the conformationCode with the phone', () => {
            findAppointmentService.verifyIdentity(mockObject).subscribe();
            expect(apiMock.post).toHaveBeenCalledWith('/guest/verifyAppointmentPhone', mockObject);
        });
    });

});
