import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ReportsComponent} from "./reports.component";
import {InflowOutflowReportsComponent} from "./inflow-outflow-reports/inflow-outflow-reports.component";

const routes: Routes = [
  {
    path: "",
    component: ReportsComponent,
    children: [
      {
        path: "inflow-outflow",
        component: InflowOutflowReportsComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {
}
