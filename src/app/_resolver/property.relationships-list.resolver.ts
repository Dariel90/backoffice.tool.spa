import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Property } from '../_models/property';
import { PaginatedResult } from '../_models/pagination';
import { AuthService } from '../_services/auth.service';
import { SourceRelationshipDetails } from '../_models/propertiesRelationshipDetails';
import { PropertyRelationService } from '../_services/property-relation.service';

@Injectable()
export class PropertyRelationshipListResolver
  implements Resolve<PaginatedResult<SourceRelationshipDetails[]>>
{
  private pageNumber = 1;
  private pageSize = 5;

  constructor(
    private propertyRealtionService: PropertyRelationService,
    private router: Router,
    private alertify: AlertifyService,
    private authService: AuthService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<PaginatedResult<SourceRelationshipDetails[]>> {
    return this.propertyRealtionService
      .getPropertiesRelationship(this.pageNumber, this.pageSize)
      .pipe<PaginatedResult<SourceRelationshipDetails[]>>(
        catchError<PaginatedResult<SourceRelationshipDetails[]>, Observable<any>>((error) => {
          this.alertify.error('Problem retreiving data');
          this.router.navigate(['/home']);
          return of(null);
        })
      );
  }
}
