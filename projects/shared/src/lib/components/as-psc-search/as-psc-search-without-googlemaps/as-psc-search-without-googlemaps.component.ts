import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';

import { GoogleAutocompletePrediction, UserLocation } from 'shared/models';
import { PscLocationData, ZipcodeLocationData } from 'shared/models/location-data';
import { LocationService } from 'shared/services/maps/location-service';
import { UserCurrentLocationService } from 'shared/services/user-current-location.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'as-psc-search-without-googlemaps',
  templateUrl: './as-psc-search-without-googlemaps.component.html',
  styleUrls: ['./as-psc-search-without-googlemaps.component.scss']
})
export class AsPscSearchWithoutGoogleMapsComponent implements OnInit, OnChanges, OnDestroy {
  @Output() locationChanged = new EventEmitter<UserLocation>();
  @Output() userProvidedZip = new EventEmitter();
  @Input() useDefaultOnError = true;
  @Input() inputValue: any;
  @ViewChild('pscSearchTxt') searchInput: ElementRef<any>;
  searchControl = new FormControl();
  options: PscLocationData[] | ZipcodeLocationData[] = [];
  controlSub: Subscription;
  loading = false;
  showLocationDetectIcon = true;
  displayResults = 50;

  constructor(private currentLocationService: UserCurrentLocationService,
    private locationService: LocationService) { }

  ngOnInit() {
    this.showLocationDetectIcon = this.currentLocationService.showLocationDetectIcon;
    if (this.inputValue) {
      this.searchControl.setValue(this.inputValue);
    }
    this.controlSub = this.searchControl.valueChanges
      .pipe(
        filter(() => !this.loading),
        tap(() => {
          this.options = [];
        }),
        debounceTime(500),
        tap(() => {
          this.loading = true;
        })
      )
      .subscribe((response: string) => {
        this.loading = false;
        if (response.length < 3) {
          return;
        }
        const results = this.locationService.getAutocomplete(response);
        if (results && results.length > 0) {
          this.options = [...results] as any;
        }
      });
  }

  ngOnChanges() {
    if (this.inputValue) {
      this.searchControl.setValue(this.inputValue);
    }
  }

  ngOnDestroy() {
    this.controlSub.unsubscribe();
  }

  getUserLocation() {
    this.loading = true;
    this.currentLocationService.getCurrentPosition(false).subscribe(value => {
      this.loading = false;
      if (value) {
        this.searchControl.patchValue('', { emitEvent: false });
        this.locationChanged.emit(value);
      }
    });
  }

  onOptionSelect(option: PscLocationData) {
    this.loading = true;
    if (option.zipcode) {
      this.userProvidedZip.emit(option.zipcode);
    } else {
      this.userProvidedZip.emit(null);
    }

    const { latitude, longitude } = option;
    this.locationChanged.emit({
      latitude: latitude,
      longitude: longitude
    });

    if (window.matchMedia('(min-width: 769px)').matches) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 500);
    }

    // Unfocus the search input after matAutoComplete auto-refocuses on the input.
    // This will hide the keyboard on mobile.
    setTimeout(() => {
      this.searchInput.nativeElement.blur();
    }, 500);

    this.loading = false;
  }
}
