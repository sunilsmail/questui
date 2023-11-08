import { of } from 'rxjs';

export class MockLogoutService {
  logout() {
    return of(null);
  }
}
