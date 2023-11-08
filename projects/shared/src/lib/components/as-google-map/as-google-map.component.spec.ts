import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { UserLocation } from 'shared/models';
import { GoogleKeyService } from 'shared/services/google-key.service';
import { PropertiesService } from 'shared/services/properties.service';
import { MockGoogleKeyService } from 'shared/specs/mocks/mock-google-key.service';
import { mockGoogle } from 'shared/specs/mocks/mock-google-maps';
import { MockPropertiesService } from 'shared/specs/mocks/mock-properties.service';
import { mockLocation, mockPscLocation } from 'shared/specs/mocks/mock-psc.service';
import { AsGoogleMapComponent, USER_LOCATION_ICON } from './as-google-map.component';


describe('AsGoogleMapComponent', () => {
    let component: AsGoogleMapComponent;
    let fixture: ComponentFixture<AsGoogleMapComponent>;
    let propertiesService: PropertiesService;
    let addMapsScriptSpy: jasmine.Spy;
    let mapInitSpy: jasmine.Spy;
    let center$: Subject<any>;
    let addresses$: Subject<any>;
    let selectedLocation$: Subject<any>;
    let googleKeyService: GoogleKeyService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AsGoogleMapComponent],
                providers: [{ provide: PropertiesService, useClass: MockPropertiesService },
                  { provide: GoogleKeyService, useClass: MockGoogleKeyService },
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        window['google'] = mockGoogle as any;
        googleKeyService = TestBed.inject(GoogleKeyService);
        fixture = TestBed.createComponent(AsGoogleMapComponent);
        component = fixture.componentInstance;
        addMapsScriptSpy = spyOn(component, 'addMapsScript').and.stub();
        mapInitSpy = spyOn(component, 'mapInit').and.stub();

        propertiesService = TestBed.inject(PropertiesService);
        spyOn(propertiesService, 'getGoogleApiKey').and.returnValue(of({ googleApiKey: 'google-key' }));

        center$ = new Subject<UserLocation>();
        component.center$ = center$;

        selectedLocation$ = new Subject<UserLocation>();
        component.selectedLocation$ = selectedLocation$;


        addresses$ = new Subject<any[]>();
        component.addresses$ = addresses$;

        fixture.detectChanges();
    });

    // afterEach(() => {
    //     delete window['google'];
    // });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('calls getGoogleMapsKey', () => {
    //     expect(propertiesService.getGoogleApiKey).toHaveBeenCalled();
    //     expect(component.googleMapsUrl).toEqual(`https://maps.googleapis.com/maps/api/js?key=google-key&libraries=places`);
    // });

    it('calls #addMapsScript', () => {
        expect(component.addMapsScript).toHaveBeenCalled();
    });

    it('should unsubscribe on destroy', () => {
        spyOn(component.subscription, 'unsubscribe').and.callThrough();
        component.ngOnDestroy();

        expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });

    describe('map update subscription', () => {
        let mockAddresses: any[];

        beforeEach(() => {
            mockAddresses = [{
                position: {
                    lat: 35.22222,
                    lng: -75.55555
                },
                psc: mockPscLocation
            }];
            spyOn(component, 'resetMap').and.stub();
            component.mapInit$.next();
            center$.next(mockLocation);
            addresses$.next(mockAddresses);
        });

        it('calls resetMap on center$ change', () => {
            const mockLoc2 = { latitude: 1, longitude: 2 };
            center$.next(mockLoc2);
            selectedLocation$.next({});

            expect(component.resetMap).toHaveBeenCalledWith(mockLoc2, mockAddresses, {});
        });

        it('calls resetMap on address$ change', () => {
            addresses$.next(mockAddresses.push(
                {
                    position: {
                        lat: 35.22222,
                        lng: -75.55555
                    },
                    psc: mockPscLocation
                }));
            selectedLocation$.next({});

            expect(component.resetMap).toHaveBeenCalled();
        });
    });

    describe('#addMapsScript', () => {
        const expectedHTML = `<script type="text/javascript" src='test'></script>`;

        beforeEach(() => {
            addMapsScriptSpy.and.callThrough();
            component.googleMapsUrl = 'test';
        });

        it('should add the google maps api script', () => {
            component.addMapsScript();

            expect(document.querySelectorAll(`[src="${component.googleMapsUrl}"]`).length).toEqual(1);
        });

        it('should only add the google maps api script once', () => {
            component.addMapsScript();
            component.addMapsScript();

            expect(document.querySelectorAll(`[src="${component.googleMapsUrl}"]`).length).toEqual(1);
        });


        // it('should call mapInit if script already loaded', done => {
        //     component.addMapsScript();

        //     mapInitSpy.and.callFake(() => {
        //         component.mapInit$.next();
        //     });

        //     component.mapInit$.subscribe(() => {
        //         expect(component.mapInit).toHaveBeenCalled();
        //         done();
        //     });

        //     component.addMapsScript();
        // });
    });

    describe('#mapInit', () => {
        let mockMap: google.maps.Map;
        let mockGeocoder: google.maps.Geocoder;

        beforeEach(() => {
            mapInitSpy.and.callThrough();
            mockMap = new google.maps.Map(component.gmapElement.nativeElement, {});
            mockGeocoder = new google.maps.Geocoder();
            spyOn(window['google'].maps, 'Map').and.returnValue(mockMap);
            spyOn(window['google'].maps, 'Geocoder').and.returnValue(mockGeocoder);
            spyOn(component.mapInit$, 'next').and.stub();
        });

        it('should create and set a new map', () => {
            component.mapInit();

            expect(window['google'].maps.Map).toHaveBeenCalled();
            expect(component.map).toEqual(mockMap);
        });

        it('should create and set a new geocoder', () => {
            component.mapInit();

            expect(window['google'].maps.Geocoder).toHaveBeenCalled();
            expect(component.geocoder).toEqual(mockGeocoder);
        });

        it('should call next on mapInit$', () => {
            component.mapInit();

            expect(component.mapInit$.next).toHaveBeenCalled();
        });
    });

    describe('#resetMap', () => {
        let mockLatLng: google.maps.LatLng;

        beforeEach(() => {
            const mockMarker: jasmine.SpyObj<google.maps.Marker> = jasmine.createSpyObj('Marker', ['setMap']);
            spyOn(window['google'].maps, 'Marker').and.returnValue(mockMarker);

            spyOn(window['google'].maps, 'LatLngBounds');
            component.markerBounds = new google.maps.LatLngBounds(new google.maps.LatLng(1, 2), new google.maps.LatLng(3, 4));

            const mockMap: jasmine.SpyObj<google.maps.Map> = jasmine.createSpyObj('Map', ['setCenter', 'setZoom']);
            spyOn(window['google'].maps, 'Map').and.returnValue(mockMap);
            mockMap.setCenter.and.stub();
            mockMap.setZoom.and.stub();
            component.map = new google.maps.Map(component.gmapElement.nativeElement, {});

            spyOn(component, 'createMarker').and.stub();
            spyOn(component, 'setMarker').and.stub();

            mockLatLng = new google.maps.LatLng(mockLocation.latitude, mockLocation.longitude);
        });

        it('should set marker maps to null', () => {
            const mockMarker = new google.maps.Marker();
            component.markers = [mockMarker];

            component.resetMap(mockLocation, [], mockPscLocation);

            expect(mockMarker.setMap).toHaveBeenCalledWith(null);
        });

        it('should set marker maps to null if user location is null', () => {
            const mockMarker = new google.maps.Marker();
            component.markers = [mockMarker];

            component.resetMap(null, [], mockPscLocation);

            expect(mockMarker.setMap).toHaveBeenCalledWith(null);
        });

        it('should empty marker array', () => {
            component.markers = [new google.maps.Marker()];

            component.resetMap(mockLocation, [], mockPscLocation);

            expect(component.markers).toEqual([]);
        });

        it('should empty marker array if user dont allow location', () => {
            component.markers = [new google.maps.Marker()];

            component.resetMap(null, [], mockPscLocation);

            expect(component.markers).toEqual([]);
        });



        it('should set the map center', () => {
            component.resetMap(mockLocation, [], mockPscLocation);

            expect(component.map.setCenter).toHaveBeenCalledWith(mockLatLng);
        });

        it('should create a marker at center', () => {
            component.resetMap(mockLocation, [], mockPscLocation);

            expect(component.createMarker).toHaveBeenCalledWith(mockLatLng, null, false, USER_LOCATION_ICON);
        });

        it('should create a new markerBounds', () => {
            component.resetMap(mockLocation, [], mockPscLocation);

            expect(component.markerBounds).toEqual(new google.maps.LatLngBounds(mockLatLng, mockLatLng));
        });

        it('should create a set markers for each address', () => {
            component.resetMap(null, ['add1', 'add2'], mockPscLocation);

            expect(component.setMarker).toHaveBeenCalledTimes(2);
            expect(component.setMarker).toHaveBeenCalledWith('add1', null, null);
            expect(component.setMarker).toHaveBeenCalledWith('add2', null, null);
        });

        it('should create a set markers for each address', () => {
            component.resetMap(mockLocation, ['add1', 'add2'], mockPscLocation);

            expect(component.setMarker).toHaveBeenCalledTimes(2);
            expect(component.setMarker).toHaveBeenCalledWith('add1', mockPscLocation);
            expect(component.setMarker).toHaveBeenCalledWith('add2', mockPscLocation);
        });
    });

    describe('#setMarker', () => {
        let mockGeocodeResult: any;

        beforeEach(() => {
            mockGeocodeResult = { geometry: { location: new google.maps.LatLng(0, 0) } };
            const mockGeocoder: jasmine.SpyObj<google.maps.Geocoder> = jasmine.createSpyObj('Geocoder', ['geocode']);
            spyOn(window['google'].maps, 'Geocoder').and.returnValue(mockGeocoder);
            mockGeocoder.geocode.and.callFake((req, callback) =>
                callback([mockGeocodeResult], google.maps.GeocoderStatus.OK)
            );
            component.geocoder = new google.maps.Geocoder();

            const mockMarkerBounds: jasmine.SpyObj<google.maps.LatLngBounds> = jasmine.createSpyObj('LatLngBounds', [
                'extend'
            ]);
            spyOn(window['google'].maps, 'LatLngBounds').and.returnValue(mockMarkerBounds);
            mockMarkerBounds.extend.and.stub();
            component.markerBounds = new google.maps.LatLngBounds();

            const mockMap: jasmine.SpyObj<google.maps.Map> = jasmine.createSpyObj('Map', ['fitBounds', 'setCenter']);
            spyOn(window['google'].maps, 'Map').and.returnValue(mockMap);
            mockMap.fitBounds.and.stub();
            component.map = new google.maps.Map(component.gmapElement.nativeElement, {});

            spyOn(component, 'createMarker').and.stub();
        });


        it('should call createMarker', () => {
            const location = {
                position: {
                    lat: 35.22222,
                    lng: -75.55555
                },
                psc: mockPscLocation
            };
            component.setMarker(location, mockPscLocation);
            const center = new google.maps.LatLng(35.22222, -75.55555);
            expect(component.createMarker)
                .toHaveBeenCalledWith(center, mockPscLocation, true, '/assets/ds-images/location-marker.png');
        });

        it('should call extend', () => {
            const location = {
                position: {
                    lat: 35.22222,
                    lng: -75.55555
                },
                psc: mockPscLocation
            };
            component.setMarker(location, mockPscLocation);
            const center = new google.maps.LatLng(35.22222, -75.55555);
            expect(component.markerBounds.extend).toHaveBeenCalledWith(center);
        });

        it('should call fitBounds', () => {
            const location = {
                position: {
                    lat: 35.22222,
                    lng: -75.55555
                },
                psc: mockPscLocation
            };
            component.setMarker(location, mockPscLocation);

            expect(component.map.fitBounds).toHaveBeenCalledWith(component.markerBounds);
        });

        it('should set the map center', () => {
            const location = {
                position: {
                    lat: 35.22222,
                    lng: -75.55555
                },
                psc: mockPscLocation
            };
            component.setMarker(location, mockPscLocation, false);
            const center = new google.maps.LatLng(35.22222, -75.55555);
            expect(component.map.setCenter).toHaveBeenCalledWith(center);
        });

        it('should call createMarker with loca false', () => {
            const location = {
                position: {
                    lat: 35.22222,
                    lng: -75.55555
                },
                psc: mockPscLocation
            };
            component.setMarker(location, mockPscLocation, false);
            const center = new google.maps.LatLng(35.22222, -75.55555);
            expect(component.createMarker)
                .toHaveBeenCalledWith(center, mockPscLocation, false, '/assets/ds-images/location-pin-marker.png');
        });
    });

    describe('#createMarker', () => {
        let mockLatLong: google.maps.LatLng;

        beforeEach(
            waitForAsync(() => {
                mockLatLong = new google.maps.LatLng(0, 0);
                const mockMarker: jasmine.SpyObj<google.maps.Marker> = jasmine.createSpyObj('Marker', ['getPosition']);
                spyOn(window['google'].maps, 'Marker').and.returnValue(mockMarker);
                mockMarker.getPosition.and.stub();
            })
        );

        it('should create a Marker', () => {
            component.createMarker(mockLatLong, null, false);

            expect(window['google'].maps.Marker).toHaveBeenCalledWith({
                map: component.map,
                animation: google.maps.Animation.DROP,
                position: mockLatLong,
                icon: null
            });
        });

        it('should add a marker to current array', () => {
            component.createMarker(mockLatLong, null, false);

            expect(component.markers).toEqual([new google.maps.Marker()]);
        });
    });
});
