import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }

  getStationList() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetStationList`);
  }

  createStation(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/MasterSetup/CreateStation`, data, httpOptions);
  }

  updateStation(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/MasterSetup/UpdateStation`, data, httpOptions);
  }

  deleteStation(id: any) {
    return this.http.delete<any>(`${environment.baseUrl}/api/MasterSetup/DeleteStation/${id}`, httpOptions);
  }
}
