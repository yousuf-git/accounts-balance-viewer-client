import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadBalanceComponent} from "./upload-balance.component";
import {UploadBalanceRoutingModule} from "./upload-balance-routing.module";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [UploadBalanceComponent],
  imports: [
    CommonModule,
    UploadBalanceRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class UploadBalanceModule {
}
