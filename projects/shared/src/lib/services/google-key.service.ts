import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// calling this service in app initializer
export class GoogleKeyService {
  public configKey: string;
  constructor(private http: HttpClient) {}

  async loadKey() {
    await this.http.get('/guest/getGoogleApiKey').toPromise().then((res: GoogleMap) => {
      // this.configKey = res.data.googleApiKey;
      this.configKey = 'AIzaSyB4fgYeb2KIF0HnF8oOdr04m7Sc1jo2RnU';
    });
  }
}
export interface Data {
  googleApiKey: string;
}
export interface GoogleMap {
  data: Data;
}
