import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private previousUrl: string = undefined;
  private currentUrl: string = undefined;
  private summaryUrl = '';
  labcardRoute = '';

  constructor(private router: Router) { }

  init() {
    this.currentUrl = this.router.url;
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((navigationEnd: NavigationEnd) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = navigationEnd.url;
        if (this.currentUrl.includes('find-appointment/as-find-appointment-summary')) {
          this.summaryUrl = this.currentUrl;
        }
      });
  }
  public getPreviousUrl() {
    return this.previousUrl;
  }
  public getSummaryUrl() {
    return this.summaryUrl;
  }
}
