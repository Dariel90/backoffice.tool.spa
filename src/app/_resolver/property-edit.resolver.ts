import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { PropertyService } from '../_services/property.service';

@Injectable()
export class PropertyEditResolver implements Resolve<Message> {
  constructor(
    private propertyService: PropertyService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.propertyService.getProperty(route.params['id']).pipe(
      catchError((error) => {
        this.alertify.error('Problem retreiving data');
        this.router.navigate(['/properties']);
        return of(null);
      })
    );
  }
}
