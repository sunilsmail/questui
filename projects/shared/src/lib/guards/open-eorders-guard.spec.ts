import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { PropertiesService } from 'shared/services/properties.service';
import { openOrdersApiResponse, MockEorderStateNavigationService } from 'shared/specs/mocks/mock-eorder-state-navigation.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { OpenEordersGuard } from './open-eorders-guard';

describe('OpenEordersGuard', () => {
  let guard: OpenEordersGuard;
  let propertiesService: PropertiesService;
  let eOderStateNavigationService: EorderStateNavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [OpenEordersGuard,
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: EorderStateNavigationService, useClass: MockEorderStateNavigationService }
      ]
    });

    guard = TestBed.inject(OpenEordersGuard);
    propertiesService = TestBed.inject(PropertiesService);
    eOderStateNavigationService = TestBed.inject(EorderStateNavigationService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();
  });

  describe('#canActivate', () => {

    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    it('should check feature flag and open eroders', () => {
      spyOn(propertiesService, 'getASOpenEordersF221').and.returnValue(of(true));
      spyOn(eOderStateNavigationService, 'getOpenEorders').and.returnValue(of(openOrdersApiResponse));
      guard.canActivate().subscribe(value => {
        expect(value).toEqual(true);
      });
      expect(propertiesService.getASOpenEordersF221).toHaveBeenCalled();
    });

    it('should check feature flag and open eroders and navigate fundtion should not call', () => {
      spyOn(propertiesService, 'getASOpenEordersF221').and.returnValue(of(true));
      spyOn(eOderStateNavigationService, 'getOpenEorders').and.returnValue(of(openOrdersApiResponse));
      guard.canActivate().subscribe();
      expect(router.navigate).not.toHaveBeenCalled();
    });
    it('should redirect to home page when flag is turned off', () => {
      spyOn(propertiesService, 'getASOpenEordersF221').and.returnValue(of(false));
      spyOn(eOderStateNavigationService, 'getOpenEorders').and.returnValue(of(openOrdersApiResponse));
      guard.canActivate().subscribe();
      expect(router.navigate).toHaveBeenCalled();
    });
    it('should redirect to home page when flag is turned off with route as-home', () => {
      spyOn(propertiesService, 'getASOpenEordersF221').and.returnValue(of(false));
      spyOn(eOderStateNavigationService, 'getOpenEorders').and.returnValue(of(openOrdersApiResponse));
      guard.canActivate().subscribe();
      expect(router.navigate).toHaveBeenCalledWith(['/as-home']);
    });
  });
});
