import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {Route, Router} from "@angular/router";
import {UserRole} from "../../core/constants";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() signOut = new EventEmitter<void>();

  public routes: { path: string, text: string }[] = [];

  constructor(public authService: AuthService, private _router: Router) {
  }

  ngOnInit(): void {
    this.authService.authStateChanged
      .subscribe(this.resolveAuthorizedRoutes.bind(this));
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
