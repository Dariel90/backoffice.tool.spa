import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { SourceService } from '../_services/source.service';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Source } from '../_models/source';

@Injectable()
export class SourceDetailsResolver implements Resolve<Source> {
  constructor(
    private sourceService: SourceService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.sourceService.getSource(route.params['id']).pipe(
      catchError((error) => {
        this.alertify.error('Problem retreiving data');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}
