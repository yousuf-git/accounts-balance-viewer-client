import {CommonInterceptor} from './common.interceptor';
import {CookieService} from "ngx-cookie-service";
import {HttpHandler, HttpRequest} from "@angular/common/http";
import {of} from "rxjs";
import {environment} from "../../../environments/environment";

describe('CommonInterceptor', () => {
  let fakeCookieService: jasmine.SpyObj<CookieService>;
  let fakeHttpHandler: jasmine.SpyObj<HttpHandler>;
  let interceptor: CommonInterceptor;

  beforeEach(() => {
    fakeCookieService = jasmine.createSpyObj<CookieService>('CookieService', {
      get: undefined
    });

    fakeHttpHandler = jasmine.createSpyObj<HttpHandler>('HttpHandler', {
      handle: of()
    });

    interceptor = new CommonInterceptor(fakeCookieService);
  });

  it('injects server host and auth token to the request', () => {
    const request: HttpRequest<any> = new HttpRequest<any>('GET', 'example.com');
    fakeCookieService.get.and.returnValue('5c44sd8321sd');

    // act
    interceptor.intercept(request, fakeHttpHandler)

    // assert
    const newRequest = fakeHttpHandler.handle.calls.argsFor(0)[0];
    expect(newRequest.url).toContain(environment.serverHost);
    expect(newRequest.headers.get('Authorization')).toBeTruthy();
  });

  it('injects only server host to the request and omits auth token when unauthenticated', () => {
    const request: HttpRequest<any> = new HttpRequest<any>('GET', 'example.com');
    fakeCookieService.get.and.returnValue('');

    // act
    interceptor.intercept(request, fakeHttpHandler)

    // assert
    const newRequest = fakeHttpHandler.handle.calls.argsFor(0)[0];
    expect(newRequest.url).toContain(environment.serverHost);
    expect(newRequest.headers.get('Authorization')).toBeFalsy();
  });
});
