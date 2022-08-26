import {AuthGuard} from './auth.guard';
import {AuthService} from "../services/auth.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {UserRole} from "../constants";

describe('AuthGuard', () => {
  let fakeAuthService: jasmine.SpyObj<AuthService>;
  let fakeActivatedRouteSnapshot: jasmine.SpyObj<ActivatedRouteSnapshot>;
  let fakeRouterStateSnapshot: jasmine.SpyObj<RouterStateSnapshot>;
  let guard: AuthGuard;

  beforeEach(() => {
    fakeAuthService = jasmine.createSpyObj<AuthService>('AuthService', {
      getUser: undefined
    });

    fakeActivatedRouteSnapshot = jasmine.createSpyObj<ActivatedRouteSnapshot>('ActivatedRouteSnapshot', ['toString']);
    fakeRouterStateSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);

    guard = new AuthGuard(fakeAuthService);
  });

  it('activates on auth user having permission to the route', () => {
    // act
    fakeActivatedRouteSnapshot.data = {
      roles: <UserRole[]>[
        UserRole.Admin
      ]
    }

    fakeAuthService.getUser.and.returnValue({
      id: '33',
      name: 'Max',
      email: 'max@email.com',
      username: 'max33',
      role: UserRole.Admin
    });

    const result = guard.canActivate(fakeActivatedRouteSnapshot, fakeRouterStateSnapshot) as boolean;

    // assert
    expect(result).toBe(true);
  });

  it('not activates on auth user having not permission to the route', () => {
    // act
    fakeActivatedRouteSnapshot.data = {
      roles: <UserRole[]>[
        UserRole.User
      ]
    }

    fakeAuthService.getUser.and.returnValue({
      id: '33',
      name: 'Max',
      email: 'max@email.com',
      username: 'max33',
      role: UserRole.Admin
    });

    const result = guard.canActivate(fakeActivatedRouteSnapshot, fakeRouterStateSnapshot) as boolean;

    // assert
    expect(result).toBe(false);
  });
});
