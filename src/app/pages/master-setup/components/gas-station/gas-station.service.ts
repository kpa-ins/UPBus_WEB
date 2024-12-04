import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class GasStationService {

  constructor(private http: HttpClient) { }

  getGasStationList() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetGasStationList`);
  }

  createGasStation(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/MasterSetup/CreateGasStation`, data, httpOptions);
  }

  updateGasStation(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/MasterSetup/UpdateGasStation`, data, httpOptions);
  }

  deleteGasStation(id: any) {
    return this.http.delete<any>(`${environment.baseUrl}/api/MasterSetup/DeleteGasStation/${id}`, httpOptions);
  }
}
