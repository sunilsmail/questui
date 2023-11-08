import { Injectable } from '@angular/core';
import { DemographicDetails } from 'shared/models/appointment';
import {
  All_States,
  GenderFeildsWithState, GenderMandatoryFields,
  GenderPrefControlname, GenderPrefFieldName, GenderRaceOptions
} from 'shared/models/gender-race-options';
import { PersonalData } from './../../models/user-demographic';

@Injectable({
  providedIn: 'root'
})
export class GenderFieldsService {

  constructor() { }

  fieldsWithState: GenderFeildsWithState = null;
  userPersonalData: PersonalData | DemographicDetails = null;
  selectedValues: GenderMandatoryFields = null;

  validateRequiredFields(): any[] {
    const requiredFieldNames = [];
    try {
      if (!this.userPersonalData) {
        return requiredFieldNames;
      }
      for (let i = 0; i <= this.fieldsWithState.genderRaceOptions.length - 1; i++) {

        const fieldname = this.getControlname(this.fieldsWithState?.genderRaceOptions[i]?.field_name);
        const displayState = this.convertToLowerCaseArray(this.fieldsWithState?.genderRaceOptions[i].displayState);
        const requiredState = this.convertToLowerCaseArray(this.fieldsWithState?.genderRaceOptions[i]?.requiredState);

        // if ((displayState?.includes(All_States) || displayState?.includes(this.fieldsWithState?.selectedState?.toLowerCase()))
        //   && !this.userPersonalData[fieldname]) {
        //   this.fieldsWithState.genderRaceOptions[i].isRequired = true;
        //   this.fieldsWithState.genderRaceOptions[i].key = null;
        //   requiredFieldNames.push(fieldname);
        // }

        if ((displayState?.includes(All_States) || displayState?.includes(this.fieldsWithState?.selectedState?.toLowerCase()))
          && (requiredState?.includes(All_States) || requiredState?.includes(this.fieldsWithState?.selectedState?.toLowerCase()))
          && !this.userPersonalData[fieldname]) {
          this.fieldsWithState.genderRaceOptions[i].isRequired = true;
          this.fieldsWithState.genderRaceOptions[i].key = null;
          requiredFieldNames.push(fieldname);
        }

        if (this.userPersonalData[fieldname]) {
          this.fieldsWithState.genderRaceOptions[i].key = this.userPersonalData[fieldname];
        }

      }

      return requiredFieldNames;
    } catch (ex) {
      return requiredFieldNames;
    } finally {
      console.log(this.userPersonalData);
    }

  }

  convertToLowerCaseArray(arr) {
    return arr?.map(x => x.toLowerCase());
  }

  getControlname(name: string) {
    if (name === GenderPrefFieldName.GenderPreference) {
      return GenderPrefControlname.GenderPreference;
    } else if (name === GenderPrefFieldName.SexualOrientation) {
      return GenderPrefControlname.SexualOrientation;
    }
    return name;
  }

  setMandatoryFields(selectedValues) {
    this.selectedValues = selectedValues;
    this.userPersonalData = { ...this.userPersonalData, ...this.selectedValues };
  }

  getMandatoryValues() {
    try {
      const values = new GenderMandatoryFields();
      for (const prop in this.selectedValues) {
        if (this.selectedValues[prop]) {
          values[prop] = this.selectedValues[prop];
        }
      }
      return values;
    } catch (ex) {
      return new GenderMandatoryFields();
    }
  }

  checkFieldAndDisplay(genderRaceOptions: GenderRaceOptions[], fieldName: string, selectedState: string = null) {
    try {
      const field = genderRaceOptions?.find(x => x.field_name === fieldName);
      field.displayState = [...field?.displayState?.map(x => x.toLowerCase())];
      if (!selectedState && field.displayState.includes(All_States)) {
        return field.options;
      }
      if (field && (field.displayState.includes(All_States) || field.displayState.includes(selectedState.toLowerCase()))) {
        return field.options;
      }
      return null;
    } catch (ex) {
      return null;
    }
  }
  checkFieldAndDisplayReqOptions(genderRaceOptions: GenderRaceOptions[], fieldName: string, selectedState: string = null) {
    try {
      const field = genderRaceOptions?.find(x => x.field_name === fieldName);
      field.displayState = [...field?.displayState?.map(x => x.toLowerCase())];
      field.requiredState = [...field?.requiredState?.map(x => x.toLowerCase())];
      if (!selectedState && field.displayState.includes(All_States)) {
        return field.options;
      }
      if (field
        && (field.displayState.includes(All_States) || field.displayState.includes(selectedState.toLowerCase()))
        && (field.requiredState.includes(All_States) || field.requiredState.includes(selectedState.toLowerCase()))) {
        return field.options;
      }
      return null;
    } catch (ex) {
      return null;
    }
  }
  checkFieldAndDisplayAndRequired(genderRaceOptions: GenderRaceOptions[], fieldName: string, selectedState: string = null) {
    try {
      const field = genderRaceOptions?.find(x => x.field_name === fieldName);
      field.displayState = [...field?.displayState?.map(x => x.toLowerCase())];
      field.requiredState = [...field?.requiredState?.map(x => x.toLowerCase())];
      if (field
        && (field.displayState.includes(All_States) || field.displayState.includes(selectedState.toLowerCase()))
        && (field.requiredState.includes(All_States) || field.requiredState.includes(selectedState.toLowerCase()))
      ) {
        return true;
      }
      return false;
    } catch (ex) {
      return false;
    }
  }
  checkFieldAndDisplayAndRequiredDialog(genderRaceOptions: GenderRaceOptions[], fieldName: string, selectedState: string = null) {
    try {
      const field = genderRaceOptions?.find(x => x.field_name === fieldName);
      field.displayState = [...field?.displayState?.map(x => x.toLowerCase())];
      field.requiredState = [...field?.requiredState?.map(x => x.toLowerCase())];
      if (field
        && (field.displayState.includes(All_States) || field.displayState.includes(selectedState.toLowerCase()))
        && (field.requiredState.includes(All_States) || field.requiredState.includes(selectedState.toLowerCase()))
      ) {
        return field.options;
      }
      return null;
    } catch (ex) {
      return null;
    }
  }

}
