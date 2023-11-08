import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsPeaceOfMindTestDialogComponent } from './as-peace-of-mind-test-dialog.component';


const mockMatDialogRef = {
  updateSize: (size: string) => {},
  close: () => {}
};
describe('AsBfaRedirectDialogComponent', () => {
  let component: AsPeaceOfMindTestDialogComponent;
  let fixture: ComponentFixture<AsPeaceOfMindTestDialogComponent>;
  let spy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: mockMatDialogRef}],
      declarations: [ AsPeaceOfMindTestDialogComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsPeaceOfMindTestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#filterSlots', () => {
    beforeEach(() => {
      spy = spyOn(window, 'open');
      component.filterSlots();
    });
  });

  describe('#closeDialog', () => {
    beforeEach(() => {
      spy = spyOn(window, 'open');
      component.filterSlots();
    });
  });

  describe('#onNoClick', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close').and.callThrough();
    });
      it(
        'should be called', () => {
          component.onNoClick();
          expect(component.dialogRef.close).toHaveBeenCalled();
        });
  });

  describe('#showAllSlots', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close').and.callThrough();
    });
      it(
        'should be called', () => {
          component.showAllSlots();
          expect(component.dialogRef.close).toHaveBeenCalled();
        });
  });

});
