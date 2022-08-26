import {ErrorInterceptor} from './error.interceptor';
import {HttpErrorResponse, HttpHandler, HttpRequest} from "@angular/common/http";
import {throwError} from "rxjs";
import {AuthService} from "../services/auth.service";

describe('ErrorInterceptor', () => {
  let fakeAuthService: jasmine.SpyObj<AuthService>;
  let fakeHttpHandler: jasmine.SpyObj<HttpHandler>;
  let interceptor: ErrorInterceptor;

  beforeEach(() => {
    fakeAuthService = jasmine.createSpyObj<AuthService>('AuthService', {
      signOut: undefined
    });

    fakeHttpHandler = jasmine.createSpyObj<HttpHandler>('HttpHandler', {
      handle: undefined
    });

    interceptor = new ErrorInterceptor(fakeAuthService);
  });

  it('invokes sign out when http error status is 401', () => {
    const request: HttpRequest<any> = new HttpRequest<any>('GET', 'example.com');
    fakeHttpHandler.handle.and.returnValue(throwError(() => new HttpErrorResponse({
      status: 401
    })))

    // act
    interceptor.intercept(request, fakeHttpHandler).subscribe({
      error: _ => {
      }
    });

    // assert
    expect(fakeAuthService.signOut).toHaveBeenCalledTimes(1);
  });

  it('does not invoke sign out when http error status is not 401', () => {
    const request: HttpRequest<any> = new HttpRequest<any>('GET', 'example.com');
    fakeHttpHandler.handle.and.returnValue(throwError(() => new HttpErrorResponse({
      status: 404
    })))

    // act
    interceptor.intercept(request, fakeHttpHandler).subscribe({
      error: _ => {
      }
    });

    // assert
    expect(fakeAuthService.signOut).toHaveBeenCalledTimes(0);
  });
});
