// import { TestBed } from '@angular/core/testing';
// import { DataService } from 'shared/services/data.service';
// import { GenderFieldsService } from 'shared/services/psc/gender-fields.service';
// import { EorderDataService } from '../eorder/eorder-data.service';
// import { MockDataService } from './../../../../specs/mocks/mock-data.service';
// import { MockEorderDataService } from './../../../../specs/mocks/mock-eorder-data.service';
// import { GenderPrefControlname } from './../../models/gender-race-options';


// describe('GenderFieldsService', () => {
//   let service: GenderFieldsService;
//   let dataService: DataService;
//   let eorderDataService: EorderDataService;

//   const data = {
//     GenderPreference: 'genderPreference',
//     Race: 'race',
//     Ethnicity: 'ethnicity',
//     SexualOrientation: 'sexualOrientation'
//   };

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         GenderFieldsService,
//         { provide: DataService, useClass: MockDataService },
//         { provide: EorderDataService, useClass: MockEorderDataService },
//       ]
//     });
//     service = TestBed.inject(GenderFieldsService);
//     dataService = TestBed.inject(DataService);
//     eorderDataService = TestBed.inject(EorderDataService);
//   });

//   it('can load instance', () => {
//     expect(service).toBeTruthy();
//   });

//   describe('validateRequiredFields', () => {

//     it('should return requiredFieldNames as null', () => {
//       expect(service.validateRequiredFields.length).toEqual(0);
//     });
//   });

//   describe('getControlname', () => {

//     it('it should return genderPreference', () => {
//       expect(GenderPrefControlname.GenderPreference).toEqual(data.GenderPreference);
//     });
//     it('it should return sexualOrientation', () => {
//       expect(GenderPrefControlname.SexualOrientation).toEqual(data.SexualOrientation);
//     });
//   });

//   describe('getMandatoryValues', () => {

//     it('should return values as null', () => {
//       expect(service.getMandatoryValues.length).toEqual(0);
//     });
//   });
// });
