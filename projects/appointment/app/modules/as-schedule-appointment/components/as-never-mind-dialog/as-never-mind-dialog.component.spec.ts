import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsNeverMindDialogComponent } from './as-never-mind-dialog.component';

const mockMatDialogData = 'anything';
const mockMatDialogRef = {
  updateSize: (size: string) => {},
  close: () => {}
};

describe('AsNeverMindDialogComponent', () => {
  let component: AsNeverMindDialogComponent;
  let fixture: ComponentFixture<AsNeverMindDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsNeverMindDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsNeverMindDialogComponent);
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
