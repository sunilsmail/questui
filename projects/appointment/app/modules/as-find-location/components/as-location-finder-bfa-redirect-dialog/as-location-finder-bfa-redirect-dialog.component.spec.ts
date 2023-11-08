import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsLocationFinderBfaRedirectDialogComponent } from './as-location-finder-bfa-redirect-dialog.component';


describe('AsLocationFinderBfaRedirectDialogComponent', () => {
  let component: AsLocationFinderBfaRedirectDialogComponent;
  let fixture: ComponentFixture<AsLocationFinderBfaRedirectDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: {}}],
      declarations: [ AsLocationFinderBfaRedirectDialogComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsLocationFinderBfaRedirectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
