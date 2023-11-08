import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppointmentService } from 'shared/services/appointment.service';
import { EorderDataService } from 'shared/services/eorder/eorder-data.service';
import { PscService } from 'shared/services/psc.service';
import { MockActivatedRoute } from 'shared/specs/mocks/mock-activatedroute';
import { MockAppointmentService } from 'shared/specs/mocks/mock-appointment.service';
import { MockPscService } from 'shared/specs/mocks/mock-psc.service';
import { AsEorderReasonForVisitComponent } from './as-eorder-reason-for-visit.component';


describe('AsEorderReasonForVisitComponent', () => {
  let component: AsEorderReasonForVisitComponent;
  let fixture: ComponentFixture<AsEorderReasonForVisitComponent>;
  let router: Router;
  let dialog: MatDialog;
  let eorderDataService:EorderDataService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, RouterTestingModule, MatDialogModule, BrowserAnimationsModule],
      declarations: [ AsEorderReasonForVisitComponent ],
      providers: [
        EorderDataService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: AppointmentService, useClass: MockAppointmentService },
        { provide: PscService, useClass: MockPscService },
    ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsEorderReasonForVisitComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    eorderDataService = TestBed.inject(EorderDataService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
