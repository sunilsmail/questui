import { Injectable } from '@angular/core';
import { throwError, Observable, ReplaySubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OpenBalanceApiResponse } from 'shared/models/open-balance';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class OpenBalanceService {
  serverUrl = '/guest';
  private fromApiResponse$ = new ReplaySubject<OpenBalanceApiResponse>(1);
  constructor(private api: ApiService) { }

  getOpenBalances(): Observable<OpenBalanceApiResponse> {
    const tempRequest = {
      'lastName': 'SLASTNAME',
      'firstName': 'JOSE',
      'dateOfBirth': '19641119',
      'legalEntity': 'TAM',
      'startPoint': 1,
      'maxReturn': 99
    };
    this.api.clearCache();
    return this.api.get<OpenBalanceApiResponse>(`${this.serverUrl}/getOpenBalancesBW`)
      .pipe(
        tap((apiRes: OpenBalanceApiResponse) => {
          this.fromApiResponse$.next(apiRes);
        })
      );
  }

  getOBResponse(): Observable<OpenBalanceApiResponse> {
    return this.fromApiResponse$.asObservable();
  }

}
