import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { PropertyMetadataDetails } from 'src/app/_models/propertyMetadataDetails';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PropertyMetadataService } from 'src/app/_services/property-metadata.service';
import { defaultPagination, numberToTypeMap } from 'src/app/_utils/utils';
@Component({
  selector: 'app-property.metadata-list',
  templateUrl: './property.metadata-list.component.html',
  styleUrls: ['./property.metadata-list.component.css'],
})
export class PropertyMetadataListComponent implements OnInit {
  protected properties: PropertyMetadataDetails[];
  private pagination: Pagination;
  protected page = defaultPagination.page;
  protected count = defaultPagination.count;
  protected tableSize: number = defaultPagination.tableSize;
  protected tableSizes = defaultPagination.tableSizes;

  constructor(
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private propertyMetadataService: PropertyMetadataService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.properties = data['properties'].result;
      this.pagination = data['properties'].pagination;
      this.page = this.pagination.currentPage;
      this.count = this.pagination.totalItems;
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.pagination.currentPage = event;
    this.loadProperties();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.pagination.itemsPerPage = event.target.value;
    this.page = 1;
    this.loadProperties();
  }

  loadProperties() {
    const sourceId = this.authService.getSourceFromStorage();
    this.propertyMetadataService
      .getPropertiesMetadatas(
        sourceId,
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .subscribe(
        (response: PaginatedResult<PropertyMetadataDetails[]>) => {
          this.properties = response.result;
          this.pagination = response.pagination;
          this.page = response.pagination.currentPage;
          this.count = response.pagination.totalItems;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  getTypeByNumber(type: number) {
    return numberToTypeMap(type);
  }

  removePropertyMeta(propertyId: number) {
    this.propertyMetadataService.deleteMetadataProperty(propertyId).subscribe(
      () => {
        this.alertify.success('The metadata has been deleted succesfully');
      },
      (error) => {
        this.alertify.error('Failed to delete the metadata');
      }
    );
  }
}
