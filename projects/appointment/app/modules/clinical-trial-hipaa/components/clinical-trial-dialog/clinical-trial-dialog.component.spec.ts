import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalTrialDialogComponent } from './clinical-trial-dialog.component';

describe('ClinicalTrialDialogComponent', () => {
  let component: ClinicalTrialDialogComponent;
  let fixture: ComponentFixture<ClinicalTrialDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalTrialDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalTrialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
