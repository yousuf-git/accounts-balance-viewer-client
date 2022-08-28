import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthRequest} from "../models/requests/auth-request";
import {AuthResponse} from "../models/responses/auth-response";
import {CookieService} from "ngx-cookie-service";
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import {User} from "../models/entities/user";
import {Endpoints} from "../constants";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _authTokenKey = 'Authorization';
  private readonly _userDataKey = 'auth-user';

  private _userData?: User;

  public authStateChanged = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private cookie: CookieService) {
    const token = this.cookie.get(this._authTokenKey);
    const userData = localStorage.getItem(this._userDataKey);

    if (token == null || userData == null) {
      return;
    }

    this._userData = JSON.parse(userData);
    this.authStateChanged.next(this.isAuthenticated());
  }

  public auth(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(Endpoints.Auth, <AuthRequest>{
      username: username,
      password: password
    }).pipe(
      tap(value => {
        this.cookie.set(this._authTokenKey, value.token);

        const user: User = {
          id: value.id,
          username: value.username,
          email: value.email,
          name: value.name,
          role: value.role
        };

        this._userData = user;
        localStorage.setItem(this._userDataKey, JSON.stringify(user));
        this.authStateChanged.next(true);
      }),
      catchError(err => {
        this.revokeAuth();
        return throwError(err);
      }));
  }

  public signOut() {
    this.revokeAuth();
    this.authStateChanged.next(false);
  }

  public getUser(): User | null {
    if (!this.isAuthenticated() || this._userData == null) {
      return null;
    }

    return this._userData;
  }

  public isAuthenticated(): boolean {
    const token = this.cookie.get(this._authTokenKey);

    return token != '' && this._userData != null;
  }

  private revokeAuth() {
    this.cookie.delete(this._authTokenKey);
    localStorage.removeItem(this._userDataKey);
  }
}
