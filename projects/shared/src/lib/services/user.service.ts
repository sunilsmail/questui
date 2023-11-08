import { HttpParams } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { EMPTY, Observable, ReplaySubject } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { CreateAccountQuery, TermsAndConditions, UserDemographic } from 'shared/models';
import { ApiService } from './api.service';
import { MaintainService } from './maintenace.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isAuthenticatedSubject: ReplaySubject<boolean> = new ReplaySubject(1);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private isEmailConfirmSubject: ReplaySubject<boolean> = new ReplaySubject(1);
  isEmailConfirmSubject$ = this.isEmailConfirmSubject.asObservable();

  private userDemographicsSubject: ReplaySubject<UserDemographic> = new ReplaySubject(1);
  userDemographics$ = this.userDemographicsSubject.asObservable();

  userId: any;

  constructor(private api: ApiService, private maintainService: MaintainService) { }

  createAccount(body: CreateAccountQuery, captcha: string, elementRef?: ElementRef) {
    const options = {
      params: new HttpParams().set('g-recaptcha-response', captcha)
    };
    return this.api.post('guestRecaptcha/createAccount', body, options);
    // return this.submitSpinnerService.wrapInSpinner(request, elementRef);
  }
  getTermsAndConditions() {
    return this.api.post<TermsAndConditions>('guest/getTermsAndConditions');
  }

  getUserDemographics(): Observable<UserDemographic> {
    return this.api.post<UserDemographic>('api/getUserDemographics').pipe(
      tap(
        response => {
          this.isAuthenticatedSubject.next(true);
          // this.userDemographicsSubject.next(response);
          this.setUserdata(response);
          // this.maintainService.setMessageClose(true);
        },
        () => {
          this.isAuthenticatedSubject.next(false);
          // this.maintainService.setMessageClose(false);
        }
      )
    );
  }

  getUserDetails() {
    return this.api.post('api/getUserDemographics').pipe(
      mergeMap((user: UserDemographic) => {
        this.isAuthenticatedSubject.next(true);
        // this.userDemographicsSubject.next(user);
        this.setUserdata(user);
        if (user) {
          return this.api.post('api/getUserSummaries').pipe(
            tap((summary) => {
            //  this.loginId = summary[0].loginId;
              this.checkForEmailVerification(user, summary);
            }),
            catchError((err: any) => {
              this.isAuthenticatedSubject.next(false);
              return  EMPTY;
            })
          );
        }
      }),
      catchError((err: any) => {
        this.isAuthenticatedSubject.next(false);
        return EMPTY;
      })
    );
  }

  checkForEmailVerification(user: any, summary: any) {
    if (user && summary && summary.length > 0) {
       this.userId =  summary[0].loginId;
      const userdata = summary.filter(x => x.prsId === user.prsId);
      if (userdata && userdata.length > 0) {
        this.isEmailConfirmSubject.next(!userdata[0].emailConfirmed);
      }
    }
  }

  getUserdata(): Observable<UserDemographic> {
    return this.userDemographics$;
  }
  setUserdata(response: UserDemographic) {
    this.userDemographicsSubject.next(response);
  }

  getUserLoginId() {
    return this.userId;
  }

}
