import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoreService} from "../../../core/services/core.service";
import {
  GetMonthlyInflowOutflowStatsResponse
} from "../../../core/models/responses/get-monthly-inflow-outflow-stats-response";
import {EChartSeriesOptions} from "../../../core/types";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-monthly-inflow-outflow-report',
  templateUrl: './monthly-inflow-outflow-report.component.html',
  styleUrls: ['./monthly-inflow-outflow-report.component.css']
})
export class MonthlyInflowOutflowReportComponent implements OnInit, OnDestroy {

  private _subscriptions = new Subscription();

  public readonly months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  public minYear = new Date().getFullYear() - 2;
  public availableYears = [new Date().getFullYear()];

  public displayedColumns: string[] = [];
  public dataSource: { [key: string]: string }[] = [];

  public chartOptions: any;

  constructor(private _coreService: CoreService) {
  }

  ngOnInit(): void {
    this.fetchMonthlyInflowOutflowStats(this.availableYears[0]);
    this.fetchFirstOperationYear();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  public onYearChange(year: any) {
    this.fetchMonthlyInflowOutflowStats(year);
  }

  private fetchMonthlyInflowOutflowStats(year: number) {
    const subscription = this._coreService.getMonthlyInflowOutflowStats(year)
      .subscribe(response => {
        this.drawTable(response);
        this.drawChart(response);
      });

    this._subscriptions.add(subscription);
  }

  private fetchFirstOperationYear() {
    const subscription = this._coreService.getFirstOperationYear()
      .subscribe(response => {
        this.minYear = response.year;

        const years = [];
        for (let i = new Date().getFullYear(); i >= response.year; i--) {
          years.push(i);
        }

        this.availableYears = years;
      });

    this._subscriptions.add(subscription);
  }

  private drawTable(data: GetMonthlyInflowOutflowStatsResponse) {
    // add account names to `displayedColumns`
    const accountNames = data.map<string>(stat => stat.accountName);
    this.displayedColumns = ['Month', ...accountNames];

    const gridMap = new Map<number, Map<string, number>>();

    // initiate maps for each month
    for (let i = 1; i <= 12; i++) {
      gridMap.set(i, new Map<string, number>());
    }

    // populate `statMaps` in `gridMap` with data
    data.forEach(item => {
      item.data.forEach(stat => {

        const account = gridMap.get(stat.month) ?? new Map<string, number>();
        account.set(item.accountName, stat.change);

        gridMap.set(stat.month, account);

      })
    })

    // transform `gridMap` and set to table data source
    const dataSource = [];
    for (const [month, statMap] of gridMap) {
      const o: { [key: string]: string } = {
        'Month': this.months[month]
      };

      for (const [account, balance] of statMap) {
        o[account] = balance.toLocaleString('en-US', {style: 'currency', currency: 'LKR'})
      }

      dataSource.push(o);
    }

    this.dataSource = dataSource;
  }

  private drawChart(data: GetMonthlyInflowOutflowStatsResponse) {
    const seriesList: EChartSeriesOptions[] = [];
    const accountNames: string[] = [];

    data.forEach(item => {
      const series: EChartSeriesOptions = {
        name: item.accountName,
        type: 'line',
        data: Array(12).fill(0),
        animationDelay: (idx: number) => idx * 10,
      }

      item.data.forEach(stat => {
        series.data![stat.month - 1] = stat.change;
      })

      seriesList.push(series);
      accountNames.push(item.accountName);
    })

    this.chartOptions = {
      legend: {
        data: [...accountNames],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        axisLabel: {
          formatter: (value: number) => value.toLocaleString('en-US', {style: 'currency', currency: 'LKR'})
        }
      },
      series: [...seriesList],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    }
  }

}
