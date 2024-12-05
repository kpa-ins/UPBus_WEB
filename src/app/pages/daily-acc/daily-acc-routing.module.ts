import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyGateAccComponent } from './components/daily-gate-acc/daily-gate-acc.component';
import { DailyGateExpenseComponent } from './components/daily-gate-expense/daily-gate-expense.component';
import { DailyGateIncomeComponent } from './components/daily-gate-income/daily-gate-income.component';
import { TripAccComponent } from './components/trip-acc/trip-acc.component';
import { TripExpenseComponent } from './components/trip-expense/trip-expense.component';
import { TripIncomeComponent } from './components/trip-income/trip-income.component';
const routes: Routes = [
  { path: 'daily-gate-acc', component: DailyGateAccComponent },
  { path: 'daily-gate-expense', component: DailyGateExpenseComponent },
  { path: 'daily-gate-income', component: DailyGateIncomeComponent },
  { path: 'trip-acc', component: TripAccComponent },
  { path: 'trip-expense', component: TripExpenseComponent },
  { path: 'trip-income', component: TripIncomeComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyAccRoutingModule { }
