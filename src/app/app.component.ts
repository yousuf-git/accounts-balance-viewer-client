import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "./core/services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private _subscriptions = new Subscription();

  constructor(private _authService: AuthService, private _router: Router) {
  }

  ngOnInit(): void {
    const subscription = this._authService.authStateChanged.subscribe(value => {
      if (!value) {
        this._router.navigate(['./']);
      }
    });

    this._subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

}
