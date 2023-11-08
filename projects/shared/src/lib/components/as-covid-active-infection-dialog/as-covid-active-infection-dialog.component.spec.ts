// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialogModule, MatDialogRef, MatSnackBarModule, MAT_DIALOG_DATA } from '@angular/material';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ActivatedRoute, Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { AsCovidActiveInfectionDialogComponent } from './as-covid-active-infection-dialog.component';

// const mockMatDialogRef = {
//   updateSize: (size: string) => {},
//   close: () => {}
// };

// describe('AsCovidActiveInfectionDialogComponent', () => {
//   let component: AsCovidActiveInfectionDialogComponent;
//   let fixture: ComponentFixture<AsCovidActiveInfectionDialogComponent>;

//   let spy: jasmine.Spy;
//   let router: Router;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule, RouterTestingModule, MatSnackBarModule, MatDialogModule, BrowserAnimationsModule],
//       providers: [{provide: MAT_DIALOG_DATA, useValue: {}},
//         {provide: MatDialogRef, useValue: mockMatDialogRef}],
//       declarations: [ AsCovidActiveInfectionDialogComponent ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     router = TestBed.inject(Router);
//     fixture = TestBed.createComponent(AsCovidActiveInfectionDialogComponent);
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
//   describe('#continue', () => {
//     beforeEach(() => {
//       spy = spyOn(window, 'open');
//       spyOn(router, 'navigate').and.callThrough();
//       component.destination = '/schedule-appointment/as-appt-scheduler';
//       component.continue();
//     });
//   });
//   describe('#openActiveInfectionOrderDialog', () => {
//     beforeEach(() => {
//       spy = spyOn(window, 'open');
//       component.openActiveInfectionOrderDialog();
//     });
//   });
// });
