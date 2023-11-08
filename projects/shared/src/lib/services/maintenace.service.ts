import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MaintainService {

  private messageClose = new ReplaySubject<boolean>(1);
  messageClose$ = this.messageClose.asObservable();
  public isMessageNotAvilable = false;

  constructor(private api: ApiService) { }

  getMaintenaceMsg() {
    return this.api.get('guest/getMaintenanceMessage');
  }

  setMessageClose(reason: boolean) {
    this.messageClose.next(reason);
  }

  getMessageClose(): Observable<boolean> {
    return this.messageClose$;
  }
}
