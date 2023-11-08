import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PscService } from 'shared/services/psc.service';
import { MockPscService } from 'shared/specs/mocks/mock-psc.service';
import { AsAntibodyF1269DialogComponent } from './as-antibody-f1269-dialog.component';
const mockMatDialogRef = {
  updateSize: (size: string) => { },
  close: () => { }
};

describe('AsAntibodyF1269DialogComponent', () => {
  let component: AsAntibodyF1269DialogComponent;
  let fixture: ComponentFixture<AsAntibodyF1269DialogComponent>;
  let spy: jasmine.Spy;
  let router: Router;
  let pscService: PscService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule],
      declarations: [AsAntibodyF1269DialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MatDialogRef, useValue: mockMatDialogRef },
      { provide: PscService, useValue: MockPscService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    pscService = TestBed.inject(PscService);
    fixture = TestBed.createComponent(AsAntibodyF1269DialogComponent);
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
  describe('#goToNext', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close').and.callThrough();
    });
  });
});
