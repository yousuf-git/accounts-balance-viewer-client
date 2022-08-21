import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewBalanceComponent} from "./view-balance.component";
import {ViewBalanceRoutingModule} from "./view-balance-routing.module";

@NgModule({
  declarations: [ViewBalanceComponent],
  imports: [
    CommonModule,
    ViewBalanceRoutingModule
  ]
})
export class ViewBalanceModule {
}
