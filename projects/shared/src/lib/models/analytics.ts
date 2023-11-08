export enum AppointmentEvents {
  locationSearch = 'page.locationSelection',
}
export class LocationSearch {
  v:Number;// <-- DO NOT EDIT.
  locationName:String; // Name of the location selected.
  distance:Number; // Distance from the zip code or city inputted into the search bar.
  timeSelected: String;// Time a user selected for their appointment.
  city: String;  // City that the location selected is in.
  state: String; // State that the location selected is in.
  view?: String;
}
