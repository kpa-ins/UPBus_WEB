import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class GateService {
  constructor(private http: HttpClient) { }

  getGateList() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetGateList`);
  }

  createGate(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/MasterSetup/CreateGate`, data, httpOptions);
  }

  updateGate(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/MasterSetup/UpdateGate`, data, httpOptions);
  }

  deleteGate(id: string) {
    return this.http.delete<any>(`${environment.baseUrl}/api/MasterSetup/DeleteGate/${id}`, httpOptions);
  }

}
