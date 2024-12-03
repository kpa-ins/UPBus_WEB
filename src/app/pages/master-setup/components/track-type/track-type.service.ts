import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class TrackTypeService {

  constructor(private http: HttpClient) { }

  getTrackTypeList() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetTrackTypeList`);
  }

  saveTrackType(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/MasterSetup/SaveTrackType`, data, httpOptions);
  }

  updateTrackType(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/MasterSetup/UpdateTrackType`, data, httpOptions);
  }

  deleteTrackType(id: string) {
    return this.http.delete<any>(`${environment.baseUrl}/api/MasterSetup/DeleteTrackType/${id}`, httpOptions);
  }
}
