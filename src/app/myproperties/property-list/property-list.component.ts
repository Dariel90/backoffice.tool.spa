import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { Property } from 'src/app/_models/property';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PropertyService } from 'src/app/_services/property.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { defaultPagination, numberToTypeMap } from 'src/app/_utils/utils';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
})
export class PropertyListComponent implements OnInit {
  protected properties: Property[];
  private pagination: Pagination;
  protected page = defaultPagination.page;
  protected count = defaultPagination.count;
  protected tableSize: number = defaultPagination.tableSize;
  protected tableSizes = defaultPagination.tableSizes;

  constructor(
    private router: Router,
    private propertyService: PropertyService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private authService: AuthService
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
    this.propertyService
      .getProperties(
        sourceId,
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .subscribe(
        (response: PaginatedResult<Property[]>) => {
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

  showAddPropertyForm() {
    this.router.navigate(['/property/add']);
  }

  removeProperty(propertyId: number) {
    this.propertyService.deleteProperty(propertyId).subscribe(
      () => {
        this.alertify.success('Property has been deleted succesfully');
      },
      (error) => {
        this.alertify.error('Failed to delete the property');
      }
    );
  }
}
