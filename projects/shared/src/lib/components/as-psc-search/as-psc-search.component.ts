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

import { GoogleAutocompletePrediction } from 'shared/models';
import { UserLocation } from 'shared/models';
import { GoogleMapsService } from 'shared/services/google-maps.service';
import { UserCurrentLocationService } from 'shared/services/user-current-location.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'as-psc-search',
  templateUrl: './as-psc-search.component.html',
  styleUrls: ['./as-psc-search.component.scss']
})
export class AsPscSearchComponent implements OnInit, OnChanges, OnDestroy {
  @Output() locationChanged = new EventEmitter<UserLocation>();
  @Output() userProvidedZip = new EventEmitter();
  @Input() useDefaultOnError = true;
  @Input() inputValue: any;
  @ViewChild('pscSearchTxt') searchInput: ElementRef<any>;
  searchControl = new FormControl();
  options: GoogleAutocompletePrediction[] = [];
  controlSub: Subscription;
  loading = false;
  showLocationDetectIcon = true;

  constructor(private googleService: GoogleMapsService, private currentLocationService: UserCurrentLocationService) { }

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
        }),
        switchMap(value => {
          const reg = /^\d{5}(-\d{4})?$/;
          if (value.length < 3) { return of({}); }
          return this.googleService.getGoogleAutocomplete(value, ['(regions)', 'address']);
        })
      )
      .subscribe((response: any) => {
        this.loading = false;
        if (response.predictions && response.predictions.length > 0) {
          response.predictions.forEach(item => {
            if (!this.containsZip(item) && response.predictions.length > 1) {
              this.options.push(item);
            } else if (!this.containsZip(item) && response.predictions.length === 1) {
              this.options.unshift(item);
            }
          });
        }
        // if (response.predictions) {
        //   response.predictions.forEach(item => {
        //     if(!this.containsZip(item)){
        //       this.options.push(item);
        //     }
        //   });
        // } else if (response.results.length){
        //   const zipItem = new GoogleAutocompletePrediction();
        //   zipItem.description = response.results[0].formatted_address;
        //   zipItem.id = response.results[0].place_id;
        //   zipItem.place_id = response.results[0].place_id;
        //   if (!this.containsZip(zipItem)) {
        //     this.options.push(zipItem);
        //   }
        // }
      });
  }

  ngOnChanges() {
    if (this.inputValue) {
      this.searchControl.setValue(this.inputValue);
    }
  }

  containsZip(zipItem: GoogleAutocompletePrediction): boolean {
    let found = false;
    this.options.forEach(item => {
      if (item.place_id === zipItem.place_id) {
        found = true;
      }
    });
    return found;
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

  onOptionSelect(option: GoogleAutocompletePrediction) {
    this.loading = true;
    const zipContained = option.terms.filter((zip)=>{
      return zip.value.length === 5 && !isNaN(Number(zip.value));
    });
    if(zipContained.length > 0){
      this.userProvidedZip.emit(zipContained[0].value);
    } else {
      this.userProvidedZip.emit(null);
    }
    this.googleService.getGooglePlaceDetails(option.place_id).subscribe((value) => {
      const { lat: latitude, lng: longitude } = value;

      this.loading = false;
      this.options = [];
      this.locationChanged.emit({ latitude, longitude });
      if (window.matchMedia('(min-width: 769px)').matches){
        setTimeout(() => {
          this.searchInput.nativeElement.focus();
        }, 500);
      }
    });

    // Unfocus the search input after matAutoComplete auto-refocuses on the input.
    // This will hide the keyboard on mobile.
    setTimeout(() => {
      this.searchInput.nativeElement.blur();
    }, 500);
  }
}
