import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable, Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { environment } from 'shared/environments/environment';

interface CacheContent {
  expireAt: number;
  value: HttpResponse<any>;
}

const CACHE_BLACKLIST = [
  'api/getKbaQuestions',
  'guest/getPscsWithAvailability',
  'guest/getPscAvailability',
  'api/getPaymentCardURL',
  'api/getOrders',
  'guest/getAppointment'
];
const CACHE_WHITELIST = [
  'api/products/read',
  'api/products/search',
  'api/pricings/read',
  'api/stores/read',
  'api/orders/read'
];

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  private cache = new Map<string, CacheContent>();
  private inFlightRequests = new Map<string, Subject<any>>();

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const requestKey = this.getKey(req);

    if (this.inFlightRequests.has(requestKey)) {
      return this.inFlightRequests.get(requestKey);
    }

    if (!this.isCachable(req)) {
      return this.sendRequest(req, next);
    }

    const cachedValue = this.getFromCache(requestKey);
    return cachedValue ? of(cachedValue) : this.sendCachableRequest(req, next);
  }

  getCacheSize() {
    return this.cache.size;
  }

  clearCache() {
    this.cache.clear();
  }

  private isCachable(req: HttpRequest<any>): boolean {
    if (CACHE_BLACKLIST.includes(req.url) || req.url.includes('guest/getAppointment')) {
      return false;
    }
    if (CACHE_WHITELIST.includes(req.url)) {
      return true;
    }
    return req.url.includes('/get') || req.method === 'GET';
  }

  private getKey(req: HttpRequest<any>) {
    return JSON.stringify({ urlWithParams: req.urlWithParams, body: req.body });
  }

  private getFromCache(key: string) {
    if (!this.cache.has(key)) {
      return null;
    }
    const cachedResponse = this.cache.get(key);
    if (cachedResponse.expireAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return cachedResponse.value;
  }

  private sendRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestKey = this.getKey(req);
    this.inFlightRequests.set(requestKey, new Subject());

    return next.handle(req).pipe(
      filter(event => event instanceof HttpResponse),
      tap(
        (response: HttpResponse<any>) => {
          this.handleInFlightResponse(requestKey, response);
        },
        (error: HttpErrorResponse) => {
          this.handleInFlightResponse(requestKey, error, 'error');
        }
      )
    );
  }

  private sendCachableRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.sendRequest(req, next).pipe(
      tap((response: HttpResponse<any>) => {
        const cacheContent = {
          expireAt: Date.now() + environment.httpCacheAge,
          value: response
        };
        const requestKey = this.getKey(req);

        this.cache.set(requestKey, cacheContent);
      })
    );
  }

  private handleInFlightResponse(key: string, response: HttpResponse<any> | HttpErrorResponse, type = 'next') {
    if (this.inFlightRequests.has(key)) {
      const inFlightRequest = this.inFlightRequests.get(key);
      inFlightRequest[type](response);
      inFlightRequest.complete();
      this.inFlightRequests.delete(key);
    }
  }
}
