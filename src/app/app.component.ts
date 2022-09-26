import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/user';
import { LogedUserInfo } from './_models/loginResultDto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jwtHepler = new JwtHelperService();
  title = 'backoffice.tool.spa';

  constructor(private authservice: AuthService) {}
  ngOnInit() {
    const token = localStorage.getItem('token');
    const tokenUser = localStorage.getItem('user');
    var user: LogedUserInfo;
    if(tokenUser){
      user = JSON.parse(tokenUser);
      if (user) {
        this.authservice.logedUser = user;
      }
    }      
    if (token) {
      this.authservice.decodedToken = this.jwtHepler.decodeToken(token);
    }
    
  }
}
