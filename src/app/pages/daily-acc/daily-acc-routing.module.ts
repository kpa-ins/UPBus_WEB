import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyGateAccComponent } from './components/daily-gate-acc/daily-gate-acc.component';
import { DailyGateExpenseComponent } from './components/daily-gate-expense/daily-gate-expense.component';
import { DailyGateIncomeComponent } from './components/daily-gate-income/daily-gate-income.component';
import { TripExpenseComponent } from './components/trip-expense/trip-expense.component';
import { TripIncomeComponent } from './components/trip-income/trip-income.component';
import { TripAccListComponent } from './components/trip-acc/trip-acc-list/trip-acc-list.component';
import { TripAccFormComponent } from './components/trip-acc/trip-acc-form/trip-acc-form.component';
const routes: Routes = [
  { path: 'daily-gate-acc', component: DailyGateAccComponent },
  { path: 'daily-gate-expense', component: DailyGateExpenseComponent },
  { path: 'daily-gate-income', component: DailyGateIncomeComponent },
  { path: 'trip-expense', component: TripExpenseComponent },
  { path: 'trip-income', component: TripIncomeComponent },
  { path: 'trip-acc-list', component: TripAccListComponent },
  { path: 'trip-acc-form', component: TripAccFormComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyAccRoutingModule { }
