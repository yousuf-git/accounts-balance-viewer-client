import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {UploadBalanceComponent} from "./upload-balance.component";

const routes: Routes = [
  {
    path: "",
    component: UploadBalanceComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadBalanceRoutingModule {
}
