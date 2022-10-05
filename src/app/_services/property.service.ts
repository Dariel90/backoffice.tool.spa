import { Injectable } from '@angular/core';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Property } from '../_models/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getProperties(sourceId: number, page?: number,itemsPerPage?: number): Observable<PaginatedResult<Property[]>> {
    const paginatedResult: PaginatedResult<Property[]> = new PaginatedResult<Property[]>();
    let params = new HttpParams();
    params = params.append('sourceId', sourceId);
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Property[]>(this.baseUrl  + 'property/GetPropertiesDetails', { observe: 'response', params}).pipe(
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

  deleteProperty(propertyId: number) {
    return this.http.delete(this.baseUrl + `property/delete?propertyId=${propertyId}` , {});
  }
}