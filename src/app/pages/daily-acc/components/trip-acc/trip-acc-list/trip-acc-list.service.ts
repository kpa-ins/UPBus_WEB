import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class TripAccListService {

  constructor(private http: HttpClient) { }

  getTripAccList() {
    return this.http.get<any>(`${environment.baseUrl}/api/DailyAcc/GetTripAccList`);
  }

  getTripAccById(id: string) {
    return this.http.get<any>(`${environment.baseUrl}/api/DailyAcc/GetTripAccById/${id}`);
  }

  createTripAcc(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/DailyAcc/CreateTripAcc`, data, httpOptions);
  }

  updateTripAcc(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/DailyAcc/UpdateTripAcc`, data, httpOptions);
  }

  deleteTripAcc(id: any) {
    return this.http.delete<any>(`${environment.baseUrl}/api/DailyAcc/DeleteTripAcc/${id}`, httpOptions);
  }


  getBusData(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/api/MasterSetup/GetBusData`);
  }

  getActiveGate() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetActiveGate`);
  }

}
