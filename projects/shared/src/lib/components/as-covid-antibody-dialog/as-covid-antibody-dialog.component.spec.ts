// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import {Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { AsCovidAntibodyDialogComponent } from './as-covid-antibody-dialog.component';

// const mockMatDialogRef = {
//   updateSize: (size: string) => {},
//   close: () => {}
// };

// describe('AsCovidAntibodyDialogComponent', () => {
//   let component: AsCovidAntibodyDialogComponent;
//   let fixture: ComponentFixture<AsCovidAntibodyDialogComponent>;
//   let spy: jasmine.Spy;
//   let router: Router;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule, MatDialogModule],
//       declarations: [AsCovidAntibodyDialogComponent],
//       providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
//         {provide: MatDialogRef, useValue: mockMatDialogRef}],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     router = TestBed.inject(Router);
//     fixture = TestBed.createComponent(AsCovidAntibodyDialogComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//   describe('#closeDialog', () => {
//     beforeEach(() => {
//       spy = spyOn(window, 'open');
//       component.closeDialog();
//     });
//   });
//   describe('#goToNext', () => {
//     beforeEach(() => {
//       spyOn(component.dialogRef, 'close').and.callThrough();
//     });
//   });
// });
