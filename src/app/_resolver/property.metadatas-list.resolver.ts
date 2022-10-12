import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Property } from '../_models/property';
import { PaginatedResult } from '../_models/pagination';
import { AuthService } from '../_services/auth.service';
import { PropertyMetadataService } from '../_services/property-metadata.service';
import { PropertyMetadataDetails } from '../_models/propertyMetadataDetails';

@Injectable()
export class PropertiesMetadataListResolver implements Resolve<PaginatedResult<PropertyMetadataDetails[]>> {
  pageNumber = 1;
  pageSize = 5;

  constructor(private propertyService: PropertyMetadataService, private router: Router,
              private alertify: AlertifyService, private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<PropertyMetadataDetails[]>> {
    const sourceId = this.authService.getSourceFromStorage()
    return this.propertyService.getPropertiesMetadatas(sourceId,this.pageNumber, this.pageSize).pipe<PaginatedResult<PropertyMetadataDetails[]>>(
      catchError<PaginatedResult<PropertyMetadataDetails[]>,Observable<any>>(error => {
        this.alertify.error('Problem retreiving data');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }

}
