import { of } from 'rxjs';
import { OpenEorders } from 'shared/models';

export class MockEorderStateNavigationService {
  blnOpenEorders = false;
  blnSkippedOpenEorder = false;
  getRoutePathByFlow(flow: string) {
    return ['/eorder/as-eorder-personal-information'];
  }
  setLoadingSpinner(data: boolean) { }

  getLoadingSpinner() {
    return of(false);
  }
  getOpenEorders() {
    const response = [
      {
        token: '5gmXGOs3BwN2KaWhI1VoOfa_pXUOzyodfxRTSqlfqIforOnAeEQI1O7TvxhNIilgE1K7coR6Tq65aVZNgmL7fQ',
        active: 'T',
        testOrders: 'BASIC HEALTH PROFILE',
        doctorFirstName: 'STAGING',
        doctorLastName: 'PHYSICIAN NY PR VA'
      }];
    return of(response);
  }
  createEorderUserSession() {
    const response = { stateNavigation: null };
    return of(response);
  }

  setEorders(eorders: OpenEorders[]) { }
  getEorders() {
    const response = [
      {
        token: '5gmXGOs3BwN2KaWhI1VoOfa_pXUOzyodfxRTSqlfqIforOnAeEQI1O7TvxhNIilgE1K7coR6Tq65aVZNgmL7fQ',
        active: 'T',
        testOrders: 'BASIC HEALTH PROFILE',
        doctorFirstName: 'STAGING',
        doctorLastName: 'PHYSICIAN NY PR VA'
      }];
    return of(response);
  }
  setSelectedEorder(eorder: OpenEorders) {}
  getSelectedEorder() {
    const response = {
      token: '5gmXGOs3BwN2KaWhI1VoOfa_pXUOzyodfxRTSqlfqIforOnAeEQI1O7TvxhNIilgE1K7coR6Tq65aVZNgmL7fQ',
      active: 'T',
      testOrders: 'BASIC HEALTH PROFILE',
      doctorFirstName: 'STAGING',
      doctorLastName: 'PHYSICIAN NY PR VA'
    };
    return of(response);
  }


}

export const openOrdersApiResponse = [{
  token: '5gmXGOs3BwN2KaWhI1VoOfa_pXUOzyodfxRTSqlfqIforOnAeEQI1O7TvxhNIilgE1K7coR6Tq65aVZNgmL7fQ',
  active: 'T',
  testOrders: 'BASIC HEALTH PROFILE',
  doctorFirstName: 'STAGING',
  doctorLastName: 'PHYSICIAN NY PR VA'
},
{
  token: '6gmXGOs3BwN2KaWhI1VoOfa_pXUOzyodfxRTSqlfqIforOnAeEQI1O7TvxhNIilgE1K7coR6Tq65aVZNgmL7fQ',
  active: 'T',
  testOrders: 'BASIC HEALTH PROFILE1',
  doctorFirstName: 'STAGING1',
  doctorLastName: 'PHYSICIAN'
}];
