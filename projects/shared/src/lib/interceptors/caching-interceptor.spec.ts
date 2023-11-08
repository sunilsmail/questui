import { HttpClient, HttpParams, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CachingInterceptor } from './caching-interceptor';

const CACHE_BLACKLIST = [
  'api/getKbaQuestions',
  'guest/getPscsWithAvailability',
  'guest/getPscAvailability',
  'api/getPaymentCardURL',
  'api/getOrders'
];
const CACHE_WHITELIST = [
  'api/products/read',
  'api/products/search',
  'api/pricings/read',
  'api/stores/read',
  'api/orders/read'
];

describe('CachingInterceptor', () => {
  let interceptor: any;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const cachableUrl = '/api/getSomething';
  const notCachableUrl = '/api/doSomethingElse';
  const mockResponse = { data: 'yes please' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true }]
    });

    interceptor = TestBed.inject(HTTP_INTERCEPTORS).find(i => i instanceof CachingInterceptor);
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should clear the cache', () => {
    http.post(cachableUrl, {}).subscribe(data => expect(data).toEqual(mockResponse));
    const request = httpMock.expectOne(cachableUrl);
    request.flush(mockResponse);
    expect(interceptor.getCacheSize()).toEqual(1);

    interceptor.clearCache();
    expect(interceptor.getCacheSize()).toEqual(0);
  });

  describe('using cache', () => {
    beforeEach(() => {
      http.post(cachableUrl, {}).subscribe(data => expect(data).toEqual(mockResponse));
      let request = httpMock.expectOne(cachableUrl);
      request.flush(mockResponse);

      http.post(notCachableUrl, {}).subscribe(data => expect(data).toEqual(mockResponse));
      request = httpMock.expectOne(notCachableUrl);
      request.flush(mockResponse);

      httpMock.verify();
    });

    it('should not cache request without "/get" in url', () => {
      http.post(notCachableUrl, {}).subscribe(data => expect(data).toEqual(mockResponse));
      const request = httpMock.expectOne(notCachableUrl);
      request.flush(mockResponse);

      expect(interceptor.getCacheSize()).toEqual(1);
    });

    it('should cache all GET request', () => {
      http.get(notCachableUrl, {}).subscribe(data => expect(data).toEqual(mockResponse));
      const request = httpMock.expectOne(notCachableUrl);
      request.flush(mockResponse);

      expect(interceptor.getCacheSize()).toEqual(2);
    });

    it('should cache request with "/get" in url', () => {
      http.post(cachableUrl, {}).subscribe(data => expect(data).toEqual(mockResponse));
      httpMock.expectNone(cachableUrl);

      expect(interceptor.getCacheSize()).toEqual(1);
    });

    it('should not cache request with different body', () => {
      http.post(cachableUrl, { differentBody: true }).subscribe(data => expect(data).toEqual(mockResponse));
      const request = httpMock.expectOne(cachableUrl);
      request.flush(mockResponse);

      expect(interceptor.getCacheSize()).toEqual(2);
    });

    it('should not cache request with different params', () => {
      http
        .post(cachableUrl, {}, { params: new HttpParams().set('param', 'yes') })
        .subscribe(data => expect(data).toEqual(mockResponse));
      const request = httpMock.expectOne(req => req.url === cachableUrl && req.params.get('param') === 'yes');
      request.flush(mockResponse);

      expect(interceptor.getCacheSize()).toEqual(2);
    });

    it('should not cache black listed requests', () => {
      CACHE_BLACKLIST.forEach(blackListUrl => {
        http.post(blackListUrl, {}).subscribe(data => expect(data).toEqual(mockResponse));
        const request = httpMock.expectOne(blackListUrl);
        request.flush(mockResponse);

        expect(interceptor.getCacheSize()).toEqual(1);
      });
    });

    it('should cache white listed requests', () => {
      CACHE_WHITELIST.forEach((whiteListUrl, index) => {
        http.post(whiteListUrl, {}).subscribe(data => expect(data).toEqual(mockResponse));
        const request = httpMock.expectOne(whiteListUrl);
        request.flush(mockResponse);

        expect(interceptor.getCacheSize()).toEqual(index + 2);
      });
    });
  });

  describe('in flight requests', () => {
    it('completes the inflight observable stream', done => {
      const httpPost$ = http.post(cachableUrl, {});
      httpPost$.subscribe(data => expect(data).toEqual(mockResponse));
      httpPost$.subscribe(
        data => expect(data).toEqual(mockResponse),
        () => {},
        () => {
          expect(true).toBeTruthy();
          done();
        }
      );
      const request = httpMock.expectOne(cachableUrl);
      request.flush(mockResponse);
      httpMock.verify();
    });

    describe('with errors', () => {
      let httpPost$;

      beforeEach(() => {
        httpPost$ = http.post(cachableUrl, {});
      });

      it('sends the error downstream', done => {
        const mockError = { errors: 'test error' };
        httpPost$.subscribe(
          () => {},
          error => {
            expect(error.error).toEqual(mockError);
            done();
          },
          () => {}
        );
        httpPost$.subscribe(
          () => {},
          error => {
            expect(error.error).toEqual(mockError);
            done();
          },
          () => {}
        );
        const request = httpMock.expectOne(cachableUrl);
        request.flush(mockError, { status: 400, statusText: 'Bad Request' });
        httpMock.verify();
      });
    });

    describe('cachable urls', () => {
      let httpPost$;

      beforeEach(() => {
        httpPost$ = http.post(cachableUrl, {});
      });

      it('only makes one http request', () => {
        httpPost$.subscribe(data => expect(data).toEqual(mockResponse));
        httpPost$.subscribe(data => expect(data).toEqual(mockResponse));
        const request = httpMock.expectOne(cachableUrl);
        request.flush(mockResponse);
        httpMock.verify();
      });
    });

    describe('not cachable urls', () => {
      let httpPost$;

      beforeEach(() => {
        httpPost$ = http.post(notCachableUrl, {});
      });

      it('only makes one http request', () => {
        httpPost$.subscribe(data => expect(data).toEqual(mockResponse));
        httpPost$.subscribe(data => expect(data).toEqual(mockResponse));
        const request = httpMock.expectOne(notCachableUrl);
        request.flush(mockResponse);
        httpMock.verify();
      });

      describe('after an http request is complete', () => {
        beforeEach(() => {
          httpPost$.subscribe(data => expect(data).toEqual(mockResponse));
          const request = httpMock.expectOne(notCachableUrl);
          request.flush(mockResponse);
        });
        it('makes a new http request', () => {
          httpPost$.subscribe(data => expect(data).toEqual(mockResponse));
          const request = httpMock.expectOne(notCachableUrl);
          request.flush(mockResponse);
          httpMock.verify();
        });
      });
    });
  });
});
