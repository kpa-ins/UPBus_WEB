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
export class DailyGateAccService {

  constructor(private http: HttpClient) { }

  getDailyGateAccList() {
    return this.http.get<any>(`${environment.baseUrl}/api/DailyAcc/GetDailyGateAccList`);
  }

  createDailyGateAcc(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/DailyAcc/CreateDailyGateAcc`, data, httpOptions);
  }

  updateDailyGateAcc(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/DailyAcc/UpdateDailyGateAcc`, data, httpOptions);
  }

  deleteDailyGateAcc(gate: any, date: any) {
    return this.http.delete<any>(`${environment.baseUrl}/api/DailyAcc/DeleteDailyGateAcc/?gate=${gate}&date=${date}`, httpOptions);
  }

  getActiveGate() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetActiveGate`);
  }


}
