import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReportsComponent} from "./reports.component";
import {ReportsRoutingModule} from "./reports-routing.module";
import {MatCardModule} from "@angular/material/card";
import {InflowOutflowReportsComponent} from './inflow-outflow-reports/inflow-outflow-reports.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";

@NgModule({
  declarations: [ReportsComponent, InflowOutflowReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule
  ]
})
export class ReportsModule {
}
