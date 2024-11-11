import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponseDto } from '../interfaces/auth-response-dto';
import { UserForAuthenticationDto } from '../interfaces/user-for-authentication-dto';
import { ResetPasswordDto } from '../interfaces/reset-password-dto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authChangeSub = new Subject<boolean>()
  public authChanged = this.authChangeSub.asObservable();

  //constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }
  constructor(private http: HttpClient) { }

  private jwtHelper = new JwtHelperService();

  sendAuthStateChangeNotification (isAuthenticated: boolean) {
    this.authChangeSub.next(isAuthenticated);
  }

  isUserAuthenticated (): boolean {
    const token = localStorage.getItem("token");
    return token != null && !this.jwtHelper.isTokenExpired(token);
    return true;
  }

  getCurrentUser() {
    const token = localStorage.getItem("token") || '';
    const decodedToken = this.jwtHelper.decodeToken(token);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    const email = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
    const user = {
      name: name,
      email: email,
      role: role
    };
    return user;
  }


  getRoleList(){
    return this.http.get<any>(`${environment.baseUrl}/api/Account/GetRoleList`);
  }

  loginUser (body: UserForAuthenticationDto) {
    console.log(environment.baseUrl);
    return this.http.post<AuthResponseDto>(`${environment.baseUrl}/api/Account/Login`, body);
  }

  resetPassword (body: ResetPasswordDto) {
    return this.http.post(`${environment.baseUrl}/api/Account/ResetPassword`, body, httpOptions);
  }

  getUserList() {
    return this.http.get<any>(`${environment.baseUrl}/api/Account/GetUserList`);
  }

  createUser(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/api/Account/RegisterUser`, data, httpOptions);
  }

  deleteUser(id: any) {
    return this.http.delete<any>(`${environment.baseUrl}/api/Account/DeleteUser/${id}`, httpOptions);
  }

}
