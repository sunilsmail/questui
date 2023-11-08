import { TestBed } from '@angular/core/testing';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { ApiService } from './api.service';
import { MaintainService } from './maintenace.service';



describe('MaintainService', () => {
  let service: MaintainService;
  let apiMock: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaintainService, { provide: ApiService, useClass: MockApiService }]
    });
    service = TestBed.inject(MaintainService);
    apiMock = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getMaintenanceMessage', () => {
    it('should call the `/guest/getMaintenanceMessage` guest', () => {
      service.getMaintenaceMsg().subscribe();
    });
  });
});
