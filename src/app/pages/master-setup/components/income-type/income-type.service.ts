import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class IncomeTypeService {
  constructor(private http: HttpClient) { }

  getIncomeTypeList(incomeType: any) {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetIncomeTypeList/?incomeType=${incomeType}`);
  }

  saveIncomeType(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/MasterSetup/SaveIncomeType`, data, httpOptions);
  }

  updateIncomeType(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/MasterSetup/UpdateIncomeType`, data, httpOptions);
  }

  deleteIncomeType(id: string) {
    return this.http.delete<any>(`${environment.baseUrl}/api/MasterSetup/DeleteIncomeType/${id}`, httpOptions);
  }

}
