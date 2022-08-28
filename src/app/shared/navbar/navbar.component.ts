import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {Route, Router} from "@angular/router";
import {UserRole} from "../../core/constants";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  @Output() signOut = new EventEmitter<void>();
  private _subscriptions = new Subscription();

  public routes: { path: string, text: string }[] = [];

  constructor(public authService: AuthService, private _router: Router) {
  }

  ngOnInit(): void {
    const subscription = this.authService.authStateChanged.subscribe(this.resolveAuthorizedRoutes.bind(this));
    this._subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  private resolveAuthorizedRoutes() {
    this.routes = [];

    const role = this.authService.getUser()?.role;
    if (!role) return;

    this._router.config.forEach(route => {
      if (this.hasPermissionToProtectedRoute(route, role)) {
        this.routes.push({
          path: route.path ?? '',
          text: route.data?.['uiText'] ?? ''
        });
      }
    });
  }

  private hasPermissionToProtectedRoute(route: Route, role: UserRole): boolean {
    return !!(route.canActivate && route.data && (route.data['roles'] as UserRole[]).includes(role));
  }

  public onSignOut() {
    this.authService.signOut();
  }

}
