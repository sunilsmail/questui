// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { AsBfaRedirectionDialogComponent } from './as-bfa-redirection-dialog.component';

// const mockMatDialogRef = {
//   updateSize: (size: string) => {},
//   close: () => {}
// };

// describe('AsBfaRedirectionDialogComponent', () => {
//   let component: AsBfaRedirectionDialogComponent;
//   let fixture: ComponentFixture<AsBfaRedirectionDialogComponent>;
//   let spy: jasmine.Spy;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
//         {provide: MatDialogRef, useValue: mockMatDialogRef}],
//       declarations: [ AsBfaRedirectionDialogComponent ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]

//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AsBfaRedirectionDialogComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('#goToOtherWebsite', () => {
//     beforeEach(() => {
//       spy = spyOn(window, 'open');
//       component.goToOtherWebsite();
//     });
//       it(
//         'should be called', () => {
//           expect(spy).toHaveBeenCalled();
//         });
//       it(
//         'should be called with', () => {
//           expect(spy).toHaveBeenCalledWith('https://My.QuestForHealth.com', '_blank');
//         });
//   });

//   describe('#onNoClick', () => {
//     beforeEach(() => {
//       spyOn(component.dialogRef, 'close').and.callThrough();
//     });
//       it(
//         'should be called', () => {
//           component.onNoClick();
//           expect(component.dialogRef.close).toHaveBeenCalled();
//         });
//   });

//   describe('#closeDialog', () => {
//     beforeEach(() => {
//       spyOn(component.dialogRef, 'close').and.callThrough();
//     });
//       it(
//         'should be called', () => {
//           component.closeDialog();
//           expect(component.dialogRef.close).toHaveBeenCalled();
//         });
//   });

// });
