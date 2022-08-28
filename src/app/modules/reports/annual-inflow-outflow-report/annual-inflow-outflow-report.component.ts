import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoreService} from "../../../core/services/core.service";
import {
  GetAnnualInflowOutflowStatsResponse
} from "../../../core/models/responses/get-annual-inflow-outflow-stats-response";
import {EChartSeriesOptions} from "../../../core/types";
import {GetFirstOperationYear} from 'src/app/core/models/responses/get-first-operation-year';
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-annual-inflow-outflow-report',
  templateUrl: './annual-inflow-outflow-report.component.html',
  styleUrls: ['./annual-inflow-outflow-report.component.css']
})
export class AnnualInflowOutflowReportComponent implements OnInit, OnDestroy {

  private _subscriptions = new Subscription();

  public minYear = new Date().getFullYear() - 2;

  public displayedColumns: string[] = [];
  public dataSource: { [key: string]: string }[] = [];

  public chartOptions: any;

  constructor(private _coreService: CoreService) {
  }

  ngOnInit(): void {
    const subscription = this.fetchFirstOperationYear()
      .subscribe(response => {
        this.minYear = response.year;
        this.fetchAnnualInflowOutflowStats();
      });

    this._subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  private fetchAnnualInflowOutflowStats() {
    const subscription = this._coreService.getAnnualInflowOutflowStats()
      .subscribe(response => {
        this.drawTable(response);
        this.drawChart(response);
      });

    this._subscriptions.add(subscription);
  }

  private fetchFirstOperationYear(): Observable<GetFirstOperationYear> {
    return this._coreService.getFirstOperationYear();
  }

  private drawTable(data: GetAnnualInflowOutflowStatsResponse) {
    // add account names to `displayedColumns`
    const accountNames = data.map<string>(stat => stat.accountName);
    this.displayedColumns = ['Year', ...accountNames];

    const gridMap = new Map<number, Map<string, number>>();

    // initiate maps for each year
    for (let i = this.minYear; i <= new Date().getFullYear(); i++) {
      gridMap.set(i, new Map<string, number>());
    }

    // populate `statMaps` in `gridMap` with data
    data.forEach(item => {
      item.data.forEach(stat => {

        const account = gridMap.get(stat.year) ?? new Map<string, number>();
        account.set(item.accountName, stat.change);

        gridMap.set(stat.year, account);

      })
    })

    // transform `gridMap` and set to table data source
    const dataSource = [];
    for (const [year, statMap] of gridMap) {
      const o: { [key: string]: string } = {
        'Year': year.toString()
      };

      for (const [account, balance] of statMap) {
        o[account] = balance.toLocaleString('en-US', {style: 'currency', currency: 'LKR'})
      }

      dataSource.push(o);
    }

    this.dataSource = dataSource;
  }

  private drawChart(data: GetAnnualInflowOutflowStatsResponse) {
    const seriesList: EChartSeriesOptions[] = [];
    const accountNames: string[] = [];

    const years = [];
    const offsetMap = new Map<number, number>();
    for (let y = this.minYear, i = 0; y <= new Date().getFullYear(); y++, i++) {
      years.push(y);
      offsetMap.set(y, i);
    }

    data.forEach(item => {
      const series: EChartSeriesOptions = {
        name: item.accountName,
        type: 'line',
        data: Array(years.length).fill(0),
        animationDelay: (idx: number) => idx * 10,
      }

      item.data.forEach(stat => {
        const offset = offsetMap.get(stat.year)!;
        series.data![offset] = stat.change;
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
        data: years,
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
