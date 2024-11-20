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
export class DailyPlanService {
  constructor(private http: HttpClient) { }

  getDailyPlanList() {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetDailyPlanList`);
  }

  getDriverByBusNo(busNo: string) {
    return this.http.get<any>(`${environment.baseUrl}/api/MasterSetup/GetDriverByBusNo?busNo=${busNo}`);
  }

  getTripCodes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/api/MasterSetup/GetTripCodes`);
  }

  getBusList(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/api/MasterSetup/GetBusLists`);
  }

  saveDailyPlan(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/MasterSetup/SaveDailyPlan`, data, httpOptions);
  }

  updateDailyPlan(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/api/MasterSetup/UpdateDailyPlan`, data, httpOptions);
  }

  deleteDailyPlans(id: string) {
    return this.http.delete<any>(`${environment.baseUrl}/api/MasterSetup/DeleteDailyPlan/${id}`, httpOptions);
  }

}
