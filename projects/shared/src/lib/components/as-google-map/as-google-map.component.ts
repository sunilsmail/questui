import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { combineLatest, of, Observable, Subject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserLocation } from 'shared/models';
import { GoogleKeyService } from 'shared/services/google-key.service';
import { PropertiesService } from 'shared/services/properties.service';

export const USER_LOCATION_ICON = 'https://www.google.com/mapfiles/arrow.png';
export const SELECTED_LOCATION = '/assets/ds-images/location-pin-marker.png';
export const OTHER_LOCATION = '/assets/ds-images/location-marker.png';
export const HTTP_REFERRER_KEY = 'AIzaSyBmfcq_7T1l2HXGzHKmPyVwZfG-TTh4zgY'; // free for local
// export const HTTP_REFERRER_KEY = 'AIzaSyAsVEQPaqzt8X5dHGLooU-IAEDtm2sgCeU';

@Component({
  selector: 'as-google-map',
  templateUrl: './as-google-map.component.html',
  styleUrls: ['./as-google-map.component.scss']
})
export class AsGoogleMapComponent implements OnInit, OnDestroy {
  @Input() center$: Observable<UserLocation>;
  @Input() addresses$: Observable<any[]>;
  @Input() selectedLocation$: Observable<any> = of({});

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  markerBounds: google.maps.LatLngBounds;
  markers = new Array<google.maps.Marker>();
  geocoder: google.maps.Geocoder;
  googleMapsUrl: string;
  mapInit$ = new Subject<void>();
  subscription: Subscription;

  // Map style provided by jamie to reduce the greenery
  mapStyle: google.maps.MapTypeStyle[] = [
    {
      'featureType': 'administrative',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'saturation': 0
        },
        {
          'lightness': 10
        }
      ]
    },
    {
      'featureType': 'landscape',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'saturation': -44
        },
        {
          'lightness': 21
        }
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'saturation': -76
        },
        {
          'lightness': 61
        },
        {
          'gamma': 1
        }
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'labels.text',
      'stylers': [
        {
          'saturation': -60
        },
        {
          'lightness': 20
        },
        {
          'gamma': 1.15
        },
        {
          'visibility': 'on'
        }
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'labels.icon',
      'stylers': [
        {
          'saturation': -60
        },
        {
          'lightness': 20
        },
        {
          'gamma': 1.00
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'saturation': -21
        },
        {
          'lightness': 16
        },
        {
          'gamma': 1.00
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'labels.icon',
      'stylers': [
        {
          'saturation': -10
        },
        {
          'lightness': 10
        }
      ]
    },
    {
      'featureType': 'road.local',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'saturation': -0
        },
        {
          'lightness': 0
        }
      ]
    },
    {
      'featureType': 'transit.station',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'saturation': -60
        },
        {
          'lightness': 20
        },
        {
          'gamma': 1.00
        }
      ]
    },
    {
      'featureType': 'transit.station',
      'elementType': 'labels.icon',
      'stylers': [
        {
          'saturation': -60
        },
        {
          'lightness': 20
        },
        {
          'gamma': 1
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'saturation': -40
        },
        {
          'lightness': 16
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'saturation': -40
        },
        {
          'lightness': 20
        },
        {
          'gamma': 1.00
        }
      ]
    }
  ];
  @Output() markerClicked = new EventEmitter();
  selectedLocation: any;

  constructor(private properties: PropertiesService, private googleKeyService: GoogleKeyService) { }

  ngOnInit() {
    this.subscription = combineLatest(this.center$, this.addresses$, this.selectedLocation$, this.mapInit$)
      .pipe(
        map(([loc, addresses, selectedLocation, init]) => ({ loc, addresses, selectedLocation })),
        tap(params => this.resetMap(params.loc, params.addresses, params.selectedLocation))
      )
      .subscribe();

    // this.properties.getGoogleApiKey().subscribe(res => {
    // update to use the key from getGoogleMapsKey once autocomplete uses the js script library
    // this.googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${res.googleApiKey}&libraries=places`;
    // this.googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB4fgYeb2KIF0HnF8oOdr04m7Sc1jo2RnU&libraries=places`;
    this.googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${this.googleKeyService.configKey}&libraries=places`;
    this.addMapsScript();
    // });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addMapsScript() {
    if (!document.querySelectorAll(`[src='${this.googleMapsUrl}']`).length) {
      document.body.appendChild(
        Object.assign(document.createElement('script'), {
          type: 'text/javascript',
          src: this.googleMapsUrl,
          onload: () => this.mapInit()
        })
      );
    } else {
      setTimeout(() => {
        this.mapInit();
      }, 500);
    }
  }

  mapInit() {
    const mapProp: google.maps.MapOptions = {
      center: new google.maps.LatLng(38.651198, -95.822754), // center of usa to show whole us map if user don't allow location
      zoom: 4.9, // to show whole us map if user don't allow location
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: this.mapStyle
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.geocoder = new google.maps.Geocoder();

    this.mapInit$.next();
  }

  resetMap(loc: UserLocation, addresses: any[], selectedLocation) {
    this.map.setZoom(15);
    if (!loc) {
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
      addresses.forEach(address => this.setMarker(address, null, null));
    } else {
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
      const center = new google.maps.LatLng(loc.latitude, loc.longitude);
      this.map.setCenter(center);
      this.createMarker(center, null, false, USER_LOCATION_ICON);

      // Create a new marker bounds object around the map center
      this.markerBounds = new google.maps.LatLngBounds(center, center);
      addresses.forEach(address => this.setMarker(address, selectedLocation));
    }

  }

  /**
   *
   * @param address - it consist lat lng for the marker to be created
   * {position:{
   *    lat: latitude,
   *    lng: longitude
   *    },
   * psc: pscDetails
   * }
   * @param selectedLocation - psc details related to active marker, to show different icon of the active marker
   * @param loc - default is true. needed to pass false if user location marker is not needed on the map.
   */

  setMarker(address: any, selectedLocation: any, loc = true) {
    const location = new google.maps.LatLng(address.position.lat, address.position.lng);

    if (loc) {
      this.createMarker(location, selectedLocation, true, OTHER_LOCATION);

      // Extend the markerBounds object to include the new marker
      this.markerBounds.extend(location);

      // Set map view area to include the markerBounds set above
      this.map.fitBounds(this.markerBounds);

    } else {
      this.map.setCenter(location);
      this.createMarker(location, selectedLocation, false, SELECTED_LOCATION);
    }

  }

  /**
   * create a marker for given position and add it to marker array.
   * @param position position for the marker has to be new google.maps.LatLng(lat, lng)
   * @param selectedLocation - psc details related to active marker, to show different icon of the active marker
   * @param hasClickEvent - needed to pass true if click event is needed to bind to a marker
   * @param setIcon - (optional) if custom icon is needed
   */

  createMarker(position: google.maps.LatLng, selectedLocation, hasClickEvent: boolean, setIcon?: string) {
    const marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position,
      icon: setIcon ? setIcon : null,
    });
    if (selectedLocation) {
      const markerPosition = marker.getPosition().toJSON();
      if (selectedLocation.latitude === markerPosition.lat && selectedLocation.longitude === markerPosition.lng) {
        marker.setIcon(SELECTED_LOCATION);
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
    this.markers.push(marker);
    if (hasClickEvent) {
      marker.addListener('click', () => {
        this.markerClicked.emit(marker.getPosition().toJSON());
      });
    }
  }

}
