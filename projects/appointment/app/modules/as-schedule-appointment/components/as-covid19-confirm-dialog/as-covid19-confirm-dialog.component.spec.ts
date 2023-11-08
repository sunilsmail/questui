import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SkipInsuranceService } from 'shared/services/skip-insurance.service';
import { MockSkipInsuranceService } from 'shared/specs/mocks/mock-skip-insurance.service';
import { AsCovid19ConfirmDialogComponent } from './as-covid19-confirm-dialog.component';


const mockMatDialogRef = {
  updateSize: (size: string) => {},
  close: () => {}
};

describe('AsCovid19ConfirmDialogComponent', () => {
  let component: AsCovid19ConfirmDialogComponent;
  let fixture: ComponentFixture<AsCovid19ConfirmDialogComponent>;
  let dialog: MatDialog;
  let spy: jasmine.Spy;
  let router: Router;
  let skipInsuranceService: SkipInsuranceService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,RouterTestingModule,BrowserAnimationsModule,MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: SkipInsuranceService, useClass: MockSkipInsuranceService }
      ],
      declarations: [ AsCovid19ConfirmDialogComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AsCovid19ConfirmDialogComponent);
    skipInsuranceService = TestBed.inject(SkipInsuranceService);
    dialog = TestBed.inject(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#closeDialog', () => {
    beforeEach(() => {
      spy = spyOn(window, 'open');
      component.closeDialog();
    });
  });
});
