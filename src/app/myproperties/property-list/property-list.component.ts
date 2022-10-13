import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { Property } from 'src/app/_models/property';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PropertyService } from 'src/app/_services/property.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
})
export class PropertyListComponent implements OnInit {
  protected properties: Property[];
  private pagination: Pagination;
  protected page: number = 1;
  protected count: number = 0;
  protected tableSize: number = 5;
  protected tableSizes: any = [5, 10, 50, 100];

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
        (res: PaginatedResult<Property[]>) => {
          this.properties = res.result;
          this.pagination = res.pagination;
          this.page = res.pagination.currentPage;
          this.count = res.pagination.totalItems;
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
