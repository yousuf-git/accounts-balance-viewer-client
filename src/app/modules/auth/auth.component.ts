import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../core/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {Routes, UserRole} from "../../core/constants";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  public authForm = this._fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private _fb: FormBuilder, private _authService: AuthService, private _snackBar: MatSnackBar, private _router: Router) {
  }

  ngOnInit(): void {
    const isAuthenticated = this._authService.isAuthenticated();
    const user = this._authService.getUser();
    if (isAuthenticated && user != null) {
      this.navigateToDefault(user.role);
    }
  }

  public onSubmit() {
    if (this.authForm.invalid) {
      this._snackBar.open('Please enter both username and password');

      return;
    }

    const {username, password} = this.authForm.value;

    this._authService.auth(username!, password!)
      .subscribe({
        next: value => {
          this._snackBar.open(`Welcome ${value.name}!`);

          this.navigateToDefault(value.role);
        },
        error: _ => this._snackBar.open('Invalid username or password')
      })
  }

  private navigateToDefault(role: UserRole) {
    switch (role) {
      case UserRole.Admin:
        this._router.navigate([Routes.ViewBalance]);
        break;
      case UserRole.User:
        this._router.navigate([Routes.ViewBalance]);
        break;
    }
  }
}
