import {AuthComponent} from './auth.component';
import {MatSnackBar} from "@angular/material/snack-bar";
import {of} from "rxjs";
import {AuthService} from "../../core/services/auth.service";
import {AuthResponse} from "../../core/models/responses/auth-response";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {Routes, UserRole} from "../../core/constants";

describe('AuthComponent', () => {
  let fakeAuthService: jasmine.SpyObj<AuthService>;
  let fakeMatSnackBar: jasmine.SpyObj<MatSnackBar>;
  let fakeRouter: jasmine.SpyObj<Router>;
  let formBuilder: FormBuilder;
  let component: AuthComponent;

  beforeEach(() => {
    fakeAuthService = jasmine.createSpyObj<AuthService>('AuthService', {
      auth: of(<AuthResponse>{
        id: '33',
        name: 'Max Verstappen',
        role: 'user',
        email: 'max@email.com',
        username: 'max555',
        token: 'token'
      })
    });
    fakeMatSnackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', {
      open: undefined
    });
    fakeRouter = jasmine.createSpyObj<Router>('Router', {
      navigate: new Promise(resolve => resolve(true))
    });
    formBuilder = new FormBuilder();
    component = new AuthComponent(formBuilder, fakeAuthService, fakeMatSnackBar, fakeRouter);
  });

  it('validates form on submit', () => {
    // act
    component.onSubmit();

    // assert
    expect(fakeAuthService.auth.calls.count()).toBe(0);
  });

  it('validates and invokes auth service on submit', () => {
    component.authForm.setValue({
      username: 'max33',
      password: '123'
    });

    // act
    component.onSubmit();

    // assert
    expect(fakeAuthService.auth.calls.count()).toBe(1);
  });

  it('on successful auth, invokes navigateToDefault func with expected user role', () => {
    component.authForm.setValue({
      username: 'max33',
      password: '123'
    });

    const navigateToDefaultSpy = spyOn<any>(component, 'navigateToDefault');

    // act
    component.onSubmit();

    // assert
    expect(fakeAuthService.auth.calls.count()).toBe(1);
    expect(navigateToDefaultSpy).toHaveBeenCalledOnceWith('user')
  });

  it('navigates to expected user role (admin) on navigate to default', () => {
    // act
    component['navigateToDefault'].call(component, UserRole.Admin)

    // assert
    expect(fakeRouter.navigate).toHaveBeenCalledOnceWith([Routes.ViewBalance]);
  });

  it('navigates to expected user role (user) on navigate to default', () => {
    // act
    component['navigateToDefault'].call(component, UserRole.User)

    // assert
    expect(fakeRouter.navigate).toHaveBeenCalledOnceWith([Routes.ViewBalance]);
  });

});
