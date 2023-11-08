import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { GetlabsLocationRequest } from 'shared/models';
import { ApiService } from '../api.service';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class PscDetailsService {

  serverUrl = '/guest';
  enableSitecodeinFindLocationFlow = false;
  enableSitecodeinScheduleApptFlow = false;
  labRedirectedLink: any;
  partnerName: string;
  homeCollectMetricsId: number;

  constructor(private api: ApiService,
    private route: ActivatedRoute,
    private userService: UserService ) {
    this.enableSiteCodeWithQueryParams();
  }

  /** Variable declaration START*/
  private enableNewUi = new ReplaySubject<boolean>(1);
  enableNewUi$ = this.enableNewUi.asObservable();

  private enableSiteCode = new ReplaySubject<boolean>(1);
  enableSiteCode$ = this.enableSiteCode.asObservable();

  private findLocationEnableSiteCode = new ReplaySubject<boolean>(1);
  findLocationEnableSiteCode$ = this.findLocationEnableSiteCode.asObservable();

  /** Variable declaration END*/

  /** Method declaration START*/

  setEnableNewUi(value: boolean) {
    this.enableNewUi.next(value);
  }
  getEnableNewUi(): Observable<boolean> {
    return this.enableNewUi$;
  }

  setEnableSiteCode(value: boolean) {
    this.enableSitecodeinScheduleApptFlow = true;
    this.enableSiteCode.next(value);
  }
  getEnableSiteCode(): Observable<boolean> {
    return this.enableSiteCode$;
  }

  setFindLocationEnableSiteCode(value: boolean) {
    this.enableSiteCode.next(value);
  }
  getFindLocationEnableSiteCode(): Observable<boolean> {
    return this.enableSiteCode$;
  }

  enableNewUI(): Observable<boolean> {
    // return of(true);
    return this.api.get<boolean>(`${this.serverUrl}/redirectAMPMSlots`);
  }


  enableSiteCodeWithQueryParams() {
    combineLatest(this.route.queryParams,
      this.userService.isAuthenticated$)
      .subscribe(([params, isAuth]: [Params, boolean]) => {
        if (!isAuth && params && params['showsitecode'] === 'true') {
          this.enableSitecodeinFindLocationFlow = true;
          this.enableSitecodeinScheduleApptFlow = true;
        }
      });
  }

  getLabsLocation(body: GetlabsLocationRequest) {
    return this.api.post('/guest/getAtHomeService/', body);
  }


  /** Method declaration END*/
}
