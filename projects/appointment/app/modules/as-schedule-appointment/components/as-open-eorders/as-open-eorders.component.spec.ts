import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { OpenEorders } from 'shared/models';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderService } from 'shared/services/eorder/eorder.service';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { MockEorderDataService } from 'shared/specs/mocks/mock-eorder-data.service';
import { MockEorderStateNavigationService } from 'shared/specs/mocks/mock-eorder-state-navigation.service';
import { MockEorderService } from 'shared/specs/mocks/mock-eorder.service';
import { openOrdersApiResponse } from './../../../../../../shared/specs/mocks/mock-eorder-state-navigation.service';
import { AsOpenEordersComponent } from './as-open-eorders.component';


describe('AsOpenEordersComponent', () => {
  let component: AsOpenEordersComponent;
  let fixture: ComponentFixture<AsOpenEordersComponent>;
  let eOderStateNavigationService: EorderStateNavigationService;
  let eOrderService: EorderService;
  let router: Router;
  let eOrderDataService: EorderDataService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule],
      providers: [
        { provide: EorderStateNavigationService, useClass: MockEorderStateNavigationService },
        { provide: EorderService, useClass: MockEorderService },
        { provide: EorderDataService, useClass: MockEorderDataService }
      ],
      declarations: [AsOpenEordersComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AsOpenEordersComponent);
    eOrderService =  TestBed.inject(EorderService);
    eOderStateNavigationService = TestBed.inject(EorderStateNavigationService);
    eOrderDataService = TestBed.inject(EorderDataService);
    component = fixture.componentInstance;
    spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#selectedEorder', () => {
    it('selecting eorder', () => {
      component.selectedEorder(openOrdersApiResponse[0]);
      expect(component.selectedItem).toEqual(openOrdersApiResponse[0]);
    });
  });

  describe('#continueEorderFlow', () => {

    it('continue eorder', () => {
      spyOn(eOderStateNavigationService, 'getRoutePathByFlow').and.callThrough();
      spyOn(eOrderService, 'getEncounterInfo').and.callThrough();
      component.selectedItem = openOrdersApiResponse[0];
      component.continueEorderFlow();
      expect(eOderStateNavigationService.getRoutePathByFlow).toHaveBeenCalled();
      expect(eOrderService.getEncounterInfo).toHaveBeenCalled();
    });

    it('continue eorder', () => {
      spyOn(eOderStateNavigationService, 'getRoutePathByFlow').and.callThrough();
      const res: OpenEorders = {
        token: '-1'
      };
      component.selectedItem = res;
      component.continueEorderFlow();
      expect(eOderStateNavigationService.getRoutePathByFlow).not.toHaveBeenCalled();
    });

    it('donot call getEncounterInfo', () => {
      spyOn(eOderStateNavigationService, 'getRoutePathByFlow').and.callThrough();
      spyOn(eOrderService, 'getEncounterInfo').and.callThrough();
      const res: OpenEorders = {
        token: '-1'
      };
      component.selectedItem = res;
      component.continueEorderFlow();
      expect(eOderStateNavigationService.getRoutePathByFlow).not.toHaveBeenCalled();
      expect(eOrderService.getEncounterInfo).not.toHaveBeenCalled();
    });

    it('continue eorder with stateNavigation', () => {
      spyOn(eOderStateNavigationService, 'getRoutePathByFlow').and.callThrough();
      spyOn(eOderStateNavigationService, 'createEorderUserSession').and.returnValue(of({ stateNavigation: 'whoIsVisiting' }));
      spyOn(eOrderService, 'getEncounterInfo').and.callThrough();
      component.selectedItem = openOrdersApiResponse[0];
      component.continueEorderFlow();
      expect(eOderStateNavigationService.getRoutePathByFlow).toHaveBeenCalled();
      expect(eOderStateNavigationService.createEorderUserSession).toHaveBeenCalled();
      expect(eOrderService.getEncounterInfo).toHaveBeenCalled();
    });
    it('when api throws error', () => {
      spyOn(eOderStateNavigationService, 'createEorderUserSession').and.returnValue(throwError('error'));
      spyOn(eOderStateNavigationService, 'getRoutePathByFlow').and.callThrough();
      component.selectedItem = openOrdersApiResponse[0];
      component.continueEorderFlow();
      expect(eOderStateNavigationService.getRoutePathByFlow).not.toHaveBeenCalled();
      expect(eOderStateNavigationService.createEorderUserSession).toHaveBeenCalled();
      expect(component.loadingIcon).toBe(false);
    });

    it('I would like to schedule an appointment for something else', () => {
      spyOn(eOderStateNavigationService, 'createEorderUserSession').and.returnValue(of({ stateNavigation: 'whoIsVisiting' }));
      spyOn(eOderStateNavigationService, 'getRoutePathByFlow').and.callThrough();
      const mockitem: OpenEorders = {
        token: '-1'
      };
      component.selectedItem = mockitem;
      component.continueEorderFlow();
      expect(eOderStateNavigationService.getRoutePathByFlow).not.toHaveBeenCalled();
      expect(eOderStateNavigationService.createEorderUserSession).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/schedule-appointment/as-reason-for-visit']);
    });

    it('user confirm test has been completed', () => {
      spyOn(eOderStateNavigationService, 'getRoutePathByFlow').and.callThrough();
      spyOn(eOrderService, 'getEncounterInfo').and.returnValue(of({status: 'userConfirmTest'}));
      spyOn(eOderStateNavigationService, 'createEorderUserSession').and.callThrough();
      component.selectedItem = openOrdersApiResponse[0];
      component.continueEorderFlow();
      expect(eOderStateNavigationService.getRoutePathByFlow).not.toHaveBeenCalled();
      expect(eOderStateNavigationService.createEorderUserSession).not.toHaveBeenCalled();
      expect(eOrderService.getEncounterInfo).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/as-home']);
    });
    it('accessed from another account navigate to home page', () => {
      spyOn(eOderStateNavigationService, 'getRoutePathByFlow').and.callThrough();
      spyOn(eOrderService, 'getEncounterInfo').and.returnValue(of({status: 'accessedFromAnotherAccount'}));
      spyOn(eOderStateNavigationService, 'createEorderUserSession').and.callThrough();
      component.selectedItem = openOrdersApiResponse[0];
      component.continueEorderFlow();
      expect(eOderStateNavigationService.getRoutePathByFlow).not.toHaveBeenCalled();
      expect(eOderStateNavigationService.createEorderUserSession).not.toHaveBeenCalled();
      expect(eOrderService.getEncounterInfo).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/as-home']);
    });

  });

  describe('#goToPrevious', () => {
    it('landing to home page', () => {
      component.goToPrevious();
      expect(router.navigate).toHaveBeenCalledWith(['/as-home']);
    });
    it('resetting eorder selection', () => {
      spyOn(eOderStateNavigationService, 'setSelectedEorder').and.callThrough();
      component.goToPrevious();
      expect(eOderStateNavigationService.setSelectedEorder).toHaveBeenCalledWith(null);
    });
  });

});
