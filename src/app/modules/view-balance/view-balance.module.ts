import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewBalanceComponent} from "./view-balance.component";
import {ViewBalanceRoutingModule} from "./view-balance-routing.module";
import {MatCardModule} from "@angular/material/card";

@NgModule({
  declarations: [ViewBalanceComponent],
  imports: [
    CommonModule,
    ViewBalanceRoutingModule,
    MatCardModule
  ]
})
export class ViewBalanceModule {
}
