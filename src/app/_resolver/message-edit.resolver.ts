import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';

@Injectable()
export class MessageEditResolver implements Resolve<Message> {
  constructor(
    private messageService: MessageService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.messageService.getMessage(route.params['id']).pipe(
      catchError((error) => {
        this.alertify.error('Problem retreiving data');
        this.router.navigate(['/messages']);
        return of(null);
      })
    );
  }
}
