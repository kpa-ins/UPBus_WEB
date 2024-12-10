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
export class BusExpenseService {

  constructor(private http: HttpClient) { }

  getActiveExpenseType() {
    const expenseType="BUS";
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetActiveExpenseType/?type=${expenseType}`);
  }

  getBusExpenseList() {
    return this.http.get<any>(`${environment.baseUrl}/api/DailyAcc/GetBusExpenseList`);
  }

  getBusData(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/api/MasterSetup/GetBusData`);
  }

  createBusExpense(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/DailyAcc/CreateBusExpense`, data, httpOptions);
  }

  updateBusExpense(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/DailyAcc/UpdateBusExpense`, data, httpOptions);
  }

  deleteBusExpense(id: any) {
    return this.http.delete<any>(`${environment.baseUrl}/api/DailyAcc/DeleteBusExpense/${id}`, httpOptions);
  }

}
