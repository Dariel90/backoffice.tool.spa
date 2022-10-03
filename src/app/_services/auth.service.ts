import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';
import { LoginDto } from '../_models/loginDto';
import * as moment from 'moment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LogedUserInfo, LoginResultDto } from '../_models/loginResultDto';
import { RegisterUserDto } from '../_models/registerUserDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.apiUrl + 'auth/';
  jwtHepler = new JwtHelperService();
  decodedToken: any;
  sourceId: number;
  nameid: number;
  user: User;
  logedUser: LogedUserInfo;

constructor(private http: HttpClient) {}

login(model: LoginDto) {
  return this.http.post(this.baseUrl + 'login', model)
  .pipe(
    map((response: any) => {
      const user = response;
      console.log(response);
      if (user) {
        this.setSession(response);
      }      
    })
  );
}
private setSession(authResult: any) {
  const expiresAt = moment().add(authResult.expiresIn,'second');
  localStorage.setItem('token', authResult.token);
  localStorage.setItem('user', JSON.stringify(authResult.user));
  localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  this.decodedToken = this.jwtHepler.decodeToken(authResult.token);
  this.logedUser = authResult.user;
  this.sourceId = authResult.user.sourceId;
  this.nameid = this.decodedToken.nameid;
}  

getSourceFromStorage():number{
  const user = JSON.parse(this.getUser() as string);
  return user.sourceId as number;
}


register(user: RegisterUserDto) {
  return this.http.post(this.baseUrl + 'register', user);
}

loggedIn() {
  const token = localStorage.getItem('token');
  const jwtToken = this.decodedToken;
  if(jwtToken == null) return false;
  var current_time = new Date().getTime() / 1000;
  if (current_time > jwtToken.exp)
    return false;
  return true;
}

logout() {
  localStorage.removeItem('token');
}

roleMatch(allowedRoles: any[]): boolean {
  let isMatch = false;
  const userRoles = this.decodedToken.role as Array<string>;
  allowedRoles.forEach(element => {
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
