import { PersonalData } from 'shared/models';
import { DemographicDetails } from 'shared/models/appointment';
import { GenderFeildsWithState, GenderMandatoryFields } from 'shared/models/gender-race-options';


export class MockGenderFieldsService {

  fieldsWithState: GenderFeildsWithState = null;
  userPersonalData: PersonalData | DemographicDetails = null;
  selectedValues: GenderMandatoryFields = null;
}
