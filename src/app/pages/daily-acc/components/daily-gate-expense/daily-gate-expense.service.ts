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
export class DailyGateExpenseService {

  constructor(private http: HttpClient) { }

  getDailyGateExpenseList() {
    return this.http.get<any>(`${environment.baseUrl}/api/DailyAcc/GetDailyGateExpenseList`);
  }

  createDailyGateExpense(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/DailyAcc/CreateDailyGateExpense`, data, httpOptions);
  }

  updateDailyGateExpense(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/DailyAcc/UpdateDailyGateExpense`, data, httpOptions);
  }

  deleteDailyGateExpense(id: any) {
    return this.http.delete<any>(`${environment.baseUrl}/api/DailyAcc/DeleteDailyGateExpense/${id}`, httpOptions);
  }

  getActiveGate() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetActiveGate`);
  }

  getActiveExpenseType() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetActiveExpenseType`);
  }


}

