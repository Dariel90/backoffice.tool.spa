import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SourceTopicDetails } from '../_models/sourceTopicDetails';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  baseUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  getSourceTopic(id: number):Observable<SourceTopicDetails>{
    return this.httpClient.get<SourceTopicDetails>(this.baseUrl + `source/getSourceTopicDetails?sourceId=${id}`);
  }
}
