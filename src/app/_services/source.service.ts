import { Injectable } from '@angular/core';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Source } from '../_models/source';
import { AddUpdateSource } from '../_models/addUpdateSource';

@Injectable({
  providedIn: 'root',
})
export class SourceService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  addOrUpdateSource(source: AddUpdateSource) {
    return this.http.post(this.baseUrl + 'source/AddOrUpdateSource', source);
  }

  getAllSources(){
    return this.http.get<Source[]>(
      this.baseUrl + `source/GetAllSources?`
    );
  }

  getSource(Id: number): Observable<Source> {
    return this.http.get<Source>(
      this.baseUrl + `source/GetSourceDetails?Id=${Id}`
    );
  }
}
