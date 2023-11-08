import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplaySubject } from 'rxjs';
import { CustomPipesModule } from 'shared/custom-pipes.module';
import { AppointmentDetails } from 'shared/models/appointment';
import { AppointmentSummaryService } from 'shared/services/appointment-summary.service';
import { FindAppointmentService } from 'shared/services/find-appointment.service';
import { PropertiesService } from 'shared/services/properties.service';
import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
import { SecondaryInsuranceService } from 'shared/services/secondary-insurance.service';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { UserService } from 'shared/services/user.service';
import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
import { MockFindAppointmentService } from 'shared/specs/mocks/mock-find-appointment';
import { MockGenderFieldsService } from 'shared/specs/mocks/mock-gender-fields-service';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { MockSkipInsuranceService } from 'shared/specs/mocks/mock-skip-insurance.service';
import { AsVerifyPhoneDialogComponent } from '../as-verify-phone-dialog/as-verify-phone-dialog.component';
import { AsFindAppointmentSummaryComponent } from './as-find-appointment-summary.component';
const mockMatDialogRef = {
  updateSize: (size: string) => { },
  close: () => { }
};

class AppointmentSummaryComponent {
  constructor(private dialog: MatDialog) {
    dialog.open(AsVerifyPhoneDialogComponent, { height: 'auto', maxWidth: '100vw' });
  }
}

describe('AsFindAppointmentSummaryComponent', () => {
  let component: AsFindAppointmentSummaryComponent;
  let fixture: ComponentFixture<AsFindAppointmentSummaryComponent>;
  let appointmentSummaryService: AppointmentSummaryService;
  let userService: UserService;
  let route: any;
  let userAuthenticated$: ReplaySubject<boolean>;
  let findAppointmentService: FindAppointmentService;
  let skipInsuranceService: SkipInsuranceService;
  let propertiesService: PropertiesService;
  let secondaryInsuranceService: SecondaryInsuranceService;
  let genderFieldsService: GenderFieldsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AsFindAppointmentSummaryComponent],
      imports: [HttpClientTestingModule, MatDialogModule,
        RouterTestingModule.withRoutes([]), CustomPipesModule],
      providers: [AppointmentSummaryService,
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: FindAppointmentService, useClass: MockFindAppointmentService },
        { provide: SkipInsuranceService, useClass: MockSkipInsuranceService },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: PropertiesService, useClass: MockPropertiesService},
        SecondaryInsuranceService,
        { provide: GenderFieldsService, useClass: MockGenderFieldsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    appointmentSummaryService = TestBed.inject(AppointmentSummaryService);
    findAppointmentService = TestBed.inject(FindAppointmentService);
    skipInsuranceService = TestBed.inject(SkipInsuranceService);
    userService = TestBed.inject(UserService);
    userAuthenticated$ = new ReplaySubject<boolean>(1);
    propertiesService = TestBed.inject(PropertiesService);
    secondaryInsuranceService = TestBed.inject(SecondaryInsuranceService);
    userService.isAuthenticated$ = userAuthenticated$;
    fixture = TestBed.createComponent(AsFindAppointmentSummaryComponent);
    genderFieldsService = TestBed.inject(GenderFieldsService);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;
    spyOn(window, 'print').and.stub();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should print to confirmation print page in summary page', () => {
    component.printConfirmation();
    expect(window.print).toHaveBeenCalled();
  });

  describe('#ngOnInit', () => {
    describe('LoggedIn flow with valid queryParams', () => {
      beforeEach(() => {
        route.setQueryParam('cancelFromMQ', 'true');
        route.setQueryParam('confirmationCode', 'ABCXYZ');
        userAuthenticated$.next(true);
        spyOn(component, 'getCancelModifyDetails').and.callThrough();
        component.ngOnInit();
      });
      it('should detect queryParams and auth flow', () => {
        expect(component.confirmationCode).toBe('ABCXYZ');
        expect(component.isCancelRequestFromMyQuest).toBeTruthy();
        expect(component.isLoggedIn).toBeTruthy();
        expect(component.getCancelModifyDetails).toHaveBeenCalled();
      });
    });

    describe('Not LoggedIn flow with valid queryParams', () => {
      beforeEach(() => {
        route.setQueryParam('cancelFromMQ', 'true');
        route.setQueryParam('confirmationCode', 'ABCXYZ');
        userAuthenticated$.next(false);
        spyOn(component, 'getCancelModifyDetails').and.callThrough();
        component.ngOnInit();
      });
      it('should detect queryParams and not auth flow', () => {
        expect(component.confirmationCode).toBe('ABCXYZ');
        expect(component.isCancelRequestFromMyQuest).toBeTruthy();
        expect(component.isLoggedIn).toBeFalsy();
        expect(component.getCancelModifyDetails).toHaveBeenCalled();
      });
    });

    describe('With Random Query Params', () => {
      beforeEach(() => {
        route.setQueryParam('notValid', 'blabla');
        route.setQueryParam('notfromMQ', 'abcd');
        userAuthenticated$.next(false);
        spyOn(component, 'getCancelModifyDetails').and.callThrough();
        component.ngOnInit();
      });
      it('confirmationCode not valid and cancel request from MyQuest is false', () => {
        expect(component.confirmationCode).toEqual(undefined);
        expect(component.isCancelRequestFromMyQuest).toBeFalsy();
        expect(component.isLoggedIn).toBeFalsy();
        expect(component.getCancelModifyDetails).toHaveBeenCalled();
      });
    });
    describe('#getReasons', () => {
      beforeEach(() => {
        spyOn(component, 'getReasons').and.callThrough();
      });
      it('should call', () => {
        component.appointmentDetails = new AppointmentDetails();
        component.appointmentDetails.facilityServiceId = [1];
        component.getReasons();
        expect(component.getReasons).toHaveBeenCalled();
      });
    });
  });
});
