import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";
import {CookieService} from "ngx-cookie-service";

@Injectable()
export class CommonInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = this.cookieService.get('Authorization');

    const newRequest = request.clone({
      url: environment.serverHost + request.url,
      setHeaders: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    return next.handle(newRequest);
  }
}
