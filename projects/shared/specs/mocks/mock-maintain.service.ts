import { of, Observable } from 'rxjs';
export class MockMiantainService {
    getMaintenanceMessage(): Observable<any> {
      return of({
        'message' : [ 'We are making .']
      });
    }
    setMessageClose(reason: boolean) {}
    getMessageClose(): Observable<boolean> {
      return of(true);
    }
  }
