import {Component, OnInit} from '@angular/core';
import {CoreService} from "../../../core/services/core.service";
import {Observable} from "rxjs";
import {GetFirstOperationYear} from "../../../core/models/responses/get-first-operation-year";
import {EChartSeriesOptions} from "../../../core/types";
import {
  GetAnnualAccumulationStatsResponse
} from "../../../core/models/responses/get-annual-accumulation-stats-response";

@Component({
  selector: 'app-annual-accumulation-report',
  templateUrl: './annual-accumulation-report.component.html',
  styleUrls: ['./annual-accumulation-report.component.css']
})
export class AnnualAccumulationReportComponent implements OnInit {


  public minYear = new Date().getFullYear() - 2;

  public displayedColumns: string[] = [];
  public dataSource: { [key: string]: string }[] = [];

  public chartOptions: any;

  constructor(private _coreService: CoreService) {
  }

  ngOnInit(): void {
    this.fetchFirstOperationYear().subscribe(response => {
      this.minYear = response.year;
      this.fetchAccumulationStats();
    });
  }

  private fetchAccumulationStats() {
    this._coreService.getAnnualAccumulationStats()
      .subscribe(response => {
        this.drawTable(response);
        this.drawChart(response);
      });
  }

  private fetchFirstOperationYear(): Observable<GetFirstOperationYear> {
    return this._coreService.getFirstOperationYear();
  }

  private drawTable(data: GetAnnualAccumulationStatsResponse) {
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
        account.set(item.accountName, stat.balance);

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

  private drawChart(data: GetAnnualAccumulationStatsResponse) {
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
        series.data![offset] = stat.balance;
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
      yAxis: {},
      series: [...seriesList],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    }
  }

}
