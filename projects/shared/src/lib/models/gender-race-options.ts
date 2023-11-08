

export class GenderRaceOptions {
  field_name: string;
  options: Option[];
  enabled: boolean;
  requiredState: string[] = [];
  displayState: string[] = [];
  key?: string;
  isRequired?: boolean;
}

export class GenderMandatoryFields {
  genderPreference?: string;
  race?: string;
  ethnicity?: string;
  sexualOrientation?: string;
}

export class GenderFeildsWithState {
  constructor(public genderRaceOptions?: GenderRaceOptions[], public selectedState?: string) {

  }
}

export interface Option {
  key: string;
  value: string;
}

export enum GenderPrefFieldName {
  GenderPreference = 'gender_preference',
  Race = 'race',
  Ethnicity = 'ethnicity',
  SexualOrientation = 'Sexual_orientation'
}
export enum GenderPrefControlname {
  GenderPreference = 'genderPreference',
  Race = 'race',
  Ethnicity = 'ethnicity',
  SexualOrientation = 'sexualOrientation'
}

export const All_States = 'all';
