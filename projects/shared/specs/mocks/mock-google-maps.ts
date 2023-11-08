export const mockGoogle = {
  maps: {
    Marker: function () { },
    LatLng: function (lat, lng) {
      return [lat, lng];
    },
    Map: function (obj) { },
    MapTypeId: { ROADMAP: true },
    Geocoder: obj => { },
    LatLngBounds: (sw, ne) => [sw, ne],
    GeocoderStatus: {
      OK: true
    },
    Animation: {
      DROP: ''
    },
    places: {
      PlacesService: () => {
        return {
          getDetails: () => { }
        };
      },
      AutocompleteService: () => { },
      AutocompleteSessionToken: () => { }
    }
  }
};
