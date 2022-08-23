import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Endpoints} from "../constants";
import {Observable} from "rxjs";
import {GetAccountsResponse} from "../models/responses/get-accounts-response";

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private http: HttpClient) {

  }

  public getAccounts(balanceFrom: Date | null = null, balanceTo: Date | null = null): Observable<GetAccountsResponse> {
    let params = new HttpParams();

    if (balanceFrom != null) {
      params = params.append('balanceFrom', balanceFrom.getUTCDate());
    }

    if (balanceTo != null) {
      params = params.append('balanceTo', balanceTo.getUTCDate());
    }

    return this.http.get<GetAccountsResponse>(Endpoints.FetchAccounts, {
      params: params
    });
  }
}
