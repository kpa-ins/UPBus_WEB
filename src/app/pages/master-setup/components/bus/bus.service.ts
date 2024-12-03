import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class BusService {
  constructor(private http: HttpClient) { }

  getBusList() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetBusList`);
  }

  createBus(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/MasterSetup/CreateBus`, data, httpOptions);
  }

  updateBus(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/MasterSetup/UpdateBus`, data, httpOptions);
  }

  deleteBus(id: any) {
    return this.http.delete<any>(`${environment.baseUrl}/api/MasterSetup/DeleteBus/${id}`, httpOptions);
  }
}
