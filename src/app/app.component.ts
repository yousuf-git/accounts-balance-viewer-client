import {Component, OnInit} from '@angular/core';
import {AuthService} from "./core/services/auth.service";
import {Router} from "@angular/router";
import {Routes} from "./core/constants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private _authService: AuthService, private _router: Router) {
  }

  ngOnInit(): void {
  }

  public onLogout() {
    this._authService.signOut();
    this._router.navigate([Routes.Auth]);
  }

}
