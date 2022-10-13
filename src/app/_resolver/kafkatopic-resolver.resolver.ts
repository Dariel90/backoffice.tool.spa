import { AuthService } from '../_services/auth.service';
import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { TopicService } from '../_services/topic.service';

@Injectable()
export class KafkaTopicResolver implements Resolve<Message> {
  constructor(
    private messageService: TopicService,
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const sourceId = this.authService.getSourceFromStorage();
    return this.messageService.getSourceTopic(sourceId).pipe(
      catchError((error) => {
        this.alertify.error('Problem retreiving data');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}
