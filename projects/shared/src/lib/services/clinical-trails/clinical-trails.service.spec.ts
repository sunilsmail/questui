import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
import { MockApiService } from 'shared/specs/mocks/mock-api.service';
import { MockUserService } from 'shared/specs/mocks/mock-user.service';
import { ApiService } from '../api.service';
import { UserService } from '../user.service';
import { ClinicalTrailsService } from './clinical-trails.service';

describe('ClinicalTrailsService', () => {
  let service: ClinicalTrailsService;
  let apiMock: any;
  let route: any;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClinicalTrailsService,
        { provide: ApiService, useClass: MockApiService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: UserService, useClass: MockUserService },
      ]
    });
    service = TestBed.inject(ClinicalTrailsService);
    userService = TestBed.inject(UserService);
    apiMock = TestBed.inject(ApiService);
    route = TestBed.inject(ActivatedRoute);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('#enable clinical trails', () => {
    beforeEach(() => {
      spyOn(apiMock, 'get').and.returnValue(of(true));
    });
    it('makes expected calls', () => {
      service.getClinicalTrailsApi().subscribe();
      expect(apiMock.get).toHaveBeenCalledWith('/guest/enableClinicalTrails');
    });
  });

});
