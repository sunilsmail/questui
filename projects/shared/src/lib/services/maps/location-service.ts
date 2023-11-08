import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of, EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PscDataResponse, PscLocationData, ZipcodesResponse, ZipcodeLocationDataV2 } from 'shared/models/location-data';
import { regex } from 'shared/utils/validation/regex-patterns';

@Injectable({
  providedIn: 'root'
})

export class LocationService {
  zipcodeUrl = 'https://as.cdn.questdiagnostics.com/zipcode.json';
  pscUrl = 'https://as.cdn.questdiagnostics.com/psclist.json';
  constructor(private http: HttpClient) {

  }
  zipcodeLocations: ZipcodeLocationDataV2[] = [];
  pscLocations: PscLocationData[] = [];
  result = [];

  loadZipcodes(zipcodeUrl: string, pscUrl: string) {
    const zipcodeReq = this.http.get<ZipcodesResponse>(zipcodeUrl).pipe(catchError(() => []));
    const pscReq = this.http.get<PscDataResponse>(pscUrl).pipe(catchError(() => []));
    if (this.zipcodeLocations.length === 0 || this.pscLocations.length === 0) {
      return forkJoin([pscReq, zipcodeReq])
        .pipe(tap(([pscLocs, zipcodesData]: [PscDataResponse, ZipcodesResponse]) => {
          this.zipcodeLocations = zipcodesData.data.map((item) => {
            return {
              ...item,
              zip: String(item.zip).padStart(5, '0'),
              description: `${item.primary_city}, ${item.state_id}, ${item.zip}, USA`,
              descriptionWithoutComma: `${item.primary_city} ${item.state_id} ${item.zip} USA`,
              fullContent: `${item.primary_city}, ${item.state_id}, ${item.postcode_localities?.length > 0 ? item.postcode_localities : ''}  ${item.state}, ${item.zip}, USA`,
              id: Date.now().toString(36) + Math.random().toString(36).substring(2),
              latitude: item?.latitude?.trim(),
              longitude: item?.longitude?.trim(),
            };
          });
          this.pscLocations = pscLocs.pscData.map((item) => {
            return {
              ...item,
              zipcode: String(item.zipcode).padStart(5, '0'),
              description: `${item.site_name}, ${item.address_1} ${item.city} ${item.state_abbreviation} ${item.zipcode}, USA`,
              id: Date.now().toString(36) + Math.random().toString(36).substring(2),
              latitude: item.latitude.trim(),
              longitude: item.longitude.trim(),
            };
          });
        }));
    }
    return EMPTY;

    /**
     * old code need to update data type ZipcodeLocationData to ZipcodeLocationDataV2
     *  const zipcodeReq = this.http.get<ZipcodeLocationData[]>(zipcodeUrl).pipe(catchError(() => []));
    const pscReq = this.http.get<PscDataResponse>(pscUrl).pipe(catchError(() => []));
    if (this.zipcodeLocations.length === 0) {
      return forkJoin([zipcodeReq, pscReq])
        .pipe(tap(([zipcodes, pscLocs]: [ZipcodeLocationData[], PscDataResponse]) => {
          this.zipcodeLocations = zipcodes.map((item) => {
            return {
              ...item,
              zip: String(item.zip).padStart(5, '0'),
              description: `${item.primary_city}, ${item.state}, ${item.zip}, USA`,
              fullContent: `${item.primary_city}, ${item.acceptable_cities}  ${item.state}, ${item.zip}, USA`,
              id: Date.now().toString(36) + Math.random().toString(36).substring(2)
            };
          });
          this.pscLocations = pscLocs.pscData.map((item) => {
            return {
              ...item,
              zipcode: String(item.zipcode).padStart(5, '0'),
              description: `${item.site_name}, ${item.address_1} ${item.city} ${item.state_abbreviation} ${item.zipcode}, USA`,
              id: Date.now().toString(36) + Math.random().toString(36).substring(2)
            };
          });
        }));
    }
    return EMPTY;
     */
  }

  getStateByZip(zipcode: string): ZipcodeLocationDataV2[] {
    try {
      if (this.isValidZipCodeFormat(zipcode) && this.zipcodeLocations.length > 0) {
        return this.zipcodeLocations.filter((loc) => loc.zip.includes(zipcode));
      }
    } catch (e) {

    }
  }
  getCheckZipByState(zipcode: string, stateName: string): boolean {
    try {
      if (this.isValidZipCodeFormat(zipcode) && this.zipcodeLocations.length > 0) {
        return this.zipcodeLocations.filter((loc) =>
          loc.zip.includes(zipcode) && loc?.state_id?.toLowerCase().includes(stateName.toLowerCase())).length > 0;
      }
    } catch (e) {

    }
  }

  isValidZipCodeFormat(zipcode: string) {
    const zipCodeRegex = new RegExp(regex.zipCode);
    return zipcode.match(zipCodeRegex) === null ? false : true;
  }

  getAutocomplete(value: string): PscLocationData[] | ZipcodeLocationDataV2[] {
    let result = [];
    try {
      const zipcode = value.match(/\d+/g) ? value.match(/\d+/g)[0]?.trim()?.substring(0, 5) : null;
      const city = value.replace(/[^A-Za-z ,]+/g, '')?.trim();
      // if (zipcode && city) {
      //   result = [...result, ...this.searchByZipcodeCity(zipcode, city)];
      // } else {
      if (city) {
        result = [...result, ...this.searchByCity(city)];
      }
      else if (zipcode) {
        result = [...result, ...this.searchByZipcode(zipcode)];
      }
      // }

      return result as any;
    } catch (e) {
      return [];
    }
  }

  searchByZipcodeCity(zipcode: string, cityInput: string): PscLocationData[] | ZipcodeLocationDataV2[] {
    const filteredZipcodes = this.zipcodeLocations.filter((item, index) => {
      item.description = `${item.primary_city}, ${item.state_id}, ${item.zip}, USA`;
      if (item?.fullContent?.toLowerCase()?.includes(zipcode?.toLowerCase()) &&
        item?.fullContent?.toLowerCase()?.includes(cityInput?.toLowerCase())) {
        try {
          const cityArray = [...item.postcode_localities, item.primary_city]
            .filter(city => city?.trim()?.toLowerCase().includes(cityInput?.toLowerCase()));
          if (cityArray?.length > 0) {
            item.description = `${cityArray[0]}, ${item.state_id}, ${item.zip}, USA`;
          }
        } catch (e) { }

        return true;
      }
      return false;
    });
    const filteredPscs = this.pscLocations.filter((item) => {
      return item?.description?.toLowerCase()?.includes(zipcode?.toLowerCase()) &&
        item?.description?.toLowerCase()?.includes(cityInput?.toLowerCase());
    });
    return [...filteredZipcodes, ...filteredPscs] as any;
  }

  searchByZipcode(zipcode: string): PscLocationData[] | ZipcodeLocationDataV2[] {
    const filteredZipcodes = this.zipcodeLocations.filter((item) => {
      item.description = `${item.primary_city}, ${item.state_id}, ${item.zip}, USA`;
      return item?.description?.toLowerCase()?.includes(zipcode?.toLowerCase());
    });
    const filteredPscs = this.pscLocations.filter((item) => {
      return item?.description?.toLowerCase()?.includes(zipcode?.toLowerCase());
    });
    return [...filteredZipcodes, ...filteredPscs] as any;
  }

  // searchByCitytodo(cityInput: string) {
  //   this.result = [];
  //   let filteredZipcodes = [];
  //   try {
  //     filteredZipcodes = this.zipcodeLocations.filter((el) => {
  //       el.postcode_localities = el.postcode_localities ? el.postcode_localities : [];
  //       const cities = [el.primary_city, ...el.postcode_localities]
  //       return cities.find(city => {
  //         if (city.length > 0) {
  //           el.description = `${city}, ${el.state_id}, USA`;
  //           return el.description.toLowerCase().includes(cityInput.toLowerCase());
  //         }
  //       });
  //     });
  //   } catch (ex) {
  //     filteredZipcodes = [];
  //   }
  //   filteredZipcodes = [...new Set(filteredZipcodes.map((item) => item.description))];
  //   const filteredPscs = this.pscLocations.filter((item) => {
  //     return item.description.toLowerCase().includes(cityInput.toLowerCase());
  //   });
  //   return [...filteredZipcodes, ...filteredPscs];
  // }

  searchByCity(cityInput: string) {
    this.result = [];
    let filteredZipcodes = [];
    try {
      filteredZipcodes = this.zipcodeLocations.filter((el) => {
        el.postcode_localities = el.postcode_localities ? el.postcode_localities : [];
        const cities = [el.primary_city, ...el.postcode_localities];
        return cities.find(city => {
          if (city.length > 0) {
            el.description = `${city}, ${el.state_id}, USA`;
            if (!this.result.includes(el.description) && el.description.toLowerCase().includes(cityInput.toLowerCase())) {
              this.result.push(el.description);
              return el.description.toLowerCase().includes(cityInput.toLowerCase());
            } else {
              return false;
            }
          }
        });
      });
    } catch (ex) {
      filteredZipcodes = [];
    }
    const filteredPscs = this.pscLocations.filter((item) => {
      return item.description.toLowerCase().includes(cityInput.toLowerCase());
    });
    return [...filteredZipcodes, ...filteredPscs];
  }

  getLocByLatLong(latitude: string, longitude: string): Observable<{ zip: string, city: string, state: string }> {
    try {
      if (this.pscLocations && this.pscLocations.length > 0) {
        const result = this.pscLocations.filter(psc => psc?.latitude?.toString()?.trim() === latitude.toString()
          && psc?.longitude?.toString()?.trim() === longitude.toString());
        if (result && result.length > 0) {
          return of({ zip: result[0].zipcode, city: result[0].city, state: result[0].state_abbreviation });
        }
      }
      if (this.zipcodeLocations && this.zipcodeLocations.length > 0) {
        const result = this.zipcodeLocations.filter(zipcodes => zipcodes?.latitude?.toString()?.trim() === latitude?.toString()
          && zipcodes?.longitude?.toString()?.trim() === longitude?.toString());
        if (result && result.length > 0) {
          return of({ zip: result[0].zip, city: result[0].primary_city, state: result[0].state_id });
        }
      }
      return of({ zip: null, city: null, state: null });
    } catch (ex) {
      return of({} as any);
    }
  }

  getLatLngByZipcode(zipcode: string): { latitude: any, longitude: any } {
    try {

      if (this.pscLocations && this.pscLocations.length > 0) {
        const result = this.pscLocations.filter(psc => psc?.zipcode === zipcode.toString());
        if (result.length > 0) {
          return { latitude: result[0].latitude, longitude: result[0].longitude };
        }
      }

      if (this.zipcodeLocations && this.zipcodeLocations.length > 0) {
        const result = this.zipcodeLocations.filter(zipcodes => zipcodes?.zip === zipcode.toString());
        if (result.length > 0) {
          return { latitude: result[0].latitude, longitude: result[0].longitude };
        }
      }

      return ({ latitude: null, longitude: null });

    } catch (ex) {
      return { latitude: null, longitude: null };
    }
  }

  getLatLngByCityStateZipcode(address: string): { latitude: any, longitude: any, fullAddress: string } {
    try {
      const zipcode = address.match(/\d+/g) ? address.match(/\d+/g)[0]?.trim()?.substring(0, 5) : null;
      let city = address.replace(/[^A-Za-z ]+/g, '')?.trim();
      city = city?.split(' ')[0];

      if (this.pscLocations && this.pscLocations.length > 0) {
        const pscResult = this.pscLocations.filter((psc) => {
          return psc?.description?.toLowerCase()?.includes(zipcode ? zipcode?.toLowerCase() : city?.toLowerCase());
        });

        if (pscResult.length > 0) {
          return { latitude: pscResult[0].latitude, longitude: pscResult[0].longitude, fullAddress: `${pscResult[0].city}, ${pscResult[0].state_abbreviation}, ${pscResult[0].zipcode}, USA` };
        }
      }

      if (this.zipcodeLocations && this.zipcodeLocations.length > 0) {
        const result = this.zipcodeLocations.filter((item) => {
          return item?.description?.toLowerCase()?.includes(zipcode ? zipcode?.toLowerCase() : city?.toLowerCase());
        });
        if (result.length > 0) {
          return { latitude: result[0].latitude, longitude: result[0].longitude, fullAddress: `${result[0].primary_city}, ${result[0].state_id}, ${result[0].zip}, USA` };
        }
      }
      return { latitude: null, longitude: null, fullAddress: null };
    }
    catch (ex) {
      return { latitude: null, longitude: null, fullAddress: null };
    }
  }
}
