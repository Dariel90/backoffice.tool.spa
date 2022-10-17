import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AddUpdatePropertyRelationship } from '../_models/addUpdatePropertyRelationship';
import { PaginatedResult } from '../_models/pagination';
import { SourceRelationshipDetails } from '../_models/propertiesRelationshipDetails';

@Injectable({
  providedIn: 'root'
})
export class PropertyRelationService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getPropertiesRelationship(
    page?: number,
    itemsPerPage?: number
  ): Observable<PaginatedResult<SourceRelationshipDetails[]>> {
    const paginatedResult: PaginatedResult<SourceRelationshipDetails[]> =
      new PaginatedResult<SourceRelationshipDetails[]>();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http
      .get<SourceRelationshipDetails[]>(
        this.baseUrl + 'propertyRelationship/GetPropertiesRelationshipPaginatedList',
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

  getPropertyRelationshipDetail(relationshipId: number): Observable<SourceRelationshipDetails> {
    const result = this.http.get<SourceRelationshipDetails>(
      this.baseUrl +
        `admin/GetPropertyRelationshipDetails?relationshipId=${relationshipId}`
    );
    return result;
  }

  addOrUpdatePropertyRelationship(relation: AddUpdatePropertyRelationship) {
    return this.http.post(
      this.baseUrl + 'admin/AddOrUpdateSourcesRelationshipByProperty',
      relation
    );
  }

  deleteRelationship(relationshipId: number) {
    return this.http.delete(
      this.baseUrl + `admin/DeletePropertyRelationship?RelationshipId=${relationshipId}`,
      {}
    );
  }
}
