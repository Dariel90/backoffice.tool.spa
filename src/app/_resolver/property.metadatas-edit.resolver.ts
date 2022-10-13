import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { PropertyMetadataService } from '../_services/property-metadata.service';
import { PropertyMetadataDetails } from '../_models/propertyMetadataDetails';

@Injectable()
export class PropertyMetadataEditResolver
  implements Resolve<PropertyMetadataDetails>
{
  constructor(
    private metadataService: PropertyMetadataService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.metadataService.getMetdata(route.params['id']).pipe(
      catchError((error) => {
        this.alertify.error('Problem retreiving data');
        this.router.navigate(['/properties/metadatas']);
        return of(null);
      })
    );
  }
}
