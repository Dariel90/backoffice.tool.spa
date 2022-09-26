import { Injectable } from '@angular/core';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Source } from '../_models/source';

@Injectable({
  providedIn: 'root'
})
export class SourceService {
  baseUrl = environment.apiUrl;
constructor(private http: HttpClient) { }

  addOrUpdateSource(source: Source) {
    return this.http.post(this.baseUrl + 'source/AddOrUpdateSource', source);
  }

  getSource(Id: number){
    return this.http.get(this.baseUrl + `source/GetSourceDetails?Id=${Id}`);
  }
}
