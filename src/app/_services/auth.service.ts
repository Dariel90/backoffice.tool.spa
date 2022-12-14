import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { User } from '../_models/user';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LoginDto } from '../_models/loginDto';
import * as moment from 'moment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LogedUserInfo, LoginResultDto } from '../_models/loginResultDto';
import { RegisterUserDto } from '../_models/registerUserDto';
import { UserDetailsResponse } from '../_models/registerResultDto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected baseUrl = environment.apiUrl + 'auth/';
  protected jwtHepler = new JwtHelperService();
  public decodedToken: any;
  public sourceId: number;
  protected nameid: number;
  protected user: User;
  public logedUser: LogedUserInfo;

  constructor(private http: HttpClient) {}

  login(model: LoginDto) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          this.setSession(response);
        }
      }),catchError((error) => {
        console.log(error)
        return of(error.error);
      })
    );
  }
  private setSession(authResult: any) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    this.decodedToken = this.jwtHepler.decodeToken(authResult.token);
    this.logedUser = authResult.user;
    this.sourceId = authResult.user.sourceId;
    this.nameid = this.decodedToken.nameid;
  }

  getSourceFromStorage(): number {
    const usrStr = this.getUser() as string;
    if(usrStr == "" || usrStr == null) return 0;
    const user = JSON.parse(usrStr);
    return user.sourceId as number;
  }

  register(user: RegisterUserDto) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  loggedIn(): boolean {
    const token = localStorage.getItem('token');
    const jwtToken = this.decodedToken;
    if (jwtToken == null) return false;
    var current_time = new Date().getTime() / 1000;
    if (current_time > jwtToken.exp) return false;
    return true;
  }

  logout() {
    localStorage.removeItem('token');
  }

  roleMatch(allowedRoles: any[]): boolean {
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach((element) => {
      if (userRoles.includes(element)) {
        isMatch = true;
        return;
      }
    });
    return isMatch;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    return localStorage.getItem('user');
  }
}
