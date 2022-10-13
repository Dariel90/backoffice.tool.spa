import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AddUpdatePropertyMeta } from '../_models/addUpdatePropertyMeta';
import { Metadata } from '../_models/metadata';
import { PaginatedResult } from '../_models/pagination';
import { PropertyMetadataDetails } from '../_models/propertyMetadataDetails';

@Injectable({
  providedIn: 'root',
})
export class PropertyMetadataService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPropertiesMetadatas(
    sourceId: number,
    page?: number,
    itemsPerPage?: number
  ): Observable<PaginatedResult<PropertyMetadataDetails[]>> {
    const paginatedResult: PaginatedResult<PropertyMetadataDetails[]> =
      new PaginatedResult<PropertyMetadataDetails[]>();
    let params = new HttpParams();
    params = params.append('sourceId', sourceId);
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http
      .get<PropertyMetadataDetails[]>(
        this.baseUrl + 'propertyMetadata/GetPropertiesMetadatasList',
        { observe: 'response', params }
      )
      .pipe(
        map((response) => {
          if (response != null) paginatedResult.result = response.body!;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')!
            );
          }
          return paginatedResult;
        })
      );
  }

  getMetdata(propertyId: number): Observable<Metadata[]> {
    const result = this.http.get<Metadata[]>(
      this.baseUrl +
        `propertymetadata/GetPropertyMetadataDetails?propertyMetadataId=${propertyId}`
    );
    return result;
  }

  addOrUpdatePropertyMetadata(propertyMeta: AddUpdatePropertyMeta) {
    return this.http.post(
      this.baseUrl + 'propertymetadata/AddOrUpdatePropertyMetadata',
      propertyMeta
    );
  }

  deleteMetadataProperty(metadataId: number) {
    return this.http.delete(
      this.baseUrl + `propertymetadata/Delete?PropertyMetadataId=${metadataId}`,
      {}
    );
  }
}
