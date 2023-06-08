import { catchError } from 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import {LoginRequest, LoginResponse} from '../interfaces/Ilogin';
import {User} from '../interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  logged$ = new BehaviorSubject(false);
  
  private REST_API_SERVER = 'http://localhost:8080';

  private user: User;

  constructor(private httpClient: HttpClient) {
  }


  // Lấy user hiện tại
  getUserCurrent(): User {
    this.user = JSON.parse(localStorage.getItem('userCurrent'));
    return this.user;
  }

  //Logout
  logout(): void{
    localStorage.removeItem('token');
    localStorage.removeItem('userCurrent');
    this.user = null;
  }

  public login(data: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.REST_API_SERVER}/login`, data);
  }

  // Update user
  public updateUser(user: any): Observable<LoginResponse> {
    const url= `${this.REST_API_SERVER}/user`;
    return this.httpClient.put<LoginResponse>(url, user)
  }

  // Đăng ký user
  public addUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.REST_API_SERVER}/user`, user);
  }
}
