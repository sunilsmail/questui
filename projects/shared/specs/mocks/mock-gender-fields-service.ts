import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { PersonalData } from 'shared/models';
import { DemographicDetails } from 'shared/models/appointment';
import { GenderFeildsWithState, GenderMandatoryFields } from 'shared/models/gender-race-options';

@Injectable({
  providedIn: 'root'
})
export class MockGenderFieldsService {

  fieldsWithState: GenderFeildsWithState = null;
  userPersonalData: PersonalData | DemographicDetails = null;
  selectedValues: GenderMandatoryFields = null;

  validateRequiredFields(): any[] {
    return [];
  }

  setMandatoryFields(){

  }
}
