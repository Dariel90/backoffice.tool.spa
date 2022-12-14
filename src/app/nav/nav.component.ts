import { AlertifyService } from './../_services/alertify.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  protected model: any = {};
  protected sourceId: number;
  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const sourceId = this.authService.getSourceFromStorage();
    if(sourceId != 0)
      this.sourceId = sourceId as number;
  }

  login() {
    this.authService.login(this.model).subscribe(
      (next) => {
        this.sourceId = this.authService.sourceId;
        this.alertify.success('Logged Successfully');
      },
      (error) => {
        console.log(error);
        this.alertify.error(error);
      },
      () => {
        this.router.navigate(['/source/', this.authService.sourceId]);
      }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.alertify.message('Logged out');
    this.router.navigate(['/home']);
  }
}
