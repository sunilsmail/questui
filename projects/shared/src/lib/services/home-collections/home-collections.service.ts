import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { PscDetailsService } from 'shared/services/psc/psc-details.service';
import { ApiService } from '../api.service';
import { HomeCollectionsMetricsRequest } from './../../models/home-collections-metrics-req';


@Injectable({
  providedIn: 'root'
})

export class HomeCollectionsService {

  zipCode = null;

  serverUrl = '/guest';

  trackHomeCollectionsMetrics = new HomeCollectionsMetricsRequest();

  constructor(private api: ApiService, private pscDetailsService: PscDetailsService) {

  }

  /** Variable declaration START*/
  private getLabsDisplayed = new ReplaySubject<boolean>(1);
  getLabsDisplayed$ = this.getLabsDisplayed.asObservable();

  private getLabsOpted = new ReplaySubject<boolean>(1);
  getLabsOpted$ = this.getLabsOpted.asObservable();

  private examOneDisplayed = new ReplaySubject<boolean>(1);
  examOneDisplayed$ = this.examOneDisplayed.asObservable();

  private examOneOpted = new ReplaySubject<boolean>();
  examOneOpted$ = this.examOneOpted.asObservable();

  /** Variable declaration END*/

  /** Method declaration START*/

  setGetLabsDisplayed(value: boolean) {
    this.trackHomeCollectionsMetrics.getLabsDisplayed = value;
    this.getLabsDisplayed.next(value);
  }

  getGetLabsDisplayed(): Observable<boolean> {
    return this.getLabsDisplayed$;
  }

  setGetlabsOpted(value: boolean) {
    this.trackHomeCollectionsMetrics.getLabsOpted = value;
    this.getLabsOpted.next(value);
  }

  getGetLabsOpted(): Observable<boolean> {
    return this.getLabsOpted$;
  }

  setExamOneDisplayed(value: boolean) {
    this.trackHomeCollectionsMetrics.examOneDisplayed = value;
    this.examOneDisplayed.next(value);
  }

  getExamOneDisplayed(): Observable<boolean> {
    return this.examOneDisplayed$;
  }

  setExamOneOpted(value: boolean) {
    this.trackHomeCollectionsMetrics.examOneOpted = value;
    this.examOneOpted.next(value);
  }

  getExamOneOpted(): Observable<boolean> {
    return this.examOneOpted$;
  }

  logBooknow() {
    this.setExamOneDisplayed(true);
    this.setExamOneOpted(true);
    this.setGetLabsDisplayed(false);
    this.setGetlabsOpted(false);
  }

  logGoToOtherWebsite() {
    this.setGetLabsDisplayed(true);
    this.setGetlabsOpted(true);
    this.setExamOneDisplayed(false);
    this.setExamOneOpted(false);
  }

  saveHomeCollectionsMetrics() {
    return this.api.post<boolean>(`${this.serverUrl}/saveHomeCollectMetrics`, this.getMetricsData());
  }

  getMetricsData() {
    const request: HomeCollectionsMetricsRequest = {
      homeCollectMetricsId: this.pscDetailsService.homeCollectMetricsId,
      getLabsDisplayed: this.trackHomeCollectionsMetrics.getLabsDisplayed,
      getLabsOpted: this.trackHomeCollectionsMetrics.getLabsOpted,
      examOneDisplayed: this.trackHomeCollectionsMetrics.examOneDisplayed,
      examOneOpted: this.trackHomeCollectionsMetrics.examOneOpted,
      zipcode: this.zipCode,
    };
    return request;
  }

  /** Method declaration END*/

}
