import { of } from 'rxjs';
export class MockIdleTimeoutService {
  startWatching() {
    return of(true);
  }
  stopTimer() {
    return of(true);
  }
  sessionWatching() {
    return of(true);
  }
  sessionStopTimer() {
    return of(true);
  }
}
