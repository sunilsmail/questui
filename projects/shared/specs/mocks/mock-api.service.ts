import { HttpHandler, HttpRequest } from '@angular/common/http';
import { of, BehaviorSubject } from 'rxjs';
import { CachingInterceptor } from 'shared/interceptors/caching-interceptor';

export class MockApiService {
  private cacheClearedSubject = new BehaviorSubject(false);

  post<T>(path: string, body?, options?: Object) {
    return of(null as T);
  }

  get<T>(path: string, options?: Object) {
    return of(null as T);
  }

  clearCache() {
    this.cacheClearedSubject.next(true);
  }

  setCsrfToken() {}

  getCacheCleared() {
    return this.cacheClearedSubject.asObservable();
  }
}

export class MockCacheInterceptor extends CachingInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req);
  }

  clearCache() {}
}
