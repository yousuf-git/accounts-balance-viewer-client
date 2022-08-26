import {Component, OnInit} from '@angular/core';
import {CoreService} from "../../core/services/core.service";
import {Account} from "../../core/models/entities/account";
import {MatSnackBar} from "@angular/material/snack-bar";
import {catchError, Observable, throwError} from "rxjs";
import {GetAccountsResponse} from "../../core/models/responses/get-accounts-response";

@Component({
  selector: 'app-view-balance',
  templateUrl: './view-balance.component.html',
  styleUrls: ['./view-balance.component.css']
})
export class ViewBalanceComponent implements OnInit {

  public accounts: Account[] = [];
  public todayDate: Date = new Date();

  constructor(private _coreService: CoreService, private _snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.fetchAccounts().subscribe(this.setAccounts);
  }

  public fetchAccounts(): Observable<GetAccountsResponse> {
    return this._coreService.getAccounts().pipe(catchError(err => {
      this._snackbar.open('Something went wrong while fetching accounts');
      return throwError(err);
    }));
  }

  public setAccounts(accounts: Account[]) {
    this.accounts = accounts;
  }

}
