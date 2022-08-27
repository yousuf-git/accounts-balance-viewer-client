import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Endpoints} from "../constants";
import {Observable} from "rxjs";
import {GetAccountsResponse} from "../models/responses/get-accounts-response";
import {Entry} from "../models/entities/entry";
import {GetMonthlyInflowOutflowStatsResponse} from "../models/responses/get-monthly-inflow-outflow-stats-response";
import {GetAnnualInflowOutflowStatsResponse} from "../models/responses/get-annual-inflow-outflow-stats-response";
import {GetMonthlyAccumulationStatsResponse} from "../models/responses/get-monthly-accumulation-stats-response";
import {GetAnnualAccumulationStatsResponse} from "../models/responses/get-annual-accumulation-stats-response";

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

  public addEntries(entries: Entry[]): Observable<{}> {
    return this.http.post(Endpoints.AddEntries, entries);
  }

  public getMonthlyInflowOutflowStats(year: number): Observable<GetMonthlyInflowOutflowStatsResponse> {
    return this.http.get<GetMonthlyInflowOutflowStatsResponse>(Endpoints.FetchMonthlyInflowOutflowStats, {
      params: {year}
    });
  }

  public getAnnualInflowOutflowStats(): Observable<GetAnnualInflowOutflowStatsResponse> {
    return this.http.get<GetAnnualInflowOutflowStatsResponse>(Endpoints.FetchAnnualInflowOutflowStats);
  }

  public getMonthlyAccumulationStats(year: number): Observable<GetMonthlyAccumulationStatsResponse> {
    return this.http.get<GetMonthlyAccumulationStatsResponse>(Endpoints.FetchMonthlyAccumulationStats, {
      params: {year}
    });
  }

  public getAnnualAccumulationStats(): Observable<GetAnnualAccumulationStatsResponse> {
    return this.http.get<GetAnnualAccumulationStatsResponse>(Endpoints.FetchAnnualAccumulationStats);
  }
}
