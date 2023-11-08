import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
// tslint:disable-next-line: max-line-length
import { AsVerifyIdentityDialogComponent } from 'app/modules/as-eorder/components/as-verify-identity-dialog/as-verify-identity-dialog.component';
// tslint:disable-next-line: max-line-length
import { AsFindAppointmentDialogComponent } from 'app/modules/as-find-appointment/components/as-find-appointment-dialog/as-find-appointment-dialog.component';
import { of } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { DataService } from 'shared/services/data.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { EorderStateNavigationService } from 'shared/services/eorder/eorder.state.navigation.service';
import { FindAppointmentService } from 'shared/services/find-appointment.service';
import { MaintainService } from 'shared/services/maintenace.service';
import { PropertiesService } from 'shared/services/properties.service';
import { UserService } from 'shared/services/user.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockEorderDataService } from 'shared/specs/mocks/mock-eorder-data.service';
import { MockEorderStateNavigationService } from 'shared/specs/mocks/mock-eorder-state-navigation.service';
import { MockFindAppointmentService } from 'shared/specs/mocks/mock-find-appointment';
import { MockMiantainService } from 'shared/specs/mocks/mock-maintain.service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockUserService } from 'shared/specs/mocks/mock-user.service';
// tslint:disable-next-line: max-line-length
import { AsImportantVisitInfoDialogComponent } from '../as-important-visit-info-dialog/as-important-visit-info-dialog.component';
import { AsHomeNewComponent } from './as-home-new.component';

const mockMatDialogRef = {
  updateSize: (size: string) => { },
  close: () => { },
  open: () => { },
  afterClosed: () => { }
};

class MockRouteComponent { }
const routes = [
  { path: 'schedule-appointment/as-open-eorders', component: MockRouteComponent },
  { path: 'schedule-appointment', component: MockRouteComponent },
  { path: 'schedule-appointment/as-reason-for-visit', component: MockRouteComponent },
];

describe('AsHomeNewComponent', () => {
  let component: AsHomeNewComponent;
  let fixture: ComponentFixture<AsHomeNewComponent>;
  let dataService: DataService;
  let mdialog: MatDialog;
  let propertiesService: PropertiesService;
  let maintainService: MaintainService;
  let userService: UserService;
  let eOrderStateNavigationService: EorderStateNavigationService;
  let eOderDataService: EorderDataService;
  let router: Router;
  let findAppointmentService: FindAppointmentService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsHomeNewComponent, AsVerifyIdentityDialogComponent, AsImportantVisitInfoDialogComponent],
      imports: [MatDialogModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        CustomPipesModule,
        MatAutocompleteModule,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        MockI18nModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      providers: [DataService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: PropertiesService, useClass: MockPropertiesService },
        { provide: MaintainService, useClass: MockMiantainService },
        { provide: ActivatedRoute, useValue: { queryParams: of({ token: 'xxxxx' }) } },
        { provide: UserService, useClass: MockUserService },
        { provide: EorderStateNavigationService, useClass: MockEorderStateNavigationService },
        { provide: EorderDataService, useClass: MockEorderDataService },
        { provide: FindAppointmentService, useClass: MockFindAppointmentService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: { entryComponents: [AsVerifyIdentityDialogComponent, AsImportantVisitInfoDialogComponent] }
      })
      .compileComponents();
  }));
  class HomeComponentSpec {
    constructor(private dialog: MatDialog) {
      dialog.open(AsFindAppointmentDialogComponent, { height: 'auto', maxWidth: '100vw' });
    }
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(AsHomeNewComponent);
    dataService = TestBed.inject(DataService);
    mdialog = TestBed.inject(MatDialog);
    propertiesService = TestBed.inject(PropertiesService);
    maintainService = TestBed.inject(MaintainService);
    userService = TestBed.inject(UserService);
    eOderDataService = TestBed.inject(EorderDataService);
    eOrderStateNavigationService = TestBed.inject(EorderStateNavigationService);
    router = TestBed.inject(Router);
    findAppointmentService = TestBed.inject(FindAppointmentService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not open important visit info dialog when it is eorder on ngOnInit', () => {
    spyOn(mdialog, 'open').and.stub();
    component.ngOnInit();
    expect(mdialog.open).not.toHaveBeenCalled();
  });

  // it('should open important visit info dialog when it is not eorder on ngOnInit', fakeAsync(() => {
  //   spyOn(dataService, 'setFindLocationFlow');
  //   spyOn(dataService, 'setLocationFinderDetailsFlowtoReason');
  //   spyOn(mdialog, 'open').and.returnValue({afterClosed: () => of(true)});
  //   component.isEorder = false;
  //   component.ngOnInit();
  //   tick(500);
  //   expect(dataService.setFindLocationFlow).toHaveBeenCalledWith(false);
  //   expect(dataService.setLocationFinderDetailsFlowtoReason).toHaveBeenCalledWith(false);
  //   expect(mdialog.open).toHaveBeenCalledWith(AsImportantVisitInfoDialogComponent,
  //     { panelClass: 'as-imp-visit-info-dialog-container', height: 'auto', maxWidth: '100vw', disableClose: true });
  // }));

  // it('should open findappointmentdialog on findAppointment method', () => {
  //   spyOn(mdialog, 'open').and.stub();
  //   component.findAppointment('view');
  //   expect(mdialog.open).toHaveBeenCalledWith(AsFindAppointmentDialogComponent, {
  //     height: 'auto', maxWidth: '100vw', disableClose: true
  //     , data: { actionName: 'view' }
  //   });
  // });

  it('should redirect to findrightTest url on findRightTest', () => {
    spyOn(propertiesService, 'getFindRightTestLink').and.callThrough();
    spyOn(window, 'open').and.stub();
    component.findRightTest();
    expect(window.open).toHaveBeenCalledWith('covid-testing-options', '_self');
  });

  describe('#next', () => {
    beforeEach(() => {
      spyOn(router, 'navigate').and.stub();
    });
    it('navigate to open orders', () => {
      eOrderStateNavigationService.blnOpenEorders = true;
      // spyOn(eOrderStateNavigationService, 'blnOpenEorders').and.returnValue(true);
      spyOn(eOrderStateNavigationService, 'setSelectedEorder').and.callThrough();
      component.next();
      expect(router.navigate).toHaveBeenCalledWith(['/schedule-appointment/as-open-eorders']);
      expect(eOrderStateNavigationService.setSelectedEorder).toHaveBeenCalledWith(null);
    });
    it('navigate to reason for visit', () => {
      eOrderStateNavigationService.blnOpenEorders = false;
      component.next();
      expect(router.navigate).toHaveBeenCalledWith(['/schedule-appointment']);
    });
  });

  describe('#covidTest', () => {
    beforeEach(() => {
      spyOn(router, 'navigate').and.stub();
    });
    it('navigate to reason for visit with covid tests filtered', () => {
      component.covidTest();
      expect(router.navigate).toHaveBeenCalledWith(['/schedule-appointment/as-reason-for-visit']);
    });
    it('setting filter in service', () => {
      spyOn(component, 'filterTests').and.callThrough();
      component.covidTest();
      expect(component.filterTests).toHaveBeenCalledWith(true);
    });
    it('reset filter', () => {
      spyOn(component, 'filterTests').and.callThrough();
      eOrderStateNavigationService.blnOpenEorders = false;
      component.next();
      expect(component.filterTests).toHaveBeenCalledWith(false);
    });
  });
});
