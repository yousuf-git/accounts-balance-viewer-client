import {Component, OnInit} from '@angular/core';
import {CoreService} from "../../../core/services/core.service";
import {
  GetMonthlyInflowOutflowStatsResponse
} from "../../../core/models/responses/get-monthly-inflow-outflow-stats-response";

@Component({
  selector: 'app-inflow-outflow-reports',
  templateUrl: './inflow-outflow-reports.component.html',
  styleUrls: ['./inflow-outflow-reports.component.css']
})
export class InflowOutflowReportsComponent implements OnInit {

  public readonly months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  public years = [new Date().getFullYear(), new Date().getFullYear() - 1];
  public displayedColumns: string[] = [];
  public dataSource: { [key: string]: string }[] = [];

  constructor(private _coreService: CoreService) {
  }

  ngOnInit(): void {
    this.fetchMonthlyInflowOutflowStats(this.years[0]);
  }

  public onChange($event: any) {
    this.fetchMonthlyInflowOutflowStats($event);
  }

  private fetchMonthlyInflowOutflowStats(year: number) {
    this._coreService.getMonthlyInflowOutflowStats(year)
      .subscribe(this.handleMonthlyInflowOutflowStatsTable.bind(this));
  }

  private handleMonthlyInflowOutflowStatsTable(data: GetMonthlyInflowOutflowStatsResponse) {
    const accountNames = data.map<string>(stat => stat.accountName);
    this.displayedColumns = ['Month', ...accountNames];

    const gridMap = new Map<number, Map<string, number>>();

    // setup months;
    for (let i = 1; i <= 12; i++) {
      gridMap.set(i, new Map<string, number>());
    }

    data.forEach(value1 => value1.data.forEach(value2 => {
      const account = gridMap.get(value2.month) ?? new Map<string, number>();
      account.set(value1.accountName, value2.change);

      gridMap.set(value2.month, account);
    }))

    const list = [];

    for (const [month, value] of gridMap) {
      const o: { [key: string]: string } = {
        'Month': this.months[month]
      };

      for (const [account, balance] of value) {
        o[account] = balance.toLocaleString('en-US', {style: 'currency', currency: 'LKR'})
      }

      list.push(o);
    }

    this.dataSource = list;
  }
}
