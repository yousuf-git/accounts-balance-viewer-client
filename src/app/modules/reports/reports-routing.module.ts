import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ReportsComponent} from "./reports.component";
import {
  MonthlyInflowOutflowReportComponent
} from "./monthly-inflow-outflow-report/monthly-inflow-outflow-report.component";
import {
  AnnualInflowOutflowReportComponent
} from "./annual-inflow-outflow-report/annual-inflow-outflow-report.component";
import {MonthlyAccumulationReportComponent} from "./monthly-accumulation-report/monthly-accumulation-report.component";
import {AnnualAccumulationReportComponent} from "./annual-accumulation-report/annual-accumulation-report.component";

const routes: Routes = [
  {
    component: ReportsComponent,
    path: "",
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "monthly-inflow-outflow"
      },
      {
        path: "monthly-inflow-outflow",
        component: MonthlyInflowOutflowReportComponent
      },
      {
        path: "annual-inflow-outflow",
        component: AnnualInflowOutflowReportComponent
      },
      {
        path: "monthly-accumulation",
        component: MonthlyAccumulationReportComponent
      },
      {
        path: "annual-accumulation",
        component: AnnualAccumulationReportComponent
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {
}
