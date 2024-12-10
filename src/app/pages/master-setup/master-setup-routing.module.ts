import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { BusComponent } from './components/bus/bus.component';
import { GateComponent } from './components/gate/gate.component';
import { DailyPlanComponent } from './components/daily-plan/daily-plan.component';
import { ExpenseTypeComponent } from './components/expense-type/expense-type.component';
import { IncomeTypeComponent } from './components/income-type/income-type.component';
import { TrackTypeComponent } from './components/track-type/track-type.component';
import { GasStationComponent } from './components/gas-station/gas-station.component';


const routes: Routes = [
  { path: 'bus', component: BusComponent },
  { path: 'gate', component: GateComponent },
  { path: 'daily-plan', component: DailyPlanComponent },
  { path: 'expense-type', component: ExpenseTypeComponent },
  { path: 'income-type', component: IncomeTypeComponent },
  { path: 'track-type', component: TrackTypeComponent },
  { path: 'gas-station', component: GasStationComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterSetupRoutingModule { }
