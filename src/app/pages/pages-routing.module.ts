import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';


const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: DefaultComponent
  },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'master-setup', loadChildren: () => import('./master-setup/master-setup.module').then(m => m.MasterSetupModule) },
  { path: 'daily-acc', loadChildren: () => import('./daily-acc/daily-acc.module').then(m => m.DailyAccModule) },
  { path: 'accounts', loadChildren: () => import('../pages/accounts/accounts.module').then(m => m.AccountsModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
