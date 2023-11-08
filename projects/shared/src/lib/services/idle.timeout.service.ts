import { Injectable } from '@angular/core';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  private idle$: Observable<any>;
  private timer$;
  private timeOutMilliSeconds: number;
  private idleSubscription;
  public expired$: Subject<boolean> = new Subject<boolean>();
  private sessionIdle$: Observable<any>;
  private sessionTimer$;
  private sessionTimeOutMilliSeconds: number;
  private sessionIdleSubscription;
  public sessionExpired$: Subject<boolean> = new Subject<boolean>();
  constructor() { }

  // This Method Watches the current page is Idle or Not, it will return TRUE if it is Idle
  public startWatching(timeOutSeconds): Observable<any> {
    // Merge the all event in page.
    this.idle$ = merge(
      fromEvent(document, 'mosuemove'),
      fromEvent(document, 'click'),
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keypress'),
      fromEvent(document, 'DOMMouseScroll'),
      fromEvent(document, 'mousewheel'),
      fromEvent(document, 'touchmove'),
      fromEvent(document, 'MSPointerMove'),
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'resize')
    );

    this.timeOutMilliSeconds = timeOutSeconds * 1000;

    this.idleSubscription = this.idle$.subscribe(res => {
      this.resetTimer();
    });

    this.startTimer();

    return this.expired$;
  }

  private startTimer() {
    this.timer$ = timer(this.timeOutMilliSeconds, this.timeOutMilliSeconds).subscribe(res => {
      this.expired$.next(true);
    });
  }

  public resetTimer() {
    this.timer$.unsubscribe();
    this.startTimer();
  }

  public stopTimer() {
    this.timer$.unsubscribe();
    this.idleSubscription.unsubscribe();
  }


 // This Method Watches the current page is Idle or Not, it will return TRUE if it is Idle
 public sessionWatching(timeOutSeconds): Observable<any> {
  // Merge the all event in page.
  this.sessionIdle$ = merge(
    fromEvent(document, 'mosuemove'),
    fromEvent(document, 'click'),
    fromEvent(document, 'mousedown'),
    fromEvent(document, 'keypress'),
    fromEvent(document, 'DOMMouseScroll'),
    fromEvent(document, 'mousewheel'),
    fromEvent(document, 'touchmove'),
    fromEvent(document, 'MSPointerMove'),
    fromEvent(window, 'mousemove'),
    fromEvent(window, 'resize')
  );

  this.sessionTimeOutMilliSeconds = timeOutSeconds * 1000;

  this.sessionIdleSubscription = this.sessionIdle$.subscribe(res => {
    this.sessionResetTimer();
  });

  this.sessionStartTimer();

  return this.sessionExpired$;
}

private sessionStartTimer() {
  this.sessionTimer$ = timer(this.sessionTimeOutMilliSeconds, this.sessionTimeOutMilliSeconds).subscribe(res => {
    this.sessionExpired$.next(true);
  });
}

public sessionResetTimer() {
  this.sessionTimer$.unsubscribe();
  this.sessionStartTimer();
}

public sessionStopTimer() {
  this.sessionTimer$.unsubscribe();
  this.sessionIdleSubscription.unsubscribe();
}

}
