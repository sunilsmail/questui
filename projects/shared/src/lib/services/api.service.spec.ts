import { HttpHeaders, HttpParams, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CsrfModule } from 'shared/csrf.module';
import { environment } from 'shared/environments/environment';
import { ApiService } from 'shared/services/api.service';
import { MockI18nModule } from 'shared/specs/mocks/I18n/mock-i18n.module';
import { MockCacheInterceptor } from 'shared/specs/mocks/mock-api.service';

const API_URI = environment.apiURI;
const REL_PATH = 'testRequest';
const API_PATH = `${API_URI}${REL_PATH}`;

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let interceptor: any;
  let locale: string;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CsrfModule, RouterTestingModule, MockI18nModule],
      providers: [
        ApiService,
        { provide: HTTP_INTERCEPTORS, useClass: MockCacheInterceptor, multi: true },
        { provide: LOCALE_ID, useFactory: () => 'en' }
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    locale = TestBed.inject(LOCALE_ID);
    router = TestBed.inject(Router);
  });

  describe('#request', () => {
    afterEach(() => {
      httpMock.verify();
    });

    it('makes POST requests', () => {
      service.request<string>('POST', `${REL_PATH}`).subscribe(data => { });

      const httpRequest = httpMock.expectOne(API_PATH);
      expect(httpRequest.request.method).toEqual('POST');
      httpRequest.flush('');
    });

    it('makes GET requests', () => {
      service.request<string>('GET', `${REL_PATH}`).subscribe(data => { });

      const httpRequest = httpMock.expectOne(API_PATH);
      expect(httpRequest.request.method).toEqual('GET');
      httpRequest.flush('');
    });

    it('should append Content-Type header', () => {
      service.request<string>('POST', `${REL_PATH}`).subscribe(data => { });

      const httpRequest = httpMock.expectOne(API_PATH);
      expect(httpRequest.request.headers.get('Content-Type')).toEqual('application/json');
      httpRequest.flush('');
    });

    it('should append X-CSRF-TOKEN header', () => {
      service.setCsrfToken();
      service.request<string>('POST', `${REL_PATH}`).subscribe(data => { });

      const httpRequest = httpMock.expectOne(API_PATH);
      expect(httpRequest.request.headers.has('X-CSRF-TOKEN')).toBeTruthy();
      httpRequest.flush('');
    });

    it('should append Accept-Language header', () => {
      service.request<string>('POST', `${REL_PATH}`).subscribe(data => { });

      const httpRequest = httpMock.expectOne(API_PATH);
      expect(httpRequest.request.headers.get('Accept-Language')).toEqual(locale);
      httpRequest.flush('');
    });

    it('should pass body and custom headers to HTTP request', () => {
      const body = { isWorking: true };
      const options = { headers: new HttpHeaders({ MyHeader: 'yes' }), body };
      service.request<string>('POST', `${REL_PATH}`, options).subscribe(data => { });

      const httpRequest = httpMock.expectOne(API_PATH);
      expect(httpRequest.request.body).toEqual(body);
      expect(httpRequest.request.headers.get('MyHeader')).toEqual('yes');
      expect(httpRequest.request.headers.has('Content-Type')).toEqual(false);
      httpRequest.flush('');
    });

    it('should pass body and parameters to HTTP request', () => {
      const body = { isWorking: true };
      const options = { params: new HttpParams().set('testParam', 'yes'), body };
      service.request<string>('POST', `${REL_PATH}`, options).subscribe(data => { });

      const httpRequest = httpMock.expectOne(req => req.url === API_PATH);
      expect(httpRequest.request.body).toEqual(body);
      expect(httpRequest.request.params.get('testParam')).toEqual('yes');
      expect(httpRequest.request.headers.get('Content-Type')).toEqual('application/json');
      httpRequest.flush('');
    });

    it('should request path with leading slash', done => {
      const mockData = 'test data';

      service.request<string>('POST', `/${REL_PATH}`).subscribe(data => {
        expect(data).toEqual(mockData);
        done();
      });

      const httpRequest = httpMock.expectOne(API_PATH);
      httpRequest.flush(mockData);
    });

    it('should request path without leading slash', done => {
      const mockData = 'test data';

      service.request<string>('POST', REL_PATH).subscribe(data => {
        expect(data).toEqual(mockData);
        done();
      });

      const httpRequest = httpMock.expectOne(API_PATH);
      httpRequest.flush(mockData);
    });

    it('should return data from response', done => {
      const mockData = { data: 'test data' };

      service.request<string>('POST', REL_PATH).subscribe(data => {
        expect(data).toEqual('test data');
        done();
      });

      const httpRequest = httpMock.expectOne(API_PATH);
      httpRequest.flush(mockData);
    });

    it('should return null response', done => {
      service.request<string>('POST', REL_PATH).subscribe(data => {
        expect(data).toEqual(null);
        done();
      });

      const httpRequest = httpMock.expectOne(API_PATH);
      httpRequest.flush(null);
    });

    it('should handle error responses', done => {
      const mockError = { errors: 'test error' };

      service.request<string>('POST', REL_PATH).subscribe(
        data => {
          // Make sure we don't end up in here
          expect(false).toBeTruthy();
          done();
        },
        error => {
          expect(error).toEqual('test error');
          done();
        }
      );

      const httpRequest = httpMock.expectOne(API_PATH);
      httpRequest.flush(mockError, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle unknown http errors', done => {
      const mockError = 'something broke but its not in our expected error response format';

      service.request<string>('POST', REL_PATH).subscribe(
        data => {
          // Make sure we don't end up in here
          expect(false).toBeTruthy();
          done();
        },
        error => {
          expect(error).toEqual(mockError);
          done();
        }
      );

      const httpRequest = httpMock.expectOne(API_PATH);
      httpRequest.flush(mockError, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 401 http errors', done => {
      // stub here bc navigate called in catchError which cause test runner to throw an error unless mock route is defined
      spyOn(router, 'navigate').and.stub();

      const mockError = 'Unauthorized dude';

      service.request<string>('POST', REL_PATH).subscribe(
        data => {
          // Make sure we don't end up in here
          expect(false).toBeTruthy();
          done();
        },
        error => {
          expect(error).toEqual(mockError);
          done();
        }
      );

      const httpRequest = httpMock.expectOne(API_PATH);
      httpRequest.flush(mockError, { status: 401, statusText: 'Unauthorized User' });

      expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: router.url } });
    });
  });

  describe('#post', () => {
    let body: any;
    let options: any;
    const mockResponse = 'mock-response';
    beforeEach(() => {
      body = { foo: 'bar' };
      options = { foo: 'bar' };
      spyOn(service, 'request').and.returnValue(of(mockResponse));
      service.post<string>(`${REL_PATH}`, body, options).subscribe(data => { });
    });

    it('calls service request', () => {
      const mockOptions = { body, ...options };
      expect(service.request).toHaveBeenCalledWith('POST', `${REL_PATH}`, mockOptions);
    });

    it('returns the data', done => {
      service.post<string>(`${REL_PATH}`).subscribe(data => {
        expect(data).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('#get', () => {
    let options: any;
    const mockResponse = 'mock-response';
    beforeEach(() => {
      options = { foo: 'bar' };
      spyOn(service, 'request').and.returnValue(of(mockResponse));
      service.get<string>(`${REL_PATH}`, options).subscribe(data => { });
    });

    it('calls service request', () => {
      expect(service.request).toHaveBeenCalledWith('GET', `${REL_PATH}`, options);
    });

    it('returns the data', done => {
      service.get<string>(`${REL_PATH}`).subscribe(data => {
        expect(data).toEqual(mockResponse);
        done();
      });
    });
  });

  describe('#clearCache', () => {
    it('should call the clearCache function', () => {
      interceptor = TestBed.inject(HTTP_INTERCEPTORS).find(i => i instanceof MockCacheInterceptor);
      spyOn(interceptor, 'clearCache');

      service.clearCache();

      expect(interceptor.clearCache).toHaveBeenCalled();
    });

    it('should emit value on cacheCleared', () => {
      service.clearCache();
      service.getCacheCleared().subscribe(value => {
        expect(value).toBeTruthy();
      });
    });
  });

  describe('csrf token', () => {
    beforeEach(() => {
      spyOn<any>(service, 'generateCsrfToken').and.returnValue('token');
    });

    describe('#setCSRFToken', () => {
      it('sets the CSRF-TOKEN cookie', () => {
        service.setCsrfToken();
        expect(document.cookie).toContain('CSRF-TOKEN=token');
      });
    });

    describe('getCsrfToken', () => {
      it('returns the csrf token cookie string', () => {
        const result = service.getCsrfToken();
        expect(result).toEqual(`CSRF-TOKEN=token; path=/;`);
      });
    });
  });

  describe('#formatBodyObject', () => {
    it('will replace strings with null', () => {
      const testBodyObject = {
        firstName: 'Jacob',
        id: '123',
        data: ''
      };

      service.post<string>(REL_PATH, testBodyObject).subscribe();

      const httpRequest = httpMock.expectOne(API_PATH);
      httpRequest.flush('');

      expect(httpRequest.request.body).toEqual({ firstName: 'Jacob', id: '123', data: null });
    });

    it('will replace strings recursively', () => {
      const testBodyObject = {
        firstName: 'Jacob',
        id: '123',
        data: {
          foo: '',
          bar: '123',
          data: {
            foo: '',
            bar: '456',
            data: {
              foo: '789',
              bar: ''
            }
          }
        }
      };

      service.post<string>(REL_PATH, testBodyObject).subscribe();

      const httpRequest = httpMock.expectOne(API_PATH);
      httpRequest.flush('');

      expect(httpRequest.request.body).toEqual({
        firstName: 'Jacob',
        id: '123',
        data: {
          foo: null,
          bar: '123',
          data: {
            foo: null,
            bar: '456',
            data: {
              foo: '789',
              bar: null
            }
          }
        }
      });
    });

    it('handles null values', () => {
      const mockBody = { foo: null };
      service.post<string>(REL_PATH, mockBody).subscribe();
      const httpRequest = httpMock.expectOne(API_PATH);
      httpRequest.flush('');
      expect(httpRequest.request.body).toEqual({ foo: null });
    });
  });
});
