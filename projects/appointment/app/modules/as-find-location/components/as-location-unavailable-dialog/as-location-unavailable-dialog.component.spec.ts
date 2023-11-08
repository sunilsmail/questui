import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsLocationUnavailableDialogComponent } from './as-location-unavailable-dialog.component';

const mockMatDialogData = 'anything';
const mockMatDialogRef = {
  updateSize: (size: string) => {},
  close: () => {}
};

describe('AsLocationUnavailableDialogComponent', () => {
  let component: AsLocationUnavailableDialogComponent;
  let fixture: ComponentFixture<AsLocationUnavailableDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsLocationUnavailableDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsLocationUnavailableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#closeDialog', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close').and.callThrough();
    });
      it(
        'should be called', () => {
          component.closePopUp();
          expect(component.dialogRef.close).toHaveBeenCalled();
        });
  });
});
