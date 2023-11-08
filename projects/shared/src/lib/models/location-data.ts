export class ZipcodeLocationData {
  zip: string;
  type: string;
  primary_city: string;
  acceptable_cities: string;
  state: string;
  county: string;
  latitude: string;
  longitude: string;
  description: string;
  fullContent: string;
  id: string;
}
export class PscDataResponse {
  pscData: PscLocationData[];
}
export class PscLocationData {
  site_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state_abbreviation: string;
  zipcode: string;
  latitude: string;
  longitude: string;
  status: string;
  site_type: string;
  description: string;
  id: string;
}

export class ZipcodesResponse {
  data: ZipcodeLocationDataV2[];
}


export class ZipcodeLocationDataV2 {
  zip: string;
  primary_city: string;
  state_id: string;
  county: string;
  state: string;
  latitude: string;
  longitude: string;
  postcode_localities: string[];
  description?: string;
  fullContent?: string;
  id?: string;
}
