// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { PropertiesService } from 'shared/services/properties.service';
// import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
// import { MockGenderFieldsService } from 'shared/specs/mocks/mock-gender-fields-service';
// import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
// import { AsGenderFieldsDialogComponent } from './as-gender-fields-dialog.component';

// describe('AsGenderFieldDialogComponent', () => {
//   let component: AsGenderFieldsDialogComponent;
//   let fixture: ComponentFixture<AsGenderFieldsDialogComponent>;
//   let propertiesService: PropertiesService;
//   let genderFieldsService: GenderFieldsService;

//   const mockMatDialogRef = {
//     close: () => { }
//   };

//   const data = {
//     'genderRaceOptions': [
//       {
//         'field_name': 'gender_preference',
//         'options': [
//           {
//             'key': 'M',
//             'value': 'Male'
//           },
//           {
//             'key': 'F',
//             'value': 'Female'
//           },
//           {
//             'key': 'MTF',
//             'value': 'Transgender male-to-female'
//           },
//           {
//             'key': 'FTM',
//             'value': 'Transgender female-to-male'
//           },
//           {
//             'key': 'TNOS',
//             'value': 'Transgender, not specified'
//           },
//           {
//             'key': 'X',
//             'value': 'Gender nonconforming'
//           },
//           {
//             'key': 'D',
//             'value': 'Decline to answer'
//           },
//           {
//             'key': 'NG',
//             'value': 'Not given'
//           }
//         ],
//         'enabled': true,
//         'state': [
//           'NJ'
//         ],
//         'key': 'M'
//       },
//       {
//         'field_name': 'race',
//         'options': [
//           {
//             'key': 'I',
//             'value': 'American Indian or Alaska Native'
//           },
//           {
//             'key': 'A',
//             'value': 'Asian'
//           },
//           {
//             'key': 'B',
//             'value': 'Black or African American'
//           },
//           {
//             'key': 'P',
//             'value': 'Native Hawaiian or Other Pacific Islander'
//           },
//           {
//             'key': 'O',
//             'value': 'Other Race'
//           },
//           {
//             'key': 'W',
//             'value': 'White'
//           },
//           {
//             'key': 'NG',
//             'value': 'Not given'
//           },
//           {
//             'key': 'M',
//             'value': 'Multiracial'
//           },
//           {
//             'key': 'D',
//             'value': 'Decline to answer'
//           }
//         ],
//         'enabled': true,
//         'state': [
//           'NJ'
//         ],
//         'isRequired': true,
//         'key': null
//       },
//       {
//         'field_name': 'ethnicity',
//         'options': [
//           {
//             'key': 'H',
//             'value': 'Hispanic or Latino'
//           },
//           {
//             'key': 'N',
//             'value': 'Not Hispanic or Latino'
//           },
//           {
//             'key': 'NG',
//             'value': 'Not given'
//           },
//           {
//             'key': 'D',
//             'value': 'Decline to answer'
//           }
//         ],
//         'enabled': true,
//         'state': [
//           'NJ'
//         ],
//         'isRequired': true,
//         'key': null
//       },
//       {
//         'field_name': 'Sexual_orientation',
//         'options': [
//           {
//             'key': 'BI',
//             'value': 'Bisexual'
//           },
//           {
//             'key': 'HET',
//             'value': 'Straight'
//           },
//           {
//             'key': 'HOM',
//             'value': 'Gay or lesbian'
//           },
//           {
//             'key': 'SE',
//             'value': 'Something else'
//           },
//           {
//             'key': 'D',
//             'value': 'Decline to answer'
//           },
//           {
//             'key': 'NG',
//             'value': 'Not given'
//           }
//         ],
//         'enabled': true,
//         'state': [
//           'NJ'
//         ],
//         'isRequired': true,
//         'key': null
//       }
//     ],
//     'selectedState': 'NJ'
//   };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [MatDialogModule,
//         HttpClientTestingModule,
//         FormsModule,
//         ReactiveFormsModule],
//       declarations: [AsGenderFieldsDialogComponent],
//       providers: [{ provide: PropertiesService, useClass: MockPropertiesService },
//       { provide: GenderFieldsService, useClass: MockGenderFieldsService },
//       { provide: MAT_DIALOG_DATA, useValue: {} },
//       { provide: MatDialogRef, useValue: mockMatDialogRef }],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     })
//       .compileComponents();
//   });

//   beforeEach(() => {
//     propertiesService = TestBed.inject(PropertiesService);
//     genderFieldsService = TestBed.inject(GenderFieldsService);
//     fixture = TestBed.createComponent(AsGenderFieldsDialogComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('onInit', () => {
//     beforeEach(() => {
//       spyOn(component, 'buildForm').and.callThrough();
//       component.ngOnInit();
//     });
//     it('should call buildForm,addressAutocompleteInit,zipCodeValidationInit', () => {
//       expect(component.buildForm).toHaveBeenCalled();
//     });
//   });

//   describe('buildform()', () => {
//     beforeEach(() => {
//       component.buildControlsData = data;
//       component.buildForm();
//     });
//     it('it should call upateValidation method ', () => {
//       spyOn(component, 'upateValueAndValidation');
//       component.upateValueAndValidation();
//       expect(component.upateValueAndValidation).toHaveBeenCalled();
//     });
//   });

//   describe('upateValueAndValidation()', () => {
//     it('it should not set validators for genderPreference if controlname is null ', () => {
//       const control = component.genderFieldsForm.controls.genderPreference;
//       expect(component.genderFieldsForm.get('genderPreference')).toBeTruthy();
//       expect(control.hasError('required')).toBeFalsy();
//     });
//     it('it should not set validators for sexualOrientation if controlname is null ', () => {
//       const control = component.genderFieldsForm.controls.sexualOrientation;
//       expect(component.genderFieldsForm.get('sexualOrientation')).toBeTruthy();
//       expect(control.hasError('required')).toBeFalsy();
//     });

//   });

//   describe('#checking getters', () => {
//     beforeEach(() => {
//       component.buildControlsData = data;
//     });
//     it('getRace', () => {
//       expect(component.getRace.length).toBeGreaterThan(0);
//     });

//     it('getEthnicity', () => {
//       component.buildControlsData = data;
//       expect(component.getEthnicity.length).toBeGreaterThan(0);
//     });

//     it('getGenderPreference', () => {
//       expect(component.getGenderPreference.length).toBeGreaterThan(0);
//     });
//     it('getSexualOrientation', () => {
//       expect(component.getSexualOrientation.length).toBeGreaterThan(0);
//     });
//     it('getSexualOrientation disable', () => {
//       component.buildControlsData.genderRaceOptions = null;
//       expect(component.getSexualOrientation).toBe(null);
//     });
//     it('getEthnicity disable', () => {
//       component.buildControlsData.genderRaceOptions = null;
//       expect(component.getEthnicity).toBe(null);
//     });
//     it('getRace disable', () => {
//       component.buildControlsData.genderRaceOptions = null;
//       expect(component.getRace).toBe(null);
//     });
//     it('getGenderPreference disable', () => {
//       component.buildControlsData.genderRaceOptions = null;
//       expect(component.getGenderPreference).toBe(null);
//     });
//   });

//   describe('#closeDialog', () => {
//     beforeEach(() => {
//       spyOn(component.dialogRef, 'close');
//     });
//     it('closeDialog', () => {
//       component.closeDialog();
//       expect(component.dialogRef.close).toHaveBeenCalled();
//     });
//   });
// });
