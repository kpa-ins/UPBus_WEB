import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class TripTypeService {
  constructor(private http: HttpClient) { }

  getTripTypeList() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetTripTypeList`);
  }

  saveTripType(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/MasterSetup/SaveTripType`, data, httpOptions);
  }

  updateTripType(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/MasterSetup/UpdateTripType`, data, httpOptions);
  }

  deleteTripType(id: string) {
    return this.http.delete<any>(`${environment.baseUrl}/api/MasterSetup/DeleteTripType/${id}`, httpOptions);
  }

}
