import { of, Observable } from 'rxjs';
import { GetlabsLocationRequest } from 'shared/models';


export class MockPscDetailsService {
  enableSitecodeinFindLocationFlow = false;

  setEnableNewUi(value: boolean) {
  }
  getEnableNewUi(): Observable<boolean> {
    return of(true);
  }
  enableNewUI(): Observable<boolean> {
    return of(true);
  }
  setEnableSiteCode(value: boolean) { }
  getEnableSiteCode(): Observable<boolean> {
    return of(true);
  }
  setFindLocationEnableSiteCode(value: boolean) {

  }
  getFindLocationEnableSiteCode(): Observable<boolean> {
    return of(true);
  }

  enableSiteCodeWithQueryParams() {

  }
  getLabsLocation(body: GetlabsLocationRequest) {
    return of(true);
  }
}
