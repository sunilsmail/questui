import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpInterceptor,
  HttpResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'shared/environments/environment';
import { CachingInterceptor } from 'shared/interceptors/caching-interceptor';

const API_BASE_URL = environment.apiURI;
const ERROR_WHITELIST = ['api/products/search', 'api/products/read', 'api/orders/read'];
const ECHECKIN_GETRWYW = '/guest/getRwywEncounterInfo';
const unAuthWhiteListUrl = 'api/getUserDemographics';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private cachingInterceptor = this.interceptors.find(i => i instanceof CachingInterceptor) as CachingInterceptor;
  private cacheClearedSubject = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(HTTP_INTERCEPTORS) private interceptors: HttpInterceptor[],
    @Inject(LOCALE_ID) private locale: string
  ) { }

  defaultHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Language': this.locale
    }),
    observe: 'response'
  };

  post<T>(path: string, body?, options?: Object): Observable<T> {
    options = Object.assign({}, options, { body: this.formatBodyObject(body) });
    return this.request<T>('POST', path, options);
  }

  get<T>(path: string, options?: Object): Observable<T> {
    return this.request<T>('GET', path, options);
  }

  request<T>(method: string, path: string, options?: Object): Observable<T> {
    options = Object.assign({}, this.defaultHttpOptions, options);
    return this.http
      .request<HttpResponse<T>>(method, this.buildPath(path), options)
      // tslint:disable-next-line: max-line-length
      .pipe(map((res:HttpResponse<T>)=>(this.formatResponse(res, path))), catchError((httpError: HttpErrorResponse) => this.handleError(httpError, path)));
  }

  clearCache() {
    this.cachingInterceptor.clearCache();
    this.cacheClearedSubject.next(true);
  }
  setCsrfToken() {
    document.cookie = this.getCsrfToken();
  }

  getCsrfToken() {
    const cookie = this.generateCsrfToken();
    return `CSRF-TOKEN=${cookie}; path=/;`;
  }

  getCacheCleared(): Observable<boolean> {
    return this.cacheClearedSubject.asObservable();
  }

  private buildPath(path) {
    const urlPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE_URL}${urlPath}`;
  }

  /**
   * Recursively traverses the nested object to replace any empty strings
   * with null.
   *
   * NOTE: This was needed for the API, as it will fail validation (min-length=1)
   * if an object value is an empty string.
   * @param obj - Body object to modify
   */
  private formatBodyObject(obj) {
    if (!obj) { return; }

    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && typeof obj[key] === 'object') {
        obj[key] = this.formatBodyObject(obj[key]);
      } else if (obj[key] === '' && key !== 'insuranceMnemonic'
      && key !=='insuranceCompanyName' && key !=='insuranceMemberId') { // after api is fixed we will remove this key
        obj[key] = null;
      }
    });

    return obj;
  }

  private formatResponse(res: HttpResponse<any>, path:string) {
    const { body } = res;
    if((path.indexOf(ECHECKIN_GETRWYW) !== -1) && res.status === 204){
      return res;
    }
    if (body === null || !(body instanceof Object) || !Object.keys(body).includes('data')) {
      return body;
    } else {
      return body.data;
    }
  }

  private handleError(httpError: HttpErrorResponse, path: string) {
    if (httpError.status === 401 && path !== unAuthWhiteListUrl) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }

    if (!ERROR_WHITELIST.includes(path)) {
      // this.snackbarService.showError(this.i18n('Oops something went wrong. Try again.'));
    }

    // Get the "errors" property of the response body if it exists,
    // otherwise get the entire response body.
    const errorResponse = httpError.error.errors || httpError.error;
    return throwError(errorResponse);
  }

  private generateCsrfToken(seed = null) {
    /* tslint:disable: no-bitwise */
    return seed
      ? (seed ^ ((Math.random() * 16) >> (seed / 4))).toString(16)
      : ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[01]/g, this.generateCsrfToken);
    /* tslint:enable: no-bitwise */
  }
}
