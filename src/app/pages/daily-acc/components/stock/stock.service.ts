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
export class StockService {

  constructor(private http: HttpClient) { }

  getStockMainList() {
    return this.http.get<any>(`${environment.baseUrl}/api/DailyAcc/GetStockMainList`);
  }

  getBusList() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetBusList`);
  }

  createStockMain(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/DailyAcc/CreateStockMain`, data, httpOptions);
  }

  updateStockMain(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/DailyAcc/UpdateStockMain`, data, httpOptions);
  }

  deleteStockMain(id: any) {
    return this.http.delete<any>(`${environment.baseUrl}/api/DailyAcc/DeleteStockMain/${id}`, httpOptions);
  }

  getStockMainById(id: string) {
    return this.http.get<any>(`${environment.baseUrl}/api/DailyAcc/GetStockMainById/?id=${id}`);
  }


  getStockHistoryList(id: any, type: any, busNo: any) {
    return this.http.get<any>(`${environment.baseUrl}/api/DailyAcc/GetStockHistoryList/?id=${id}&stockType=${type}&busNo=${busNo}`);
  }

  createStockHistory(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/DailyAcc/CreateStockHistory`, data, httpOptions);
  }

  updateStockHistory(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/DailyAcc/UpdateStockHistory`, data, httpOptions);
  }

  cancelStockHistory(id: any) {
    return this.http.delete<any>(`${environment.baseUrl}/api/DailyAcc/CancelStockHistory/${id}`, httpOptions);
  }




}
