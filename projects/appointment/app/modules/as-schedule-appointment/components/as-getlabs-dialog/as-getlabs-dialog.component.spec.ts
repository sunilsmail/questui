// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { PropertiesService } from 'shared/services/properties.service';
// import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
// import { AsGetlabsDialogComponent } from './as-getlabs-dialog.component';

// const mockMatDialogRef = {
//   updateSize: (size: string) => {},
//   close: () => {}
// };
// describe('AsGetlabsDialogComponent', () => {
//   let component: AsGetlabsDialogComponent;
//   let fixture: ComponentFixture<AsGetlabsDialogComponent>;
//   let spy: jasmine.Spy;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
//         {provide: MatDialogRef, useValue: mockMatDialogRef},
//         { provide: PropertiesService, useClass: MockPropertiesService },
//       ],
//       declarations: [ AsGetlabsDialogComponent ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]

//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AsGetlabsDialogComponent);
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
//           expect(spy).toHaveBeenCalledWith('https://app.getlabs.com/book/step-1', '_blank');
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
