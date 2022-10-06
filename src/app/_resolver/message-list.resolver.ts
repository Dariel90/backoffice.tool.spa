import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { PropertyService } from '../_services/property.service';
import { Property } from '../_models/property';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';

@Injectable()
export class MessageListResolver implements Resolve<PaginatedResult<Message[]>> {
  pageNumber = 1;
  pageSize = 5;

  constructor(private propertyService: MessageService, private router: Router,
              private alertify: AlertifyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<Message[]>> {
    return this.propertyService.getPaginatedMessages(this.pageNumber, this.pageSize).pipe<PaginatedResult<Message[]>>(
      catchError<PaginatedResult<Message[]>,Observable<any>>(error => {
        this.alertify.error('Problem retreiving data');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }

}
