import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { PropertyService } from '../_services/property.service';
import { Property } from '../_models/property';
import { PaginatedResult } from '../_models/pagination';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class PropertyListResolver implements Resolve<PaginatedResult<Property[]>> {
  pageNumber = 1;
  pageSize = 5;

  constructor(private propertyService: PropertyService, private router: Router,
              private alertify: AlertifyService, private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<Property[]>> {
    const sourceId = this.authService.getSourceFromStorage()
    return this.propertyService.getProperties(sourceId,this.pageNumber, this.pageSize).pipe<PaginatedResult<Property[]>>(
      catchError<PaginatedResult<Property[]>,Observable<any>>(error => {
        this.alertify.error('Problem retreiving data');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }

}
