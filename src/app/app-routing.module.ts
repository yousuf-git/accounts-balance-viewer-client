import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {Routes as RouteKeys, UserRole} from "./core/constants";
import {AuthGuard} from "./core/guards/auth.guard";

const routes: Routes = [
  {
    path: RouteKeys.Auth,
    loadChildren: () => import('./modules/auth/auth.module').then(mod => mod.AuthModule),
  },
  {
    path: RouteKeys.Overview,
    loadChildren: () => import('./modules/view-balance/view-balance.module').then(mod => mod.ViewBalanceModule),
    canActivate: [AuthGuard],
    data: {
      uiText: 'Overview',
      roles: [UserRole.User, UserRole.Admin]
    }
  },
  {
    path: RouteKeys.UploadBalances,
    loadChildren: () => import('./modules/upload-balance/upload-balance.module').then(mod => mod.UploadBalanceModule),
    canActivate: [AuthGuard],
    data: {
      uiText: 'Upload Balances',
      roles: [UserRole.Admin]
    }
  },
  {
    path: RouteKeys.Reports,
    loadChildren: () => import('./modules/reports/reports.module').then(mod => mod.ReportsModule),
    canActivate: [AuthGuard],
    data: {
      uiText: 'Reports',
      roles: [UserRole.Admin]
    }
  },
  {
    path: '',
    redirectTo: RouteKeys.Auth,
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
