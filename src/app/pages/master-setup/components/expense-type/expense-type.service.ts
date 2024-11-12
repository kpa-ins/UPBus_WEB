import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class ExpenseTypeService {
  constructor(private http: HttpClient) { }

  getExpenseTypeList() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetExpenseTypeList`);
  }

  saveExpenseType(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/MasterSetup/SaveExpenseType`, data, httpOptions);
  }

  updateExpenseType(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/MasterSetup/UpdateExpenseType`, data, httpOptions);
  }

  deleteExpenseType(id: string) {
    return this.http.delete<any>(`${environment.baseUrl}/api/MasterSetup/DeleteExpenseType/${id}`, httpOptions);
  }

}
