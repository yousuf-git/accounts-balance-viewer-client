import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReportsComponent} from "./reports.component";
import {ReportsRoutingModule} from "./reports-routing.module";
import {MatCardModule} from "@angular/material/card";
import {
  MonthlyInflowOutflowReportComponent
} from './monthly-inflow-outflow-report/monthly-inflow-outflow-report.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {NgxEchartsModule} from "ngx-echarts";
import {
  AnnualInflowOutflowReportComponent
} from './annual-inflow-outflow-report/annual-inflow-outflow-report.component';
import {MonthlyAccumulationReportComponent} from './monthly-accumulation-report/monthly-accumulation-report.component';
import {AnnualAccumulationReportComponent} from './annual-accumulation-report/annual-accumulation-report.component';

@NgModule({
  declarations: [ReportsComponent, MonthlyInflowOutflowReportComponent, AnnualInflowOutflowReportComponent, MonthlyAccumulationReportComponent, AnnualAccumulationReportComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ]
})
export class ReportsModule {
}
