import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class DailyGateIncomeService {

  constructor(private http: HttpClient) { }

  getDailyGateIncomeList() {
    return this.http.get<any>(`${environment.baseUrl}/api/DailyAcc/GetDailyGateIncomeList`);
  }

  createDailyGateIncome(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/DailyAcc/CreateDailyGateIncome`, data, httpOptions);
  }

  updateDailyGateIncome(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/DailyAcc/UpdateDailyGateIncome`, data, httpOptions);
  }

  deleteDailyGateIncome(id: any) {
    return this.http.delete<any>(`${environment.baseUrl}/api/DailyAcc/DeleteDailyGateIncome/${id}`, httpOptions);
  }

  getActiveGate() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetActiveGate`);
  }

  getActiveIncomeType() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetActiveIncomeType`);
  }


}

