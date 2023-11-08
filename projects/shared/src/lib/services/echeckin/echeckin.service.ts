import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { EcheckinDataService } from './echeckin-data.service';

@Injectable({
  providedIn: 'root'
})
export class EcheckinService {
  serverUrl = '/guest';

  constructor(private api: ApiService, private echeckinDataService: EcheckinDataService) { }

  getEncounterInfo(token: string) {
    this.api.clearCache();
    return this.api.get(this.serverUrl + '/getRwywEncounterInfo/' + token).
      pipe(map((data: any) => data));
  }
  getInsuranceProvider(siteCode: string) {
    return this.api.get(`/guest/getPayorList/${siteCode}`);
  }
  saveEncounter(params) {
    const token = this.echeckinDataService.getToken();
    params.rwywToken = token;
    return this.api.post(this.serverUrl + '/saveEncounterInfo', params);
  }
}
