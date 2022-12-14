import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpInterceptor,
    HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AlertifyService } from './alertify.service';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Injectable } from '@angular/core';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private alertifyService: AlertifyService) { }
    
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = `Error: ${error.error.message}`;
                    } else {
                        // server-side error
                        errorMessage = `Error Status: ${error.status}\nMessage: ${error.error.error}`;
                    }
                    this.alertifyService.error(errorMessage);
                    return throwError(errorMessage);
                })
            )
    }
}