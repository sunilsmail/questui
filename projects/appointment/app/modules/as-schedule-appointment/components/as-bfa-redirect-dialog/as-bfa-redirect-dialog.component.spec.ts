import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsBfaRedirectDialogComponent } from './as-bfa-redirect-dialog.component';


const mockMatDialogRef = {
  updateSize: (size: string) => {},
  close: () => {}
};
describe('AsBfaRedirectDialogComponent', () => {
  let component: AsBfaRedirectDialogComponent;
  let fixture: ComponentFixture<AsBfaRedirectDialogComponent>;
  let spy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
        {provide: MatDialogRef, useValue: mockMatDialogRef}],
      declarations: [ AsBfaRedirectDialogComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsBfaRedirectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#goToOtherWebsite', () => {
    beforeEach(() => {
      spy = spyOn(window, 'open');
      component.goToOtherWebsite();
    });
      it(
        'should be called', () => {
          expect(spy).toHaveBeenCalled();
        });
      it(
        'should be called with', () => {
          expect(spy).toHaveBeenCalledWith('https://My.QuestForHealth.com', '_blank');
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

  describe('#closeDialog', () => {
    beforeEach(() => {
      spyOn(component.dialogRef, 'close').and.callThrough();
    });
      it(
        'should be called', () => {
          component.closeDialog();
          expect(component.dialogRef.close).toHaveBeenCalled();
        });
  });

});
