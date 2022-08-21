import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ViewBalanceComponent} from "./view-balance.component";

const routes: Routes = [
  {
    path: "",
    component: ViewBalanceComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewBalanceRoutingModule {
}
