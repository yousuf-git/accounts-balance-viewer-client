import {Component, OnInit} from '@angular/core';
import {CoreService} from "../../../core/services/core.service";
import {EChartSeriesOptions} from "../../../core/types";
import {
  GetMonthlyAccumulationStatsResponse
} from "../../../core/models/responses/get-monthly-accumulation-stats-response";

@Component({
  selector: 'app-monthly-accumulation-report',
  templateUrl: './monthly-accumulation-report.component.html',
  styleUrls: ['./monthly-accumulation-report.component.css']
})
export class MonthlyAccumulationReportComponent implements OnInit {


  public readonly months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  public minYear = new Date().getFullYear() - 2;
  public availableYears = [new Date().getFullYear()];

  public displayedColumns: string[] = [];
  public dataSource: { [key: string]: string }[] = [];

  public chartOptions: any;

  constructor(private _coreService: CoreService) {
  }

  ngOnInit(): void {
    this.fetchMonthlyAccumulationStats(this.availableYears[0]);
    this.fetchFirstOperationYear();
  }

  public onYearChange(year: any) {
    this.fetchMonthlyAccumulationStats(year);
  }

  private fetchMonthlyAccumulationStats(year: number) {
    this._coreService.getMonthlyAccumulationStats(year)
      .subscribe(response => {
        this.drawTable(response);
        this.drawChart(response);
      });
  }

  private fetchFirstOperationYear() {
    this._coreService.getFirstOperationYear()
      .subscribe(response => {
        this.minYear = response.year;

        const years = [];
        for (let i = new Date().getFullYear(); i >= response.year; i--) {
          years.push(i);
        }

        this.availableYears = years;
      })
  }

  private drawTable(data: GetMonthlyAccumulationStatsResponse) {
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
        account.set(item.accountName, stat.balance);

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
        o[account] = balance ? balance.toLocaleString('en-US', {style: 'currency', currency: 'LKR'}) : ''
      }

      dataSource.push(o);
    }

    this.dataSource = dataSource;
  }

  private drawChart(data: GetMonthlyAccumulationStatsResponse) {
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
        series.data![stat.month - 1] = stat.balance;
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
      yAxis: {},
      series: [...seriesList],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    }
  }
}
