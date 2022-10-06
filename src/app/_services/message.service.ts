import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { PaginatedResult } from '../_models/pagination';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { AddUpdateMessage } from '../_models/addUpdateMessage';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  getPaginatedMessages(page?: number,itemsPerPage?: number): Observable<PaginatedResult<Message[]>> {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
    let params = new HttpParams();
  
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    const sourceId = this.authService.getSourceFromStorage();
    return this.http.get<Message[]>(this.baseUrl  + `message/getMessagesDetails?sourceId=${sourceId}`, { observe: 'response', params}).pipe(
      map(response => {
        if(response != null)
          paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      })
    );
  }

  getMessage(Id: number):Observable<Message>{
    return this.http.get<Message>(this.baseUrl + `message/GetMessageDetails?messageId=${Id}`);
  }

  getAllMessages(sourceId: number): Observable<Message[]>{
    return this.http.get<Message[]>(this.baseUrl + `message/GetAllMessages?sourceId=${sourceId}`);
  }

  addOrUpdateMessage(message: AddUpdateMessage) {
    return this.http.post(this.baseUrl + 'message/addOrUpdateMessage', message);
  }

  deleteMessage(messageId: number) {
    return this.http.delete(this.baseUrl + `message/delete?messageId=${messageId}` , {});
  }
}
