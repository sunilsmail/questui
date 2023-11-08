import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed  } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsPriceEstimateDialogComponent } from './as-price-estimate-dialog.component';

const mockMatDialogRef = {
  close: () => {}
};

describe('AsPriceEstimateDialogComponent', () => {
  let component: AsPriceEstimateDialogComponent;
  let fixture: ComponentFixture<AsPriceEstimateDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsPriceEstimateDialogComponent ],
      providers: [
        Renderer2,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockMatDialogRef }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsPriceEstimateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
