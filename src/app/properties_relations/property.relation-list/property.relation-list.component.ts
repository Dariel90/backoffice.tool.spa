import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { SourceRelationshipDetails } from 'src/app/_models/propertiesRelationshipDetails';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PropertyRelationService } from 'src/app/_services/property-relation.service';
import { defaultPagination } from 'src/app/_utils/utils';

@Component({
  selector: 'app-property.relation-list',
  templateUrl: './property.relation-list.component.html',
  styleUrls: ['./property.relation-list.component.css'],
})
export class PropertyRelationListComponent implements OnInit {
  protected relationships: SourceRelationshipDetails[];
  private pagination: Pagination;
  protected page = defaultPagination.page;
  protected count = defaultPagination.count;
  protected tableSize: number = defaultPagination.tableSize;
  protected tableSizes = defaultPagination.tableSizes;

  constructor(
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private propertyRelationshipService: PropertyRelationService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.relationships = data['properties'].result;
      this.pagination = data['properties'].pagination;
      this.page = this.pagination.currentPage;
      this.count = this.pagination.totalItems;
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.pagination.currentPage = event;
    this.loadRelationships();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.pagination.itemsPerPage = event.target.value;
    this.page = 1;
    this.loadRelationships();
  }

  loadRelationships() {
    this.propertyRelationshipService
      .getPropertiesRelationship(
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .subscribe(
        (response: PaginatedResult<SourceRelationshipDetails[]>) => {
          this.relationships = response.result;
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
    switch (type) {
      case 0:
        return 'Integer';
      case 1:
        return 'Float';
      case 2:
        return 'Double';
      case 3:
        return 'String';
      case 4:
        return 'Decimal';
      case 5:
        return 'Boolean';
      case 6:
        return 'DateTime';
      default:
        return '';
        break;
    }
  }

  removeRelationship(propertyId: number) {
    this.propertyRelationshipService.deleteRelationship(propertyId).subscribe(
      () => {
        this.alertify.success('The metadata has been deleted succesfully');
      },
      (error) => {
        this.alertify.error('Failed to delete the metadata');
      }
    );
  }
}
