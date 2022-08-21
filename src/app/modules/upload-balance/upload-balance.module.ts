import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadBalanceComponent} from "./upload-balance.component";
import {UploadBalanceRoutingModule} from "./upload-balance-routing.module";

@NgModule({
  declarations: [UploadBalanceComponent],
  imports: [
    CommonModule,
    UploadBalanceRoutingModule
  ]
})
export class UploadBalanceModule {
}
